package com.example.contactManagement.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.*;

import com.example.contactManagement.model.History;
import com.example.contactManagement.model.ResponseModel.FileUpload;
import com.example.contactManagement.model.UserModel;
import com.example.contactManagement.model.ResponseModel.Response;
import com.example.contactManagement.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import static org.springframework.http.ResponseEntity.ok;


@NoArgsConstructor
@AllArgsConstructor
@Service
public class UserService {
    @Autowired
    public UserRepository userRepository;

    /***
     * get all contacts request
     * @return List of Contacts
     */
    public List<UserModel> getAllContacts() {
        return this.userRepository.findAll();
    }

    public ResponseEntity<?> ValidateUser(UserModel user) {
        List<UserModel> allUsers = this.userRepository.findByCreatedBy(user.getCreatedBy());
        for (UserModel x : allUsers) {
            if ((user.getEmail().equals(x.getEmail())) && (user.getPassword().equals(x.getPassword()))) {
                List<History> prevHistory = x.getHistory();
                if (prevHistory == null) {
                    prevHistory = new ArrayList<>(); // Initialize an empty list if tmp is null
                }
                History newHistory = new History();
                newHistory.setType("login");
                newHistory.setContent("login successfully");
                newHistory.setTimestamp();
                prevHistory.add(newHistory);
                x.setHistory(prevHistory);
                return ResponseEntity.ok(x);
            }
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public List<UserModel> getContactsByOrgId(String id) {
        return this.userRepository.findByCreatedBy(id);
    }

    public ResponseEntity<?> CreateUser(UserModel contact) {
        List<UserModel> allUsers = userRepository.findAll();
        for (UserModel x : allUsers) {
            if (x.getName().equals(contact.getName()) || x.getEmail().equals(contact.getEmail())) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        List<History> prevHistory = contact.getHistory();
        if (prevHistory == null) {
            prevHistory = new ArrayList<>(); // Initialize an empty list if tmp is null
        }
        History newHistory = new History();
        newHistory.setType("new");
        newHistory.setContent("Welcome to our Contact application, your account is created successfully");
        newHistory.setTimestamp();
        prevHistory.add(newHistory);
        contact.setHistory(prevHistory);
        return ResponseEntity.ok(this.userRepository.save(contact));
    }

    public UserModel updateUser(UserModel contact) {

//        System.out.println("object Id " + contact.get_id());
        UserModel contactToEdit = this.userRepository.findById(contact.get_id()).get();
        List<History> prevHistory = contactToEdit.getHistory();
        if (prevHistory == null) {
            prevHistory = new ArrayList<>(); // Initialize an empty list if tmp is null
        }
        History newHistory = new History();
        newHistory.setType("update");
        String name = contactToEdit.getName();
        newHistory.setContent(name + " Account details has been updated");
        newHistory.setTimestamp();
        prevHistory.add(newHistory);

        if (contactToEdit.getPhonenumber().size() > contact.getPhonenumber().size()) {
            History newHistory2 = new History();
            newHistory2.setType("remove");
            newHistory2.setContent("You have delete one of your phone number");
            newHistory.setTimestamp();
            prevHistory.add(newHistory2);
        }
        contactToEdit.setName(contact.getName());
        contactToEdit.setEmail(contact.getEmail());
        contactToEdit.setRole(contact.getRole());
        contactToEdit.setNotes(contact.getNotes());
        contactToEdit.setPhonenumber(contact.getPhonenumber());
        contactToEdit.setHistory(prevHistory);

        this.userRepository.save(contactToEdit);
//        System.out.println("updated");
        return contactToEdit;
    }

    public Response deleteContact(UserModel contact) {
        UserModel ContactTmp = this.userRepository.findById(contact.get_id()).get();
        this.userRepository.delete(ContactTmp);
        Response response = new Response();
        response.setMessage("success");
        response.setResponse(contact);
        return response;
    }

    public ResponseEntity<Map<String, String>> addAttachments(MultipartFile file) {
        try {
            FileUpload fileUpload = saveFileToDirectory(file);
            System.out.println("fileName : "+ fileUpload.getFileName());
            System.out.println("fileUrl : "+ fileUpload.getFileUrl());
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String userInfoJson = request.getParameter("userInfo");

            // Convert JSON string to UserInfo object
//            ObjectMapper mapper = new ObjectMapper();
//            UserModel userInfo = mapper.readValue(userInfoJson, UserModel.class);
            UserModel userEdit = userRepository.findById(userInfoJson).get();

            List<FileUpload> tmp = userEdit.getAttachments();
            if (tmp == null) {
                tmp = new ArrayList<>(); // Initialize an empty list if tmp is null
            }
            tmp.add(fileUpload);
            System.out.println("after appending" + tmp.size());
            userEdit.setAttachments(tmp);

            // update history
            List<History> prevHistory = userEdit.getHistory();
            if (prevHistory == null) {
                prevHistory = new ArrayList<>(); // Initialize an empty list if tmp is null
            }
            History newHistory = new History();
            newHistory.setType("file");
            newHistory.setContent("new attachments has been added");
            newHistory.setTimestamp();
            prevHistory.add(newHistory);
            userEdit.setHistory(prevHistory);
            userRepository.save(userEdit);

            var result = Map.of(
                    "fileName", Objects.requireNonNull(file.getOriginalFilename()),
                    "fileUrl", fileUpload.getFileUrl()
            );
            return ok().body(result);
        } catch (IOException e) {
            System.out.println("e"+e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private FileUpload saveFileToDirectory(MultipartFile file) throws IOException {
        File f = new ClassPathResource("").getFile();
        final Path path = Paths.get(f.getAbsolutePath() + File.separator + "static" + File.separator + "image");

        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        Path filePath = path.resolve(file.getOriginalFilename());
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String newFilename = timestamp + "_" + file.getOriginalFilename();
        Path newFilePath = path.resolve(newFilename);
        Files.copy(file.getInputStream(), newFilePath, StandardCopyOption.REPLACE_EXISTING);
        System.out.println(file.getInputStream());
        String fileUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/image/")
                .path(newFilename)
                .toUriString();
        FileUpload result = new FileUpload();
        result.setFileUrl(fileUri);
        result.setFileName(file.getOriginalFilename());
        return result;
    }

}
