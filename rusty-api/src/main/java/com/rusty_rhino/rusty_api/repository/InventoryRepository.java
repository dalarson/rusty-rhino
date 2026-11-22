package com.rusty_rhino.rusty_api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rusty_rhino.rusty_api.models.InventoryItem;

public interface InventoryRepository extends JpaRepository<InventoryItem, UUID> {
}
