package com.fragranceshop.fragrance_shop_backend.mappers;

import com.fragranceshop.fragrance_shop_backend.dto.response.OrderResponseDTO;
import com.fragranceshop.fragrance_shop_backend.entity.Order;
import com.fragranceshop.fragrance_shop_backend.entity.Product;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper {

    public OrderResponseDTO toDTO(Order entity) {

        // Customer name (first + last)
        String customerName = entity.getCustomer().getFirstName() + " " +
                entity.getCustomer().getLastName();

        // Convert list of Product objects -> List<String> names
        List<String> productNames = entity.getProducts()
                .stream()
                .map(Product::getName)
                .toList();

        // Return DTO exactly in the order your constructor expects
        return new OrderResponseDTO(
                entity.getId(),
                customerName,
                productNames,
                entity.getTotalAmount(),
                entity.getDateCreated()
        );
    }
}
