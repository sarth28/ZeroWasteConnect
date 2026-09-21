package com.zerowaste.zerowaste.connect.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.zerowaste.zerowaste.connect.dto.AuthResponse;
import com.zerowaste.zerowaste.connect.dto.LoginRequest;
import com.zerowaste.zerowaste.connect.dto.RegisterRequest;
import com.zerowaste.zerowaste.connect.entity.AppUser;
import com.zerowaste.zerowaste.connect.entity.NGO;
import com.zerowaste.zerowaste.connect.entity.Restaurant;
import com.zerowaste.zerowaste.connect.repository.AppUserRepository;
import com.zerowaste.zerowaste.connect.repository.NGORepository;
import com.zerowaste.zerowaste.connect.repository.RestaurantRepository;
import com.zerowaste.zerowaste.connect.security.JwtService;
import com.zerowaste.zerowaste.connect.security.UserPrincipal;

@Service
public class AuthService {

    private final AppUserRepository userRepository;
    private final RestaurantRepository restaurantRepository;
    private final NGORepository ngoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            AppUserRepository userRepository,
            RestaurantRepository restaurantRepository,
            NGORepository ngoRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.restaurantRepository = restaurantRepository;
        this.ngoRepository = ngoRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String role = request.getRole() == null ? "" : request.getRole().trim().toUpperCase();
        if (!"RESTAURANT".equals(role) && !"NGO".equals(role)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be RESTAURANT or NGO");
        }

        if (isBlank(request.getName()) || isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Name, email and password are required");
        }

        if (request.getPassword().length() < 6) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be at least 6 characters");
        }

        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        String location = request.getLocation() == null ? "" : request.getLocation().trim();
        String contact = request.getContactNumber() == null ? "" : request.getContactNumber().trim();

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setName(request.getName().trim());
        user.setContactNumber(contact);

        if ("RESTAURANT".equals(role)) {
            Restaurant restaurant = new Restaurant(user.getName(), location, contact);
            restaurant.setEmail(email);
            restaurant = restaurantRepository.save(restaurant);
            user.setRestaurantId(restaurant.getId());
        } else {
            NGO ngo = new NGO();
            ngo.setName(user.getName());
            ngo.setLocation(location);
            ngo.setEmail(email);
            ngo.setContactNumber(contact);
            ngo.setCapacity(0);
            ngo.setCurrentDemand(0);
            ngo = ngoRepository.save(ngo);
            user.setNgoId(ngo.getId());
        }

        user = userRepository.save(user);
        return toResponse(user);
    }

    public AuthResponse login(LoginRequest request) {
        if (isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and password are required");
        }

        AppUser user = userRepository.findByEmailIgnoreCase(request.getEmail().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return toResponse(user);
    }

    public AuthResponse me(UserPrincipal principal) {
        AppUser user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
        return toResponse(user);
    }

    private AuthResponse toResponse(AppUser user) {
        AuthResponse response = new AuthResponse();
        response.setToken(jwtService.generateToken(user));
        response.setUserId(user.getId());
        response.setRole(user.getRole());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setContactNumber(user.getContactNumber());
        response.setRestaurantId(user.getRestaurantId());
        response.setNgoId(user.getNgoId());
        return response;
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
