package com.zerowaste.zerowaste.connect.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.zerowaste.zerowaste.connect.entity.NGO;
import com.zerowaste.zerowaste.connect.repository.NGORepository;
import com.zerowaste.zerowaste.connect.security.CurrentUser;
import com.zerowaste.zerowaste.connect.security.UserPrincipal;

@RestController
@RequestMapping("/ngos")
public class NGOController {

    private final NGORepository repository;

    public NGOController(NGORepository repository) {
        this.repository = repository;
    }


    /*
     * Existing NGO creation endpoint.
     */
    @PostMapping
    public NGO addNGO(@RequestBody NGO ngo) {
        return repository.save(ngo);
    }


    /*
     * Public NGO directory.
     *
     * This is used by the landing page,
     * NGO directory and analytics.
     */
    @GetMapping
    public List<NGO> getAllNGOs() {
        return repository.findAll();
    }


    /*
     * Get one NGO.
     */
    @GetMapping("/{id}")
    public NGO getNGOById(
            @PathVariable Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "NGO not found"
                        )
                );
    }


    /*
     * Update NGO profile.
     *
     * An NGO can only update its own profile.
     */
    @PutMapping("/{id}")
    public NGO updateNGO(
            @PathVariable Long id,
            @RequestBody NGO updatedNGO) {

        UserPrincipal user = CurrentUser.require();


        if (!user.isNgo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only NGO accounts can update NGO profiles"
            );
        }


        if (user.getNgoId() == null
                || !user.getNgoId().equals(id)) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You can only update your own NGO profile"
            );
        }


        NGO ngo = repository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "NGO not found"
                        )
                );


        ngo.setName(updatedNGO.getName());
        ngo.setLocation(updatedNGO.getLocation());

        ngo.setCapacity(
                updatedNGO.getCapacity()
        );

        ngo.setCurrentDemand(
                updatedNGO.getCurrentDemand()
        );

        ngo.setCategoryPreference(
                updatedNGO.getCategoryPreference()
        );

        ngo.setLatitude(
                updatedNGO.getLatitude()
        );

        ngo.setLongitude(
                updatedNGO.getLongitude()
        );


        return repository.save(ngo);
    }


    /*
     * Delete NGO.
     */
    @DeleteMapping("/{id}")
    public String deleteNGO(
            @PathVariable Long id) {

        if (!repository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "NGO not found"
            );
        }

        repository.deleteById(id);

        return "NGO deleted successfully";
    }
}