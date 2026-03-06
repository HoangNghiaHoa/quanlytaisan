package com.quanlytaisan.entity;
 import com.quanlytaisan.dto.AssetStatus;
 import lombok.*;
 import jakarta.persistence.*;

 import java.time.LocalDateTime;

@Entity
 @Table(name ="assets")
 @Data
 @NoArgsConstructor
 @AllArgsConstructor

public class Asset {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private  Long id;

     @Column(nullable =false)
     private String name ; // ten cua cong cu
     @Column(name="serial_number")
     private String serialNumber; //Seri Number

     private Integer quantity; // So luong
     private String unit ; //DVT(measure)

     @Column(name = "mfg_year")
     private Integer mfg_year; // year of made
     @Column(name = "usage_year")
     private Integer usage_year; // year of use

     private String origin; // country made
     private String brand;
     private String modelCode;//ma hieu
     private String capacity; // Cong suat/hieu nang

     @Enumerated(EnumType.STRING)
     private AssetStatus status; //trang thai
     @Column(columnDefinition = "TEXT")
     private String demand; // nhu cau
     @Column(columnDefinition = "TEXT")
     private String notes;
     private LocalDateTime createAt;
     private LocalDateTime updateAt;
     @PrePersist
     protected void onCreate(){
         createAt = LocalDateTime.now();
     }
     @PreUpdate
     protected void onUpdate(){
         updateAt = LocalDateTime.now();
     }
     @ManyToOne
     @JoinColumn(name = "department_id")
     private Department department;
}
