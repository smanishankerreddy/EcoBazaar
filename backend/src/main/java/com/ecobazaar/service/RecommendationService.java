package com.ecobazaar.service;

import com.ecobazaar.dto.response.GreenSuggestionResponse;
import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.exception.ResourceNotFoundException;
import com.ecobazaar.repository.CartRepository;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    /** Eco-friendly products (e.g. EXCELLENT rating) for general browse. */
    public List<Product> recommendEcoFriendlyProducts() {
        return productRepository.findAll().stream()
                .filter(p -> p.getEcoRating() != null && "EXCELLENT".equals(p.getEcoRating().name()))
                .filter(p -> Boolean.TRUE.equals(p.getIsApproved()) && Boolean.TRUE.equals(p.getIsActive()))
                .collect(Collectors.toList());
    }

    /** Green alternatives for current cart: lower-carbon options per category with potential savings. */
    public List<GreenSuggestionResponse> getGreenAlternativesForCart() {
        User user = getCurrentUser();
        var cart = cartRepository.findByUser(user)
                .orElse(null);
        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            return List.of();
        }

        List<GreenSuggestionResponse> suggestions = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            Product current = item.getProduct();
            if (current == null || current.getCategory() == null || current.getCarbonImpact() == null) continue;
            double currentCarbon = current.getCarbonImpact();
            int qty = item.getQuantity();

            List<Product> alternatives = productRepository
                    .findTop5ByCategoryAndIsApprovedTrueAndIsActiveTrueAndCarbonImpactLessThanOrderByCarbonImpactAsc(
                            current.getCategory(), currentCarbon);
            for (Product alt : alternatives) {
                if (alt.getId().equals(current.getId())) continue;
                double savedPerUnit = currentCarbon - (alt.getCarbonImpact() != null ? alt.getCarbonImpact() : 0);
                if (savedPerUnit <= 0) continue;
                GreenSuggestionResponse dto = new GreenSuggestionResponse();
                dto.setProductId(alt.getId());
                dto.setProductName(alt.getName());
                dto.setCategory(alt.getCategory());
                dto.setCarbonImpact(alt.getCarbonImpact());
                dto.setPrice(alt.getPrice());
                dto.setImageUrl(alt.getImageUrl());
                dto.setReplacesProductId(current.getId());
                dto.setReplacesProductName(current.getName());
                dto.setCarbonSavedPerUnit(savedPerUnit);
                dto.setCarbonSavedTotal(savedPerUnit * qty);
                suggestions.add(dto);
            }
        }
        return suggestions;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
