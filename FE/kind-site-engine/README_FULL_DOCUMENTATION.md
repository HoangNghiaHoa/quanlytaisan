# 📘 TÀI LIỆU BÀN GIAO CUỐI CÙNG CHO ĐỘI NGŨ BACKEND

> **Dự án:** Hệ thống Quản lý Công cụ Dụng cụ (CCDC)  
> **Phiên bản:** 2.0 — Production-Ready (đã loại bỏ 100% Mock Data)  
> **Ngày cập nhật:** 11/03/2026

---

## 📑 Mục lục

| #   | Phần                                                         |
| --- | ------------------------------------------------------------ |
| 1   | [Hướng dẫn cài đặt (Setup)](#phần-1--hướng-dẫn-cài-đặt-setup) |
| 2   | [Cấu trúc dự án (Project Structure)](#phần-2--cấu-trúc-dự-án-project-structure) |
| 3   | [Hợp đồng API (API Contract)](#phần-3--hợp-đồng-api-api-contract) |
| 4   | [Cấu hình kết nối (Connection)](#phần-4--cấu-hình-kết-nối-connection) |
| 5   | [Quy tắc vận hành (Logic)](#phần-5--quy-tắc-vận-hành-logic) |

---

---

# PHẦN 1 — Hướng dẫn cài đặt (Setup)

---

## 1.1 Yêu cầu môi trường

| Phần mềm    | Phiên bản tối thiểu | Ghi chú                                |
| ------------ | -------------------- | -------------------------------------- |
| **Node.js**  | >= 18.x              | Khuyến nghị dùng [nvm](https://github.com/nvm-sh/nvm) để quản lý |
| **npm**      | >= 9.x               | Đi kèm Node.js                        |
| **Git**      | >= 2.x               | Để clone repository                    |

> 💡 **Tip:** Kiểm tra nhanh bằng lệnh `node -v && npm -v`

## 1.2 Các bước cài đặt & chạy

```bash
# Bước 1: Clone repository
git clone <GIT_URL>
cd <PROJECT_FOLDER>

# Bước 2: Cài đặt dependencies
npm install

# Bước 3: Khởi chạy Front-end dev server
npm run dev
```

> ✅ Front-end sẽ chạy tại **http://localhost:5173**  
> ✅ Front-end gọi API tại **http://localhost:8081/api**

## 1.3 Các lệnh khác

| Lệnh              | Chức năng                        |
| ------------------ | -------------------------------- |
| `npm run dev`      | Chạy dev server (hot-reload)     |
| `npm run build`    | Build production                 |
| `npm run preview`  | Preview bản build (port 4173)    |

## 1.4 Công nghệ sử dụng

| Công nghệ          | Phiên bản | Vai trò                          |
| ------------------- | --------- | -------------------------------- |
| **React**           | 18.x      | Thư viện xây dựng giao diện     |
| **TypeScript**      | 5.x       | Ngôn ngữ chính (type-safe)      |
| **Vite**            | 5.x       | Build tool & dev server          |
| **Tailwind CSS**    | 3.x       | Framework CSS utility-first      |
| **Axios**           | 1.x       | HTTP client gọi API             |
| **React Router**    | 6.x       | Điều hướng SPA                   |
| **Recharts**        | 2.x       | Biểu đồ thống kê                |
| **xlsx**            | 0.18      | Import/Export Excel              |
| **jspdf-autotable** | 5.x       | Xuất báo cáo PDF                |
| **shadcn/ui**       | —         | Component library (Radix-based)  |

---

---

# PHẦN 2 — Cấu trúc dự án (Project Structure)

---

## 2.1 Sơ đồ cây thư mục

```
src/
├── assets/                  # Hình ảnh, tài nguyên tĩnh
│
├── components/              # Các component UI tái sử dụng
│   ├── ui/                  # Component cơ sở (Button, Input, Dialog, Table...)
│   ├── ApiStatusGuard.tsx   # ⭐ Guard hiển thị Loading/Error khi gọi API
│   ├── AppSidebar.tsx       # Thanh điều hướng bên trái
│   ├── EquipmentPanel.tsx   # Panel chi tiết thiết bị
│   ├── EquipmentTable.tsx   # Bảng danh sách thiết bị (CRUD)
│   ├── ImportExcelModal.tsx # Modal nhập dữ liệu từ Excel
│   ├── StatCard.tsx         # Thẻ hiển thị chỉ số KPI
│   ├── DepartmentChart.tsx  # Biểu đồ cột phân bổ theo phòng ban
│   ├── StatusDonut.tsx      # Biểu đồ tròn trạng thái
│   ├── RecentActivity.tsx   # Hoạt động gần đây
│   ├── ProtectedRoute.tsx   # Bảo vệ route theo quyền
│   └── NavLink.tsx          # Link điều hướng
│
├── contexts/                # Quản lý state toàn cục (React Context)
│   ├── AuthContext.tsx      # ⭐ Xác thực & phân quyền (gọi API /auth/login)
│   └── EquipmentContext.tsx # ⭐ Dữ liệu CCDC & phòng ban (100% từ API)
│
├── hooks/                   # Custom React Hooks
│   ├── use-mobile.tsx       # Phát hiện thiết bị mobile
│   └── use-toast.ts         # Quản lý thông báo toast
│
├── lib/                     # Hàm tiện ích thuần
│   ├── utils.ts             # Utility chung (cn, classNames...)
│   └── exportUtils.ts       # Xuất dữ liệu sang Excel/PDF
│
├── pages/                   # Các trang chính
│   ├── Login.tsx            # Trang đăng nhập (gọi API thật)
│   ├── Index.tsx            # Dashboard tổng quan
│   ├── EquipmentList.tsx    # Danh sách CCDC (CRUD đầy đủ)
│   ├── DepartmentPage.tsx   # Chi tiết phòng ban
│   ├── DepartmentManagement.tsx # Quản lý phòng ban (Admin)
│   ├── UserManagement.tsx   # Quản lý tài khoản (Admin)
│   ├── AnalyticsPage.tsx    # Báo cáo & thống kê
│   ├── ForbiddenPage.tsx    # Trang 403 - Không có quyền
│   └── NotFound.tsx         # Trang 404
│
├── services/                # Lớp giao tiếp API
│   └── api.ts               # ⭐ Cấu hình Axios & tất cả endpoints
│
├── App.tsx                  # Component gốc, cấu hình routing
├── main.tsx                 # Entry point
└── index.css                # Cấu hình Tailwind & design tokens
```

## 2.2 Giải thích ý nghĩa từng thư mục

| Thư mục        | Ý nghĩa                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------- |
| `components/`  | Chứa các component UI tái sử dụng. `ui/` là component cơ sở từ shadcn/ui.                  |
| `contexts/`    | **Trung tâm logic nghiệp vụ.** Quản lý state toàn cục bằng React Context API.              |
| `hooks/`       | Custom hooks trích xuất logic tái sử dụng (responsive, toast...).                            |
| `pages/`       | Mỗi file tương ứng với một route/trang trong ứng dụng.                                      |
| `services/`    | **Lớp giao tiếp duy nhất với Backend.** Mọi HTTP request đều đi qua đây.                    |
| `lib/`         | Các hàm tiện ích thuần (không phụ thuộc React).                                              |

## 2.3 Chi tiết các file quan trọng

### `src/services/api.ts` — Lớp giao tiếp API

> **File quan trọng nhất đối với Backend.**

- Khởi tạo Axios instance với `baseURL = http://localhost:8081/api`
- Request interceptor: tự động gắn `Bearer` token từ `localStorage`
- Response interceptor: log debug + bắt lỗi
- Định nghĩa tất cả các hàm gọi API (xem [Phần 3](#phần-3--hợp-đồng-api-api-contract))

### `src/contexts/EquipmentContext.tsx` — Bộ não quản lý dữ liệu

> **Trung tâm điều khiển** — quản lý toàn bộ state CCDC và phòng ban.

| Tính năng             | Mô tả                                                     |
| --------------------- | ---------------------------------------------------------- |
| **Fetch dữ liệu**    | Gọi API khi khởi tạo, tải danh sách CCDC + phòng ban      |
| **CRUD đầy đủ**       | Thêm / Sửa / Xóa / Xóa hàng loạt — 100% qua API         |
| **Quản lý phòng ban** | Thêm / Sửa / Xóa phòng ban — 100% qua API                |
| **Lọc & Sắp xếp**    | Tìm kiếm, lọc theo trạng thái/nhu cầu/năm                |
| **Phân trang**        | 15 bản ghi/trang                                           |
| **Tính KPI**          | Tổng, đang dùng tốt, cần sửa, hỏng, cần bổ sung          |

### `src/contexts/AuthContext.tsx` — Xác thực người dùng

- Gọi `POST /auth/login` khi đăng nhập
- Lưu JWT token vào `localStorage` (key: `auth_token`)
- Gắn token vào header `Authorization: Bearer <token>` cho mọi request
- Phân quyền: Admin thấy toàn bộ, User chỉ thấy phòng ban được gán

### `src/components/ApiStatusGuard.tsx` — Guard trạng thái API

- Hiển thị **spinner xoay** khi đang tải dữ liệu từ Backend
- Hiển thị **màn hình lỗi + nút Thử lại** khi Backend không phản hồi
- Được áp dụng trên tất cả các trang chính (Dashboard, EquipmentList, DepartmentPage, AnalyticsPage)

---

---

# PHẦN 3 — Hợp đồng API (API Contract)

---

## 3.1 Tổng hợp Endpoint

### Quản lý CCDC (Assets)

| #  | Method     | Endpoint           | Mô tả                        | Request Body            | Response            |
| -- | ---------- | ------------------ | ----------------------------- | ----------------------- | ------------------- |
| 1  | **GET**    | `/assets`          | Lấy toàn bộ danh sách CCDC   | —                       | `AssetResponse[]`   |
| 2  | **POST**   | `/assets`          | Thêm mới 1 CCDC              | `AssetPayload`          | `AssetResponse`     |
| 3  | **PUT**    | `/assets/{id}`     | Cập nhật CCDC theo ID         | `Partial<AssetPayload>` | `AssetResponse`     |
| 4  | **DELETE** | `/assets/{id}`     | Xóa CCDC theo ID             | —                       | `204 No Content`    |
| 5  | **POST**   | `/assets/bulk`     | Thêm nhiều CCDC cùng lúc     | `AssetPayload[]`        | `AssetResponse[]`   |

### Quản lý Phòng ban (Departments)

| #  | Method     | Endpoint              | Mô tả                   | Request Body                  | Response              |
| -- | ---------- | --------------------- | ------------------------ | ----------------------------- | --------------------- |
| 1  | **GET**    | `/departments`        | Lấy danh sách phòng ban | —                             | `DepartmentPayload[]` |
| 2  | **POST**   | `/departments`        | Thêm phòng ban mới      | `DepartmentPayload`           | `DepartmentPayload`   |
| 3  | **PUT**    | `/departments/{id}`   | Cập nhật phòng ban      | `Partial<DepartmentPayload>`  | `DepartmentPayload`   |
| 4  | **DELETE** | `/departments/{id}`   | Xóa phòng ban           | —                             | `204 No Content`      |

### Xác thực (Authentication)

| #  | Method     | Endpoint         | Mô tả       | Request Body    | Response         |
| -- | ---------- | ---------------- | ------------ | --------------- | ---------------- |
| 1  | **POST**   | `/auth/login`    | Đăng nhập    | `LoginPayload`  | `LoginResponse`  |

### Quản lý Tài khoản (Users) — _Cần Backend implement_

| #  | Method     | Endpoint              | Mô tả                   | Request Body    | Response         |
| -- | ---------- | --------------------- | ------------------------ | --------------- | ---------------- |
| 1  | **GET**    | `/users`              | Lấy danh sách tài khoản | —               | `UserAccount[]`  |
| 2  | **POST**   | `/users`              | Tạo tài khoản mới       | `CreateUserPayload` | `UserAccount` |
| 3  | **DELETE** | `/users/{username}`   | Xóa tài khoản           | —               | `204 No Content` |

---

## 3.2 Interface chi tiết

### `AssetPayload` — Body khi tạo/cập nhật CCDC

```typescript
interface AssetPayload {
  name: string;            // Tên thiết bị (VD: "Máy tính để bàn")
  serial: string;          // Số serial (VD: "KTTH-2023-0001")
  quantity: number;        // Số lượng
  unit: string;            // Đơn vị tính ("Cái" | "Bộ" | "Chiếc" | "Máy")
  yearManufacture: number | null;  // Năm sản xuất
  yearUse: number | null;          // Năm đưa vào sử dụng
  country: string;         // Nước sản xuất (VD: "Nhật Bản")
  brand: string;           // Hãng (VD: "Dell", "HP")
  model: string;           // Model (VD: "MDL-5678")
  capacity: string;        // Công suất / Thông số kỹ thuật
  status: string;          // "Đang dùng tốt" | "Cần sửa chữa" | "Hỏng"
  demand: string;          // "Thường xuyên" | "Theo đợt" | "Cần bổ sung" | "Dự phòng"
  note: string;            // Ghi chú
  departmentId: string;    // ID phòng ban (VD: "ke-toan")
  departmentName: string;  // Tên phòng ban (VD: "Kế toán - Tổng hợp")
}
```

### `AssetResponse` — Response trả về từ Backend

```typescript
interface AssetResponse extends AssetPayload {
  id: number;   // ID tự tăng do Backend tạo (auto-increment)
}
```

### `DepartmentPayload` — Dữ liệu Phòng ban

```typescript
interface DepartmentPayload {
  id: string;     // ID dạng slug (VD: "ke-toan", "cntt")
  name: string;   // Tên đầy đủ (VD: "Kế toán - Tổng hợp")
  short: string;  // Tên viết tắt (VD: "KTTH")
  icon: string;   // Tên icon Lucide (VD: "Calculator", "Monitor")
}
```

### `LoginPayload` & `LoginResponse` — Xác thực

```typescript
// Request body gửi lên
interface LoginPayload {
  username: string;
  password: string;
}

// Response trả về
interface LoginResponse {
  token: string;           // JWT token — FE lưu vào localStorage
  user: {
    username: string;
    displayName: string;
    role: string;          // "admin" | "user"
    departments: string[]; // Danh sách departmentId được phép truy cập
  };
}
```

---

## 3.3 Gợi ý thiết kế Database

```
┌──────────────────────────────────────────┐
│              departments                 │
├──────────────────────────────────────────┤
│ id        VARCHAR(50)   PK              │
│ name      VARCHAR(200)  NOT NULL         │
│ short     VARCHAR(20)   NOT NULL         │
│ icon      VARCHAR(50)   NOT NULL         │
└──────────────────────────────────────────┘
            │
            │ 1:N
            ▼
┌──────────────────────────────────────────┐
│                assets                    │
├──────────────────────────────────────────┤
│ id               INT          PK, AUTO   │
│ name             VARCHAR(200) NOT NULL    │
│ serial           VARCHAR(100) NOT NULL    │
│ quantity         INT          NOT NULL    │
│ unit             VARCHAR(20)  NOT NULL    │
│ year_manufacture INT          NULLABLE    │
│ year_use         INT          NULLABLE    │
│ country          VARCHAR(100)             │
│ brand            VARCHAR(100)             │
│ model            VARCHAR(100)             │
│ capacity         VARCHAR(200)             │
│ status           VARCHAR(50)  NOT NULL    │
│ demand           VARCHAR(50)              │
│ note             TEXT                     │
│ department_id    VARCHAR(50)  FK          │
│ department_name  VARCHAR(200)             │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│                users                     │
├──────────────────────────────────────────┤
│ id               INT          PK, AUTO   │
│ username         VARCHAR(50)  UNIQUE      │
│ password         VARCHAR(255) NOT NULL    │
│ display_name     VARCHAR(100)             │
│ role             ENUM('admin','user')     │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│           user_departments               │
├──────────────────────────────────────────┤
│ user_id          INT          FK          │
│ department_id    VARCHAR(50)  FK          │
└──────────────────────────────────────────┘
```

---

## 3.4 Quy ước Response

### Mã trạng thái HTTP

| Mã    | Ý nghĩa               | Khi nào dùng                                |
| ----- | ---------------------- | ------------------------------------------- |
| `200` | OK                     | GET, PUT thành công                          |
| `201` | Created                | POST tạo mới thành công                     |
| `204` | No Content             | DELETE thành công                            |
| `400` | Bad Request            | Dữ liệu gửi lên không hợp lệ               |
| `401` | Unauthorized           | Chưa đăng nhập hoặc token hết hạn           |
| `403` | Forbidden              | Không có quyền truy cập                      |
| `404` | Not Found              | Không tìm thấy tài nguyên                   |
| `500` | Internal Server Error  | Lỗi phía server                              |

### Format Response thành công

```json
// GET /assets → 200
[
  {
    "id": 1,
    "name": "Máy tính để bàn",
    "serial": "KTTH-2023-0001",
    "quantity": 2,
    "unit": "Cái",
    "yearManufacture": 2022,
    "yearUse": 2023,
    "country": "Nhật Bản",
    "brand": "Dell",
    "model": "MDL-5678",
    "capacity": "-",
    "status": "Đang dùng tốt",
    "demand": "Thường xuyên",
    "note": "",
    "departmentId": "ke-toan",
    "departmentName": "Kế toán - Tổng hợp"
  }
]
```

```json
// POST /auth/login → 200
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "username": "taisan",
    "displayName": "Quản trị viên",
    "role": "admin",
    "departments": []
  }
}
```

### Format Response lỗi

```json
{
  "message": "Tên thiết bị không được để trống",
  "status": 400,
  "timestamp": "2026-03-11T10:30:00Z"
}
```

> ⚠️ **Quan trọng:** Front-end đọc lỗi từ `error.response.data.message`. Backend **bắt buộc** phải trả về trường `message` trong mọi response lỗi.

---

---

# PHẦN 4 — Cấu hình kết nối (Connection)

---

## 4.1 File cấu hình: `src/services/api.ts`

```typescript
const API_BASE_URL = "http://localhost:8081/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — tự động gắn JWT token
apiClient.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method} ${config.url}`, config.data);
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Cách đổi Base URL

Nếu Backend chạy ở địa chỉ khác, chỉ cần sửa dòng đầu tiên:

```typescript
// Ví dụ: Backend chạy ở port 3000
const API_BASE_URL = "http://localhost:3000/api";

// Ví dụ: Backend đã deploy
const API_BASE_URL = "https://api.example.com/api";
```

---

## 4.2 Cấu hình CORS ⚠️

> **Bắt buộc:** Backend phải cho phép CORS từ origin `http://localhost:5173` (Vite dev server).

### Spring Boot (Java)

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",  // Vite dev server
                    "http://localhost:4173"   // Vite preview
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

### Node.js / Express

```javascript
const cors = require("cors");

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:4173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
```

### .NET / ASP.NET Core

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:4173")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

app.UseCors("AllowFrontend");
```

---

## 4.3 Quy tắc đặt tên trường JSON

Front-end sử dụng **camelCase** cho tất cả các trường. Backend **bắt buộc** trả về đúng format:

| ✅ Đúng (camelCase)   | ❌ Sai (snake_case)     |
| --------------------- | ----------------------- |
| `departmentId`        | `department_id`         |
| `departmentName`      | `department_name`       |
| `yearManufacture`     | `year_manufacture`      |
| `yearUse`             | `year_use`              |
| `displayName`         | `display_name`          |

> 💡 Nếu Backend dùng snake_case trong database, hãy cấu hình **JSON serializer** để tự động convert:
> - **Spring Boot:** `@JsonNaming(PropertyNamingStrategies.LowerCamelCaseStrategy.class)`
> - **Express:** middleware transform
> - **.NET:** `JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }`

---

---

# PHẦN 5 — Quy tắc vận hành (Logic)

---

## 5.1 ✅ Đã loại bỏ 100% Mock Data

> **Xác nhận: Front-end KHÔNG còn bất kỳ dữ liệu giả nào.**

| Trước đây (v1.0)                              | Hiện tại (v2.0)                              |
| ---------------------------------------------- | -------------------------------------------- |
| ❌ Tự sinh 50 bản ghi CCDC giả khi API lỗi    | ✅ Bảng trống + hiển thị lỗi rõ ràng         |
| ❌ Có 8 phòng ban mặc định cứng trong code     | ✅ Danh sách trống, chờ API trả về           |
| ❌ CRUD hoạt động offline (không lưu DB)        | ✅ Mọi CRUD đều gọi API, lỗi → Toast error  |
| ❌ Login so khớp password offline               | ✅ Gọi `POST /auth/login` thật              |

## 5.2 Luồng hoạt động khi khởi tạo

```
Người dùng mở trang
        │
        ▼
┌─────────────────────────┐
│  Hiển thị SPINNER xoay  │  ← "Đang tải dữ liệu từ Server..."
│  (ApiStatusGuard)        │
└────────────┬────────────┘
             │
    Gọi API: GET /assets + GET /departments
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
  ✅ 200 OK       ❌ Lỗi / Timeout
     │               │
     ▼               ▼
 Hiển thị        Hiển thị màn hình lỗi:
 dữ liệu        🔴 "Không kết nối được Backend"
 từ API          + Nút [Thử lại]
                 + Toast thông báo đỏ
```

## 5.3 Luồng hoạt động CRUD

```
Người dùng nhấn "Thêm CCDC"
        │
        ▼
    Gọi POST /assets
        │
    ┌───┴───┐
    │       │
    ▼       ▼
 ✅ 201   ❌ Lỗi
    │       │
    ▼       ▼
 Cập nhật  Toast error:
 bảng UI   "Lỗi thêm CCDC: <message>"
 + Toast   Bảng KHÔNG thay đổi
 thành công
```

> **Nguyên tắc:** Giao diện chỉ cập nhật **SAU KHI** Backend trả về thành công. Nếu lỗi → giữ nguyên trạng thái cũ + hiển thị thông báo.

## 5.4 Luồng đăng nhập

```
Người dùng nhập username + password → Nhấn "Đăng Nhập"
        │
        ▼
   Button hiện SPINNER: "Đang kết nối Server..."
        │
        ▼
   Gọi POST /auth/login { username, password }
        │
    ┌───┴───┐
    │       │
    ▼       ▼
 ✅ 200   ❌ Lỗi
    │       │
    ▼       ▼
 Lưu token  Hiển thị alert đỏ:
 vào        "Tên đăng nhập hoặc
 localStorage mật khẩu không chính xác"
 → Chuyển
 trang Dashboard
```

## 5.5 Debug Logs

Front-end đã tích hợp `console.log` cho mọi request/response API. Mở **F12 → Console** để theo dõi:

```
[API Request] POST /auth/login {username: "taisan", password: "***"}
[API Response] 200 POST /auth/login {token: "eyJ...", user: {...}}

[API Request] GET /assets
[API Error] NETWORK GET /assets Không thể kết nối đến Server

[EquipmentContext] Đang tải dữ liệu từ Backend...
[EquipmentContext] Tải thành công: 50 CCDC, 8 phòng ban
```

## 5.6 Phân quyền

| Quyền     | Mô tả                                                    |
| --------- | --------------------------------------------------------- |
| `admin`   | Truy cập toàn bộ, quản lý tài khoản & phòng ban          |
| `user`    | Chỉ xem/chỉnh sửa CCDC thuộc phòng ban được gán         |

## 5.7 Biến trạng thái quan trọng trong EquipmentContext

| Biến              | Kiểu           | Ý nghĩa                                    |
| ----------------- | -------------- | ------------------------------------------- |
| `isLoading`       | `boolean`      | `true` khi đang gọi API lần đầu            |
| `apiError`        | `string | null`| Thông báo lỗi nếu API thất bại             |
| `equipmentData`   | `Equipment[]`  | Toàn bộ danh sách CCDC (từ API)             |
| `departments`     | `Department[]` | Danh sách phòng ban (từ API)                |
| `filteredData`    | `Equipment[]`  | Dữ liệu sau khi lọc & sắp xếp             |

---

## ✅ Checklist trước khi tích hợp

- [ ] Backend chạy tại `http://localhost:8081`
- [ ] Đã cấu hình CORS cho `http://localhost:5173`
- [ ] Endpoint `GET /api/assets` trả về `AssetResponse[]`
- [ ] Endpoint `GET /api/departments` trả về `DepartmentPayload[]`
- [ ] Endpoint `POST /api/auth/login` trả về `LoginResponse` (có `token` + `user`)
- [ ] Tất cả JSON response sử dụng **camelCase**
- [ ] Response lỗi luôn có trường `message`
- [ ] Database đã seed ít nhất 1 tài khoản admin và vài phòng ban mặc định

---

> 📞 **Liên hệ:** Nếu có thắc mắc, vui lòng liên hệ đội ngũ Front-end để được hỗ trợ.

---

*Tài liệu bàn giao cuối cùng — Cập nhật lần cuối: 11/03/2026*
