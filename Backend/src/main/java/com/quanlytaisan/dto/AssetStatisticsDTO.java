package com.quanlytaisan.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AssetStatisticsDTO {

    private Long totalTypes;      // số loại tài sản
    private Long totalQuantity;   // tổng số lượng
    private Long totalUsing;
    private Long totalBroken;
}
