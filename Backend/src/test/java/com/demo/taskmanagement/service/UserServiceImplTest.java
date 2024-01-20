package com.demo.taskmanagement.service;

import com.demo.taskmanagement.common.types.Gender;
import com.demo.taskmanagement.model.User;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.UserCreateDto;
import com.demo.taskmanagement.payload.dto.UserEditDto;
import com.demo.taskmanagement.repository.UserDao;
import com.demo.taskmanagement.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserDao userDao;

    @Mock
    private MessageSource messageSource;

    @InjectMocks
    private UserServiceImpl userService;

    private UserCreateDto sampleCreateDto;
    private UserEditDto sampleEditDto;

    @BeforeEach
    void setUp() {
//        sampleCreateDto = createSampleUserCreateDto();
//        sampleEditDto = createSampleUserEditDto();
    }

    @Test
    void testCreateUser_Success() {
        // Arrange
        when(userDao.findUserByEmail(anyString())).thenReturn(Optional.empty());
        when(userDao.save(any())).thenReturn(createSampleUser());

        // Act
        ResponseEntityDto response = userService.createUser(sampleCreateDto);

        // Assert
        assertEquals("successful", response.getStatus());
        assertNotNull(response.getResults());
        assertEquals(1, response.getResults().size());
        assertTrue(response.getResults().get(0) instanceof User);
    }


    @Test
    void testEditUser_Success() {
        // Arrange
        when(userDao.findById(anyString())).thenReturn(Optional.of(createSampleUser()));
        when(userDao.save(any())).thenReturn(createSampleUser());

        // Act
        ResponseEntityDto response = userService.editUser(sampleEditDto);

        // Assert
        assertEquals("successful", response.getStatus());
        assertNotNull(response.getResults());
        assertEquals(1, response.getResults().size());
        assertTrue(response.getResults().get(0) instanceof User);
    }


    @Test
    void testDeleteUser_Success() {
        // Arrange
        String userId = "123";
        when(userDao.findById(anyString())).thenReturn(Optional.of(createSampleUser()));

        // Act
        ResponseEntityDto response = userService.deleteUser(userId);

        // Assert
        assertEquals("successful", response.getStatus());
        assertNotNull(response.getResults());
        assertEquals(1, response.getResults().size());
        assertTrue(response.getResults().get(0) instanceof User);
    }

    @Test
    void testDeleteUser_UserNotFound() {
        // Arrange
        String userId = "123";
        when(userDao.findById(anyString())).thenReturn(Optional.empty());

        // Act and Assert
        assertThrows(IllegalArgumentException.class, () -> userService.deleteUser(userId));
    }

    @Test
    void testSearchUsers_Success() {
        // Arrange
        int page = 0;
        int size = 10;
        String searchField = "BOTH";
        String searchTerm = "John";
        when(userDao.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(anyString(), anyString(), anyString(), any(PageRequest.class)))
                .thenReturn(new PageImpl<>(Collections.singletonList(createSampleUser())));

        // Act
        ResponseEntityDto response = userService.searchUsers(searchField, searchTerm, page, size);

        // Assert
        assertEquals("successful", response.getStatus());
        assertNotNull(response.getResults());
        assertEquals(1, response.getResults().size());
    }

//    public static UserCreateDto createSampleUserCreateDto() {
//        UserCreateDto userCreateDto = new UserCreateDto();
//        userCreateDto.setId("sampleId");
//        userCreateDto.setFirstName("John");
//        userCreateDto.setLastName("Doe");
//        userCreateDto.setEmail("john.doe@example.com");
//        userCreateDto.setPhoneNumber("1234567890");
//        userCreateDto.setGender(Gender.MALE);
//        userCreateDto.setDob(new Date());
//        return userCreateDto;
//    }

//    public static UserEditDto createSampleUserEditDto() {
//        UserEditDto userEditDto = new UserEditDto();
//        userEditDto.setId("sampleId");
//        userEditDto.setFirstName("UpdatedJohn");
//        userEditDto.setLastName("UpdatedDoe");
//        userEditDto.setEmail("updated.john.doe@example.com");
//        userEditDto.setPhoneNumber("9876543210");
//        userEditDto.setGender(Gender.FEMALE);
//        userEditDto.setDob(new Date());
//        return userEditDto;
//    }

    public static User createSampleUser() {
        User user = new User();
        user.setId("sampleId");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        user.setPhoneNumber("1234567890");
        user.setGender(Gender.MALE);
        user.setDob(new Date());
        return user;
    }
}
