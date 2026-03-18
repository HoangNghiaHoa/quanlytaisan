package com.quanlytaisan.service;

import com.quanlytaisan.dto.UserDTO;
import com.quanlytaisan.entity.User;
import java.util.List;

public interface  UserService {
    User createUser(UserDTO dto);
    List<User> getAllUsers();
    void deleteUser(String username);

}