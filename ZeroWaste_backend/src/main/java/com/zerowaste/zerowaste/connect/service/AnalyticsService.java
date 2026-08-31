package com.zerowaste.zerowaste.connect.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zerowaste.zerowaste.connect.dto.AnalyticsResponse;
import com.zerowaste.zerowaste.connect.repository.FoodListingRepository;
import com.zerowaste.zerowaste.connect.repository.MatchRecordRepository;
import com.zerowaste.zerowaste.connect.repository.NGORepository;
import com.zerowaste.zerowaste.connect.repository.RestaurantRepository;

@Service
public class AnalyticsService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private FoodListingRepository foodRepository;

    @Autowired
    private MatchRecordRepository matchRepository;

    public AnalyticsResponse getAnalytics() {

        AnalyticsResponse response =
                new AnalyticsResponse();

        response.setRestaurants(
                restaurantRepository.count());

        response.setNgos(
                ngoRepository.count());

        response.setFoodListings(
                foodRepository.count());

        response.setMatches(
                matchRepository.count());

        response.setFoodSavedKg(
                foodRepository.count() * 10);

        return response;
    }
}