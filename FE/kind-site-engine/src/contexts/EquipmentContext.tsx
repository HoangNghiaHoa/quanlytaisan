import React, { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import {useAuth} from "./AuthContext"
import api, {
  addAsset as addAssetApi,
  updateAsset as updateAssetApi,
  bulkAddAssets,
  getDepartments as getDepartmentsApi,
  addDepartmentApi,
  updateDepartmentApi,
  deleteDepartmentApi,
  type AssetPayload,
  AssetResponse,
} from "@/services/api";
import { 
  getAssets, 
  deleteAssetApi, 
  deleteMultipleAssetsApi 
} from "@/services/api";

export interface Equipment {
  id: number;
  name: string;
  serial: string;
  quantity: number;
  unit: string;
  yearManufacture: number | null;
  yearUse: number | null;
  country: string;
  brand: string;
  model: string;
  capacity: string;
  status: string;
  demand: string;
  note: string;
  departmentId: string;
  departmentName: string;
}

export interface Department {
  id: number
  name: string;
  shortName: string;
  icon: string;
}

// ─── Types ───

interface Filters {
  search: string;
  status: string;
  demand: string;
  year: string;
}

interface SortConfig {
  column: keyof Equipment | null;
  direction: "asc" | "desc";
}

interface EquipmentContextType {
  departments: Department[];
  equipmentData: Equipment[];
  filteredData: Equipment[];
  filters: Filters;
  sortConfig: SortConfig;
  selectedRows: Set<number>;
  currentPage: number;
  rowsPerPage: number;
  isLoading: boolean;
  apiError: string | null;
  setFilters: (filters: Partial<Filters>) => void;
  toggleSort: (column: keyof Equipment) => void;
  setCurrentPage: (page: number) => void;
  toggleSelectRow: (id: number) => void;
  selectAllPage: (select: boolean) => void;
  addEquipment: (data: Omit<Equipment, "id">) => void;
  bulkAddEquipment: (items: Omit<Equipment, "id">[]) => void;
  updateEquipment: (id: number, data: Partial<Equipment>) => void;
  deleteEquipment: (id: number) => void;
  deleteMultiple: (ids: Set<number>) => void;
  getById: (id: number) => Equipment | undefined;
  getPageData: () => Equipment[];
  calculateKPIs: (departmentId?: string) => { total: number; active: number; idle: number; broken: number; need: number };
  getFilteredByDepartment: (departmentId: string) => Equipment[];
  addDepartment: (dept: Department) => void;
  updateDepartment: (id: number, data: Partial<Department>) => void;
  deleteDepartment: (id: number) => void;
  refreshData: () => void;
}

const EquipmentContext = createContext<EquipmentContextType | null>(null);

// ─── Helper: Equipment → API payload ───
// EquipmentContext.tsx - Dòng khoảng 117
const toPayload = (e: Omit<Equipment, "id">): AssetPayload => ({
  name: e.name,
  serialNumber: e.serial,        // Sửa: serial -> serialNumber
  quantity: e.quantity,
  unit: e.unit,
  mfgYear: e.yearManufacture,    // Sửa: yearManufacture -> mfgYear
  usageYear: e.yearUse,          // Sửa: yearUse -> usageYear
  origin: e.country,             // Sửa: country -> origin
  brand: e.brand,
  modelCode: e.model,            // Sửa: model -> modelCode
  capacity: e.capacity,
  status: e.status,              // Đảm bảo status khớp enum (Ví dụ: "USING", "BROKEN")
  demand: e.demand,
  notes: e.note,                 // Sửa: note -> notes
  departmentName: e.departmentName,
});

// Chuyển từ dữ liệu API (Backend) sang dữ liệu Local (UI)
const fromResponse = (r: any, currentDepartments: Department[]): Equipment => {
  // Tìm phòng ban có tên trùng với tên từ API để lấy ID
  const dept = currentDepartments.find(d => 
    d.name.trim().toLowerCase() === (r.departmentName || "").trim().toLowerCase()
  );
  
  return {
    id: r.id,
    name: r.name,
    serial: r.serialNumber,
    quantity: r.quantity,
    unit: r.unit,
    yearManufacture: r.mfgYear,
    yearUse: r.usageYear,
    country: r.origin,
    brand: r.brand,
    model: r.modelCode,
    capacity: r.capacity,
    status: r.status,
    demand: r.demand,
    note: r.notes,
    // Gán ID tìm được, nếu không thấy thì để trống
    departmentId: dept ? String(dept.id) : (r.departmentId ? String(r.departmentId) : ""), 
    departmentName: r.departmentName || "Phòng chưa xác định",
  };
};
export const EquipmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {isLoggedIn} = useAuth(); // Lấy trạng thái từ AuthContext
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [equipmentData, setEquipmentData] = useState<Equipment[]>([]);
  const [filters, setFiltersState] = useState<Filters>({ search: "", status: "", demand: "", year: "" });
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: "asc" });
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const rowsPerPage = 15;
  const hasFetched = useRef(false);

  // ─── Fetch dữ liệu từ API (KHÔNG fallback mock) ───
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
    const [assetsPage, depts] = await Promise.all([getAssets(), getDepartmentsApi()]);
    
    // Ép kiểu depts về Department[] nếu cấu trúc đã khớp
    const formattedDepts = (depts || []).map((d: any) => ({
      id: d.id,
      name: d.name,
      shortName: d.short, // Map từ trường 'short' của BE
      icon: d.icon || "Building"
    })) as Department[];

    setDepartments(formattedDepts);

    const formattedAssets = (assetsPage.content || []).map((asset: any) => 
      fromResponse(asset, formattedDepts)
    );

    setEquipmentData(formattedAssets);
      console.log(`[EquipmentContext] Tải thành công: ${assetsPage.content.length} CCDC, ${depts.length} phòng ban`);
    } catch (err: any) {
      const msg = err.message || "Không thể kết nối đến Server Backend";
      console.error("[EquipmentContext] Lỗi tải dữ liệu:", msg);
      setApiError(msg);
      setEquipmentData([]);
      setDepartments([]);
      toast({
        title: "❌ Lỗi kết nối Backend",
        description: `${msg}. Vui lòng kiểm tra Backend đang chạy tại localhost:8081.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      hasFetched.current = true;
    }
  }, [toast]);

  useEffect(() => {
    if(isLoggedIn){
      fetchData();
    }
  }, [fetchData, isLoggedIn]);

  const refreshData = useCallback(() => {
    hasFetched.current = false;
    fetchData();
  }, [fetchData]);

  // ─── Filter & Sort ───

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
    setCurrentPage(1);
  }, []);

  const applyFiltersAndSort = useCallback(
    (data: Equipment[]) => {
      let result = data.filter((item) => {
        let matches = true;
        if (filters.search) {
          const s = filters.search.toLowerCase();
          matches = matches && (item.name.toLowerCase().includes(s) || item.serial.toLowerCase().includes(s) || (item.brand && item.brand.toLowerCase().includes(s)));
        }
        if (filters.status) matches = matches && item.status === filters.status;
        if (filters.demand) matches = matches && item.demand === filters.demand;
        if (filters.year) {
          if (filters.year === "older") matches = matches && (item.yearUse ?? 0) < 2021;
          else matches = matches && item.yearUse === parseInt(filters.year);
        }
        return matches;
      });

      if (sortConfig.column) {
        result.sort((a, b) => {
          let aVal = a[sortConfig.column!] as any;
          let bVal = b[sortConfig.column!] as any;
          if (typeof aVal === "string") { aVal = aVal.toLowerCase(); bVal = (bVal || "").toLowerCase(); }
          if (sortConfig.direction === "asc") return aVal > bVal ? 1 : -1;
          return aVal < bVal ? 1 : -1;
        });
      }
      return result;
    },
    [filters, sortConfig]
  );

  const filteredData = useMemo(() => applyFiltersAndSort(equipmentData), [equipmentData, applyFiltersAndSort]);

  const toggleSort = useCallback((column: keyof Equipment) => {
    setSortConfig((prev) => ({
      column,
      direction: prev.column === column && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const getPageData = useCallback(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  // ─── Row selection ───

  const toggleSelectRow = useCallback((id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAllPage = useCallback(
    (select: boolean) => {
      const pageData = getPageData();
      setSelectedRows((prev) => {
        const next = new Set(prev);
        pageData.forEach((item) => (select ? next.add(item.id) : next.delete(item.id)));
        return next;
      });
    },
    [getPageData]
  );

  // ─── CRUD: Equipment (luôn gọi API, không fallback) ───

  const addEquipment = useCallback(async (data: Omit<Equipment, "id">) => {
    try {
      const created = await addAssetApi(toPayload(data));
      // TRUYỀN THÊM: departments vào đây
      setEquipmentData((prev) => [...prev, fromResponse(created, departments)]);
      toast({ title: "✅ Thêm CCDC thành công" });
    } catch (err: any) {
      toast({ title: "Lỗi thêm CCDC", description: err.message, variant: "destructive" });
    }
  }, [toast, departments]); // THÊM: departments vào dependency array

  const bulkAddEquipment = useCallback(async (items: Omit<Equipment, "id">[]) => {
    try {
      const created = await bulkAddAssets(items.map(toPayload));
      const formattedList = created.map((asset) => fromResponse(asset, departments));
      setEquipmentData((prev) => [...prev, ...formattedList]);
      toast({ title: `✅ Nhập thành công ${created.length} CCDC` });
    } catch (err: any) {
      toast({ title: "Lỗi nhập hàng loạt", description: err.message, variant: "destructive" });
    }
  }, [toast, departments]);

  const updateEquipment = useCallback(async (id: number, data: Partial<Equipment>) => {
    try {
      const updated = await updateAssetApi(id, data as Partial<AssetPayload>);
      setEquipmentData((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
      toast({ title: "✅ Cập nhật thành công" });
    } catch (err: any) {
      toast({ title: "Lỗi cập nhật", description: err.message, variant: "destructive" });
    }
  }, [toast]);

const deleteEquipment = async (id: number) => {
  try {
    await deleteAssetApi(id); 
    
    // 1. Cập nhật mảng gốc
    setEquipmentData(prev => {
      const newData = prev.filter(item => item.id !== id);
      // Nếu xóa xong mà trang hiện tại không còn phần tử nào, tự lùi 1 trang
      const totalPages = Math.ceil(newData.length / rowsPerPage);
      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      }
      return newData;
    });

    // 2. Quan trọng: Xóa ID khỏi hàng được chọn để tránh lỗi logic Selection
    setSelectedRows(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    toast({ title: "✅ Xóa thành công" });
  } catch (error) {
    console.error(error);
    toast({ title: "❌ Lỗi khi xóa", variant: "destructive" });
  }
};

const deleteMultiple = async (ids: Set<number>) => {
  const idArray = Array.from(ids);
  try {
    // 3. Gọi hàm xóa nhiều
    await deleteMultipleAssetsApi(idArray);
    
    setEquipmentData(prev => prev.filter(item => !ids.has(item.id)));
    setSelectedRows(new Set());
    toast({ title: `Đã xóa ${idArray.length} mục` });
  } catch (error) {
    toast({ title: "Lỗi khi xóa hàng loạt", variant: "destructive" });
  }
};

  const getById = useCallback((id: number) => equipmentData.find((e) => e.id === id), [equipmentData]);

 const calculateKPIs = useCallback(
  (departmentId?: string) => {
    const data = departmentId 
      ? equipmentData.filter((e) => String(e.departmentId) === String(departmentId)) 
      : equipmentData;

    return {
      total: data.length,
      // 1. Đang sử dụng
      active: data.filter(e => e.status === "Đang sử dụng").length, 
      
      // 2. Nhàn rỗi (Sửa "Đang sửa chữa" thành "Nhàn rỗi")
      idle: data.filter(e => e.status === "Nhàn rỗi").length, 
      
      // 3. Hỏng hoặc Không sử dụng (Gộp lại cho thẻ StatCard AlertTriangle)
      broken: data.filter(e => e.status === "Hỏng" || e.status === "Không sử dụng").length, 
      
      // 4. Cần bổ sung (Dựa trên nhu cầu)
      need: data.filter(e => e.demand === "Cần bổ sung").length
    };
  },
  [equipmentData]
);

  const getFilteredByDepartment = useCallback(
    (departmentId: string) => applyFiltersAndSort(equipmentData.filter((e) => String(e.departmentId) === String(departmentId))),
    [equipmentData, applyFiltersAndSort]
  );

  // ─── CRUD: Departments ───

const addDepartment = useCallback(async (dept: Department) => {
  try {
    // 1. Loại bỏ ID khi gửi lên (vì BE tự sinh ID)
    const { id, ...payload } = dept;

    // 2. Gọi API và ép kiểu 'any' để bypass check interface của hàm add
    const response = await addDepartmentApi(payload as any);
    
    // 3. Ép kiểu 'response' về 'Department' để đưa vào State prev
    // Điều này giúp ID từ String của BE tự động được coi như Number ở FE (hoặc ngược lại)
    const newDept = response as unknown as Department;

    setDepartments((prev) => [...prev, newDept]);
    
    toast({ title: "✅ Thêm phòng ban thành công" });
  } catch (err: any) {
    toast({ title: "Lỗi thêm phòng ban", description: err.message, variant: "destructive" });
  }
}, [toast]);

  const updateDepartment = useCallback(async (id: number, data: Partial<Department>) => {
    try {
      await updateDepartmentApi(String(id), data as any);
      setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...data } : d)));
      if (data.name) {
        setEquipmentData((prev) => prev.map((e) => (e.departmentId === String(id) ? { ...e, departmentName: data.name! } : e)));
      }
      toast({ title: "✅ Cập nhật phòng ban thành công" });
    } catch (err: any) {
      toast({ title: "Lỗi cập nhật phòng ban", description: err.message, variant: "destructive" });
    }
  }, [toast]);

  const deleteDepartment = useCallback(async (id: number) => {
    try {
      await deleteDepartmentApi(String(id));
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      setEquipmentData((prev) => prev.filter((e) => e.departmentId !== String(id)));
      toast({ title: "✅ Đã xóa phòng ban" });
    } catch (err: any) {
      toast({ title: "Lỗi xóa phòng ban", description: err.message, variant: "destructive" });
    }
  }, [toast]);

  return (
    <EquipmentContext.Provider
      value={{
        departments, equipmentData, filteredData, filters, sortConfig, selectedRows, currentPage, rowsPerPage,
        isLoading, apiError,
        setFilters, toggleSort, setCurrentPage, toggleSelectRow, selectAllPage,
        addEquipment, bulkAddEquipment, updateEquipment, deleteEquipment, deleteMultiple, getById, getPageData,
        calculateKPIs, getFilteredByDepartment,
        addDepartment, updateDepartment, deleteDepartment, refreshData,
      }}
    >
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const ctx = useContext(EquipmentContext);
  if (!ctx) throw new Error("useEquipment must be used within EquipmentProvider");
  return ctx;
};
