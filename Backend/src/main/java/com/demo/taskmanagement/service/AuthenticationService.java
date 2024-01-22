package com.demo.taskmanagement.service;

import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.SigninRequest;
import com.demo.taskmanagement.payload.dto.SignupRequest;
import com.demo.taskmanagement.payload.dto.UserCreateDto;

public interface AuthenticationService {
    ResponseEntityDto signup(SignupRequest request);

    ResponseEntityDto signin(SigninRequest request);

    ResponseEntityDto signupAdmin(UserCreateDto request);
}
