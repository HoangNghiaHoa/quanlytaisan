package com.quanlytaisan.helper;

import com.quanlytaisan.dto.AssetDTO;
import com.quanlytaisan.dto.AssetStatus;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
public class AssetExcelHelper {
    public static String[] HEADERS = {
            "ID", "Tên tài sản", "Số Serial", "Số lượng", "Đơn vị",
            "Năm SX", "Năm sử dụng", "Xuất xứ", "Nhãn hiệu", "Mã hiệu",
            "Công suất", "Trạng thái", "Nhu cầu", "Ghi chú", "Phòng ban"
    };
    // import excel
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
                row.createCell(11).setCellValue(asset.getStatus() != null ? asset.getStatus().getLabel() : "");
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
    // export excel
    public static List<AssetDTO> excelToAssets(InputStream is){

        try(Workbook wb =  new XSSFWorkbook(is)){

            List<AssetDTO> assets = new ArrayList<>();

            // Lặp qua tất cả sheet (mỗi sheet = 1 phòng ban)
            for(int s=0 ; s < wb.getNumberOfSheets(); s++){

                Sheet sheet = wb.getSheetAt(s);

                String departmentName = sheet.getSheetName();
                //Dữ liệu bắt đầu từ dòng 10 (index = 9)
                for(int rowIndex = 9; rowIndex <= sheet.getLastRowNum(); rowIndex++){

                    Row row = sheet.getRow(rowIndex);
                    if(row == null) continue;

                    String name = getStringCellValue(row.getCell(1));

                    if(name == null || name.trim().isEmpty()){
                        continue;
                    }

                    AssetDTO dto = new AssetDTO();
                    dto.setName(name);

                    String serial = getStringCellValue(row.getCell(2));
                    if(serial == null || serial.isEmpty()){
                        serial = "AUTO-" + System.currentTimeMillis();
                    }
                    dto.setSerialNumber(serial);

                    Integer quantity = getIntegerCellValue(row.getCell(3));
                    dto.setQuantity(quantity != null ? quantity : 1);

                    dto.setUnit(getStringCellValue(row.getCell(4)));
                    dto.setMfgYear(getIntegerCellValue(row.getCell(5)));
                    dto.setUsageYear(getIntegerCellValue(row.getCell(6)));
                    dto.setOrigin(getStringCellValue(row.getCell(7)));
                    dto.setBrand(getStringCellValue(row.getCell(8)));
                    dto.setModelCode(getStringCellValue(row.getCell(9)));
                    dto.setCapacity(getStringCellValue(row.getCell(10)));

                    String status = getStringCellValue(row.getCell(11));
                    try {
                        dto.setStatus(AssetStatus.fromLabel(status));
                    } catch (Exception e) {
                        dto.setStatus(AssetStatus.IDLE); // Mặc định là Rảnh nếu không nhận diện được
                    }
                    dto.setDemand(getStringCellValue(row.getCell(12)));
                    dto.setNotes(getStringCellValue(row.getCell(13)));

                    dto.setDepartmentName(departmentName);

                    assets.add(dto);
                }
            }
         return assets;
        }catch(IOException e){
            throw new RuntimeException("Lỗi khi đọc file Excel: " + e.getMessage());
        }
    }
    private static String getStringCellValue(Cell cell) {

        if (cell == null) return null;

        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue().trim();
        }

        if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf((int) cell.getNumericCellValue());
        }

        return null;
    }
    private static Integer getIntegerCellValue(Cell cell){

        if(cell == null) return null;

        try{

            if(cell.getCellType() == CellType.NUMERIC){
                return (int) cell.getNumericCellValue();
            }

            if(cell.getCellType() == CellType.STRING){
                String value = cell.getStringCellValue();

                if(value == null || value.trim().isEmpty()){
                    return null;
                }

                return Integer.parseInt(value.trim());
            }

        }catch(Exception e){
            // Nếu dữ liệu không phải số thì bỏ qua
            return null;
        }

        return null;
    }

}