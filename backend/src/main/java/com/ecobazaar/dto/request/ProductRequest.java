package com.ecobazaar.dto.request;

import com.ecobazaar.enums.EcoRating;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    private String name;

    private String description;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    private String imageUrl;

    private EcoRating ecoRating;

    private boolean ecoCertified;

    private Double carbonImpact;

    private String category;

    private Integer stockQuantity;

    private Long sellerId;
}
