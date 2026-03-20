package com.quanlytaisan.controller;

import com.quanlytaisan.dto.LoginRequest;
import com.quanlytaisan.dto.LoginResponse;
import com.quanlytaisan.entity.User;
import com.quanlytaisan.exception.ResourceNotFoundException;
import com.quanlytaisan.repository.UserRepository;
import com.quanlytaisan.security.JwtUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
@Tag(name = "Auth Controller", description = " Đăng nhập và phân quyền ")
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder; // Thêm cái này

    @Autowired
    public AuthController(UserRepository userRepository, JwtUtil jwtUtil, org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder; // Inject vào đây
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest){
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow( () -> new ResourceNotFoundException("User not found!"));

        String inputPass = loginRequest.getPassword();
        String dbPass = user.getPassword();

        // Kiểm tra 2 trường hợp:
        // 1. Khớp mã hóa BCrypt
        // 2. Hoặc khớp chuỗi thô (để dự phòng nếu DB chưa update kịp)
        boolean isMatch = passwordEncoder.matches(inputPass, dbPass) || inputPass.equals(dbPass);

        if (!isMatch){
            throw new ResourceNotFoundException("Wrong password!");
        }

        String token = jwtUtil.generateToken(user.getUsername(),user.getRole().name());
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getUsername(),
                user.getRole().name().toLowerCase(),
                user.getDepartments().stream().map(d -> d.getId().toString()).toList()
        );
        return new LoginResponse(token, userInfo);
    }
}