package com.zerowaste.zerowaste.connect.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerowaste.zerowaste.connect.entity.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

}