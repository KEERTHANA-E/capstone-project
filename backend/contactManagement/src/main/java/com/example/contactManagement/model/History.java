package com.example.contactManagement.model;

import java.time.LocalDateTime;

public class History {
    String type;
    String content;
    LocalDateTime timestamp;

    public String getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }



    public void setType(String type) {
        this.type = type;
    }



    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp() {
        this.timestamp = LocalDateTime.now();
    }
}
