package com.zerowaste.zerowaste.connect.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class MatchPredictionResponse {

    @JsonProperty("match_probability")
    private Double match_probability;

    @JsonProperty("match_prediction")
    private Integer match_prediction;

    public MatchPredictionResponse() {
    }

    public Double getMatch_probability() {
        return match_probability;
    }

    public void setMatch_probability(Double match_probability) {
        this.match_probability = match_probability;
    }

    public Integer getMatch_prediction() {
        return match_prediction;
    }

    public void setMatch_prediction(Integer match_prediction) {
        this.match_prediction = match_prediction;
    }
}