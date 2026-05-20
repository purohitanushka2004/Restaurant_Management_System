package com.edutech.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {

    private Long id;

    private String customerName;

    private String restaurantName;

    private int itemCount;

    private List<String> menuItemNames;

    private Double totalAmount;

    private String status;

    private LocalDateTime orderTime;

    public OrderResponseDTO(
            Long id,
            String customerName,
            String restaurantName,
            int itemCount,
            List<String> menuItemNames,
            Double totalAmount,
            String status,
            LocalDateTime orderTime
    ) {
        this.id = id;
        this.customerName = customerName;
        this.restaurantName = restaurantName;
        this.itemCount = itemCount;
        this.menuItemNames = menuItemNames;
        this.totalAmount = totalAmount;
        this.status = status;
        this.orderTime = orderTime;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public int getItemCount() {
        return itemCount;
    }

    public List<String> getMenuItemNames() {
        return menuItemNames;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getOrderTime() {
        return orderTime;
    }
}