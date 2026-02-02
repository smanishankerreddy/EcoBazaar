package com.ecobazaar.service;

import com.ecobazaar.dto.request.CartItemRequest;
import com.ecobazaar.dto.response.CartResponse;
import com.ecobazaar.entity.Cart;
import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import java.math.BigDecimal;
import java.util.Optional;
import com.ecobazaar.exception.ResourceNotFoundException;
import com.ecobazaar.repository.CartItemRepository;
import com.ecobazaar.repository.CartRepository;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartResponse getUserCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });
        if (cart.getItems() != null) {
            for (CartItem i : cart.getItems()) {
                if (i.getSubtotal() == null || i.getCarbonSubtotal() == null) setItemTotals(i);
            }
            cartItemRepository.saveAll(cart.getItems());
        }
        recalculateCartTotals(cart);
        return CartResponse.fromEntity(cartRepository.findById(cart.getId()).orElse(cart));
    }

    public CartResponse addItem(CartItemRequest request) {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            return cartRepository.save(newCart);
        });

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        int quantity = request.getQuantity();

        Optional<CartItem> existing = cartItemRepository.findByCartAndProduct(cart, product);
        CartItem item;
        if (existing.isPresent()) {
            item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
        } else {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(quantity);
        }
        setItemTotals(item);
        cartItemRepository.save(item);

        recalculateCartTotals(cart);
        return CartResponse.fromEntity(cartRepository.findById(cart.getId()).orElse(cart));
    }

    public CartResponse updateItem(Long itemId, CartItemRequest request) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        item.setQuantity(request.getQuantity());
        setItemTotals(item);
        cartItemRepository.save(item);

        Cart cart = item.getCart();
        recalculateCartTotals(cart);
        return CartResponse.fromEntity(cartRepository.findById(cart.getId()).orElse(cart));
    }

    public CartResponse removeItem(Long itemId) {
        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found"));
        Cart cart = item.getCart();
        cartItemRepository.delete(item);

        recalculateCartTotals(cart);
        return CartResponse.fromEntity(cartRepository.findById(cart.getId()).orElse(cart));
    }

    public CartResponse clearCart() {
        User user = getCurrentUser();
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found"));
        cartItemRepository.deleteAll(cart.getItems());

        cart.setTotalPrice(BigDecimal.ZERO);
        cart.setTotalCarbon(0.0);
        cartRepository.save(cart);
        return CartResponse.fromEntity(cart);
    }

    private void setItemTotals(CartItem item) {
        Product p = item.getProduct();
        BigDecimal unitPrice = p.getPrice() != null ? p.getPrice() : BigDecimal.ZERO;
        double unitCarbon = p.getCarbonImpact() != null ? p.getCarbonImpact() : 0.0;
        int qty = item.getQuantity();
        item.setSubtotal(unitPrice.multiply(BigDecimal.valueOf(qty)));
        item.setCarbonSubtotal(unitCarbon * qty);
    }

    private void recalculateCartTotals(Cart cart) {
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            cart.setTotalPrice(BigDecimal.ZERO);
            cart.setTotalCarbon(0.0);
        } else {
            BigDecimal totalPrice = cart.getItems().stream()
                    .map(CartItem::getSubtotal)
                    .filter(java.util.Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            double totalCarbon = cart.getItems().stream()
                    .mapToDouble(i -> i.getCarbonSubtotal() != null ? i.getCarbonSubtotal() : 0.0)
                    .sum();
            cart.setTotalPrice(totalPrice);
            cart.setTotalCarbon(totalCarbon);
        }
        cartRepository.save(cart);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
