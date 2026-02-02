package com.ecobazaar.dto.response;

import com.ecobazaar.entity.Product;
import com.ecobazaar.enums.EcoRating;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private EcoRating ecoRating;
    private boolean ecoCertified;
    private Double carbonImpact;
    private String category;
    private Integer stockQuantity;
    private Long sellerId;
    private Boolean isApproved;
    private Boolean isActive;
    private String createdAt;
    private String updatedAt;

    public static ProductResponse fromEntity(Product product) {
        ProductResponse response = new ProductResponse();
        response.setId(product.getId());
        response.setName(product.getName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setImageUrl(product.getImageUrl());
        response.setEcoRating(product.getEcoRating());
        response.setEcoCertified(product.isEcoCertified());
        response.setCarbonImpact(product.getCarbonImpact());
        response.setCategory(product.getCategory());
        response.setStockQuantity(product.getStockQuantity());
        response.setSellerId(product.getSeller() != null ? product.getSeller().getId() : null);
        response.setIsApproved(product.getIsApproved());
        response.setIsActive(product.getIsActive());
        response.setCreatedAt(product.getCreatedAt() != null ? product.getCreatedAt().toString() : null);
        response.setUpdatedAt(product.getUpdatedAt() != null ? product.getUpdatedAt().toString() : null);
        return response;
    }
}
