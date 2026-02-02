package com.ecobazaar.dto.response;

import com.ecobazaar.entity.Cart;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartResponse {
    private Long id;
    private Long userId;
    private List<CartItemResponse> items;
    private Double totalPrice;
    private Double totalCarbon;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CartItemResponse {
        private Long id;
        private Long productId;
        private String productName;
        private int quantity;
        private Double unitPrice;
        private Double unitCarbon;
        private Double price;      // line subtotal
        private Double carbonImpact; // line carbon subtotal
    }

    public static CartResponse fromEntity(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser() != null ? cart.getUser().getId() : null);
        response.setTotalPrice(cart.getTotalPrice() != null ? cart.getTotalPrice().doubleValue() : 0.0);
        response.setTotalCarbon(cart.getTotalCarbon() != null ? cart.getTotalCarbon() : 0.0);
        
        if (cart.getItems() != null) {
            response.setItems(cart.getItems().stream()
                    .map(item -> {
                        CartItemResponse itemResponse = new CartItemResponse();
                        itemResponse.setId(item.getId());
                        itemResponse.setProductId(item.getProduct() != null ? item.getProduct().getId() : null);
                        itemResponse.setProductName(item.getProduct() != null ? item.getProduct().getName() : null);
                        itemResponse.setQuantity(item.getQuantity());
                        double unitPrice = item.getProduct() != null && item.getProduct().getPrice() != null ? item.getProduct().getPrice().doubleValue() : 0.0;
                        double unitCarbon = item.getProduct() != null && item.getProduct().getCarbonImpact() != null ? item.getProduct().getCarbonImpact() : 0.0;
                        itemResponse.setUnitPrice(unitPrice);
                        itemResponse.setUnitCarbon(unitCarbon);
                        itemResponse.setPrice(item.getSubtotal() != null ? item.getSubtotal().doubleValue() : 0.0);
                        itemResponse.setCarbonImpact(item.getCarbonSubtotal() != null ? item.getCarbonSubtotal() : 0.0);
                        return itemResponse;
                    })
                    .collect(Collectors.toList()));
        }
        
        return response;
    }
}
