package com.zerowaste.zerowaste.connect.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.zerowaste.zerowaste.connect.entity.NGO;
import com.zerowaste.zerowaste.connect.repository.NGORepository;

@RestController
@RequestMapping("/ngos")
public class NGOController {

    @Autowired
    private NGORepository repository;

    @PostMapping
    public NGO addNGO(@RequestBody NGO ngo) {
        return repository.save(ngo);
    }

    @GetMapping
    public List<NGO> getAllNGOs() {
        return repository.findAll();
    }

    // ----------------------------
    // NEW ENDPOINTS
    // ----------------------------

    @GetMapping("/{id}")
    public NGO getNGOById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public NGO updateNGO(
            @PathVariable Long id,
            @RequestBody NGO updatedNGO) {

        NGO ngo = repository.findById(id).orElse(null);

        if (ngo == null) {
            return null;
        }

        ngo.setName(updatedNGO.getName());
        ngo.setLocation(updatedNGO.getLocation());
        ngo.setCapacity(updatedNGO.getCapacity());
        ngo.setCurrentDemand(updatedNGO.getCurrentDemand());
        ngo.setCategoryPreference(updatedNGO.getCategoryPreference());
        ngo.setLatitude(updatedNGO.getLatitude());
        ngo.setLongitude(updatedNGO.getLongitude());

        return repository.save(ngo);
    }

    @DeleteMapping("/{id}")
    public String deleteNGO(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return "NGO not found";
        }

        repository.deleteById(id);

        return "NGO deleted successfully";
    }
}