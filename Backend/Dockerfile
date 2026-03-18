# Sử dụng Java 17 (Kiểm tra lại pom.xml nếu bạn dùng bản khác)
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy toàn bộ code backend vào trong máy ảo
COPY . .
# Chạy lệnh build của Maven
RUN ./mvnw clean package -DskipTests
# Lấy file thực thi (.jar) ra để chạy
RUN cp target/*.jar app.jar
EXPOSE 8080
# Chạy ứng dụng và lắng nghe Port mà Render cấp
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]