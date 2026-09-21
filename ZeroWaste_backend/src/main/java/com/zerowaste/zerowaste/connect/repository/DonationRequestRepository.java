package com.zerowaste.zerowaste.connect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerowaste.zerowaste.connect.entity.DonationRequest;

public interface DonationRequestRepository
        extends JpaRepository<DonationRequest, Long> {

    List<DonationRequest> findByNgoIdOrderByCreatedAtDesc(Long ngoId);
}