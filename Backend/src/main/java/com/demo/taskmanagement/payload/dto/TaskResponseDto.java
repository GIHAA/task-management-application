package com.demo.taskmanagement.payload.dto;

import com.demo.taskmanagement.common.types.Priority;
import com.demo.taskmanagement.common.types.Status;
import com.demo.taskmanagement.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TaskResponseDto {
    private String name;
    private String description;
    private User owner;
    private Priority priority;
    private Status status;
}
