package com.quanlytaisan.service;

import com.quanlytaisan.dto.DepartmentDTO;
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
}
