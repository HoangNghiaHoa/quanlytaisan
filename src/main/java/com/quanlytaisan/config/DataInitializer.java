package com.quanlytaisan.config;

import com.quanlytaisan.dto.AssetStatus;
import com.quanlytaisan.entity.Asset;
import com.quanlytaisan.entity.Department;
import com.quanlytaisan.entity.User;
import com.quanlytaisan.repository.DepartmentRepository;
import com.quanlytaisan.repository.AssetRepository;
import com.quanlytaisan.repository.UserRepository;
import com.quanlytaisan.role.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final DepartmentRepository departmentRepository;
    private final AssetRepository  assetRepository;

    @Bean
    CommandLineRunner initDatabase(){
        return args -> {
            // Check if table Department has no data, input
            if (departmentRepository.count() ==0){
                List<String> department = Arrays.asList(
                        "BGĐ","KTTH","CNTT",
                        "GTGT","KTPM","GPPM",
                        "PMHCM","ANTT","DVTC"
                );
                department.forEach(name ->{
                    Department dept = new Department();
                    dept.setName(name);
                    departmentRepository.save(dept);
                });
                System.out.println(">>> Đã khởi tạo 9 phòng ban thành công vào Database!");
            }
            // Sample of assets for 2 department , just sample
            if(assetRepository.count() ==0){
                Department  gdDepartment = departmentRepository.findAll().stream()
                        .filter(d -> d.getName().contains("BGĐ"))
                        .findFirst().orElse(null);

                Department ktDepartment = departmentRepository.findAll().stream()
                        .filter(d -> d.getName().contains("KTTH"))
                        .findFirst().orElse(null);

                if(gdDepartment !=null){
                    Asset a1 = new Asset();
                    a1.setName("Máy tính PC");
                    a1.setSerialNumber("BG-1032");
                    a1.setQuantity(21);
                    a1.setCapacity("500GB");
                    a1.setStatus(AssetStatus.USING);
                    a1.setBrand("ASUS");
                    a1.setUnit("Cái");
                    a1.setDemand("Thường xuyên");
                    a1.setNotes(" Bảo trì 6 tháng mot lần");
                    a1.setMfg_year(2016);
                    a1.setUsage_year(2020);
                    a1.setOrigin("CHINA");
                    a1.setModelCode("AC M23");
                    a1.setDepartment(gdDepartment);
                    assetRepository.save(a1);
                }
                if(ktDepartment !=null){
                    Asset a2 = new Asset();
                    a2.setName(" Ghe thái công");
                    a2.setSerialNumber("TCH-435XY");
                    a2.setQuantity(15);
                    a2.setCapacity("240 pounds");
                    a2.setStatus(AssetStatus.USING);
                    a2.setBrand("TCH");
                    a2.setUnit("Cái");
                    a2.setDemand("Thường xuyên");
                    a2.setNotes("Vệ sinh thường xuyên");
                    a2.setMfg_year(2020);
                    a2.setUsage_year(2024);
                    a2.setOrigin("VIETNAM");
                    a2.setDepartment(ktDepartment);
                    assetRepository.save(a2);
                }
                System.out.println(">>> Đã khởi tạo các tài sản mẫu thành công!");
            }
        };
    }
    @Bean
    CommandLineRunner init(UserRepository userRepository){

        return args->{
            if(userRepository.findByUsername("admin").isEmpty()){

                User admin =  new User();
                admin.setUsername("admin");
                admin.setPassword("123456");
                admin.setRole(Role.ADMIN);
                userRepository.save(admin);
                System.out.println(">>> Đã tạo user Admin");
            }
            // Check và tạo Employee
            if(userRepository.findByUsername("employee").isEmpty()){
                User employee = new User();
                employee.setUsername("employee");
                employee.setPassword("56789");
                employee.setRole(Role.EMPLOYEE);
                userRepository.save(employee);
                System.out.println(">>> Đã tạo user Employee");
            }
        };
    }

}
