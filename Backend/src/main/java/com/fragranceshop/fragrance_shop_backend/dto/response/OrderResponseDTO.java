package com.fragranceshop.fragrance_shop_backend.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class OrderResponseDTO {
    private Long id;
    private String customerName;
    private List<String> products;
    private Double totalAmount;
    private LocalDateTime dateCreated;
}
