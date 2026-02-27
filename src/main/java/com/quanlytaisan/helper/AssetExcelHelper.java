package com.quanlytaisan.helper;

import com.quanlytaisan.dto.AssetDTO;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
public class AssetExcelHelper {
    public static String[] HEADERS = {
            "ID", "Tên tài sản", "Số Serial", "Số lượng", "Đơn vị",
            "Năm SX", "Năm sử dụng", "Xuất xứ", "Nhãn hiệu", "Mã hiệu",
            "Công suất", "Trạng thái", "Nhu cầu", "Ghi chú", "Phòng ban"
    };
    public static ByteArrayInputStream assetsToExcel(List<AssetDTO> assets) throws IOException{
        try(Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream  out = new ByteArrayOutputStream()){
            Sheet sheet = wb.createSheet("Danh sách tài sản");

            // 1. Tạo Header (Dòng tiêu đề)
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = wb.createCellStyle();
            Font font = wb.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            for( int i=0 ;i < HEADERS.length; i++){
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERS[i]);
                cell.setCellStyle(headerStyle);
            }
            // 2. Đổ dữ liệu từ danh sách vào các Row
            int rowIdx = 1;
            for(AssetDTO asset :assets){
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(asset.getId() !=null ? asset.getId():0);
                row.createCell(1).setCellValue(asset.getName());
                row.createCell(2).setCellValue(asset.getSerialNumber());
                row.createCell(3).setCellValue(asset.getQuantity() !=null ? asset.getQuantity() :0);
                row.createCell(4).setCellValue(asset.getUnit());
                row.createCell(5).setCellValue(asset.getMfgYear()!=null ? asset.getMfgYear() :0);
                row.createCell(6).setCellValue(asset.getUsageYear()!=null ? asset.getUsageYear():0);
                row.createCell(7).setCellValue(asset.getOrigin());
                row.createCell(8).setCellValue(asset.getBrand());
                row.createCell(9).setCellValue(asset.getModelCode());
                row.createCell(10).setCellValue(asset.getCapacity());
                row.createCell(11).setCellValue(asset.getStatus());
                row.createCell(12).setCellValue(asset.getDemand());
                row.createCell(13).setCellValue(asset.getNotes());
                row.createCell(14).setCellValue(asset.getDepartmentName());
            }
            // Tự động căn chỉnh độ rộng cột cho đẹp
            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }
            wb.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
