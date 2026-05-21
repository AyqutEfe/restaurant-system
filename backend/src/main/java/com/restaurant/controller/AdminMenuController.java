package com.restaurant.controller;

import com.restaurant.dto.request.MenuItemRequest;
import com.restaurant.dto.response.MenuItemResponse;
import com.restaurant.service.MenuItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/admin/menu")
@RequiredArgsConstructor
public class AdminMenuController {

    private final MenuItemService menuItemService;

    @GetMapping
    public ResponseEntity<List<MenuItemResponse>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    @PostMapping
    public ResponseEntity<MenuItemResponse> createMenuItem(@Valid @RequestBody MenuItemRequest request) {
        return new ResponseEntity<>(menuItemService.createMenuItem(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItemResponse> updateMenuItem(
            @PathVariable UUID id,
            @Valid @RequestBody MenuItemRequest request) {
        return ResponseEntity.ok(menuItemService.updateMenuItem(id, request));
    }

    @PutMapping("/{id}/toggle")
    public ResponseEntity<MenuItemResponse> toggleAvailability(@PathVariable UUID id) {
        return ResponseEntity.ok(menuItemService.toggleAvailability(id));
    }
}
