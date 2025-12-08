package com.fragranceshop.fragrance_shop_backend.mappers;

import com.fragranceshop.fragrance_shop_backend.dto.request.ProductRequestDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.ProductResponseDTO;
import com.fragranceshop.fragrance_shop_backend.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(ProductRequestDTO dto) {
        return new Product(
                null,
                dto.getName(),
                dto.getBrand(),
                dto.getPrice(),
                dto.getStockQuantity(),
                dto.getDescription(),
                dto.getConcentration()
        );
    }

    public ProductResponseDTO toDTO(Product entity) {
        return new ProductResponseDTO(
                entity.getId(),
                entity.getName(),
                entity.getBrand(),
                entity.getPrice(),
                entity.getStockQuantity(),
                entity.getConcentration()
        );
    }
}
