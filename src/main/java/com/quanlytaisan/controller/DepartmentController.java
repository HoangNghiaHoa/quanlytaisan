package com.quanlytaisan.controller;

import com.quanlytaisan.dto.DepartmentDTO;
import com.quanlytaisan.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/departments")
@RequiredArgsConstructor
@CrossOrigin("*")
@Tag(name="Department Controller", description = "Quản lý phòng ban")
public class DepartmentController {
    private final DepartmentService departmentService;
//Lay Department de lam dropdown cho asset
    @Operation(summary ="Lay danh sach Phong ban de dropdown")
    @GetMapping
    public List<DepartmentDTO> getAll()
    {
        return departmentService.getAllDepartment();
    }
// Lay department theo id
    @Operation(summary ="Lay phong ban theo id")
    @GetMapping("/{id}")
    public DepartmentDTO getById(@PathVariable Long id){
        return departmentService.getDepartmentById(id);
    }
// Tao department
    @Operation(summary ="Tao phong ban moi")
    @PostMapping
    public DepartmentDTO create(@RequestBody DepartmentDTO departmentDTO){
        return departmentService.createDepartment(departmentDTO);
    }
//Cap nhat theo
    @Operation(summary ="Cap nhat theo id")
    @PutMapping("/{id}")
    public DepartmentDTO update(@PathVariable Long id, @RequestBody DepartmentDTO dto){
        return departmentService.updateDepartment(id, dto);
    }
//Xoa theo
    @Operation(summary ="Xoa phong ban theo id")
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        departmentService.deleteDepartment(id);
    }
}