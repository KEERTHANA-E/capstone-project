package com.example.contactManagement.model.ResponseModel;

public class Response {
    private String message;
    private Object response;
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public Object getResponse() {
        return response;
    }
    public void setResponse(Object response) {
        this.response = response;
    }
}
