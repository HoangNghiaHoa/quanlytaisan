package com.quanlytaisan.service;

import com.quanlytaisan.dto.AssetDTO;
import java.util.List;

import com.quanlytaisan.dto.AssetStatisticsDTO;
import com.quanlytaisan.dto.AssetStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface AssetService {
    Page<AssetDTO> getAllAsset(Pageable pageable);
    AssetDTO createAsset(AssetDTO assetDTO);
    void deleteAsset(Long id);
    AssetDTO updateAsset(Long id, AssetDTO assetDTO);
    Page<AssetDTO> searchAssets(String keyword, Pageable pageable);
    List<AssetDTO> getAllAssetList();
    Page<AssetDTO> filterAssets(Long departmentId, AssetStatus status, Pageable pageable);
    AssetStatisticsDTO getStatistics();
    void importFromExcel (MultipartFile file);
}