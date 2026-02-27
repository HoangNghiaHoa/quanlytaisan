package com.quanlytaisan.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // Name of department

    @Column(name="description")
    private String description;

    // Relationship 1-N, one depart has many assets
    @OneToMany(mappedBy ="department" ,cascade = CascadeType.ALL)
    private List<Asset> assets;

}
