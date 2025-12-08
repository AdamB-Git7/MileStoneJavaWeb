package com.fragranceshop.fragrance_shop_backend.service;

import com.fragranceshop.fragrance_shop_backend.entity.Product;
import com.fragranceshop.fragrance_shop_backend.dto.request.ProductRequestDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.ProductResponseDTO;
import com.fragranceshop.fragrance_shop_backend.repository.ProductRepository;
import com.fragranceshop.fragrance_shop_backend.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repository;

    public List<ProductResponseDTO> getAll() {
        return repository.findAll().stream()
                .map(p -> new ProductResponseDTO(p.getId(), p.getName(), p.getBrand(),
                        p.getPrice(), p.getStockQuantity(), p.getConcentration()))
                .toList();
    }

    public ProductResponseDTO getById(Long id) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        return new ProductResponseDTO(p.getId(), p.getName(), p.getBrand(),
                p.getPrice(), p.getStockQuantity(), p.getConcentration());
    }

    public ProductResponseDTO create(ProductRequestDTO dto) {
        Product p = new Product(null, dto.getName(), dto.getBrand(),
                dto.getPrice(), dto.getStockQuantity(),
                dto.getDescription(), dto.getConcentration());
        repository.save(p);
        return getById(p.getId());
    }

    public ProductResponseDTO update(Long id, ProductRequestDTO dto) {
        Product p = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Product not found"));
        p.setName(dto.getName());
        p.setBrand(dto.getBrand());
        p.setPrice(dto.getPrice());
        p.setStockQuantity(dto.getStockQuantity());
        p.setDescription(dto.getDescription());
        p.setConcentration(dto.getConcentration());
        repository.save(p);
        return getById(p.getId());
    }



    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new NotFoundException("Product not found");
        }
        repository.deleteById(id);
    }

}
