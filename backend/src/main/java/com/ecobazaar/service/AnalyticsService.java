package com.ecobazaar.service;

import com.ecobazaar.dto.response.AnalyticsResponse;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    public AnalyticsResponse getDashboardData() {
        return new AnalyticsResponse(); // Add real analytics logic
    }

    public AnalyticsResponse getCarbonReport() {
        return new AnalyticsResponse(); // Add real report logic
    }
}
