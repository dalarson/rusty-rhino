package com.rusty_rhino.rusty_api.models;

import java.util.List;
import java.util.UUID;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "inventory")
@Data
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private String description;
    private double price;
    private String imgUrl;
    @JdbcTypeCode(SqlTypes.ARRAY)
    private List<String> beforeImgUrls;
    @JdbcTypeCode(SqlTypes.ARRAY)
    private List<String> afterImgUrls;
    private boolean sold;
    private String type;
}
