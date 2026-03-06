package com.quanlytaisan.controller;

import com.quanlytaisan.dto.AssetDTO;
import com.quanlytaisan.dto.AssetStatisticsDTO;
import com.quanlytaisan.dto.AssetStatus;
import com.quanlytaisan.helper.AssetExcelHelper;
import com.quanlytaisan.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/asset")
@CrossOrigin("*")
@Tag(name = "Asset Controller", description = "Quản lý danh sách công cụ dụng cụ")
public class AssetController {
    private final AssetService assetService;
//Create Asset
    @Operation(summary = "Thêm mới một tài sản", description = "Dữ liệu gửi lên dạng JSON không bao gồm ID")
    @PostMapping
    public ResponseEntity<AssetDTO> createAsset(@Valid @RequestBody AssetDTO assetDTO){
        AssetDTO asset = assetService.createAsset(assetDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(asset);
    }
//Get AllAsset
    @Operation(summary = "Lấy danh sách tài sản (Có phân trang & sắp xếp)")
    @GetMapping
    public Page<AssetDTO> getAllAsset(
            @PageableDefault(size = 10, sort = "id", direction = Sort.Direction.DESC)
            @org.springdoc.core.annotations.ParameterObject Pageable pageable ){
        return assetService.getAllAsset(pageable);
    }
//Filter theo department + status
    @Operation(summary ="Loc theo phong ban va trang thai")
    @GetMapping("/filter")
    public ResponseEntity<Page<AssetDTO>> filterAsset(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false)AssetStatus status,
            @PageableDefault(size=10) Pageable pageable){

        return ResponseEntity.ok(assetService.filterAssets(departmentId,status,pageable));
    }
//Thong ket (getStatistics)
    @Operation(summary = "Thong ke cua asset")
    @GetMapping("/statistics")
    public ResponseEntity<AssetStatisticsDTO> getStatistics(){
        return ResponseEntity.ok(assetService.getStatistics());
    }
//Search asset + paging
    @Operation(summary = "Tìm kiếm tài sản", description = "Tìm kiếm theo tên hoặc số serial, có phân trang")
    @GetMapping("/search")
    public Page<AssetDTO> search( @RequestParam String keyword,
                                  @org.springdoc.core.annotations.ParameterObject Pageable pageable){
            return assetService.searchAssets(keyword,pageable);
    }
//Update Asset by ID
    @Operation(summary = "Cập nhật tài sản", description = "Truyền ID trên đường dẫn và dữ liệu mới trong Body")
    @PutMapping("{id}")
    public ResponseEntity<AssetDTO> updateAsset(@PathVariable Long id, @RequestBody AssetDTO assetDTO){
        return ResponseEntity.ok(assetService.updateAsset(id,assetDTO));
    }
//Delete Asset by Id
    @Operation(summary = "Xóa tài sản theo ID")
    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id){
        assetService.deleteAsset(id);
        return ResponseEntity.noContent().build();
    }
//Import excel
    @Operation(summary = "Import file excel",description = "Upload file Excel dạng multipart/form-data, không bao gồm ID")

    @PostMapping(value = "/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE )
    public ResponseEntity<String> importExcel(@RequestParam("file") MultipartFile file){
        assetService.importFromExcel(file);
        return ResponseEntity.ok("Import thành công");
}
//Export Excel
    @Operation(summary = "Xuất danh sách tài sản ra file Excel")
    @GetMapping("/export/excel")
    public ResponseEntity<InputStreamResource> exportExcel() throws Exception{
        List<AssetDTO>  assets = assetService.getAllAssetList();
        ByteArrayInputStream  in= AssetExcelHelper.assetsToExcel(assets);

        String filename= "danh_sach_tai_san.xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,"attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}