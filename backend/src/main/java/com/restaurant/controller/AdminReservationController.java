package com.restaurant.controller;

import com.restaurant.dto.request.StatusUpdateRequest;
import com.restaurant.dto.response.ReservationResponse;
import com.restaurant.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ReservationResponse> updateStatus(
            @PathVariable UUID id,
            @Valid @RequestBody StatusUpdateRequest request) {
        return ResponseEntity.ok(reservationService.updateStatus(id, request.getStatus()));
    }
}
