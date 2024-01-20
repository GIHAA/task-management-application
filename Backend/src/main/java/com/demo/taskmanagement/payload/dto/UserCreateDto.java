package com.demo.taskmanagement.payload.dto;

import com.demo.taskmanagement.common.types.Gender;
import com.demo.taskmanagement.common.types.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class UserCreateDto {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private Gender gender;
    private Date dob;
    private String password;
    private Role role;
}
