package com.demo.taskmanagement.exception;

import com.demo.taskmanagement.payload.common.ErrorResponse;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;

@ControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ResponseEntityDto> handleNullPointerExceptions(Exception e) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(new ResponseEntityDto(
                true, new ErrorResponse(status, e.getMessage())), status);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseEntityDto> handleExceptions(Exception e) {
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        return new ResponseEntity<>(new ResponseEntityDto(
                true, new ErrorResponse(status, e.getMessage())), status);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Object> handleUserNotFoundException(Exception e){
        HttpStatus status = HttpStatus.FORBIDDEN;
        return new ResponseEntity<>(new ResponseEntityDto(
                true, new ErrorResponse(status, e.getMessage())), status);
    }

    @ExceptionHandler(ModuleException.class)
    public ResponseEntity<ResponseEntityDto> handleModuleExceptions(Exception e) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        return new ResponseEntity<>(new ResponseEntityDto(
                true, new ErrorResponse(status, e.getMessage())), status);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ResponseEntityDto> handleEntityNotFoundExceptions(Exception e) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        return new ResponseEntity<>(new ResponseEntityDto(
                true, new ErrorResponse(status, e.getMessage())), status);
    }

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ResponseEntityDto> handleValidationErrors(BindException e) {

        String err = "Validation error. Check 'errors' field for details.";
        HttpStatus status = HttpStatus.UNPROCESSABLE_ENTITY;
        ErrorResponse errorResponse = new ErrorResponse(status, err);
        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            errorResponse.addValidationError(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return new ResponseEntity<>(new ResponseEntityDto(true, errorResponse), status);
    }
}