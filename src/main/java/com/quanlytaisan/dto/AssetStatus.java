package com.quanlytaisan.dto;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum AssetStatus {
    USING("Đang sử dụng"),
    BROKEN("Hỏng"),
    IDLE("Nhàn rỗi"),
    LIQUIDATED("Đã thanh lý"),
    REPAIRING("Đang sửa chữa");

    private final String label;

    AssetStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static AssetStatus fromLabel(String label) {
        if (label == null || label.isBlank()) {
            return USING;
        }

        for (AssetStatus status : values()) {
            if (status.label.equalsIgnoreCase(label.trim())) {
                return status;
            }
            if (label.trim().equals("Đang dùng tốt") && status == USING) {
                return USING;
            }
        }
        return USING;
    }

    @Override
    public String toString() {
        return label;
    }
}