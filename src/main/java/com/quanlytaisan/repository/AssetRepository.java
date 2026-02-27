package com.quanlytaisan.repository;

import com.quanlytaisan.entity.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
   @Query(value = "SELECT  a from Asset  a left join  fetch  a.department",
            countQuery = "SELECT  count(a) from Asset a")
   Page<Asset> findAllWithDepartment(Pageable pageable);
   // Tìm kiếm theo tên hoặc serial (không phân biệt hoa thường) kèm phân trang
   @Query("SELECT  a FROM  Asset a where " +
         "LOWER(a.name) LIKE LOWER(CONCAT('%',:keyword,'%')) OR " +
         "LOWER(a.serialNumber) LIKE LOWER(CONCAT('%',:keyword,'%'))")
   Page<Asset> searchAssets(@Param("keyword") String keyword, Pageable pageable);
}
