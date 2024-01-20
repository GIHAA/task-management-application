package com.demo.taskmanagement.repository;

import com.demo.taskmanagement.model.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.data.mongo.DataMongoTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@DataMongoTest
class UserDaoTest {

    @Autowired
    private UserDao userDao;

    @Test
    void testFindUserByEmail() {
        User user = new User();
        user.setEmail("test@example.com");
        userDao.save(user);

        Optional<User> result = userDao.findUserByEmail("test@example.com");

        assertEquals(user, result.orElse(null));

        userDao.delete(user);
    }


    @Test
    void testFindByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase() {

        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setEmail("john.doe@example.com");
        userDao.save(user);


        Page<User> result = userDao.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                "John", "Doe", "john.doe@example.com", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals(user, result.getContent().get(0));

        userDao.delete(user);
    }

    @Test
    void testFindByFirstNameContainingIgnoreCaseAndLastNameContainingIgnoreCase() {
        User user = new User();
        user.setFirstName("John");
        user.setLastName("Doe");
        userDao.save(user);

        Page<User> result = userDao.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(
                "John", "Doe", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals(user, result.getContent().get(0));

        userDao.delete(user);
    }

    @Test
    void testFindByEmailContainingIgnoreCase() {

        User user = new User();
        user.setEmail("test@example.com");
        userDao.save(user);

        Page<User> result = userDao.findByEmailContainingIgnoreCase("test@example.com", PageRequest.of(0, 10));

        assertEquals(1, result.getTotalElements());
        assertEquals(user, result.getContent().get(0));

        userDao.delete(user);
    }
}
