package com.zerowaste.zerowaste.connect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.zerowaste.zerowaste.connect.entity.Restaurant;
import com.zerowaste.zerowaste.connect.repository.RestaurantRepository;

@RestController
@RequestMapping("/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantRepository repository;

    @PostMapping
    public Restaurant addRestaurant(@RequestBody Restaurant restaurant) {
        return repository.save(restaurant);
    }

    @GetMapping
    public List<Restaurant> getAllRestaurants() {
        return repository.findAll();
    }

    // ----------------------------
    // NEW ENDPOINTS
    // ----------------------------

    @GetMapping("/{id}")
    public Restaurant getRestaurantById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Restaurant updateRestaurant(
            @PathVariable Long id,
            @RequestBody Restaurant updatedRestaurant) {

        Restaurant restaurant = repository.findById(id).orElse(null);

        if (restaurant == null) {
            return null;
        }

        restaurant.setName(updatedRestaurant.getName());
        restaurant.setLocation(updatedRestaurant.getLocation());
        restaurant.setContactNumber(updatedRestaurant.getContactNumber());

        return repository.save(restaurant);
    }

    @DeleteMapping("/{id}")
    public String deleteRestaurant(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return "Restaurant not found";
        }

        repository.deleteById(id);

        return "Restaurant deleted successfully";
    }
}