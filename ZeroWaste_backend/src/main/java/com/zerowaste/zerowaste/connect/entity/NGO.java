package com.zerowaste.zerowaste.connect.entity;

import jakarta.persistence.*;

@Entity
public class NGO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    private Integer capacity;

    private Integer currentDemand;

    private Double latitude;

    private Double longitude;

    private String categoryPreference;

    public NGO() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getLocation() {
        return location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public Integer getCurrentDemand() {
        return currentDemand;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public String getCategoryPreference() {
        return categoryPreference;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setCurrentDemand(Integer currentDemand) {
        this.currentDemand = currentDemand;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public void setCategoryPreference(String categoryPreference) {
        this.categoryPreference = categoryPreference;
    }
}