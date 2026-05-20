package com.edutech.dto;

import java.time.LocalDateTime;

public class RestaurantManagerAssignmentDTO {
    private Long assignmentId;
    private String restaurantName;
    private String restaurantLocation;
    private String managerUsername;
    private String managerEmail;
    private LocalDateTime assignedAt;
    
    
    
	
	public RestaurantManagerAssignmentDTO(Long assignmentId, String restaurantName, String restaurantLocation,
			String managerUsername, String managerEmail, LocalDateTime assignedAt) {
		super();
		this.assignmentId = assignmentId;
		this.restaurantName = restaurantName;
		this.restaurantLocation = restaurantLocation;
		this.managerUsername = managerUsername;
		this.managerEmail = managerEmail;
		this.assignedAt = assignedAt;
	}
	public Long getAssignmentId() {
		return assignmentId;
	}
	public void setAssignmentId(Long assignmentId) {
		this.assignmentId = assignmentId;
	}
	public String getRestaurantName() {
		return restaurantName;
	}
	public void setRestaurantName(String restaurantName) {
		this.restaurantName = restaurantName;
	}
	public String getRestaurantLocation() {
		return restaurantLocation;
	}
	public void setRestaurantLocation(String restaurantLocation) {
		this.restaurantLocation = restaurantLocation;
	}
	public String getManagerUsername() {
		return managerUsername;
	}
	public void setManagerUsername(String managerUsername) {
		this.managerUsername = managerUsername;
	}
	public String getManagerEmail() {
		return managerEmail;
	}
	public void setManagerEmail(String managerEmail) {
		this.managerEmail = managerEmail;
	}
	public LocalDateTime getAssignedAt() {
		return assignedAt;
	}
	public void setAssignedAt(LocalDateTime assignedAt) {
		this.assignedAt = assignedAt;
	}

    // Constructors, Getters, Setters
    
    
}
