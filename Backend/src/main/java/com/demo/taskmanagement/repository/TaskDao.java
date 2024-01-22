package com.demo.taskmanagement.repository;

import com.demo.taskmanagement.model.Task;
import com.demo.taskmanagement.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;


public interface TaskDao extends MongoRepository <Task, String> {

    Page<Task> findByOwner(User owner, Pageable pageable);

    Page<Task> findByNameContainingIgnoreCase(
            String name,  Pageable pageable);
    
    Page<Task> findByDescriptionContainingIgnoreCase(
                String description,  Pageable pageable);

    Page<Task> findByDescriptionContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String name, String description, Pageable pageable);
    Page<Task> findByNameContainingIgnoreCaseAndOwner(String name, User owner, Pageable pageable);
    Page<Task> findByDescriptionContainingIgnoreCaseAndOwner(String description, User owner, Pageable pageable);

    Page<Task> findByNameContainingIgnoreCaseAndDescriptionContainingIgnoreCaseAndOwner(
            String name, String description, User owner, Pageable pageable);

}
