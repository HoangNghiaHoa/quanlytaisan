package com.quanlytaisan.dto;
 import com.fasterxml.jackson.annotation.JsonProperty;
 import io.swagger.v3.oas.annotations.media.Schema;
 import lombok.Data;
 import lombok.NoArgsConstructor;
 import lombok.AllArgsConstructor;
 import jakarta.validation.constraints.*;

 @Data
 @AllArgsConstructor
 @NoArgsConstructor
public class AssetDTO {

     @Schema(accessMode = Schema.AccessMode.READ_ONLY)
     @JsonProperty(access = JsonProperty.Access.READ_ONLY)
     private Long id;

     @NotBlank(message = "Tên tài sản không được để trống")
     private String name;

     @NotBlank(message = "Số Serial là bắt buộc để quản lý")
     private String serialNumber;

     @NotNull(message = "Số lượng không được để trống")
     @Positive(message = "Số lượng phải là số dương")
     private Integer quantity;

     private String unit;
     @Min(value = 1900, message = "Năm sản xuất không hợp lệ")
     @Max(value = 2100, message = "Năm sản xuất không hợp lệ")
     private Integer mfgYear;  // Năm sản xuất
     private Integer usageYear;  // Năm sử dụng
     private String origin;      // Xuất xứ
     private String brand;       // Nhãn hiệu
     private String modelCode;   // Mã hiệu
     private String capacity;    // Công suất
     @NotNull(message = "Vui lòng chọn trạng thái tài sản")
     private AssetStatus status;      // Trạng thái
     private String demand;      // Nhu cầu
     private String notes;       // Ghi chú

     // This field is important : take name department from Object Department to show directly
     private String departmentName;
}
