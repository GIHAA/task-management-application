package com.demo.taskmanagement.common;

public class ModuleConstants {

    public interface AppErrorMessages {
        String USER_NOT_FOUND = "api.user.not.found";
        String EMAIL_ALREADY_IN_USE = "api.user.duplicate.email";
        String REQUEST_BODY_IS_MISSING_PAYLOAD = "api.user.missing.payload";
        String USER_LOGIN_FAILED = "api.user.login.failed";
        String USER_ACCESS_DENIED = "api.user.access.denied";
        String TASK_NOT_FOUND = "api.task.not.found";
    }
}