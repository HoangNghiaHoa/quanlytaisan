package com.quanlytaisan.mapper;

import com.quanlytaisan.entity.Asset;
import com.quanlytaisan.dto.AssetDTO;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AssetMapper {
    // Vì trong Entity   đặt là mfg_year (có gạch dưới)
    // còn DTO là mfgYear (viết đà) nên phải chỉ định rõ cho MapStruct
    // 1. Chuyển từ Entity sang DTO (để hiển thị lên FE)
    @Mapping(source ="mfg_year", target="mfgYear")
    @Mapping(source = "usage_year", target = "usageYear")
    @Mapping(source = "department.name", target = "departmentName")
    AssetDTO toDTO(Asset asset);

    // 2. Chuyển từ DTO sang Entity (để tạo mới)
    @Mapping(source="mfgYear", target = "mfg_year")
    @Mapping(source = "usageYear", target = "usage_year")
    @Mapping(target = "id", ignore = true) // Luôn ignore ID khi tạo mới để tránh lỗi DB
    @Mapping(target = "department", ignore = true) // Để Service tự xử lý logic gán phòng ban
    Asset toEntity(AssetDTO assetDTO);

    // 3. Cập nhật Entity đã có sẵn từ DTO (Dùng cho hàm Update)
    @Mapping(source="mfgYear", target = "mfg_year")
    @Mapping(source = "usageYear", target = "usage_year")
    @Mapping(target = "id", ignore = true) // Không cho phép đè ID gốc
    @Mapping(target = "department", ignore = true) // Để Service tự handle gán lại nếu đổi phòng
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(AssetDTO assetDTO, @MappingTarget Asset asset);

}