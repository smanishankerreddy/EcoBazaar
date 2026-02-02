package com.ecobazaar.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderRequest {

    /** When null or empty, order is created from current cart. */
    private List<Long> productIds;

    private String shippingAddress;
    private String paymentMethod;
}
