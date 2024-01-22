package com.demo.taskmanagement.controller;


import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.UserCreateDto;
import com.demo.taskmanagement.payload.dto.UserEditDto;
import com.demo.taskmanagement.service.UserService;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/user")
@AllArgsConstructor
@CrossOrigin
public class UserController {

    @NonNull
    private final UserService userService;

    @PreAuthorize("hasAnyAuthority('OWNER')")
    @PostMapping
    public ResponseEntity<ResponseEntityDto> createUser(@RequestBody UserCreateDto userCreateDto) {
        ResponseEntityDto response = userService.createUser(userCreateDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PreAuthorize("hasAnyAuthority('OWNER')")
    @GetMapping
    public ResponseEntity<ResponseEntityDto> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntityDto response = userService.getUsers(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('OWNER')")
    @GetMapping("/{userId}")
    public ResponseEntity<ResponseEntityDto> getOneUser(@PathVariable String userId) {
        ResponseEntityDto response = userService.getOneUser(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('OWNER')")
    @GetMapping("/search")
    public ResponseEntity<ResponseEntityDto> searchUsers(
            @RequestParam String searchField,
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntityDto response = userService.searchUsers(searchField ,searchTerm, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('OWNER')")
    @PutMapping
    public ResponseEntity<ResponseEntityDto> updateUser(@RequestBody UserEditDto userEditDto) {
        ResponseEntityDto response = userService.editUser(userEditDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize("hasAnyAuthority('OWNER')")
    @DeleteMapping("/{userId}")
    public ResponseEntity<ResponseEntityDto> deleteUser(@PathVariable String userId) {
        ResponseEntityDto response = userService.deleteUser(userId);
        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }
}

