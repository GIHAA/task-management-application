package com.demo.taskmanagement.controller;

import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/health")
@AllArgsConstructor
@CrossOrigin
public class HealthController {
    @GetMapping
    public ResponseEntity<ResponseEntityDto> healthController() {
        return new ResponseEntity<>(new ResponseEntityDto(false, "Health check ok"), HttpStatus.OK);
    }
}

