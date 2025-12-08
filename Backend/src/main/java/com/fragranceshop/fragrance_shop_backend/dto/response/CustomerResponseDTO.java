package com.fragranceshop.fragrance_shop_backend.dto.response;

public record CustomerResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email
) {}
