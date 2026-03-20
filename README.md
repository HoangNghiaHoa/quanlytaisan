
Asset Management System - Backend API
🎯 Giới thiệu
Đây là mã nguồn phía Server của hệ thống Quản lý tài sản. Dự án tập trung vào việc xây dựng hệ thống RESTful API bảo mật, hiệu năng cao để quản lý thiết bị và phòng ban.

🚀 Tính năng Backend
RESTful API: Cung cấp đầy đủ các endpoint CRUD cho Tài sản (Assets) và Phòng ban (Departments).

Stateless Authentication: Sử dụng Spring Security & JWT (JSON Web Token) để xác thực và phân quyền.

Database Management: Thiết kế quan hệ One-to-Many giữa Department và Asset, đảm bảo toàn vẹn dữ liệu (Referential Integrity).

CORS Configuration: Cấu hình an toàn để cho phép Frontend (React/Vue) giao tiếp với Server.

Pagination & Filtering: Xử lý phân trang và lọc dữ liệu trực tiếp từ Database để tối ưu hiệu năng.

🛠 Tech Stack (Backend Focus)
Core: Java 17, Spring Boot 3.

Security: Spring Security, JWT Filter.

Data: Spring Data JPA, Hibernate.

Validation: Spring Boot Validation (Hibernate Validator).

Deployment: Render (Web Service).

📂 Cấu trúc mã nguồn
Plaintext
src/main/java/com/quanlytaisan/
├── config/             # Cấu hình hệ thống (CORS, Bean...)
├── controller/         # REST Controllers (Endpoint mapping)
├── dto/                # Data Transfer Objects (Request/Response)
├── model/              # Entity Classes (Database Mapping)
├── repository/         # Spring Data JPA Interfaces
├── security/           # JWT Filter, UserDetailsService, SecurityConfig
└── service/            # Business Logic Layer (Xử lý nghiệp vụ chính)
🔒 Security Highlights
Trong dự án này, em đã triển khai:

JwtFilter: Tách Token từ Header, xác thực tính hợp lệ và thiết lập Authentication Context.

Stateless Session: Không sử dụng Session trên Server, giúp hệ thống dễ dàng mở rộng (Scalability).

Password Encoding: Sử dụng BCrypt để mã hóa mật khẩu trước khi lưu vào DB.

⚙️ Cài đặt & Chạy Local
Clone repo.

Cập nhật thông tin Database trong src/main/resources/application.properties.

Chạy lệnh: ./mvnw spring-boot:run.

API mặc định chạy tại: http://localhost:8081.
Email: [Email của em]

LinkedIn: [Link LinkedIn của em]
