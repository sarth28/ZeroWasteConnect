package com.zerowaste.zerowaste.connect.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.zerowaste.zerowaste.connect.dto.FoodMLRequest;
import com.zerowaste.zerowaste.connect.dto.MatchPredictionResponse;
import com.zerowaste.zerowaste.connect.dto.NGOMLRequest;
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

    @Autowired
    private MLPredictionService mlPredictionService;

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final double EARTH_RADIUS_KM = 6371.0;

        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(lat1Rad) * Math.cos(lat2Rad)
                * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }

    public MatchRecord matchFood(Long foodId) {

        // 1. Check whether food listing exists
        FoodListing food = foodRepository.findById(foodId).orElse(null);
        if (food == null) {
            return null;
        }

        // 2. Validate required food data
        if (food.getQuantity() == null || food.getQuantity() <= 0) {
            throw new IllegalArgumentException("Food quantity must be greater than 0");
        }
        if (food.getLatitude() == null || food.getLongitude() == null) {
            throw new IllegalArgumentException("Food latitude and longitude are required for matching");
        }

        // 3. Prevent duplicate matching
        List<MatchRecord> existingMatches = matchRepository.findByFoodListingId(foodId);
        boolean alreadyMatched = existingMatches.stream()
                .anyMatch(match -> "MATCHED".equalsIgnoreCase(match.getStatus()));
        if (alreadyMatched) {
            throw new IllegalStateException("This food listing has already been matched");
        }

        // 4. Retrieve candidate NGOs
        List<NGO> ngos = ngoRepository.findAll();
        if (ngos.isEmpty()) {
            return null;
        }

        // 5. Build Food ML payload
        FoodMLRequest foodML = new FoodMLRequest();
        foodML.setQuantity(food.getQuantity());
        foodML.setCategory(food.getCategory() != null ? food.getCategory() : "Other");
        int shelfLife = food.getShelfLifeHours() != null ? food.getShelfLifeHours() : 24;
        foodML.setShelfLifeHours(shelfLife);

        double hoursUntilExpiry = 12.0;
        if (food.getExpiryDate() != null) {
            long hoursDiff = Duration.between(LocalDateTime.now(), food.getExpiryDate().atTime(23, 59)).toHours();
            hoursUntilExpiry = Math.max(1.0, (double) hoursDiff);
        }
        foodML.setHoursUntilExpiry(hoursUntilExpiry);

        double urgencyScore = Math.max(0.0, Math.min(1.0, 1.0 - (hoursUntilExpiry / (double) shelfLife)));
        foodML.setUrgencyScore(Math.round(urgencyScore * 100.0) / 100.0);
        foodML.setLatitude(food.getLatitude());
        foodML.setLongitude(food.getLongitude());

        NGO bestNgo = null;
        double bestScore = -1.0;
        String matchReason = "";

        // 6. Evaluate each candidate
        for (NGO ngo : ngos) {
            if (ngo.getCapacity() == null || ngo.getCurrentDemand() == null
                    || ngo.getLatitude() == null || ngo.getLongitude() == null) {
                continue;
            }

            int availableCapacity = ngo.getCapacity() - ngo.getCurrentDemand();

            // Hard Rule Constraint: capacity check
            if (availableCapacity < food.getQuantity()) {
                continue;
            }

            // Fallback Heuristic Score Calculation
            double capacityScore = Math.min((double) availableCapacity / food.getQuantity(), 1.0) * 35.0;
            double demandScore = Math.min(((double) ngo.getCurrentDemand() / 100.0) * 30.0, 30.0);
            double categoryScore = (food.getCategory() != null && ngo.getCategoryPreference() != null
                    && (food.getCategory().equalsIgnoreCase(ngo.getCategoryPreference())
                    || "Any".equalsIgnoreCase(ngo.getCategoryPreference()))) ? 15.0 : 0.0;
            double distance = calculateDistance(food.getLatitude(), food.getLongitude(), ngo.getLatitude(), ngo.getLongitude());
            double distanceScore = Math.max(0.0, 20.0 - (distance * 10.0));
            double ruleBasedTotal = capacityScore + demandScore + categoryScore + distanceScore;

            double finalCandidateScore;
            String candidateReason;

            // Step 7: Call ML Service with Heuristic Fallback
            try {
                NGOMLRequest ngoML = new NGOMLRequest();
                ngoML.setCapacity(ngo.getCapacity());
                ngoML.setCurrentDemand(ngo.getCurrentDemand());
                ngoML.setCategoryPreference(ngo.getCategoryPreference() != null ? ngo.getCategoryPreference() : "Any");
                ngoML.setLatitude(ngo.getLatitude());
                ngoML.setLongitude(ngo.getLongitude());

                MatchPredictionResponse mlResponse = mlPredictionService.predictMatch(foodML, ngoML);

                if (mlResponse != null && mlResponse.getMatch_probability() != null) {
                    double mlProbPercent = mlResponse.getMatch_probability() * 100.0;
                    // Hybrid score: 70% ML Probability + 30% Heuristic score
                    finalCandidateScore = (0.70 * mlProbPercent) + (0.30 * ruleBasedTotal);
                    candidateReason = String.format("ML Match Probability: %.1f%% | Rule-fit: %.1f/100 (Dist: %.1f km)",
                            mlProbPercent, ruleBasedTotal, distance);
                } else {
                    finalCandidateScore = ruleBasedTotal;
                    candidateReason = String.format("Rule-based heuristic: %.1f/100 (Dist: %.1f km)", ruleBasedTotal, distance);
                }
            } catch (Exception ex) {
                // Graceful fallback if Python FastAPI service is offline
                finalCandidateScore = ruleBasedTotal;
                candidateReason = String.format("Fallback heuristic (ML unavailable): %.1f/100 (Dist: %.1f km)", ruleBasedTotal, distance);
            }

            if (finalCandidateScore > bestScore) {
                bestScore = finalCandidateScore;
                bestNgo = ngo;
                matchReason = candidateReason;
            }
        }

        if (bestNgo == null) {
            return null;
        }

        // 8. Persist Match
        MatchRecord match = new MatchRecord();
        match.setFoodListingId(food.getId());
        match.setNgoId(bestNgo.getId());
        match.setStatus("MATCHED");
        match.setMatchScore(Math.round(bestScore * 100.0) / 100.0);
        match.setMatchingReason(matchReason);
        match.setMatchedAt(LocalDateTime.now());

        food.setStatus("MATCHED");
        foodRepository.save(food);

        return matchRepository.save(match);
    }
}