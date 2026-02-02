package com.ecobazaar.service;

import com.ecobazaar.dto.request.ProductRequest;
import com.ecobazaar.dto.response.ProductResponse;
import com.ecobazaar.entity.Product;
import com.ecobazaar.entity.User;
import com.ecobazaar.exception.ResourceNotFoundException;
import com.ecobazaar.repository.ProductRepository;
import com.ecobazaar.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public Page<ProductResponse> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable)
                .map(ProductResponse::fromEntity);
    }

    public List<ProductResponse> getAllProductsList() {
        return productRepository.findAll().stream()
                .filter(p -> p.getIsActive() != null && p.getIsActive())
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ProductResponse.fromEntity(product);
    }

    public Page<ProductResponse> searchProducts(String keyword, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(keyword, pageable)
                .map(ProductResponse::fromEntity);
    }

    public ProductResponse createProduct(ProductRequest request) {
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setEcoRating(request.getEcoRating());
        product.setEcoCertified(request.isEcoCertified());
        product.setCarbonImpact(request.getCarbonImpact());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        product.setStockQuantity(request.getStockQuantity() != null ? request.getStockQuantity() : 0);
        product.setIsActive(true);
        product.setIsApproved(false);

        // Get current authenticated user as seller
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        product.setSeller(seller);

        productRepository.save(product);
        return ProductResponse.fromEntity(product);
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setEcoRating(request.getEcoRating());
        product.setEcoCertified(request.isEcoCertified());
        product.setCarbonImpact(request.getCarbonImpact());
        product.setImageUrl(request.getImageUrl());
        product.setCategory(request.getCategory());
        if (request.getStockQuantity() != null) {
            product.setStockQuantity(request.getStockQuantity());
        }

        productRepository.save(product);
        return ProductResponse.fromEntity(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found");
        }
        productRepository.deleteById(id);
    }

    public void approveProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        product.setIsApproved(true);
        productRepository.save(product);
    }

    public List<ProductResponse> getMyProducts() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User seller = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Seller not found"));
        return productRepository.findBySellerId(seller.getId()).stream()
                .map(ProductResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
