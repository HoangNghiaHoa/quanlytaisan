package com.quanlytaisan.service;

import com.quanlytaisan.dto.UserDTO;
import com.quanlytaisan.entity.Department;
import com.quanlytaisan.entity.User;
import com.quanlytaisan.role.Role;
import com.quanlytaisan.repository.DepartmentRepository;
import com.quanlytaisan.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements  UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional
    public User createUser(UserDTO dto) {
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword()); // Tạm thời plain text
        user.setDisplayName(dto.getDisplayName());
        user.setRole(Role.valueOf(dto.getRole().toUpperCase()));

        // Map từ List ID sang Set Entity Department
        if (dto.getDepartments() != null && !dto.getDepartments().isEmpty()) {
            List<Department> depts = departmentRepository.findAllById(dto.getDepartments());
            user.setDepartments(new HashSet<>(depts));
        }

        return userRepository.save(user);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void deleteUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
        userRepository.delete(user);
    }
}
