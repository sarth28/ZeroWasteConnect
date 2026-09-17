package com.zerowaste.zerowaste.connect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.zerowaste.zerowaste.connect.entity.MatchRecord;
import com.zerowaste.zerowaste.connect.repository.MatchRecordRepository;
import com.zerowaste.zerowaste.connect.service.MatchingService;

@RestController
@RequestMapping("/matches")
public class MatchingController {

    @Autowired
    private MatchRecordRepository repository;

    @Autowired
    private MatchingService matchingService;

    @PostMapping
    public MatchRecord createMatch(@RequestBody MatchRecord match) {
        return repository.save(match);
    }

    @PostMapping("/match-food/{foodId}")
    public ResponseEntity<?> autoMatch(@PathVariable Long foodId) {

        try {

            MatchRecord result =
                    matchingService.matchFood(foodId);

            if (result == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("No suitable NGO found for this food listing");
            }

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        } catch (IllegalStateException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    @GetMapping
    public List<MatchRecord> getAllMatches() {
        return repository.findAll();
    }
}