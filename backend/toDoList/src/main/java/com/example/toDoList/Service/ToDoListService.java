package com.example.toDoList.Service;

import com.example.toDoList.DTO.ToDoListDTO;
import com.example.toDoList.Entity.ToDoList;
import com.example.toDoList.Repository.ToDoListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ToDoListService {
    private final ToDoListRepository TDLrepository;

    @Autowired
    public ToDoListService(ToDoListRepository repository) {
        this.TDLrepository = repository;
    }
    // CRUD METHOD
    public ToDoList create(ToDoListDTO dto){
        ToDoList tdl = new ToDoList(dto.getName(),dto.getText(), dto.isComplete());
        TDLrepository.save(tdl);
        return tdl;
    }
    public ToDoList get(long id){
        Optional<ToDoList> TDLoptional = TDLrepository.findById(id);

        if(TDLoptional.isPresent()){
            return TDLoptional.get();
        }else {
            return null;
        }
    }
    public ToDoList put(long id,ToDoListDTO dto){
        Optional<ToDoList> TDLoptional = TDLrepository.findById(id);
        if(TDLoptional.isPresent()){
            TDLoptional.get().setText(dto.getText());
            TDLoptional.get().setName(dto.getName());
            TDLoptional.get().setComplete(dto.isComplete());
        }else {
            return null;
        }
        return TDLrepository.save(TDLoptional.get());
    }
    public void delete(Long id) {
        if (!TDLrepository.existsById(id)) {
            throw new RuntimeException("No toDo");
        }
        TDLrepository.deleteById(id);
    }

    public List<ToDoList> readAll(){
        return TDLrepository.findAll();
    }
}
