package com.ecobazaar.controller;

import com.ecobazaar.dto.response.AnalyticsResponse;
import com.ecobazaar.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public AnalyticsResponse getDashboardAnalytics() {
        return analyticsService.getDashboardData();
    }

    @GetMapping("/carbon")
    public AnalyticsResponse getCarbonReport() {
        return analyticsService.getCarbonReport();
    }
}
