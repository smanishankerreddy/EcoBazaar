package com.ecobazaar.controller;

import com.ecobazaar.dto.request.ProductRequest;
import com.ecobazaar.dto.response.ProductResponse;
import com.ecobazaar.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/list")
    public List<ProductResponse> listProducts(@RequestParam(required = false) Integer page,
                                              @RequestParam(required = false) Integer size) {
        if (page != null && size != null) {
            return productService.getAllProducts(
                org.springframework.data.domain.PageRequest.of(page, size)
            ).getContent();
        }
        return productService.getAllProductsList();
    }

    @GetMapping("/{id}")
    public ProductResponse getProduct(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/search")
    public Page<ProductResponse> searchProducts(@RequestParam String keyword, Pageable pageable) {
        return productService.searchProducts(keyword, pageable);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ProductResponse createProduct(@RequestBody ProductRequest request) {
        return productService.createProduct(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public ProductResponse updateProduct(@PathVariable Long id, @RequestBody ProductRequest request) {
        return productService.updateProduct(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public void deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
    }

    @GetMapping("/my-products")
    @PreAuthorize("hasAnyRole('ADMIN','SELLER')")
    public List<ProductResponse> getMyProducts() {
        return productService.getMyProducts();
    }
}
