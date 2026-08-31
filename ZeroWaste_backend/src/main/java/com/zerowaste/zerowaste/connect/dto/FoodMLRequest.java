package com.zerowaste.zerowaste.connect.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Food information used for ML prediction")
public class FoodMLRequest {

    private Integer quantity;

    private String category;

    private Integer shelf_life_hours;

    private Double hours_until_expiry;

    private Double urgency_score;

    private Double latitude;

    private Double longitude;

    public FoodMLRequest() {
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getShelf_life_hours() {
        return shelf_life_hours;
    }

    public void setShelf_life_hours(Integer shelf_life_hours) {
        this.shelf_life_hours = shelf_life_hours;
    }

    public Double getHours_until_expiry() {
        return hours_until_expiry;
    }

    public void setHours_until_expiry(Double hours_until_expiry) {
        this.hours_until_expiry = hours_until_expiry;
    }

    public Double getUrgency_score() {
        return urgency_score;
    }

    public void setUrgency_score(Double urgency_score) {
        this.urgency_score = urgency_score;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
}