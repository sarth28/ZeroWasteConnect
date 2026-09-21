package com.zerowaste.zerowaste.connect.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class DonationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long ngoId;

    private String category;

    private Integer quantityNeeded;

    private String message;

    private String status = "PENDING";

    private LocalDateTime createdAt;

    public DonationRequest() {
    }

    public Long getId() {
        return id;
    }

    public Long getNgoId() {
        return ngoId;
    }

    public String getCategory() {
        return category;
    }

    public Integer getQuantityNeeded() {
        return quantityNeeded;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setNgoId(Long ngoId) {
        this.ngoId = ngoId;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setQuantityNeeded(Integer quantityNeeded) {
        this.quantityNeeded = quantityNeeded;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}