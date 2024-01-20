package com.demo.taskmanagement.service.impl;

import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.*;
import com.demo.taskmanagement.repository.UserDao;
import com.demo.taskmanagement.service.AuthenticationService;
import com.demo.taskmanagement.service.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.security.authentication.AuthenticationManager;
import com.demo.taskmanagement.model.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.NonNull;
import org.springframework.stereotype.Service;


import java.util.Locale;

import static com.demo.taskmanagement.common.ModuleConstants.AppErrorMessages.USER_LOGIN_FAILED;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {
    @NonNull
    private final UserDao userDao;

    @NonNull
    private final PasswordEncoder passwordEncoder;

    @NonNull
    private final JwtService jwtService;

    @NonNull
    private final AuthenticationManager authenticationManager;

    @NonNull
    private final MessageSource messageSource;



    @Override
    public ResponseEntityDto signup(SignupRequest request) {
        var user = User
                .builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .gender(request.getGender())
                .dob(request.getDob())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole()).build();
        userDao.save(user);

        var jwt = jwtService.generateToken(user);


        UserResponseDto userResponseDto = UserResponseDto.builder().id(user.getId()).firstName(user.getFirstName()).lastName(user.getLastName()).gender(user.getGender()).email(user.getEmail()).phoneNumber(user.getPhoneNumber()).dob(user.getDob()).role(user.getRole()).build();

        JwtAuthenticationResponse response = JwtAuthenticationResponse.builder().user(userResponseDto).token(jwt).build();

        return new ResponseEntityDto(false, response);
    }

    @Override
    public ResponseEntityDto signin(SigninRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        var user = userDao
                .findUserByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException(messageSource.getMessage(USER_LOGIN_FAILED, null, Locale.ENGLISH)));

        var jwt = jwtService.generateToken(user);

        UserResponseDto userResponseDto = UserResponseDto.builder().id(user.getId()).firstName(user.getFirstName()).lastName(user.getLastName()).gender(user.getGender()).email(user.getEmail()).phoneNumber(user.getPhoneNumber()).dob(user.getDob()).role(user.getRole()).build();

        JwtAuthenticationResponse jwtAuthenticationResponse =  JwtAuthenticationResponse.builder().user(userResponseDto).token(jwt).build();

        return new ResponseEntityDto(false, jwtAuthenticationResponse);
    }
}
