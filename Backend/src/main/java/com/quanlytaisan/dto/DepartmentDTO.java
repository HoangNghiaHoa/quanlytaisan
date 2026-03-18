package com.quanlytaisan.dto;
import lombok.Data;

@Data
public class DepartmentDTO {

    private Long id;
    private String name;
    private String description;
    private String shortName; // FE sẽ dùng trường này làm "short"
    private String icon;
}
