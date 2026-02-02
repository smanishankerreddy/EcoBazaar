package com.ecobazaar.service;

import com.ecobazaar.entity.CarbonReport;
import com.ecobazaar.repository.CarbonReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final CarbonReportRepository carbonReportRepository;

    public List<CarbonReport> getAllReports() {
        return carbonReportRepository.findAll();
    }
}
