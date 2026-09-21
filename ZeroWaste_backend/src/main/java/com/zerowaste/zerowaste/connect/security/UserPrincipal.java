package com.zerowaste.zerowaste.connect.security;

import java.io.Serializable;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.zerowaste.zerowaste.connect.entity.AppUser;

public class UserPrincipal implements UserDetails, Serializable {

    private static final long serialVersionUID = 1L;

    private final Long id;
    private final String email;
    private final String passwordHash;
    private final String role;
    private final String name;
    private final String contactNumber;
    private final Long restaurantId;
    private final Long ngoId;

    public UserPrincipal(AppUser user) {

        this.id = user.getId();
        this.email = user.getEmail();
        this.passwordHash = user.getPasswordHash();
        this.role = user.getRole();
        this.name = user.getName();
        this.contactNumber = user.getContactNumber();
        this.restaurantId = user.getRestaurantId();
        this.ngoId = user.getNgoId();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getName() {
        return name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public Long getNgoId() {
        return ngoId;
    }

    public boolean isRestaurant() {
        return "RESTAURANT".equalsIgnoreCase(role);
    }

    public boolean isNgo() {
        return "NGO".equalsIgnoreCase(role);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
            new SimpleGrantedAuthority("ROLE_" + role)
        );
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}