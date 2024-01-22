package com.demo.taskmanagement.service;

import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.TaskCreateDto;
import com.demo.taskmanagement.payload.dto.TaskEditDto;

public interface TaskService {
    ResponseEntityDto createTask(TaskCreateDto task);
    ResponseEntityDto getTasks(int page, int size);
    ResponseEntityDto getMyTasks(int page, int size);
    ResponseEntityDto getOneTask(String id);
    ResponseEntityDto deleteTask(String id);
    ResponseEntityDto editTask(TaskEditDto task);
    ResponseEntityDto searchTasks(String searchField, String searchTerm, int page, int size);
    ResponseEntityDto searchMyTasks(String searchField, String searchTerm, int page, int size);

}
