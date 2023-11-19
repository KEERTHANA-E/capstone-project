package com.example.contactManagement.controllers.OrgController;

import com.example.contactManagement.model.OrgModel;
import com.example.contactManagement.service.OrgService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/org")
@CrossOrigin(origins = "http://localhost:4200")
public class OrgController {
    @Autowired
    public OrgService orgService;

    @GetMapping("/getall")
    public ResponseEntity<?> getOrgs(){
        return ResponseEntity.ok(this.orgService.getOrgData());
    }
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody OrgModel user){
        return ResponseEntity.ok(this.orgService.registerUser(user));
    }
}
