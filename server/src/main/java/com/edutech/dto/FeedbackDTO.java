package com.edutech.dto;

public class FeedbackDTO {
    private String customerName;
    private String comment;
    private int rating;
    private Long menuItemId;
    
    public FeedbackDTO(String customerName, String comment, int rating, Long menuItemId) {
		super();
		this.customerName = customerName;
		this.comment = comment;
		this.rating = rating;
		this.menuItemId = menuItemId;
	}
	// getters and setters
	public String getCustomerName() {
		return customerName;
	}
	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}
	public Long getMenuItemId() {
		return menuItemId;
	}
	public void setMenuItemId(Long menuItemId) {
		this.menuItemId = menuItemId;
	}
    
    
}
