package com.zerowaste.zerowaste.connect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "NGO information used for ML prediction")
public class NGOMLRequest {

    @JsonProperty("capacity")
    private Integer capacity;

    @JsonProperty("current_demand")
    private Integer currentDemand;

    @JsonProperty("category_preference")
    private String categoryPreference;

    @JsonProperty("latitude")
    private Double latitude;

    @JsonProperty("longitude")
    private Double longitude;

    public NGOMLRequest() {
    }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public Integer getCurrentDemand() { return currentDemand; }
    public void setCurrentDemand(Integer currentDemand) { this.currentDemand = currentDemand; }

    public String getCategoryPreference() { return categoryPreference; }
    public void setCategoryPreference(String categoryPreference) { this.categoryPreference = categoryPreference; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
}