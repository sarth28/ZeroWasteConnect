package com.zerowaste.zerowaste.connect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class MatchRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long foodListingId;

    private Long ngoId;

    private String status;

    private Double matchScore;

    private String matchingReason;

    private LocalDateTime matchedAt;

    public MatchRecord() {
    }

    public Long getId() {
        return id;
    }

    public Long getFoodListingId() {
        return foodListingId;
    }

    public Long getNgoId() {
        return ngoId;
    }

    public String getStatus() {
        return status;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public String getMatchingReason() {
        return matchingReason;
    }

    public LocalDateTime getMatchedAt() {
        return matchedAt;
    }

    public void setFoodListingId(Long foodListingId) {
        this.foodListingId = foodListingId;
    }

    public void setNgoId(Long ngoId) {
        this.ngoId = ngoId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public void setMatchingReason(String matchingReason) {
        this.matchingReason = matchingReason;
    }

    public void setMatchedAt(LocalDateTime matchedAt) {
        this.matchedAt = matchedAt;
    }
}