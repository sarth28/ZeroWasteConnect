package com.zerowaste.zerowaste.connect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
    public MatchRecord autoMatch(@PathVariable Long foodId) {
        return matchingService.matchFood(foodId);
    }

    @GetMapping
    public List<MatchRecord> getAllMatches() {
        return repository.findAll();
    }
}