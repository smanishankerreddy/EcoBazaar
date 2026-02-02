package com.ecobazaar.repository;

import com.ecobazaar.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
    Page<Product> findByEcoCertifiedTrue(Pageable pageable);
    Page<Product> findByCategory(String category, Pageable pageable);
    List<Product> findBySellerId(Long sellerId);

    /** Green alternatives: same category, lower carbon, approved & active. */
    List<Product> findTop5ByCategoryAndIsApprovedTrueAndIsActiveTrueAndCarbonImpactLessThanOrderByCarbonImpactAsc(
            String category, Double carbonImpact);
}
