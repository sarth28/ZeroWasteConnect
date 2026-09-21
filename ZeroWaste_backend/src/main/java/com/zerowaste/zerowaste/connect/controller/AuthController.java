package com.zerowaste.zerowaste.connect.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.zerowaste.zerowaste.connect.dto.AuthResponse;
import com.zerowaste.zerowaste.connect.dto.LoginRequest;
import com.zerowaste.zerowaste.connect.dto.RegisterRequest;
import com.zerowaste.zerowaste.connect.security.CurrentUser;
import com.zerowaste.zerowaste.connect.service.AuthService;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @GetMapping("/me")
    public AuthResponse me() {
        return authService.me(CurrentUser.require());
    }
}
