package com.zerowaste.zerowaste.connect.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request containing food and NGO information for ML matching")
public class MatchPredictionRequest {

    @Schema(description = "Surplus food information")
    private FoodMLRequest food;

    @Schema(description = "NGO information")
    private NGOMLRequest ngo;

    public MatchPredictionRequest() {
    }

    public FoodMLRequest getFood() {
        return food;
    }

    public void setFood(FoodMLRequest food) {
        this.food = food;
    }

    public NGOMLRequest getNgo() {
        return ngo;
    }

    public void setNgo(NGOMLRequest ngo) {
        this.ngo = ngo;
    }
}