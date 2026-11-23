package com.rusty_rhino.rusty_api.controllers;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.rusty_rhino.rusty_api.models.InventoryItem;
import com.rusty_rhino.rusty_api.repository.InventoryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@AllArgsConstructor
public class InventoryController {
    private final InventoryRepository repo;

    @GetMapping("/inventory")
    List<InventoryItem> getInventory() {
        return repo.findAll();
    }

    @GetMapping("/inventory/{id}")
    public ResponseEntity<InventoryItem> getInventoryItem(@PathVariable UUID id) {
        return ResponseEntity.of(repo.findById(id));
    }

    @PutMapping("/inventory")
    public String insertInventoryItem(@RequestBody InventoryItem item) {
        try {
            item.setId(null);
            return repo.save(item).getId().toString();
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save inventory item", e);
        }
    }

    @PatchMapping("/inventory/{id}")
    public String updateInventoryItem(@PathVariable UUID id, @RequestBody InventoryItem item) {
        try {
            InventoryItem existing = repo.findById(id).orElse(null);
            if (existing == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found");
            }
            existing.setName(item.getName());
            existing.setDescription(item.getDescription());
            existing.setPrice(item.getPrice());
            existing.setSold(item.isSold());
            existing.setType(item.getType());
            existing.setImgUrls(item.getImgUrls());
            return repo.save(existing).getId().toString();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to save inventory item", e);
        }
    }

    @DeleteMapping("/inventory/{id}")
    public void deleteInventoryItem(@PathVariable UUID id) {
        try {
            repo.deleteById(id);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
    }

}
