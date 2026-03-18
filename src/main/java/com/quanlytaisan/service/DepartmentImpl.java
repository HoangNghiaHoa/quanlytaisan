package com.quanlytaisan.service;

import com.quanlytaisan.dto.DepartmentDTO;
import com.quanlytaisan.entity.Department;
import com.quanlytaisan.exception.ResourceNotFoundException;
import com.quanlytaisan.repository.DepartmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import lombok.RequiredArgsConstructor;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentImpl  implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    @Override
    public List<DepartmentDTO> getAllDepartment() {
       return departmentRepository.findAll().stream()
               .map(dept ->{
                   DepartmentDTO departDTO = new DepartmentDTO();
                   departDTO.setId(dept.getId());
                   departDTO.setName(dept.getName());
                   return departDTO;
               })
               .collect(Collectors.toList());
    }
// Lay department theo id
    @Override
    public DepartmentDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("Department not found"));
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());

        return dto;
    }
// Tao department
    @Override
    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        Department department  = new Department();
        department.setName(departmentDTO.getName());
        department.setShortName(departmentDTO.getShortName()); // Lưu tên viết tắt
        department.setIcon(departmentDTO.getIcon());           // Lưu tên icon
        department.setDescription(departmentDTO.getDescription());

        Department saved = departmentRepository.save(department);
        departmentDTO.setId(saved.getId());
        return departmentDTO;
    }
//Cap nhat department theo id
    @Override
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO departmentDTO) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow( () ->new ResourceNotFoundException("Department not found!"));
        dept.setName(departmentDTO.getName());
        dept.setShortName(departmentDTO.getShortName()); // Lưu tên viết tắt
        dept.setIcon(departmentDTO.getIcon());           // Lưu tên icon
        dept.setDescription(departmentDTO.getDescription());
        departmentRepository.save(dept);
        departmentDTO.setId(dept.getId());
        return departmentDTO;
    }
// Xoa department theo id
    @Override
    public void deleteDepartment(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found!"));
        departmentRepository.delete(dept);
    }

}
