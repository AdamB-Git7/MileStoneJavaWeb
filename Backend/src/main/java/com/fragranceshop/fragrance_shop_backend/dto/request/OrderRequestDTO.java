package com.fragranceshop.fragrance_shop_backend.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderRequestDTO {

    private Long customerId;
    private List<Long> productIds;
}
