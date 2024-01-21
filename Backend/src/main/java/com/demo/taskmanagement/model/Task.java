package com.demo.taskmanagement.model;


import com.demo.taskmanagement.common.types.Gender;
import com.demo.taskmanagement.common.types.Priority;
import com.demo.taskmanagement.common.types.Role;
import com.demo.taskmanagement.common.types.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@Data
@Document
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Task  {

    @Id
    private String id;
    private String name;
    private String description;
    @DBRef
    private User owner;
    private Date created_at;
    private Priority priority;
    private Status status;

}
