package com.demo.taskmanagement.repository;

import com.demo.taskmanagement.model.Task;
import com.demo.taskmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface TaskDao extends MongoRepository <Task, String> {

    Page<Task> findByOwner(User owner, Pageable pageable);

    Page<Task> findByNameContainingIgnoreCase(
            String name,  Pageable pageable);
    
    Page<Task> findByDescriptionContainingIgnoreCase(
                String description,  Pageable pageable);

    Page<Task> findByDescriptionContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description, Pageable pageable);


}
