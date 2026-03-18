package com.quanlytaisan.dto;


import lombok.Data;

import java.util.List;

@Data
public class UserDTO {
    private String username;
    private String password;
    private String displayName;
    private List<Long> departments; // Danh sách ID phòng ban từ checkbox FE
    private String role; // "ADMIN" hoặc "EMPLOYEE"
}