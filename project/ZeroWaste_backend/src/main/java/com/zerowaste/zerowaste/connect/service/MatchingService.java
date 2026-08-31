package com.zerowaste.zerowaste.connect.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zerowaste.zerowaste.connect.entity.FoodListing;
import com.zerowaste.zerowaste.connect.entity.MatchRecord;
import com.zerowaste.zerowaste.connect.entity.NGO;

import com.zerowaste.zerowaste.connect.repository.FoodListingRepository;
import com.zerowaste.zerowaste.connect.repository.MatchRecordRepository;
import com.zerowaste.zerowaste.connect.repository.NGORepository;

@Service
public class MatchingService {

    @Autowired
    private FoodListingRepository foodRepository;

    @Autowired
    private NGORepository ngoRepository;

    @Autowired
    private MatchRecordRepository matchRepository;

    private double calculateDistance(
            double lat1,
            double lon1,
            double lat2,
            double lon2) {

        final double EARTH_RADIUS_KM = 6371.0;

        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);

        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(lat1Rad)
                * Math.cos(lat2Rad)
                * Math.sin(deltaLon / 2)
                * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS_KM * c;
    }

    public MatchRecord matchFood(Long foodId) {

        FoodListing food =
                foodRepository.findById(foodId).orElse(null);

        if (food == null) {
            return null;
        }

        List<NGO> ngos = ngoRepository.findAll();

        if (ngos.isEmpty()) {
            return null;
        }

        NGO selectedNGO = null;

        double highestScore = -1;

        for (NGO ngo : ngos) {

            // --------------------------------
            // AVAILABLE CAPACITY
            // --------------------------------

            int availableCapacity =
                    ngo.getCapacity() - ngo.getCurrentDemand();

            // NGO cannot accept this donation
            if (availableCapacity < food.getQuantity()) {
                continue;
            }

            // --------------------------------
            // CAPACITY SCORE (0-35)
            // --------------------------------

            double capacityRatio =
                    Math.min(
                            (double) availableCapacity
                                    / food.getQuantity(),
                            1.0);

            double capacityScore =
                    capacityRatio * 35;

            // Demand Score (0-30)

            double demandScore =
                    ((double) ngo.getCurrentDemand()
                            / 100.0) * 30;

            // Category Score (0 or 15)

            double categoryScore = 0;

            if (food.getCategory() != null
                    && ngo.getCategoryPreference() != null
                    && food.getCategory()
                            .equalsIgnoreCase(
                                    ngo.getCategoryPreference())) {

                categoryScore = 15;
            }

            // Distance Score (0-20)

            double distance =
                    calculateDistance(
                            food.getLatitude(),
                            food.getLongitude(),
                            ngo.getLatitude(),
                            ngo.getLongitude());

            double distanceScore =
                    Math.max(0, 20 - (distance * 10));

            // Final Score

            double totalScore =
                    capacityScore
                    + demandScore
                    + categoryScore
                    + distanceScore;

            if (totalScore > highestScore) {

                highestScore = totalScore;

                selectedNGO = ngo;
            }
        }

        MatchRecord match = new MatchRecord();

        match.setFoodListingId(food.getId());

        match.setNgoId(selectedNGO.getId());

        match.setStatus("MATCHED");

        match.setMatchScore(
                Math.round(highestScore * 100.0) / 100.0);

        match.setMatchingReason(
                "Selected based on capacity, demand, category suitability and distance");

        match.setMatchedAt(LocalDateTime.now());

        return matchRepository.save(match);
    }
}