package com.edutech.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OtpService {

    @Autowired
    private EmailService emailService;

    private Map<String, String> otpStorage = new HashMap<>();

    private Map<String, LocalDateTime> otpExpiry = new HashMap<>();

    public void generateAndSendOtp(String email) {

        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpStorage.put(email, otp);

        otpExpiry.put(email, LocalDateTime.now().plusMinutes(5));

        emailService.sendOtpEmail(email, otp);
    }

    public boolean verifyOtp(String email, String otp) {

        if (!otpStorage.containsKey(email)) {
            return false;
        }

        if (LocalDateTime.now().isAfter(otpExpiry.get(email))) {

            otpStorage.remove(email);
            otpExpiry.remove(email);

            return false;
        }

        boolean isValid = otpStorage.get(email).equals(otp);

        if (isValid) {

            otpStorage.remove(email);
            otpExpiry.remove(email);
        }

        return isValid;
    }
}