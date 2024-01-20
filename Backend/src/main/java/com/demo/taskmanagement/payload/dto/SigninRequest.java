package com.demo.taskmanagement.payload.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SigninRequest {

    private String email;
    private String password;

}
