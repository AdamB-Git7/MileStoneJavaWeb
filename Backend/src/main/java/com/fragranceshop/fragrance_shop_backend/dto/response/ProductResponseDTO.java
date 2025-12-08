package com.fragranceshop.fragrance_shop_backend.dto.response;

import lombok.*;

@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String brand;
    private Double price;
    private Integer stockQuantity;
    private String concentration;
}
