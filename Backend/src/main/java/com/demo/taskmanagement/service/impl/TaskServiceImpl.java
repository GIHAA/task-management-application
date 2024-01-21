package com.demo.taskmanagement.service.impl;


import com.demo.taskmanagement.common.types.Role;
import com.demo.taskmanagement.common.types.Status;
import com.demo.taskmanagement.exception.ModuleException;
import com.demo.taskmanagement.model.Task;
import com.demo.taskmanagement.model.User;
import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.TaskCreateDto;
import com.demo.taskmanagement.payload.dto.TaskEditDto;
import com.demo.taskmanagement.repository.TaskDao;
import com.demo.taskmanagement.service.TaskService;
import com.demo.taskmanagement.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;

import static com.demo.taskmanagement.common.ModuleConstants.AppErrorMessages.*;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    @NonNull
    private final TaskDao taskDao;

    @NonNull
    private MessageSource messageSource;
    @NonNull
    private UserService userService;

    @Override
    public ResponseEntityDto createTask(TaskCreateDto taskCreateDto) {


        if (    taskCreateDto.getName() == null ||
                taskCreateDto.getDescription() == null ){
            throw new ModuleException(String.format(messageSource.getMessage(REQUEST_BODY_IS_MISSING_PAYLOAD , null, Locale.ENGLISH)));
        }

        User user = userService.getCurrentUser();

        Task task = Task.builder().name(taskCreateDto.getName()).description(taskCreateDto.getDescription()).owner(user).created_at(new Date()).priority(taskCreateDto.getPriority()).status(taskCreateDto.getStatus()).build();

        Task savedTask = taskDao.save(task);

        return new ResponseEntityDto(false, savedTask);
    }

    @Override
    public ResponseEntityDto getTasks(int page, int size) {
        User user = userService.getCurrentUser();

        if(user.getRole().equals(Role.REGULAR_USER)){
            throw new ModuleException(String.format(messageSource.getMessage(USER_ACCESS_DENIED, null, Locale.ENGLISH)));
        }

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Task> taskPage = taskDao.findAll(pageRequest);

        return new ResponseEntityDto(false, taskPage);
    }

    @Override
    public ResponseEntityDto getMyTasks(int page, int size) {
        User user = userService.getCurrentUser();

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Task> taskPage = taskDao.findByOwner(user, pageRequest);

        return new ResponseEntityDto(false, taskPage);
    }

    @Override
    public ResponseEntityDto getOneTask(String id) {
        Optional<Task> task = taskDao.findById(id);

        if(task.isEmpty()){
            throw new ModuleException(String.format(messageSource.getMessage(TASK_NOT_FOUND, null, Locale.ENGLISH),
                    id));
        }

        return new ResponseEntityDto(false, task);
    }


    @Override
    public ResponseEntityDto editTask(TaskEditDto taskEditDto) {

        Optional<Task> existingTask = taskDao.findById(taskEditDto.getId());

        if(existingTask.isEmpty()){
            throw new ModuleException(String.format(messageSource.getMessage(TASK_NOT_FOUND, null, Locale.ENGLISH),
                    taskEditDto.getId()));
        }

        if (taskEditDto.getName() != null) {
            existingTask.get().setName(taskEditDto.getName());
        }
        if (taskEditDto.getDescription() != null) {
            existingTask.get().setDescription(taskEditDto.getDescription());
        }
        if (taskEditDto.getPriority() != null) {
            existingTask.get().setPriority(taskEditDto.getPriority());
        }
        if (taskEditDto.getStatus() != null) {
            existingTask.get().setStatus(taskEditDto.getStatus());
        }

        Task updatedTask = taskDao.save(existingTask.get());

        return new ResponseEntityDto(false, updatedTask);
    }

    @Override
    public ResponseEntityDto deleteTask(String id) {
        Task taskToDelete = taskDao.findById(id)
                .orElseThrow(() ->   new ModuleException(String.format(messageSource.getMessage(TASK_NOT_FOUND, null, Locale.ENGLISH), id)));

        taskDao.delete(taskToDelete);

        return new ResponseEntityDto(false, taskToDelete);
    }

    @Override
    public ResponseEntityDto searchTasks(String searchField, String searchTerm, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Task> searchResults = null;
        switch (searchField.toUpperCase()) {
            case "BOTH":
                searchResults = taskDao.findByDescriptionContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm , pageRequest);
                break;
            case "NAME":
                searchResults = taskDao.findByNameContainingIgnoreCase(searchTerm , pageRequest);
                break;
            case "DESCRIPTION":
                searchResults = taskDao.findByDescriptionContainingIgnoreCase(searchTerm, pageRequest);
                break;
            default:
                searchResults = taskDao.findByDescriptionContainingIgnoreCaseOrDescriptionContainingIgnoreCase(searchTerm, searchTerm, pageRequest);
                break;
        }

        return new ResponseEntityDto(false, searchResults);
    }

}
