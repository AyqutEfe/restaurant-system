package com.restaurant.dto.response;

import com.restaurant.entity.enums.ReservationStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {

    private UUID id;
    private String customerName;
    private String customerPhone;
    private LocalDate reservationDate;
    private LocalTime reservationTime;
    private Integer partySize;
    private Integer tableNumber;
    private ReservationStatus status;
    private String specialRequest;
    private LocalDateTime createdAt;
}
