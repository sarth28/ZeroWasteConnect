package com.zerowaste.zerowaste.connect.service;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.zerowaste.zerowaste.connect.dto.FoodMLRequest;
import com.zerowaste.zerowaste.connect.dto.NGOMLRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionResponse;

@Service
public class MLPredictionService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public MLPredictionService(
            RestClient restClient,
            ObjectMapper objectMapper) {

        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    public MatchPredictionResponse predictMatch(
            FoodMLRequest food,
            NGOMLRequest ngo) {

        MatchPredictionRequest request =
                new MatchPredictionRequest();

        request.setFood(food);
        request.setNgo(ngo);

        try {

            // Convert Java object to JSON explicitly
            String jsonRequest =
                    objectMapper.writeValueAsString(request);

            System.out.println(
                    "========================================"
            );

            System.out.println(
                    "SENDING REQUEST TO ML SERVICE:"
            );

            System.out.println(jsonRequest);

            System.out.println(
                    "========================================"
            );

            return restClient
                    .post()
                    .uri("/predict-match")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(jsonRequest)
                    .retrieve()
                    .body(MatchPredictionResponse.class);

        } catch (JsonProcessingException e) {

            throw new RuntimeException(
                    "Failed to convert ML request to JSON",
                    e
            );
        }
    }
}

