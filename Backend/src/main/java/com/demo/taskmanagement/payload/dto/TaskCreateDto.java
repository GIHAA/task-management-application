package com.demo.taskmanagement.payload.dto;

import com.demo.taskmanagement.common.types.Gender;
import com.demo.taskmanagement.common.types.Role;
import com.demo.taskmanagement.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class TaskCreateDto {
    private String name;
    private String description;
    private Date created_at;
}
