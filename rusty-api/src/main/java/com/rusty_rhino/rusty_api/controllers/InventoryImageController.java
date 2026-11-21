package com.rusty_rhino.rusty_api.controllers;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class InventoryImageController {
    private static final String BUCKET = "img";

    private final String supabaseUrl;
    private final String serviceKey;
    private final RestClient client = RestClient.create();

    public InventoryImageController(
            @Value("${supabase.url:}") String supabaseUrl,
            @Value("${supabase.service-key:}") String serviceKey) {
        this.supabaseUrl = supabaseUrl.replaceAll("/+$", "");
        this.serviceKey = serviceKey;
    }

    @PostMapping("/img")
    public ResponseEntity<String> uploadImage(@RequestParam MultipartFile file) {
        log.info("Image upload request received: filename={}, size={} bytes, contentType={}",
                file.getOriginalFilename(), file.getSize(), file.getContentType());
        try {
            String filename = file.getOriginalFilename();
            String newImgName = UUID.randomUUID() + filename.substring(filename.lastIndexOf("."));
            String contentType = file.getContentType() != null ? file.getContentType()
                    : MediaType.APPLICATION_OCTET_STREAM_VALUE;

            client.post()
                    .uri(supabaseUrl + "/storage/v1/object/" + BUCKET + "/" + newImgName)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + serviceKey)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();

            String url = supabaseUrl + "/storage/v1/object/public/" + BUCKET + "/" + newImgName;
            log.info("Upload successful: {}", url);
            return ResponseEntity.ok(url);
        } catch (Exception e) {
            log.error("Image upload failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body("Upload failed: " + e.getMessage());
        }
    }
}
