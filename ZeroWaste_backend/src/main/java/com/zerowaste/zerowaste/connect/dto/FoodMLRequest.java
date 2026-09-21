package com.zerowaste.zerowaste.connect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Food information used for ML prediction")
public class FoodMLRequest {

    @JsonProperty("quantity")
    private Integer quantity;

    @JsonProperty("category")
    private String category;

    @JsonProperty("shelf_life_hours")
    private Integer shelfLifeHours;

    @JsonProperty("hours_until_expiry")
    private Double hoursUntilExpiry;

    @JsonProperty("urgency_score")
    private Double urgencyScore;

    @JsonProperty("latitude")
    private Double latitude;

    @JsonProperty("longitude")
    private Double longitude;

    public FoodMLRequest() {
    }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Integer getShelfLifeHours() { return shelfLifeHours; }
    public void setShelfLifeHours(Integer shelfLifeHours) { this.shelfLifeHours = shelfLifeHours; }

    public Double getHoursUntilExpiry() { return hoursUntilExpiry; }
    public void setHoursUntilExpiry(Double hoursUntilExpiry) { this.hoursUntilExpiry = hoursUntilExpiry; }

    public Double getUrgencyScore() { return urgencyScore; }
    public void setUrgencyScore(Double urgencyScore) { this.urgencyScore = urgencyScore; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}