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

    @Autowired
    public AuthController(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest loginRequest){
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow( () -> new ResourceNotFoundException("User not found!"));
        if (!user.getPassword().equals(loginRequest.getPassword())){
            throw new ResourceNotFoundException("Wrong password!");
        }
        String token = jwtUtil.generateToken(user.getUsername(),user.getRole().name());
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
                user.getUsername(),
                user.getRole().name().toLowerCase(), // FE đang chờ "admin" hoặc "user" (chữ thường)
                user.getDepartments().stream().map(d -> d.getId().toString()).toList()
        );
        return new LoginResponse(token, userInfo);
    }
}
