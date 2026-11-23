package com.rusty_rhino.rusty_api.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

class InventoryImageControllerTest {
    @Test
    void acceptsAllowedExtensionsCaseInsensitively() {
        assertEquals("heic", InventoryImageController.extensionOf("IMG_0001.HEIC"));
        assertEquals("jpg", InventoryImageController.extensionOf("a.b.jpg"));
    }

    @Test
    void rejectsMissingOrUnknownExtensions() {
        assertNull(InventoryImageController.extensionOf("noext"));
        assertNull(InventoryImageController.extensionOf("trailing."));
        assertNull(InventoryImageController.extensionOf("evil.exe"));
        assertNull(InventoryImageController.extensionOf(null));
    }
}
