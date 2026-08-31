package com.zerowaste.zerowaste.connect.dto;

public class AnalyticsResponse {

    private long restaurants;
    private long ngos;
    private long foodListings;
    private long matches;
    private double foodSavedKg;

    public long getRestaurants() {
        return restaurants;
    }

    public void setRestaurants(long restaurants) {
        this.restaurants = restaurants;
    }

    public long getNgos() {
        return ngos;
    }

    public void setNgos(long ngos) {
        this.ngos = ngos;
    }

    public long getFoodListings() {
        return foodListings;
    }

    public void setFoodListings(long foodListings) {
        this.foodListings = foodListings;
    }

    public long getMatches() {
        return matches;
    }

    public void setMatches(long matches) {
        this.matches = matches;
    }

    public double getFoodSavedKg() {
        return foodSavedKg;
    }

    public void setFoodSavedKg(double foodSavedKg) {
        this.foodSavedKg = foodSavedKg;
    }
}