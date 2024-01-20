package com.demo.taskmanagement.controller;


import com.demo.taskmanagement.payload.common.ResponseEntityDto;
import com.demo.taskmanagement.payload.dto.TaskCreateDto;
import com.demo.taskmanagement.payload.dto.TaskEditDto;
import com.demo.taskmanagement.service.TaskService;
import lombok.AllArgsConstructor;
import lombok.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/task")
@AllArgsConstructor
@CrossOrigin
public class TaskController {

    @NonNull
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ResponseEntityDto> createTask(@RequestBody TaskCreateDto taskCreateDto) {
        ResponseEntityDto response = taskService.createTask(taskCreateDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<ResponseEntityDto> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntityDto response = taskService.getTasks(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping()
    public ResponseEntity<ResponseEntityDto> getMyTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntityDto response = taskService.getMyTasks(page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<ResponseEntityDto> getOneTask(@PathVariable String taskId) {
        ResponseEntityDto response = taskService.getOneTask(taskId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<ResponseEntityDto> searchTasks(
            @RequestParam String searchField,
            @RequestParam String searchTerm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        ResponseEntityDto response = taskService.searchTasks(searchField ,searchTerm, page, size);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PutMapping
    public ResponseEntity<ResponseEntityDto> updateTask(@RequestBody TaskEditDto taskEditDto) {
        ResponseEntityDto response = taskService.editTask(taskEditDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<ResponseEntityDto> deleteTask(@PathVariable String taskId) {
        ResponseEntityDto response = taskService.deleteTask(taskId);
        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }
}

