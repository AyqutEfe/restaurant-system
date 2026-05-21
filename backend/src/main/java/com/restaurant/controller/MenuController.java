package com.restaurant.controller;

import com.restaurant.dto.response.MenuItemResponse;
import com.restaurant.service.MenuItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuItemService menuItemService;

    @GetMapping
    public ResponseEntity<List<MenuItemResponse>> getActiveMenu() {
        return ResponseEntity.ok(menuItemService.getAvailableMenuItems());
    }
}
