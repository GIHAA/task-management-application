package com.demo.taskmanagement.service;

import com.demo.taskmanagement.model.User;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;

public interface UserDetailsService {
    UserDetailsService userDetailsService();
    User getCurrentUser();
    ResponseEntityDto getMe();

}
