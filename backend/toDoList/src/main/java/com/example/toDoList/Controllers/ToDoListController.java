package com.example.toDoList.Controllers;

import com.example.toDoList.DTO.ToDoListDTO;
import com.example.toDoList.Entity.ToDoList;
import com.example.toDoList.Repository.ToDoListRepository;
import com.example.toDoList.Service.ToDoListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.net.http.HttpRequest;
import java.util.List;
@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequestMapping("toDoList")

public class ToDoListController {
    private final ToDoListService tdlService;

    public ToDoListController(ToDoListService tdlService) {
        this.tdlService = tdlService;
    }
    @PostMapping
    public ResponseEntity<ToDoList> post(@RequestBody ToDoListDTO dto) {
        ToDoList toDoList = tdlService.create(dto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(toDoList.getId())
                .toUri();
        return ResponseEntity.created(uri).body(toDoList);
    }
    @GetMapping
    public ResponseEntity<List<ToDoList>> readAll(){
        return ResponseEntity.ok(tdlService.readAll());
    }

    @PutMapping
    public ResponseEntity<ToDoList> update(@RequestBody ToDoList toDoList) {
        ToDoListDTO dto = new ToDoListDTO(
                toDoList.getName(),
                toDoList.getText(),
                toDoList.isComplete()
        );
        return ResponseEntity.ok(tdlService.put(toDoList.getId(), dto));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            tdlService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}
