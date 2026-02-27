package com.quanlytaisan.controller;

import com.quanlytaisan.dto.DepartmentDTO;
import com.quanlytaisan.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/department")
@RequiredArgsConstructor
@CrossOrigin("*")
@Tag(name="Department Controller", description = "Lấy danh sách phòng ban cho Dropdown")
public class DepartmentController {
    private final DepartmentService departmentService;

    @GetMapping
    public List<DepartmentDTO> getAll()
    {
        return departmentService.getAllDepartment();
    }

}
