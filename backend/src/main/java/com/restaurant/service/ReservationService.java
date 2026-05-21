package com.restaurant.service;

import com.restaurant.constants.AppConstants;
import com.restaurant.dto.request.ReservationRequest;
import com.restaurant.dto.response.ReservationResponse;
import com.restaurant.entity.Reservation;
import com.restaurant.entity.enums.ReservationStatus;
import com.restaurant.exception.ReservationConflictException;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;

    @Transactional
    public ReservationResponse createReservation(ReservationRequest request) {
        validateTimeSlot(request);

        // Pessimistic lock check for double booking
        reservationRepository.findConflictingReservation(
                request.getReservationDate(),
                request.getReservationTime(),
                request.getTableNumber()
        ).ifPresent(existing -> {
            throw new ReservationConflictException(AppConstants.RESERVATION_CONFLICT_MSG);
        });

        Reservation reservation = Reservation.builder()
                .customerName(request.getCustomerName())
                .customerPhone(request.getCustomerPhone())
                .reservationDate(request.getReservationDate())
                .reservationTime(request.getReservationTime())
                .partySize(request.getPartySize())
                .tableNumber(request.getTableNumber())
                .specialRequest(request.getSpecialRequest())
                .build();

        Reservation saved = reservationRepository.save(reservation);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponse updateStatus(UUID id, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.RESERVATION_NOT_FOUND_MSG + id));
        reservation.setStatus(status);
        return toResponse(reservationRepository.save(reservation));
    }

    private void validateTimeSlot(ReservationRequest request) {
        int hour = request.getReservationTime().getHour();
        int minute = request.getReservationTime().getMinute();

        if (hour < AppConstants.OPENING_HOUR || hour >= AppConstants.CLOSING_HOUR) {
            throw new IllegalArgumentException(AppConstants.INVALID_TIME_MSG);
        }
        if (minute != 0 && minute != AppConstants.TIME_SLOT_MINUTES) {
            throw new IllegalArgumentException("Rezervasyon saati yalnızca tam veya yarım saatlerde olabilir");
        }
    }

    private ReservationResponse toResponse(Reservation r) {
        return ReservationResponse.builder()
                .id(r.getId())
                .customerName(r.getCustomerName())
                .customerPhone(r.getCustomerPhone())
                .reservationDate(r.getReservationDate())
                .reservationTime(r.getReservationTime())
                .partySize(r.getPartySize())
                .tableNumber(r.getTableNumber())
                .status(r.getStatus())
                .specialRequest(r.getSpecialRequest())
                .createdAt(r.getCreatedAt())
                .build();
    }
}
