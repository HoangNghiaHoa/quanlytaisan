package com.quanlytaisan.mapper;

import com.quanlytaisan.dto.AssetDTO;
import com.quanlytaisan.entity.Asset;
import com.quanlytaisan.entity.Department;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-03-05T10:59:18+0700",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 17.0.14 (JetBrains s.r.o.)"
)
@Component
public class AssetMapperImpl implements AssetMapper {

    @Override
    public AssetDTO toDTO(Asset asset) {
        if ( asset == null ) {
            return null;
        }

        AssetDTO assetDTO = new AssetDTO();

        assetDTO.setMfgYear( asset.getMfg_year() );
        assetDTO.setUsageYear( asset.getUsage_year() );
        assetDTO.setDepartmentName( assetDepartmentName( asset ) );
        assetDTO.setId( asset.getId() );
        assetDTO.setName( asset.getName() );
        assetDTO.setSerialNumber( asset.getSerialNumber() );
        assetDTO.setQuantity( asset.getQuantity() );
        assetDTO.setUnit( asset.getUnit() );
        assetDTO.setOrigin( asset.getOrigin() );
        assetDTO.setBrand( asset.getBrand() );
        assetDTO.setModelCode( asset.getModelCode() );
        assetDTO.setCapacity( asset.getCapacity() );
        assetDTO.setStatus( asset.getStatus() );
        assetDTO.setDemand( asset.getDemand() );
        assetDTO.setNotes( asset.getNotes() );

        return assetDTO;
    }

    @Override
    public Asset toEntity(AssetDTO assetDTO) {
        if ( assetDTO == null ) {
            return null;
        }

        Asset asset = new Asset();

        asset.setMfg_year( assetDTO.getMfgYear() );
        asset.setUsage_year( assetDTO.getUsageYear() );
        asset.setId( assetDTO.getId() );
        asset.setName( assetDTO.getName() );
        asset.setSerialNumber( assetDTO.getSerialNumber() );
        asset.setQuantity( assetDTO.getQuantity() );
        asset.setUnit( assetDTO.getUnit() );
        asset.setOrigin( assetDTO.getOrigin() );
        asset.setBrand( assetDTO.getBrand() );
        asset.setModelCode( assetDTO.getModelCode() );
        asset.setCapacity( assetDTO.getCapacity() );
        asset.setStatus( assetDTO.getStatus() );
        asset.setDemand( assetDTO.getDemand() );
        asset.setNotes( assetDTO.getNotes() );

        return asset;
    }

    private String assetDepartmentName(Asset asset) {
        if ( asset == null ) {
            return null;
        }
        Department department = asset.getDepartment();
        if ( department == null ) {
            return null;
        }
        String name = department.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
