package com.ecobazaar.dto.response;

import com.ecobazaar.entity.Order;
import com.ecobazaar.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private Long userId;
    private List<OrderItemResponse> items;
    private Double totalPrice;
    private Double totalCarbon;
    private OrderStatus status;
    private String shippingAddress;
    private String paymentMethod;
    private Instant orderDate;
    private Instant deliveryDate;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private int quantity;
        private Double price;
        private Double carbonImpact;
    }

    public static OrderResponse fromEntity(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser() != null ? order.getUser().getId() : null);
        response.setTotalPrice(order.getTotalPrice() != null ? order.getTotalPrice().doubleValue() : 0.0);
        response.setTotalCarbon(order.getTotalCarbon() != null ? order.getTotalCarbon() : 0.0);
        response.setStatus(order.getStatus());
        response.setShippingAddress(order.getShippingAddress());
        response.setPaymentMethod(order.getPaymentMethod());
        response.setOrderDate(order.getOrderDate());
        response.setDeliveryDate(order.getDeliveryDate());
        
        if (order.getItems() != null) {
            response.setItems(order.getItems().stream()
                    .map(item -> {
                        OrderItemResponse itemResponse = new OrderItemResponse();
                        itemResponse.setId(item.getId());
                        itemResponse.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
                        itemResponse.setProductName(item.getProduct() != null ? item.getProduct().getName() : null);
                        itemResponse.setQuantity(item.getQuantity());
                        itemResponse.setPrice(item.getPrice() != null ? item.getPrice().doubleValue() : 0.0);
                        itemResponse.setCarbonImpact(item.getCarbonImpact() != null ? item.getCarbonImpact() : 0.0);
                        return itemResponse;
                    })
                    .collect(Collectors.toList()));
        }
        
        return response;
    }
}
