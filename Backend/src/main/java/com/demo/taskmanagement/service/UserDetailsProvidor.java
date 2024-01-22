package com.demo.taskmanagement.service;

import com.demo.taskmanagement.model.User;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserDetailsProvidor {
    UserDetailsService userDetailsService();
    User getCurrentUser();
    ResponseEntityDto getMe();

}
