package com.quanlytaisan.service;
 import com.quanlytaisan.dto.AssetDTO;
 import com.quanlytaisan.dto.AssetStatisticsDTO;
 import com.quanlytaisan.dto.AssetStatus;
 import com.quanlytaisan.entity.Asset;
 import com.quanlytaisan.entity.Department;
 import com.quanlytaisan.exception.ResourceNotFoundException;
 import com.quanlytaisan.helper.AssetExcelHelper;
 import com.quanlytaisan.repository.AssetRepository;
 import com.quanlytaisan.mapper.AssetMapper;
 import com.quanlytaisan.repository.DepartmentRepository;
 import lombok.RequiredArgsConstructor;
 import org.springframework.data.domain.Page;
 import org.springframework.data.domain.Pageable;
 import org.springframework.stereotype.Service;
 import org.springframework.transaction.annotation.Transactional;
 import org.springframework.web.multipart.MultipartFile;

 import java.io.IOException;
 import java.util.List;
 import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements  AssetService {

     private final AssetRepository assetRepository;
     private final AssetMapper assetMapper;
     private final DepartmentRepository departmentRepository;

//Show all Asset
     @Override
     public Page<AssetDTO> getAllAsset(Pageable pageable) {
         return assetRepository.findAllWithDepartment(pageable)
                 .map(assetMapper::toDTO);
     }
//Add an Asset
     @Override
     public AssetDTO createAsset(AssetDTO assetDTO) {
         //1.Move DTO from fe put into Entity to save in DB
         Asset asset = assetMapper.toEntity(assetDTO);
         //2. Handle Department
         if(assetDTO.getDepartmentName() !=null){
             Department dept = departmentRepository.findByName(assetDTO.getDepartmentName())
                     .orElseThrow(()-> new ResourceNotFoundException("Khong tim thay phong ban:" + assetDTO.getDepartmentName()));

             // Gán đối tượng phòng ban thật vào Asset
             asset.setDepartment(dept);
         }
         // 3. Lưu vào database
         Asset savedAsset = assetRepository.save(asset);

         // 4. Trả về DTO
         return assetMapper.toDTO(savedAsset);
     }
//Update Asset
     @Override
     public AssetDTO updateAsset(Long id, AssetDTO assetDTO) {
         //1. Check Asset is existing
         Asset existingAsset = assetRepository.findById(id)
                 .orElseThrow(() ->new ResourceNotFoundException("Not found Asset with ID:" + id));
         // 2. Map new data into old asset(ignore filed null)
         assetMapper.updateEntityFromDTO(assetDTO, existingAsset);
         //3 Check department if FE send new department
         if(assetDTO.getDepartmentName() !=null){
             Department dept = departmentRepository.findByName(assetDTO.getDepartmentName())
                     .orElseThrow(() ->new ResourceNotFoundException("Phòng ban không hợp lệ"));
             existingAsset.setDepartment(dept);
         }
         //4 Save in DB
         Asset savedAsset = assetRepository.save(existingAsset);
        return assetMapper.toDTO(savedAsset);
     }
//Search Assets + paging
     @Override
     public Page<AssetDTO> searchAssets(String keyword, Pageable pageable) {
         return assetRepository.searchAssets(keyword, pageable)
                 .map(assetMapper::toDTO);
     }
// get AllAssetList for excel
    @Override
    public List<AssetDTO> getAllAssetList() {
        return assetRepository.findAll().stream()
                .map(assetMapper::toDTO)
                .collect(Collectors.toList());
    }
// Tim kiem theo phong ban va trang thai
    @Override
    public Page<AssetDTO> filterAssets(Long departmentId, AssetStatus status, Pageable pageable) {
         Page<Asset> page;
         if(departmentId !=null && status != null){
             page = assetRepository.findByDepartmentIdAndStatus(departmentId,status,pageable);
         } else if (departmentId != null) {
             page =assetRepository.findByDepartmentId(departmentId,pageable);
         }else if(status != null){
             page = assetRepository.findByStatus(status,pageable);
         }else{
             page= assetRepository.findAllWithDepartment(pageable);
         }

        return page.map(assetMapper::toDTO);
    }
// Thong ke cua  Asset
    @Override
    public AssetStatisticsDTO getStatistics(){
        return assetRepository.getQuickStatistics();
    }
// Import Excel
    @Transactional
    @Override
    public void importFromExcel(MultipartFile file) {
        try {
            List<AssetDTO> dtos = AssetExcelHelper.excelToAssets(file.getInputStream());
            for (AssetDTO dto : dtos){
                String deptName = dto.getDepartmentName() != null ? dto.getDepartmentName().trim() : "Chưa phân loại";

                Department dpart = departmentRepository.findByName(deptName)
                        .orElseGet(() -> {
                            // Chỉ tạo mới nếu thực sự cần, hoặc có thể throw lỗi để người dùng sửa file Excel
                            Department newDept = new Department();
                            newDept.setName(deptName);
                            return departmentRepository.save(newDept);
                        });

                Asset asset = assetMapper.toEntity(dto);
                asset.setDepartment(dpart);
                asset.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 1);
                assetRepository.save(asset);
            }
        }catch(Exception e){
            throw new RuntimeException("Lỗi khi import Excel", e);
        }
    }
//Delete Asset
     @Override
     public void deleteAsset(Long id) {
         assetRepository.deleteById(id);
     }
// Delete many assets
    @Override
    @Transactional
    public void deleteMultipleAssets(List<Long> ids) {
        assetRepository.deleteAllByIdInBatch(ids);
    }
}