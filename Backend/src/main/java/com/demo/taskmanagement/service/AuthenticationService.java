package com.demo.taskmanagement.service;

import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.SigninRequest;
import com.demo.taskmanagement.payload.dto.SignupRequest;

public interface AuthenticationService {
    ResponseEntityDto signup(SignupRequest request);

    ResponseEntityDto signin(SigninRequest request);
}
