package com.zerowaste.zerowaste.connect.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.zerowaste.zerowaste.connect.entity.FoodListing;

public interface FoodListingRepository extends JpaRepository<FoodListing, Long> {

}