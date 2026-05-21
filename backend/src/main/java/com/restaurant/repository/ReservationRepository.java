package com.restaurant.repository;

import com.restaurant.entity.Reservation;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT r FROM Reservation r WHERE r.reservationDate = :date AND r.reservationTime = :time AND r.tableNumber = :tableNumber AND r.status <> 'CANCELLED'")
    Optional<Reservation> findConflictingReservation(
            @Param("date") LocalDate date,
            @Param("time") LocalTime time,
            @Param("tableNumber") int tableNumber
    );

    List<Reservation> findAllByOrderByCreatedAtDesc();
}
