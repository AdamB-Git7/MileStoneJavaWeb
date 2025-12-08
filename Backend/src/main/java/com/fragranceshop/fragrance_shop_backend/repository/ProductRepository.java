package com.fragranceshop.fragrance_shop_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fragranceshop.fragrance_shop_backend.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> { }
