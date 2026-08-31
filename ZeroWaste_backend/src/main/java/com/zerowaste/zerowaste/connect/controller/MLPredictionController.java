package com.zerowaste.zerowaste.connect.controller;

import org.springframework.web.bind.annotation.*;

import com.zerowaste.zerowaste.connect.dto.FoodMLRequest;
import com.zerowaste.zerowaste.connect.dto.NGOMLRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionResponse;
import com.zerowaste.zerowaste.connect.service.MLPredictionService;

@RestController
@RequestMapping("/ml")
public class MLPredictionController {

    private final MLPredictionService mlPredictionService;

    public MLPredictionController(
            MLPredictionService mlPredictionService) {

        this.mlPredictionService = mlPredictionService;
    }

    @PostMapping("/predict-match")
    public MatchPredictionResponse predictMatch(
            @RequestBody MatchPredictionRequest request) {

        return mlPredictionService.predictMatch(
                request.getFood(),
                request.getNgo()
        );
    }
}