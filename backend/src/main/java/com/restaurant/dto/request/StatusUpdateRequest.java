package com.restaurant.dto.request;

import com.restaurant.entity.enums.ReservationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateRequest {

    @NotNull(message = "Durum boş olamaz")
    private ReservationStatus status;
}
