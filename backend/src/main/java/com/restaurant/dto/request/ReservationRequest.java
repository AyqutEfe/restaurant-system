package com.restaurant.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {

    @NotBlank(message = "Müşteri adı boş olamaz")
    private String customerName;

    @NotBlank(message = "Telefon numarası boş olamaz")
    private String customerPhone;

    @NotNull(message = "Rezervasyon tarihi boş olamaz")
    @FutureOrPresent(message = "Rezervasyon tarihi geçmiş olamaz")
    private LocalDate reservationDate;

    @NotNull(message = "Rezervasyon saati boş olamaz")
    private LocalTime reservationTime;

    @NotNull(message = "Kişi sayısı boş olamaz")
    @Min(value = 1, message = "Kişi sayısı en az 1 olmalıdır")
    @Max(value = 6, message = "Bir masa en fazla 6 kişiliktir")
    private Integer partySize;

    @NotNull(message = "Masa numarası boş olamaz")
    @Min(value = 1, message = "Masa numarası 1-10 arasında olmalıdır")
    @Max(value = 10, message = "Masa numarası 1-10 arasında olmalıdır")
    private Integer tableNumber;

    private String specialRequest;
}
