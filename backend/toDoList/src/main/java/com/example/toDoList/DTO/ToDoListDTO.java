package com.example.toDoList.DTO;

public class ToDoListDTO {
    private String name;
    private String text;
    private boolean complete;

    public boolean isComplete() {
        return complete;
    }

    public void setComplete(boolean complete) {
        this.complete = complete;
    }

    public ToDoListDTO(String name, String text, boolean complete) {
        this.name = name;
        this.text = text;
        this.complete = complete;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
