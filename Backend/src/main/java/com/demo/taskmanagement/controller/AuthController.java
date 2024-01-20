package com.demo.taskmanagement.controller;

import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.SigninRequest;
import com.demo.taskmanagement.payload.dto.SignupRequest;
import com.demo.taskmanagement.service.AuthenticationService;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
@CrossOrigin
public class AuthController {

    @NonNull
    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<ResponseEntityDto> signup(@RequestBody SignupRequest request) {
        ResponseEntityDto response = authenticationService.signup(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<ResponseEntityDto> signin(@RequestBody SigninRequest request) {
        ResponseEntityDto response = authenticationService.signin(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
