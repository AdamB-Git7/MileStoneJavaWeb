package com.fragranceshop.fragrance_shop_backend.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record OrderWithCustomerResponseDTO(
        Long id,
        CustomerSummaryDTO customer,
        List<String> products,
        Double totalAmount,
        LocalDateTime dateCreated
) {}
