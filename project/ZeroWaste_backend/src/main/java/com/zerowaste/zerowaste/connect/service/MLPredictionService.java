package com.zerowaste.zerowaste.connect.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.zerowaste.zerowaste.connect.dto.FoodMLRequest;
import com.zerowaste.zerowaste.connect.dto.NGOMLRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionResponse;

@Service
public class MLPredictionService {

    private final RestClient restClient;

    public MLPredictionService(RestClient restClient) {
        this.restClient = restClient;
    }

    public MatchPredictionResponse predictMatch(
            FoodMLRequest food,
            NGOMLRequest ngo) {

        MatchPredictionRequest request =
                new MatchPredictionRequest();

        request.setFood(food);
        request.setNgo(ngo);

        return restClient
                .post()
                .uri("/predict-match")
                .body(request)
                .retrieve()
                .body(MatchPredictionResponse.class);
    }
}