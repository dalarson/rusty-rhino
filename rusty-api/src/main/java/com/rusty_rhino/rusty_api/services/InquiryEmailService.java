package com.rusty_rhino.rusty_api.services;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.rusty_rhino.rusty_api.models.InterestEntry;
import com.rusty_rhino.rusty_api.repository.InventoryRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class InquiryEmailService {

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern("MMM d, yyyy h:mm a z").withZone(ZoneId.of("America/New_York"));

    private final JavaMailSender mailSender;
    private final InventoryRepository inventoryRepo;
    private final String mailHost;
    private final String to;
    private final String from;
    private final String siteUrl;

    public InquiryEmailService(
            JavaMailSender mailSender,
            InventoryRepository inventoryRepo,
            @Value("${spring.mail.host:}") String mailHost,
            @Value("${inquiry.notify.to}") String to,
            @Value("${inquiry.notify.from:}") String from,
            @Value("${inquiry.site-url}") String siteUrl) {
        this.mailSender = mailSender;
        this.inventoryRepo = inventoryRepo;
        this.mailHost = mailHost;
        this.to = to;
        this.from = from;
        this.siteUrl = siteUrl.replaceAll("/+$", "");
    }

    @Async
    public void sendInquiryNotification(InterestEntry entry) {
        if (mailHost == null || mailHost.isBlank()) {
            log.warn("MAIL_HOST not configured; skipping email for inquiry {}", entry.getId());
            return;
        }
        try {
            String itemName = lookupItemName(entry.getInventoryItemId());
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(to);
            if (!from.isBlank()) {
                msg.setFrom(from);
            }
            msg.setReplyTo(entry.getEmail());
            msg.setSubject("Rusty Rhino inquiry - " + itemName);
            msg.setText(buildBody(entry, itemName));
            mailSender.send(msg);
            log.info("Inquiry email sent for {}", entry.getId());
        } catch (Exception e) {
            log.error("Failed to send inquiry email for {}", entry.getId(), e);
        }
    }

    private String lookupItemName(String itemId) {
        if (itemId == null || itemId.isBlank()) {
            return "Unknown item";
        }
        try {
            return inventoryRepo.findById(UUID.fromString(itemId))
                    .map(i -> i.getName())
                    .orElse("Unknown item");
        } catch (IllegalArgumentException e) {
            return "Unknown item";
        }
    }

    private String buildBody(InterestEntry e, String itemName) {
        String listingLink = e.getInventoryItemId() == null ? "" : siteUrl + "/listing/" + e.getInventoryItemId();
        return "New inquiry received\n\n"
                + "Item: " + itemName + "\n"
                + "Listing: " + listingLink + "\n"
                + "Name: " + e.getName() + "\n"
                + "Email: " + e.getEmail() + "\n"
                + "Phone: " + (e.getPhone() == null ? "" : e.getPhone()) + "\n"
                + "Received: " + DATE_FORMAT.format(Instant.ofEpochMilli(e.getCreatedAt())) + "\n\n"
                + "Message:\n" + (e.getMessage() == null ? "" : e.getMessage()) + "\n";
    }
}
