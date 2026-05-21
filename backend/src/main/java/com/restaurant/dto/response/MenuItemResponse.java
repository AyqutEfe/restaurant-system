package com.restaurant.dto.response;

import com.restaurant.entity.enums.MenuCategory;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemResponse {

    private UUID id;
    private String name;
    private String description;
    private BigDecimal price;
    private MenuCategory category;
    private String imageUrl;
    private Boolean isAvailable;
}
