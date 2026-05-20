package com.edutech.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.edutech.model.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant,Long> {
	 //Write your logic here
}

