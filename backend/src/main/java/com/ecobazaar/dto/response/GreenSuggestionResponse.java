package com.ecobazaar.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GreenSuggestionResponse {
    private Long productId;
    private String productName;
    private String category;
    private Double carbonImpact;
    private BigDecimal price;
    private String imageUrl;

    /** Product in cart this alternative can replace */
    private Long replacesProductId;
    private String replacesProductName;
    /** Carbon saved (kg CO₂) if user switches to this alternative (per unit) */
    private Double carbonSavedPerUnit;
    /** Total carbon saved for current cart quantity */
    private Double carbonSavedTotal;
}
