package com.ecobazaar.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "carbon_reports")
@Getter
@Setter
public class CarbonReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "carbon_emitted")
    private Double carbonEmitted = 0.0;

    @Column(name = "carbon_saved")
    private Double carbonSaved = 0.0;

    @Column(name = "eco_rank")
    private Integer ecoRank;

    @Column(name = "report_date")
    private LocalDate reportDate;
}
