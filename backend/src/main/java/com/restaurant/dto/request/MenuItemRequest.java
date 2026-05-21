package com.restaurant.dto.request;

import com.restaurant.entity.enums.MenuCategory;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenuItemRequest {

    @NotBlank(message = "Ürün adı boş olamaz")
    private String name;

    private String description;

    @NotNull(message = "Fiyat boş olamaz")
    @DecimalMin(value = "0.01", message = "Fiyat 0'dan büyük olmalıdır")
    private BigDecimal price;

    @NotNull(message = "Kategori boş olamaz")
    private MenuCategory category;

    private String imageUrl;
}
