package com.quanlytaisan.service;
 import com.quanlytaisan.dto.AssetDTO;
 import com.quanlytaisan.entity.Asset;
 import com.quanlytaisan.entity.Department;
 import com.quanlytaisan.exception.ResourceNotFoundException;
 import com.quanlytaisan.repository.AssetRepository;
 import com.quanlytaisan.mapper.AssetMapper;
 import com.quanlytaisan.repository.DepartmentRepository;
 import lombok.RequiredArgsConstructor;
 import org.springframework.data.domain.Page;
 import org.springframework.data.domain.Pageable;
 import org.springframework.stereotype.Service;

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
//Add a Asset
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
         //2 Use Mapper to update Data from DTO to Entity,
         // use ToEntity and set ID again  or write important fields yourself
         Asset updateData = assetMapper.toEntity(assetDTO);
         updateData.setId(existingAsset.getId());// Make sure ID not change
         //3 Check department if FE send new department
         if(assetDTO.getDepartmentName() !=null){
             Department dept = departmentRepository.findByName(assetDTO.getDepartmentName())
                     .orElseThrow(() ->new ResourceNotFoundException("Phòng ban không hợp lệ"));
             updateData.setDepartment(dept);
         }
         //4 Save in DB
         Asset savedAsset = assetRepository.save(updateData);
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
    //Delete Asset
     @Override
     public void deleteAsset(Long id) {
         assetRepository.deleteById(id);
     }
}