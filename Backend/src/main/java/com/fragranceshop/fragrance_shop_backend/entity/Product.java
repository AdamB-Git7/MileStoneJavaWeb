package com.fragranceshop.fragrance_shop_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank private String name;
    @NotBlank private String brand;
    @Positive private Double price;
    @Min(0) private Integer stockQuantity;
    private String description;
    private String concentration; // EDT, EDP, Parfum
}
