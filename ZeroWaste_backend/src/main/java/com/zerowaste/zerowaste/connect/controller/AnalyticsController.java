package com.zerowaste.zerowaste.connect.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zerowaste.zerowaste.connect.dto.AnalyticsResponse;
import com.zerowaste.zerowaste.connect.service.AnalyticsService;

@RestController
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/analytics")
    public AnalyticsResponse getAnalytics() {

        return analyticsService.getAnalytics();
    }
}