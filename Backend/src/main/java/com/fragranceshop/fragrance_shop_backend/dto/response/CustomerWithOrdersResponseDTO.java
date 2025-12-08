package com.fragranceshop.fragrance_shop_backend.dto.response;

import java.util.List;

public record CustomerWithOrdersResponseDTO(
        Long id,
        String firstName,
        String lastName,
        String email,
        List<OrderSummaryDTO> orders
) {}
