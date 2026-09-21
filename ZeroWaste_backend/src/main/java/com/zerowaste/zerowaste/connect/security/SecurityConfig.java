package com.zerowaste.zerowaste.connect.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.zerowaste.zerowaste.connect.repository.AppUserRepository;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public UserDetailsService userDetailsService(
            AppUserRepository userRepository) {

        return email ->
                userRepository
                        .findByEmailIgnoreCase(email)
                        .map(UserPrincipal::new)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found"
                                )
                        );
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);


        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

            .csrf(csrf -> csrf.disable())

            .cors(Customizer.withDefaults())

            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                /*
                 * CORS preflight
                 */
                .requestMatchers(
                        HttpMethod.OPTIONS,
                        "/**"
                ).permitAll()


                /*
                 * Authentication
                 */
                .requestMatchers(
                        "/auth/login",
                        "/auth/register"
                ).permitAll()


                /*
                 * Swagger
                 */
                .requestMatchers(
                        "/swagger-ui/**",
                        "/v3/api-docs/**",
                        "/swagger-ui.html"
                ).permitAll()


                /*
                 * PUBLIC LANDING PAGE DATA
                 *
                 * GET is public.
                 *
                 * POST / PUT / DELETE are still
                 * protected by the final rule.
                 */
                .requestMatchers(
                        HttpMethod.GET,
                        "/analytics"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.GET,
                        "/restaurants",
                        "/restaurants/**"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.GET,
                        "/ngos"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.GET,
                        "/food"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.GET,
                        "/matches"
                ).permitAll()


                /*
                 * Everything else requires JWT.
                 */
                .anyRequest().authenticated()
            )

            .addFilterBefore(
                    jwtAuthFilter,
                    UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }
}