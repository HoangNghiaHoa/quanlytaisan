import axios from "axios";

 const API_BASE_URL = "https://quanlytaisan-m2oc.onrender.com/api"
                      // "http://localhost:8081/api"; // Thay bằng URL thực tế của backend

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Request interceptor: Debug log + Token auth ───
// ─── Request interceptor ───
  apiClient.interceptors.request.use(
    (config) => {
      // 1. Kiểm tra xem có phải đang gọi API Login không
      const isLoginRequest = config.url?.includes("/auth/login");

      const token = localStorage.getItem("auth_token");
      
      // 2. Chỉ đính token nếu KHÔNG PHẢI là request login và có token tồn tại
      if (token && !isLoginRequest) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // ─── Response interceptor: Debug log + Error handling ───
  apiClient.interceptors.response.use(
    (response) => {
      console.log(`[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Không thể kết nối đến Server";
      console.error(`[API Error] ${status ?? "NETWORK"} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, message);
      return Promise.reject(new Error(message));
    }
  );

// ═══════════════════════════════════════════
//  ASSET (CCDC) APIs
// ═══════════════════════════════════════════

export interface AssetPayload {
  name: string;
  serialNumber: string; // Đổi từ serial -> serialNumber
  quantity: number;
  unit: string;
  mfgYear: number | null; // Đổi từ yearManufacture -> mfgYear
  usageYear: number | null; // Đổi từ yearUse -> usageYear
  origin: string; // Đổi từ country -> origin
  brand: string;
  modelCode: string; // Đổi từ model -> modelCode
  capacity: string;
  status: string;
  demand: string;
  notes: string; // Đổi từ note -> notes
  departmentName: string;
}
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
export interface AssetResponse extends AssetPayload {
  id: number;
}

/** GET /assets */
export const getAssets = async (page =0 , size=100): Promise<PageResponse<AssetResponse>> => {
  const response = await apiClient.get(`/assets?page=${page}&size=${size}`);
  return response.data;
};

/** POST /assets */
export const addAsset = async (payload: AssetPayload): Promise<AssetResponse> => {
  const { data } = await apiClient.post<AssetResponse>("/assets", payload);
  return data;
};

/** PUT /assets/{id} */
export const updateAsset = async (
  id: number,
  payload: Partial<AssetPayload>
): Promise<AssetResponse> => {
  const { data } = await apiClient.put<AssetResponse>(`/assets/${id}`, payload);
  return data;
};

/** DELETE /assets/{id} */
export const deleteAssetApi = async (id: number): Promise<void> => {
  await apiClient.delete(`/assets/${id}`);
};

// Xóa nhiều cái (Batch)
export const deleteMultipleAssetsApi = async (ids: number[]): Promise<void> => {
  // Lưu ý: Với phương thức DELETE, data phải nằm trong object config
  await apiClient.delete("/assets/batch", { data: ids });
};

/** POST /assets/bulk */
export const bulkAddAssets = async (
  items: AssetPayload[]
): Promise<AssetResponse[]> => {
  const { data } = await apiClient.post<AssetResponse[]>("/assets/bulk", items);
  return data;
};

// ═══════════════════════════════════════════
//  DEPARTMENT APIs
// ═══════════════════════════════════════════

export interface DepartmentPayload {
  id: string;
  name: string;
  shortName: string;
  icon: string;
}

/** GET /departments */
export const getDepartments = async (): Promise<DepartmentPayload[]> => {
  const { data } = await apiClient.get<DepartmentPayload[]>("/departments");
  return data;
};

/** POST /departments */
export const addDepartmentApi = async (
  payload: DepartmentPayload
): Promise<DepartmentPayload> => {
  const { data } = await apiClient.post<DepartmentPayload>("/departments", payload);
  return data;
};

/** PUT /departments/{id} */
export const updateDepartmentApi = async (
  id: string,
  payload: Partial<DepartmentPayload>
): Promise<DepartmentPayload> => {
  const { data } = await apiClient.put<DepartmentPayload>(`/departments/${id}`, payload);
  return data;
};

/** DELETE /departments/{id} */
export const deleteDepartmentApi = async (id: string): Promise<void> => {
  await apiClient.delete(`/departments/${id}`);
};

// ═══════════════════════════════════════════
//  AUTH APIs
// ═══════════════════════════════════════════

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    username: string;
    displayName: string;
    role: string;
    departments: string[];
  };
}

/** POST /auth/login */
export const loginApi = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
};

export default apiClient;
