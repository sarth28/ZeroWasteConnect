package com.zerowaste.zerowaste.connect.controller;
import org.springframework.http.ResponseEntity;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.zerowaste.zerowaste.connect.entity.FoodListing;
import com.zerowaste.zerowaste.connect.repository.FoodListingRepository;

@RestController
@RequestMapping("/food")
public class FoodListingController {

    @Autowired
    private FoodListingRepository repository;

    @PostMapping
    public ResponseEntity<?> addFood(@RequestBody FoodListing food) {

        if (food.getFoodName() == null
                || food.getFoodName().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Food name is required");
        }

        if (food.getQuantity() == null
                || food.getQuantity() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Quantity must be greater than 0");
        }

        if (food.getCategory() == null
                || food.getCategory().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Category is required");
        }

        if (food.getExpiryDate() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Expiry date is required");
        }

        if (food.getLatitude() == null
                || food.getLongitude() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Latitude and longitude are required");
        }

        if (food.getShelfLifeHours() == null
                || food.getShelfLifeHours() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Shelf life must be greater than 0");
        }

        return ResponseEntity.ok(repository.save(food));
    }

    @GetMapping
    public List<FoodListing> getAllFood() {
        return repository.findAll();
    }

    // ----------------------------
    // NEW ENDPOINTS
    // ----------------------------

    @GetMapping("/{id}")
    public FoodListing getFoodById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public FoodListing updateFood(
            @PathVariable Long id,
            @RequestBody FoodListing updatedFood) {

        FoodListing food = repository.findById(id).orElse(null);

        if (food == null) {
            return null;
        }

        food.setFoodName(updatedFood.getFoodName());
        food.setQuantity(updatedFood.getQuantity());
        food.setExpiryDate(updatedFood.getExpiryDate());
        food.setCategory(updatedFood.getCategory());
        food.setShelfLifeHours(updatedFood.getShelfLifeHours());
        food.setRestaurantId(updatedFood.getRestaurantId());
        food.setLatitude(updatedFood.getLatitude());
        food.setLongitude(updatedFood.getLongitude());

        return repository.save(food);
    }

    @DeleteMapping("/{id}")
    public String deleteFood(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return "Food listing not found";
        }

        repository.deleteById(id);

        return "Food listing deleted successfully";
    }
}