package com.quanlytaisan.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {
    // 1. Xử lý lỗi Không tìm thấy tài nguyên (404)
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request){
        ErrorMessage message = new ErrorMessage(
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now(),
                ex.getMessage(),
                request.getDescription(false)
        );
        return new ResponseEntity<>(message, HttpStatus.NOT_FOUND);
    }
    // 2. Xử lý tất cả các lỗi còn lại (500)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorMessage> globalExceptionHandler(RuntimeException ex, WebRequest request){

        ErrorMessage message = new ErrorMessage(
               HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now(),
                "Có lỗi xảy ra trong hệ thống!",
                request.getDescription(false)
       );
        return new ResponseEntity<>(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
