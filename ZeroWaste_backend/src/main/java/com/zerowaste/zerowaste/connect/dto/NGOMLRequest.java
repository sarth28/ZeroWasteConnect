package com.zerowaste.zerowaste.connect.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "NGO information used for ML prediction")
public class NGOMLRequest {

    private Integer capacity;

    private Integer current_demand;

    private String category_preference;

    private Double latitude;

    private Double longitude;

    public NGOMLRequest() {
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getCurrent_demand() {
        return current_demand;
    }

    public void setCurrent_demand(Integer current_demand) {
        this.current_demand = current_demand;
    }

    public String getCategory_preference() {
        return category_preference;
    }

    public void setCategory_preference(String category_preference) {
        this.category_preference = category_preference;
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