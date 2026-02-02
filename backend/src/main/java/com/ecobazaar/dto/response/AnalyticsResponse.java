package com.ecobazaar.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@lombok.NoArgsConstructor
public class AnalyticsResponse {
    private Long totalUsers;
    private Long totalOrders;
    private Double totalRevenue;
    private Double totalCarbonSaved;
    private Map<String, Long> productsByCategory;
}
