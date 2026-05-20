



package com.edutech;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.edutech.model.Role;
import com.edutech.model.User;
import com.edutech.repository.UserRepository;

@SpringBootApplication
public class RestrurantManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestrurantManagementSystemApplication.class, args);
        System.out.println("Welcome to Restaurant Management Project!");
    }

    @Bean
    public CommandLineRunner createAdmin(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {

            if (userRepository.findByUsername("admin").isEmpty()) {

                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(encoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setSessionId("ADMIN_SESSION");
                userRepository.save(admin);
				admin.setEmail("admin123@gmail.com");
            }
        };
    }
}
