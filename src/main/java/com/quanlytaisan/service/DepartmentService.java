package com.quanlytaisan.service;

import com.quanlytaisan.dto.DepartmentDTO;
import java.util.List;
public interface DepartmentService {
    List<DepartmentDTO> getAllDepartment();
    DepartmentDTO getDepartmentById(Long id);
    DepartmentDTO createDepartment(DepartmentDTO departmentDTO);
    DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO);
    void deleteDepartment(Long id);

}
