package com.edutech;

import javax.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.edutech.model.Role;
import com.edutech.model.User;
import com.edutech.repository.UserRepository;

@SpringBootApplication
public class RestrurantManagementSystemApplication {

    @Autowired
    private Environment env;

    @PostConstruct
    public void checkMailConfig() {
        System.out.println("=================================");
        System.out.println("MAIL HOST = " + env.getProperty("spring.mail.host"));
        System.out.println("MAIL PORT = " + env.getProperty("spring.mail.port"));
        System.out.println("MAIL USER = " + env.getProperty("spring.mail.username"));
        System.out.println("=================================");
    }

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
                admin.setEmail("purohitanushka2004@gmail.com");

                userRepository.save(admin);
            }
        };
    }
}