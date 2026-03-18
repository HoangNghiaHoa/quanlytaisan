package com.quanlytaisan.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private UserInfo user; // Thêm field này để khớp với FE

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private String username;
        private String role;
        private List<String> departments; // FE đang chờ mảng các phòng ban
    }

    public String getToken() {
        return token;
    }
}
