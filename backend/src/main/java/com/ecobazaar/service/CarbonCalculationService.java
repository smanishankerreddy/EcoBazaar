package com.ecobazaar.service;

import com.ecobazaar.entity.Product;
import org.springframework.stereotype.Service;

@Service
public class CarbonCalculationService {

    public double calculateCarbonImpact(Product product, int quantity) {
        return product.getCarbonImpact() * quantity;
    }
}
