package com.quanlytaisan.repository;

import com.quanlytaisan.dto.AssetStatisticsDTO;
import com.quanlytaisan.dto.AssetStatus;
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
   // Tối ưu các hàm Filter: Thay vì dùng Query Method mặc định, hãy dùng @Query để JOIN FETCH
   @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.department WHERE a.department.id = :deptId")
   Page<Asset> findByDepartmentId(@Param("deptId") Long departmentId, Pageable pageable);

   @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.department WHERE a.status = :status")
   Page<Asset> findByStatus(@Param("status") AssetStatus status, Pageable pageable);

   @Query("SELECT a FROM Asset a LEFT JOIN FETCH a.department WHERE a.department.id = :deptId AND a.status = :status")
   Page<Asset> findByDepartmentIdAndStatus(@Param("deptId") Long departmentId, @Param("status") AssetStatus status, Pageable pageable);

   @Query("SELECT new com.quanlytaisan.dto.AssetStatisticsDTO(" +
           "COUNT(a), " +
           "SUM(a.quantity), " +
           "SUM(CASE WHEN a.status = 'USING' THEN 1 ELSE 0 END), " +
           "SUM(CASE WHEN a.status = 'BROKEN' THEN 1 ELSE 0 END)) " +
           "FROM Asset a")
   AssetStatisticsDTO getQuickStatistics();

}
