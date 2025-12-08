package com.fragranceshop.fragrance_shop_backend.controller;

import com.fragranceshop.fragrance_shop_backend.dto.request.OrderRequestDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.OrderResponseDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.OrderWithCustomerResponseDTO;
import com.fragranceshop.fragrance_shop_backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> all() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> one(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> create(@Valid @RequestBody OrderRequestDTO dto) {
        OrderResponseDTO created = service.place(dto);

        return ResponseEntity.created(
                URI.create("/api/orders/" + created.getId())
        ).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> update(@PathVariable Long id,
                                                   @Valid @RequestBody OrderRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/summary")
    public ResponseEntity<OrderWithCustomerResponseDTO> getSummary(@PathVariable Long id) {
        return ResponseEntity.ok(service.getOrderSummary(id));
    }
}
