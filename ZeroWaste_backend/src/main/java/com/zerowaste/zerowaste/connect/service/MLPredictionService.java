package com.zerowaste.zerowaste.connect.service;

import java.nio.charset.StandardCharsets;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.zerowaste.zerowaste.connect.dto.FoodMLRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionResponse;
import com.zerowaste.zerowaste.connect.dto.NGOMLRequest;

@Service
public class MLPredictionService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public MLPredictionService(RestClient restClient, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    public MatchPredictionResponse predictMatch(FoodMLRequest food, NGOMLRequest ngo) {
        MatchPredictionRequest request = new MatchPredictionRequest();
        request.setFood(food);
        request.setNgo(ngo);

        try {
            byte[] jsonBytes = objectMapper.writeValueAsBytes(request);

            System.out.println("Payload sent to FastAPI: " + new String(jsonBytes, StandardCharsets.UTF_8));

            return restClient
                    .post()
                    .uri("/predict-match")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.APPLICATION_JSON)
                    .body(jsonBytes)
                    .retrieve()
                    .body(MatchPredictionResponse.class);

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize ML prediction request", e);
        } catch (RestClientResponseException ex) {
            System.err.println("FastAPI Error (" + ex.getStatusCode() + "): " + ex.getResponseBodyAsString());
            throw ex;
        }
    }
}