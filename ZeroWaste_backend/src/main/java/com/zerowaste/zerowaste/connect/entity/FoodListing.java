package com.zerowaste.zerowaste.connect.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;

    private Integer quantity;

    private LocalDate expiryDate;

    private Long restaurantId;

    private String category;

    private Integer shelfLifeHours;

    private Double latitude;

    private Double longitude;
    
    private String status = "AVAILABLE";

    public FoodListing() {
    }

    public Long getId() {
        return id;
    }

    public String getFoodName() {
        return foodName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public String getCategory() {
        return category;
    }

    public Integer getShelfLifeHours() {
        return shelfLifeHours;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }
    
    public String getStatus() {
    	return status; 
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setShelfLifeHours(Integer shelfLifeHours) {
        this.shelfLifeHours = shelfLifeHours;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public void setStatus(String status) { 
    	this.status = status;
    }
}