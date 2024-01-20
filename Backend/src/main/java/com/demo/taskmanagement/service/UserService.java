package com.demo.taskmanagement.service;

import com.demo.taskmanagement.model.User;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.UserCreateDto;
import com.demo.taskmanagement.payload.dto.UserEditDto;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService {
    ResponseEntityDto createUser(UserCreateDto user);
    ResponseEntityDto getUsers(int page, int size);
    ResponseEntityDto getOneUser(String id);
    ResponseEntityDto deleteUser(String id);
    ResponseEntityDto editUser(UserEditDto user);
    ResponseEntityDto searchUsers(String searchField, String searchTerm, int page, int size);
    UserDetailsService userDetailsService();
    User getCurrentUser();
    ResponseEntityDto getMe();

}
