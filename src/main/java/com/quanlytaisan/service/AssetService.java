package com.quanlytaisan.service;

import com.quanlytaisan.dto.AssetDTO;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
public interface AssetService {
    Page<AssetDTO> getAllAsset(Pageable pageable);
    AssetDTO createAsset(AssetDTO assetDTO);
    void deleteAsset(Long id);
    AssetDTO updateAsset(Long id, AssetDTO assetDTO);
    Page<AssetDTO> searchAssets(String keyword, Pageable pageable);
    List<AssetDTO> getAllAssetList();
}