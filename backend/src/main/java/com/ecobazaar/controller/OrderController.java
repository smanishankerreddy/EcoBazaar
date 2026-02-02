package com.ecobazaar.controller;

import com.ecobazaar.dto.request.OrderRequest;
import com.ecobazaar.dto.response.OrderResponse;
import com.ecobazaar.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public OrderResponse createOrder(@RequestBody(required = false) OrderRequest request,
                                     @RequestHeader("X-User-Id") Long userId) {
        return orderService.createOrder(request, userId);
    }

    @GetMapping
    public List<OrderResponse> getUserOrders(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getUserOrders(userId);
    }

    @GetMapping("/{id}")
    public OrderResponse getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id);
    }
}
