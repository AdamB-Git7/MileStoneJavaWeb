package com.fragranceshop.fragrance_shop_backend.dto.response;

import java.time.LocalDateTime;

public record OrderSummaryDTO(
        Long id,
        Double totalAmount,
        LocalDateTime dateCreated
) {}
