package com.ecobazaar.controller;

import com.ecobazaar.dto.request.CartItemRequest;
import com.ecobazaar.dto.response.CartResponse;
import com.ecobazaar.dto.response.GreenSuggestionResponse;
import com.ecobazaar.service.CartService;
import com.ecobazaar.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class CartController {

    private final CartService cartService;
    private final RecommendationService recommendationService;

    @GetMapping
    public CartResponse getCart() {
        return cartService.getUserCart();
    }

    @GetMapping("/recommendations")
    public List<GreenSuggestionResponse> getGreenRecommendations() {
        return recommendationService.getGreenAlternativesForCart();
    }

    @PostMapping("/items")
    public CartResponse addItem(@RequestBody CartItemRequest request) {
        return cartService.addItem(request);
    }

    @PutMapping("/items/{itemId}")
    public CartResponse updateItem(@PathVariable Long itemId, @RequestBody CartItemRequest request) {
        return cartService.updateItem(itemId, request);
    }

    @DeleteMapping("/items/{itemId}")
    public CartResponse removeItem(@PathVariable Long itemId) {
        return cartService.removeItem(itemId);
    }

    @DeleteMapping("/clear")
    public CartResponse clearCart() {
        return cartService.clearCart();
    }
}
