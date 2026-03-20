📦 QuanLyTaiSan - Asset Management System
QuanLyTaiSan là hệ thống quản lý tài sản và phòng ban, giúp doanh nghiệp theo dõi vòng đời tài sản, tối ưu hóa việc phân bổ và kiểm soát dữ liệu tập trung.
🚀 Tính năng chính

Quản lý tài sản (Assets): Các thao tác CRUD (Thêm, Sửa, Xóa, Xem) thông tin tài sản. 

Quản lý phòng ban (Departments): Thiết lập mối quan hệ giữa tài sản và đơn vị sử dụng để đảm bảo tính toàn vẹn dữ liệu. 

Tìm kiếm & Lọc: Hệ thống phân trang (Pagination) và bộ lọc (Filtering) giúp truy xuất dữ liệu lớn một cách hiệu quả. 

Bảo mật: Tích hợp Spring Security và JWT để quản lý quyền truy cập. 

🛠 Công nghệ sử dụng

Backend: Java Spring Boot, Spring Data JPA. 

Database: MySQL (Thiết kế quan hệ thực thể chặt chẽ). 

Security: JWT (JSON Web Token), Role-based Authorization. 

Optimization: HikariCP (Connection Pooling), Pagination. 

📂 Kiến trúc dự án
Dự án được triển khai theo mô hình Layered Architecture để đảm bảo tính dễ bảo trì:

controller: Tiếp nhận và điều hướng các request RESTful.

service: Xử lý logic nghiệp vụ chính của hệ thống.

repository: Tương tác với cơ sở dữ liệu thông qua JPA.

entity: Định nghĩa các đối tượng dữ liệu (Asset, Department).

⚙️ Hướng dẫn cài đặt
Clone project: git clone https://github.com/HoangNghia-Hoa/quanlytaisan 

Cấu hình database trong file application.properties (URL, Username, Password).

Chạy ứng dụng bằng Maven: mvn spring-boot:run
