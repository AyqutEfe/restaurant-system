package com.restaurant.service;

import com.restaurant.constants.AppConstants;
import com.restaurant.dto.request.MenuItemRequest;
import com.restaurant.dto.response.MenuItemResponse;
import com.restaurant.entity.MenuItem;
import com.restaurant.exception.ResourceNotFoundException;
import com.restaurant.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MenuItemService {

    private final MenuItemRepository menuItemRepository;

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAvailableMenuItems() {
        return menuItemRepository.findByIsAvailableTrueOrderByCategoryAscNameAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MenuItemResponse> getAllMenuItems() {
        return menuItemRepository.findAllByOrderByCategoryAscNameAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public MenuItemResponse createMenuItem(MenuItemRequest request) {
        MenuItem item = MenuItem.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .imageUrl(request.getImageUrl())
                .build();
        return toResponse(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemResponse updateMenuItem(UUID id, MenuItemRequest request) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.MENU_ITEM_NOT_FOUND_MSG + id));
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCategory(request.getCategory());
        item.setImageUrl(request.getImageUrl());
        return toResponse(menuItemRepository.save(item));
    }

    @Transactional
    public MenuItemResponse toggleAvailability(UUID id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(AppConstants.MENU_ITEM_NOT_FOUND_MSG + id));
        item.setIsAvailable(!item.getIsAvailable());
        return toResponse(menuItemRepository.save(item));
    }

    private MenuItemResponse toResponse(MenuItem item) {
        return MenuItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .category(item.getCategory())
                .imageUrl(item.getImageUrl())
                .isAvailable(item.getIsAvailable())
                .build();
    }
}
