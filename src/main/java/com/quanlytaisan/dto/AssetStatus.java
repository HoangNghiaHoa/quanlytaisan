package com.quanlytaisan.dto;

public enum AssetStatus {

    USING("Đang sử dụng"),
    BROKEN("Hỏng"),
    IDLE("Nhàn rỗi"),
    LIQUIDATED("Đã thanh lý");

    private final String label;

    AssetStatus(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static AssetStatus fromLabel(String label) {

        if (label == null || label.isBlank()) {
            return USING;
        }

        for (AssetStatus status : values()) {
            if (status.label.equalsIgnoreCase(label.trim())) {
                return status;
            }
        }

        return USING; // default
    }

    @Override
    public String toString() {
        return label;
    }
}