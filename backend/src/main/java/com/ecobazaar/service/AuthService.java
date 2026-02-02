package com.ecobazaar.service;

import com.ecobazaar.dto.request.LoginRequest;
import com.ecobazaar.dto.request.RegisterRequest;
import com.ecobazaar.dto.response.AuthResponse;
import com.ecobazaar.entity.User;
import com.ecobazaar.enums.Role;
import com.ecobazaar.exception.BadRequestException;
import com.ecobazaar.repository.UserRepository;
import com.ecobazaar.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.USER);
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setEcoScore(0.0);
        user.setIsActive(true);

        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getRole());
        
        return new AuthResponse(token, "Bearer", savedUser.getId(), savedUser.getName(), 
                savedUser.getEmail(), savedUser.getRole(), "Registration successful");
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, "Bearer", user.getId(), user.getName(), 
                user.getEmail(), user.getRole(), "Login successful");
    }
}
