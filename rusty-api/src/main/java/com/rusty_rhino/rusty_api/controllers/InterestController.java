package com.rusty_rhino.rusty_api.controllers;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rusty_rhino.rusty_api.models.InterestEntry;
import com.rusty_rhino.rusty_api.repository.InterestRepository;
import com.rusty_rhino.rusty_api.services.InquiryEmailService;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@AllArgsConstructor
@RequestMapping("/interest")
public class InterestController {

    private final InterestRepository repo;
    private final InquiryEmailService emailService;

    @GetMapping
    public List<InterestEntry> getAllInterest() {
        try {
            return repo.findAll();
        } catch (Exception e) {
            log.warn("Failed to read interest entries: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterestEntry> getInterest(@PathVariable UUID id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/addressed")
    public ResponseEntity<Void> setAddressed(@PathVariable UUID id, @RequestBody Map<String, Boolean> body) {
        Boolean addressed = body.get("addressed");
        if (addressed == null) {
            return ResponseEntity.badRequest().build();
        }
        return repo.findById(id).map(entry -> {
            entry.setAddressed(addressed);
            repo.save(entry);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterest(@PathVariable UUID id) {
        try {
            repo.deleteById(id);
            log.info("Interest entry {} deleted", id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Failed to delete interest entry {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping
    public ResponseEntity<String> submitInterest(@RequestBody InterestEntry entry) {
        if (entry.getName() == null || entry.getName().isBlank()) {
            return ResponseEntity.badRequest().body("Name is required");
        }
        if (entry.getEmail() == null || entry.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        if (entry.getMessage() != null && entry.getMessage().length() > 250) {
            return ResponseEntity.badRequest().body("Message must be 250 characters or less");
        }

        entry.setCreatedAt(System.currentTimeMillis());
        entry.setId(null);
        entry.setAddressed(false);

        try {
            InterestEntry saved = repo.save(entry);
            emailService.sendInquiryNotification(saved);
            log.info("Interest submitted by {} for item {}", saved.getEmail(), saved.getInventoryItemId());
            return ResponseEntity.status(HttpStatus.CREATED).body(saved.getId().toString());
        } catch (Exception e) {
            log.error("Failed to save interest entry", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to save");
        }
    }
}
