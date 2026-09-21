package com.zerowaste.zerowaste.connect.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.zerowaste.zerowaste.connect.entity.NGO;

public interface NGORepository extends JpaRepository<NGO, Long> {

    List<NGO> findByCapacityGreaterThanEqual(Integer capacity);

}