package com.demo.taskmanagement.payload.dto;


import com.demo.taskmanagement.common.types.Priority;
import com.demo.taskmanagement.common.types.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TaskCreateDto {
    private String name;
    private String description;
    private Date created_at;
    private Priority priority;
    private Status status;
}
