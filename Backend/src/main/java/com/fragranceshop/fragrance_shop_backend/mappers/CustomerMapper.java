package com.fragranceshop.fragrance_shop_backend.mappers;

import com.fragranceshop.fragrance_shop_backend.dto.request.CustomerRequestDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.CustomerResponseDTO;
import com.fragranceshop.fragrance_shop_backend.entity.Customer;
import org.springframework.stereotype.Component;

@Component
public class CustomerMapper {

    public Customer toEntity(CustomerRequestDTO dto) {
        return new Customer(
                null,
                dto.getFirstName(),
                dto.getLastName(),
                dto.getEmail()
        );
    }

    public CustomerResponseDTO toDTO(Customer entity) {
        return new CustomerResponseDTO(
                entity.getId(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getEmail()
        );
    }
}
