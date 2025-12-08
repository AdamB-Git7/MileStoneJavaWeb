package com.fragranceshop.fragrance_shop_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fragranceshop.fragrance_shop_backend.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> { }
