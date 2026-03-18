package com.quanlytaisan.repository;

import java.util.Optional;

import com.quanlytaisan.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
public interface UserRepository extends JpaRepository<User,Long>{

    Optional<User> findByUsername(String username);
}
