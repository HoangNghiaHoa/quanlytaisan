package com.quanlytaisan.controller;

import com.quanlytaisan.dto.UserDTO;
import com.quanlytaisan.entity.User;
import com.quanlytaisan.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin("*")
@Tag(name="User Controller", description = "Quản lý user")
public class UserController {
    private final UserService userService;

    @Operation(summary ="Create User")
    @PostMapping
    public ResponseEntity<User> create(@RequestBody UserDTO dto) {
        // Mặc định tạo user mới là role EMPLOYEE nếu FE không gửi lên
        if (dto.getRole() == null) dto.setRole("EMPLOYEE");
        return ResponseEntity.ok(userService.createUser(dto));
    }

    @Operation(summary ="Get all user")
    @GetMapping
    public ResponseEntity<List<User>> getAll() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Operation(summary ="Delete User by name")
    @DeleteMapping("/{username}")
    public ResponseEntity<Void> delete(@PathVariable String username) {
        userService.deleteUser(username);
        return ResponseEntity.ok().build();
    }
}