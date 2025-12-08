package com.fragranceshop.fragrance_shop_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
import com.fragranceshop.fragrance_shop_backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
}
