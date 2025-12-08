package com.fragranceshop.fragrance_shop_backend.service;

import com.fragranceshop.fragrance_shop_backend.dto.request.OrderRequestDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.CustomerSummaryDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.OrderResponseDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.OrderWithCustomerResponseDTO;
import com.fragranceshop.fragrance_shop_backend.entity.Customer;
import com.fragranceshop.fragrance_shop_backend.entity.Order;
import com.fragranceshop.fragrance_shop_backend.entity.Product;
import com.fragranceshop.fragrance_shop_backend.exception.NotFoundException;
import com.fragranceshop.fragrance_shop_backend.mappers.OrderMapper;
import com.fragranceshop.fragrance_shop_backend.repository.CustomerRepository;
import com.fragranceshop.fragrance_shop_backend.repository.OrderRepository;
import com.fragranceshop.fragrance_shop_backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    // GET ALL
    public List<OrderResponseDTO> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDTO)
                .toList();
    }

    // GET BY ID
    public OrderResponseDTO getById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));
        return orderMapper.toDTO(order);
    }

    // CREATE ORDER (POST)
    public OrderResponseDTO place(OrderRequestDTO dto) {

        // Find customer
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        // Find products
        List<Product> products = productRepository.findAllById(dto.getProductIds());
        if (products.isEmpty()) {
            throw new NotFoundException("No valid products found");
        }

        // Calculate total
        double total = products.stream()
                .mapToDouble(Product::getPrice)
                .sum();

        // Build order
        Order order = new Order();
        order.setCustomer(customer);
        order.setProducts(products);
        order.setTotalAmount(total);
        order.setDateCreated(LocalDateTime.now());

        Order saved = orderRepository.save(order);
        return orderMapper.toDTO(saved);
    }

    // UPDATE ORDER (PUT)
    public OrderResponseDTO update(Long id, OrderRequestDTO dto) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        // Update customer
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new NotFoundException("Customer not found"));
        order.setCustomer(customer);

        // Update products
        List<Product> products = productRepository.findAllById(dto.getProductIds());
        if (products.isEmpty()) {
            throw new NotFoundException("No valid products found");
        }
        order.setProducts(products);

        // Recalculate total
        double total = products.stream()
                .mapToDouble(Product::getPrice)
                .sum();
        order.setTotalAmount(total);

        Order updated = orderRepository.save(order);
        return orderMapper.toDTO(updated);
    }

    // DELETE ORDER
    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new NotFoundException("Order not found");
        }
        orderRepository.deleteById(id);
    }

    public OrderWithCustomerResponseDTO getOrderSummary(Long id) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Order not found"));

        Customer customer = order.getCustomer();

        CustomerSummaryDTO customerSummary = new CustomerSummaryDTO(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName()
        );

        List<String> productNames = order.getProducts()
                .stream()
                .map(Product::getName)
                .toList();

        return new OrderWithCustomerResponseDTO(
                order.getId(),
                customerSummary,
                productNames,
                order.getTotalAmount(),
                order.getDateCreated()
        );
    }

}
