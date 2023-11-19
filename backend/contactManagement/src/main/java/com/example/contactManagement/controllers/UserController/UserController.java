package com.example.contactManagement.controllers.UserController;
import com.example.contactManagement.model.PhoneNumber;
import lombok.extern.slf4j.Slf4j;

import com.example.contactManagement.model.UserModel;
import com.example.contactManagement.service.UserService;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import static org.springframework.http.ResponseEntity.ok;

import static org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@Slf4j
@SuppressWarnings("unused")
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    public UserService userService;
    @PostMapping("/")
    public ResponseEntity<?> CreateUser(@RequestBody UserModel user) {
        ResponseEntity<?> savedUser = userService.CreateUser(user);
        return ResponseEntity.ok(savedUser);
    }
    @PostMapping("/login")
    public ResponseEntity<?> ValidateUser(@RequestBody UserModel user) {
        return userService.ValidateUser(user);
    }
    @PutMapping("/")
    public ResponseEntity<?> updateUser(@RequestBody UserModel user) {
        UserModel updatedUser = this.userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getContacts(@PathVariable String id) {
        List<UserModel> users = this.userService.getContactsByOrgId(id);
        System.out.println(id);
        return ResponseEntity.ok(users);
    }
    @DeleteMapping("/")
    ResponseEntity<?> deleteById(@RequestBody UserModel user) {
        return ResponseEntity.ok(this.userService.deleteContact(user));
    }

    @PostMapping(value = "/attachment", consumes = MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> handleFileUploadForm(@RequestPart("file") MultipartFile file) {
        System.out.println("handling request parts: {}"+ file);
        return userService.addAttachments(file);
    }
//    @PostMapping("/category/{role}")
    List<UserModel> getDataByCategory(String role,List<UserModel> data){
        if(role.equalsIgnoreCase("tmp")){
            return data;
        }
        List<UserModel> filteredContacts = new ArrayList<>();
        for (UserModel contact : data) {
            if (contact.getRole().equalsIgnoreCase(role)) {
                filteredContacts.add(contact);
            }
        }
        return filteredContacts;
    }
    @PostMapping("/category/{role}/search/{query}/filter/{type}")
    List<UserModel> searchFilter(@RequestBody UserModel user, @PathVariable String role, @PathVariable String query, @PathVariable String type){
        List<UserModel> contacts = this.userService.getContactsByOrgId(user.getCreatedBy());
//        System.out.println("data :"+role+","+query+","+type);
        if(query.equalsIgnoreCase("tmp") || type.equalsIgnoreCase("tmp")){
            return getDataByCategory(role,contacts);
        }
        List<UserModel> filteredContacts = new ArrayList<>();
        for (UserModel contact : contacts) {
            if(type.equalsIgnoreCase( "name")){
                if (contact.getName().toLowerCase().contains(query.toLowerCase())) {
                    filteredContacts.add(contact);
                }
            }
            else if(type.equalsIgnoreCase( "email")){
                if (contact.getName().toLowerCase().contains(query.toLowerCase())) {
                    filteredContacts.add(contact);
                }
            }
            else if(type.equalsIgnoreCase( "phonenumber")){
                for (PhoneNumber x: contact.getPhonenumber()) {
                    if(x.getNumber().toLowerCase().contains(query.toLowerCase())){
                        filteredContacts.add(contact);
                    }
                }
            }
        }

        return getDataByCategory(role,filteredContacts);
    }

}
