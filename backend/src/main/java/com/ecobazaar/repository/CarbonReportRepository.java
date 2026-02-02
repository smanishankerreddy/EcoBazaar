package com.ecobazaar.repository;

import com.ecobazaar.entity.CarbonReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarbonReportRepository extends JpaRepository<CarbonReport, Long> {
}
