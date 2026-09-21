package com.zerowaste.zerowaste.connect.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.zerowaste.zerowaste.connect.entity.DonationRequest;
import com.zerowaste.zerowaste.connect.entity.NGO;
import com.zerowaste.zerowaste.connect.repository.DonationRequestRepository;
import com.zerowaste.zerowaste.connect.repository.NGORepository;
import com.zerowaste.zerowaste.connect.security.CurrentUser;
import com.zerowaste.zerowaste.connect.security.UserPrincipal;

@RestController
@RequestMapping("/requests")
public class DonationRequestController {

    private final DonationRequestRepository requestRepository;
    private final NGORepository ngoRepository;

    public DonationRequestController(
            DonationRequestRepository requestRepository,
            NGORepository ngoRepository) {

        this.requestRepository = requestRepository;
        this.ngoRepository = ngoRepository;
    }


    /*
     * NGO creates a food request.
     */
    @PostMapping
    public DonationRequest createRequest(
            @RequestBody DonationRequest request) {

        UserPrincipal user = CurrentUser.require();

        if (!user.isNgo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only NGO accounts can create food requests"
            );
        }

        if (user.getNgoId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "NGO profile is not linked to this account"
            );
        }

        if (request.getCategory() == null
                || request.getCategory().trim().isEmpty()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Food category is required"
            );
        }

        if (request.getQuantityNeeded() == null
                || request.getQuantityNeeded() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Quantity needed must be greater than zero"
            );
        }


        NGO ngo = ngoRepository.findById(user.getNgoId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "NGO profile not found"
                        )
                );


        /*
         * IMPORTANT:
         *
         * Never trust ngoId from React.
         * We take it from the JWT-authenticated user.
         */
        request.setNgoId(user.getNgoId());

        request.setCategory(
                request.getCategory().trim()
        );

        request.setStatus("PENDING");

        request.setCreatedAt(
                LocalDateTime.now()
        );


        DonationRequest saved =
                requestRepository.save(request);


        /*
         * Keep the NGO matching profile synchronized
         * with the latest request.
         *
         * MatchingService uses these fields.
         */
        ngo.setCurrentDemand(
                request.getQuantityNeeded()
        );

        ngo.setCategoryPreference(
                request.getCategory()
        );

        ngoRepository.save(ngo);


        return saved;
    }


    /*
     * Get requests belonging to the logged-in NGO.
     */
    @GetMapping
    public List<DonationRequest> getMyRequests() {

        UserPrincipal user = CurrentUser.require();

        if (!user.isNgo()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Only NGO accounts can view donation requests"
            );
        }

        return requestRepository
                .findByNgoIdOrderByCreatedAtDesc(
                        user.getNgoId()
                );
    }
}