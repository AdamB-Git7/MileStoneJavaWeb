package com.fragranceshop.fragrance_shop_backend.controller;

import com.fragranceshop.fragrance_shop_backend.dto.request.CustomerRequestDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.CustomerResponseDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.CustomerWithOrdersResponseDTO;
import com.fragranceshop.fragrance_shop_backend.service.CustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class `CustomerController {

    private final CustomerService service;

    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> all() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> one(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<CustomerResponseDTO> create(@Valid @RequestBody CustomerRequestDTO dto) {
        CustomerResponseDTO created = service.create(dto);

        return ResponseEntity.created(
                URI.create("/api/customers/" + created.id())
        ).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> update(@PathVariable Long id,
                                                      @Valid @RequestBody CustomerRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<CustomerWithOrdersResponseDTO> getSummary(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCustomerSummary(id));
    }
}
