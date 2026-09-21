package com.zerowaste.zerowaste.connect.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zerowaste.zerowaste.connect.dto.MatchPredictionRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionResponse;
import com.zerowaste.zerowaste.connect.service.MLPredictionService;

@RestController
@RequestMapping("/ml")
public class MLPredictionController {

    private final MLPredictionService mlPredictionService;

    public MLPredictionController(MLPredictionService mlPredictionService) {
        this.mlPredictionService = mlPredictionService;
    }

    @PostMapping("/predict-match")
    public MatchPredictionResponse predictMatch(@RequestBody MatchPredictionRequest request) {
        return mlPredictionService.predictMatch(
                request.getFood(),
                request.getNgo()
        );
    }
}