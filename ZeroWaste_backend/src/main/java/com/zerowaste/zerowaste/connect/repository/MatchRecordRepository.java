package com.zerowaste.zerowaste.connect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerowaste.zerowaste.connect.entity.MatchRecord;

public interface MatchRecordRepository
        extends JpaRepository<MatchRecord, Long> {

    List<MatchRecord> findByFoodListingId(Long foodListingId);
}