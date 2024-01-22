package com.demo.taskmanagement.service.impl;


import com.demo.taskmanagement.exception.ModuleException;
import com.demo.taskmanagement.model.User;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.UserCreateDto;
import com.demo.taskmanagement.payload.dto.UserEditDto;
import com.demo.taskmanagement.repository.UserDao;
import com.demo.taskmanagement.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.demo.taskmanagement.common.ModuleConstants.AppErrorMessages.*;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @NonNull
    private final UserDao userDao;

    @NonNull
    private MessageSource messageSource;

    @NonNull
    private final PasswordEncoder passwordEncoder;


    @Override
    public ResponseEntityDto createUser(UserCreateDto userCreateDto) {

        Optional<User> checkUser = userDao.findUserByEmail(userCreateDto.getEmail());

        if(checkUser.isPresent()){
            throw new ModuleException(String.format(messageSource.getMessage(EMAIL_ALREADY_IN_USE , null, Locale.ENGLISH),
                    userCreateDto.getEmail()));
        }
        if (    userCreateDto.getFirstName() == null ||
                userCreateDto.getLastName() == null ||
                userCreateDto.getEmail() == null ||
                userCreateDto.getPhoneNumber() == null ||
                userCreateDto.getGender() == null ||
                userCreateDto.getDob() == null ||
                userCreateDto.getRole() == null ||
                userCreateDto.getPassword() == null
        ) {
            throw new ModuleException(String.format(messageSource.getMessage(REQUEST_BODY_IS_MISSING_PAYLOAD , null, Locale.ENGLISH)));
        }


        User user = userCreateDtoToUser(userCreateDto);
        user.setPassword(passwordEncoder.encode(userCreateDto.getPassword()));
        String timestamp = String.valueOf(System.currentTimeMillis()).toString().substring(0,4);
        String uuid = UUID.randomUUID().toString().substring(0, 5);

        String id = String.format("%s-%s", timestamp, uuid);

        switch (user.getGender()){
            case MALE:
                id = "M-"+id;
                break;
            case FEMALE:
                id = "F-"+id;
                break;
            case NOT_SPECIFIED:
                id = "N-"+id;
                break;
            case NON_BINARY:
                id = "NB-"+id;
                break;
            case PREFER_NOT_TO_SAY:
                id = "P-"+id;
                break;
            case OTHER:
                id = "O-"+id;
                break;
            default:
                System.out.println("Invalid gender");
        }

        user.setId(id);

        User savedUser = userDao.save(user);

        return new ResponseEntityDto(false, savedUser);
    }

    @Override
    public ResponseEntityDto getUsers(int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> userPage = userDao.findAll(pageRequest);

        return new ResponseEntityDto(false, userPage);
    }

    @Override
    public ResponseEntityDto getOneUser(String id) {
        Optional<User> user = userDao.findById(id);

        if(user.isEmpty()){
            throw new ModuleException(String.format(messageSource.getMessage(USER_NOT_FOUND, null, Locale.ENGLISH),
                    id));
        }

        return new ResponseEntityDto(false, user);
    }


    @Override
    public ResponseEntityDto editUser(UserEditDto userEditDto) {

        Optional<User> existingUser = userDao.findById(userEditDto.getId());

        if(existingUser.isEmpty()){
            throw new ModuleException(String.format(messageSource.getMessage(USER_NOT_FOUND, null, Locale.ENGLISH),
                    userEditDto.getId()));
        }

        if (userEditDto.getFirstName() != null) {
            existingUser.get().setFirstName(userEditDto.getFirstName());
        }
        if (userEditDto.getLastName() != null) {
            existingUser.get().setLastName(userEditDto.getLastName());
        }
        if (userEditDto.getEmail() != null) {
            existingUser.get().setEmail(userEditDto.getEmail());
        }
        if (userEditDto.getPhoneNumber() != null) {
            existingUser.get().setPhoneNumber(userEditDto.getPhoneNumber());
        }
        if (userEditDto.getGender() != null) {
            existingUser.get().setGender(userEditDto.getGender());
        }
        if (userEditDto.getDob() != null) {
            existingUser.get().setDob(userEditDto.getDob());
        }

        User updatedUser = userDao.save(existingUser.get());

        return new ResponseEntityDto(false, updatedUser);
    }

    @Override
    public ResponseEntityDto deleteUser(String id) {
        User userToDelete = userDao.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        userDao.delete(userToDelete);

        return new ResponseEntityDto(false, userToDelete);
    }

    @Override
    public ResponseEntityDto searchUsers(String searchField, String searchTerm, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<User> searchResults = null;
        switch (searchField.toUpperCase()) {
            case "BOTH":
                searchResults = userDao.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchTerm, searchTerm, searchTerm, pageRequest);
                break;
            case "NAME":
                searchResults = userDao.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(searchTerm, searchTerm, pageRequest);
                break;
            case "EMAIL":
                searchResults = userDao.findByEmailContainingIgnoreCase(searchTerm, pageRequest);
                break;
            default:
                searchResults = userDao.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(searchTerm, searchTerm, searchTerm, pageRequest);
                break;
        }

        return new ResponseEntityDto(false, searchResults);
    }


//    @Override
//    public UserDetailsProvidor userDetailsService() {
//        return username -> (UserDetailsProvidor) userDao.findUserByEmail(username)
//                .orElseThrow(() -> new UsernameNotFoundException(messageSource.getMessage(USER_NOT_FOUND, null, Locale.ENGLISH)));
//    }
//
//    @Override
//    public User getCurrentUser() {
//        UserDetailsProvidor UserDetailsProvidor = (UserDetailsProvidor) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        return (User) UserDetailsProvidor;
//    }
//
//    @Override
//    public ResponseEntityDto getMe() {
//        return new ResponseEntityDto(false, this.getCurrentUser());
//    }

    public User userCreateDtoToUser(UserCreateDto userCreateDto) {
        User user = new User();
        user.setId(userCreateDto.getId());
        user.setGender(userCreateDto.getGender());
        user.setEmail(userCreateDto.getEmail());
        user.setFirstName(userCreateDto.getFirstName());
        user.setLastName(userCreateDto.getLastName());
        user.setDob(userCreateDto.getDob());
        user.setPhoneNumber(userCreateDto.getPhoneNumber());
        user.setPassword(userCreateDto.getPassword());
        user.setRole(userCreateDto.getRole());
        return user;
    }

}
