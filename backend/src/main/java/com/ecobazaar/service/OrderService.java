package com.ecobazaar.service;

import com.ecobazaar.dto.request.OrderRequest;
import com.ecobazaar.dto.response.OrderResponse;
import com.ecobazaar.entity.Cart;
import com.ecobazaar.entity.CartItem;
import com.ecobazaar.entity.Order;
import com.ecobazaar.entity.OrderItem;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.enums.OrderStatus;
import com.ecobazaar.exception.BadRequestException;
import com.ecobazaar.exception.ResourceNotFoundException;
import com.ecobazaar.repository.CartRepository;
import com.ecobazaar.repository.CartItemRepository;
import com.ecobazaar.repository.OrderRepository;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    @Transactional
    public OrderResponse createOrder(OrderRequest request, Long userId) {
        if (request == null || request.getProductIds() == null || request.getProductIds().isEmpty()) {
            return createOrderFromCart(request, userId);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        if (request.getShippingAddress() != null) order.setShippingAddress(request.getShippingAddress());
        if (request.getPaymentMethod() != null) order.setPaymentMethod(request.getPaymentMethod());

        Set<OrderItem> orderItems = new HashSet<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        double totalCarbon = 0.0;

        for (Long productId : request.getProductIds()) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + productId));

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(1);
            BigDecimal price = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
            double carbon = product.getCarbonImpact() != null ? product.getCarbonImpact() : 0.0;
            item.setPrice(price);
            item.setCarbonImpact(carbon);
            item.setSubtotal(price);
            item.setCarbonSubtotal(carbon);

            orderItems.add(item);
            totalPrice = totalPrice.add(price);
            totalCarbon += carbon;
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setTotalCarbon(totalCarbon);

        orderRepository.save(order);
        return OrderResponse.fromEntity(order);
    }

    @Transactional
    public OrderResponse createOrderFromCart(OrderRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new BadRequestException("Cart not found"));
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cart is empty. Add items before checkout.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        if (request != null) {
            if (request.getShippingAddress() != null) order.setShippingAddress(request.getShippingAddress());
            if (request.getPaymentMethod() != null) order.setPaymentMethod(request.getPaymentMethod());
        }

        Set<OrderItem> orderItems = new HashSet<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        double totalCarbon = 0.0;

        for (CartItem ci : cart.getItems()) {
            Product product = ci.getProduct();
            int qty = ci.getQuantity();
            BigDecimal unitPrice = product.getPrice() != null ? product.getPrice() : BigDecimal.ZERO;
            double unitCarbon = product.getCarbonImpact() != null ? product.getCarbonImpact() : 0.0;
            BigDecimal linePrice = unitPrice.multiply(BigDecimal.valueOf(qty));
            double lineCarbon = unitCarbon * qty;

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(qty);
            item.setPrice(unitPrice);
            item.setCarbonImpact(unitCarbon);
            item.setSubtotal(linePrice);
            item.setCarbonSubtotal(lineCarbon);

            orderItems.add(item);
            totalPrice = totalPrice.add(linePrice);
            totalCarbon += lineCarbon;
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);
        order.setTotalCarbon(totalCarbon);

        orderRepository.save(order);

        cartItemRepository.deleteAll(cart.getItems());
        cart.setTotalPrice(BigDecimal.ZERO);
        cart.setTotalCarbon(0.0);
        cartRepository.save(cart);

        return OrderResponse.fromEntity(order);
    }

    public List<OrderResponse> getUserOrders(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orderRepository.findByUser(user)
                .stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public OrderResponse getOrderById(Long id) {
        return OrderResponse.fromEntity(orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found")));
    }

}
