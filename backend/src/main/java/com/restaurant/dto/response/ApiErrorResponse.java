package com.restaurant.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiErrorResponse {

    private int status;
    private String message;
    private LocalDateTime timestamp;
}
