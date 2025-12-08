package com.fragranceshop.fragrance_shop_backend.service;

import com.fragranceshop.fragrance_shop_backend.dto.request.CustomerRequestDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.CustomerResponseDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.CustomerWithOrdersResponseDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.OrderResponseDTO;
import com.fragranceshop.fragrance_shop_backend.dto.response.OrderSummaryDTO;
import com.fragranceshop.fragrance_shop_backend.entity.Customer;
import com.fragranceshop.fragrance_shop_backend.entity.Order;
import com.fragranceshop.fragrance_shop_backend.exception.ConflictException;
import com.fragranceshop.fragrance_shop_backend.exception.NotFoundException;
import com.fragranceshop.fragrance_shop_backend.mappers.CustomerMapper;
import com.fragranceshop.fragrance_shop_backend.mappers.OrderMapper;
import com.fragranceshop.fragrance_shop_backend.repository.CustomerRepository;
import com.fragranceshop.fragrance_shop_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OrderRepository orderRepository;
    private final CustomerMapper customerMapper;
    private final OrderMapper orderMapper;

    // GET ALL
    public List<CustomerResponseDTO> getAll() {
        return customerRepository.findAll()
                .stream()
                .map(customerMapper::toDTO)
                .toList();
    }

    // GET BY ID
    public CustomerResponseDTO getById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found"));
        return customerMapper.toDTO(customer);
    }

    // CREATE
    public CustomerResponseDTO create(CustomerRequestDTO dto) {
        Customer customer = customerMapper.toEntity(dto);
        Customer saved = customerRepository.save(customer);
        return customerMapper.toDTO(saved);
    }

    // UPDATE
    public CustomerResponseDTO update(Long id, CustomerRequestDTO dto) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        customer.setFirstName(dto.getFirstName());
        customer.setLastName(dto.getLastName());
        customer.setEmail(dto.getEmail());


        Customer updated = customerRepository.save(customer);
        return customerMapper.toDTO(updated);
    }

    // DELETE
    public void delete(Long id) {

        if (!customerRepository.existsById(id)) {
            throw new NotFoundException("Customer not found");
        }

        if (!orderRepository.findByCustomerId(id).isEmpty()) {
            throw new ConflictException("Customer has orders, cannot delete");
        }

        customerRepository.deleteById(id);
    }



    public List<OrderResponseDTO> getOrders(Long customerId) {

        if (!customerRepository.existsById(customerId)) {
            throw new NotFoundException("Customer not found");
        }

        List<Order> orders = orderRepository.findByCustomerId(customerId);

        return orders
                .stream()
                .map(orderMapper::toDTO)
                .toList();
    }

    public CustomerWithOrdersResponseDTO getCustomerSummary(Long id) {

        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Customer not found"));

        List<Order> orders = orderRepository.findByCustomerId(id);

        List<OrderSummaryDTO> orderSummaries = orders.stream()
                .map(o -> new OrderSummaryDTO(
                        o.getId(),
                        o.getTotalAmount(),
                        o.getDateCreated()
                ))
                .toList();

        return new CustomerWithOrdersResponseDTO(
                customer.getId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                orderSummaries
        );
    }

}
