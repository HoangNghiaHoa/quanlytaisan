package com.quanlytaisan.mapper;

import com.quanlytaisan.entity.Asset;
import com.quanlytaisan.dto.AssetDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AssetMapper {
    // Vì trong Entity   đặt là mfg_year (có gạch dưới)
    // còn DTO là mfgYear (viết đà) nên phải chỉ định rõ cho MapStruct
    @Mapping(source ="mfg_year", target="mfgYear")
    @Mapping(source = "usage_year", target = "usageYear")

    // Take name Department
    @Mapping(source = "department.name",target = "departmentName")
    AssetDTO toDTO(Asset asset);
    //Opposite data from FE to BE
    @Mapping(source="mfgYear",target = "mfg_year")
    @Mapping(source = "usageYear",target = "usage_year")
    Asset toEntity(AssetDTO assetDTO);

}