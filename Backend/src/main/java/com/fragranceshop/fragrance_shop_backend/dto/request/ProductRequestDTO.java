package com.fragranceshop.fragrance_shop_backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
public class ProductRequestDTO {
    @NotBlank private String name;
    @NotBlank private String brand;
    @Positive private Double price;
    @Min(0) private Integer stockQuantity;
    private String description;
    private String concentration;
}
