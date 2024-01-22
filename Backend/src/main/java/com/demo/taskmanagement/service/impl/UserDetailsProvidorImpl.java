package com.demo.taskmanagement.service.impl;

import com.demo.taskmanagement.model.User;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.repository.UserDao;
import com.demo.taskmanagement.service.UserDetailsProvidor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Locale;

import static com.demo.taskmanagement.common.ModuleConstants.AppErrorMessages.USER_NOT_FOUND;

@Service
@RequiredArgsConstructor
public class UserDetailsProvidorImpl implements UserDetailsProvidor {

    @NonNull
    private final UserDao userDao;

    @NonNull
    private MessageSource messageSource;
    @Override
    public UserDetailsService userDetailsService() {
        return username -> userDao.findUserByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException(messageSource.getMessage(USER_NOT_FOUND, null, Locale.ENGLISH)));
    }

    @Override
    public User getCurrentUser() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (User) userDetails;
    }

    @Override
    public ResponseEntityDto getMe() {
        return new ResponseEntityDto(false, this.getCurrentUser());
    }
}