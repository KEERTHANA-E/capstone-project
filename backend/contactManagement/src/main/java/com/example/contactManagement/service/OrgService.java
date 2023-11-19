package com.example.contactManagement.service;

import com.example.contactManagement.model.ResponseModel.Response;
import com.example.contactManagement.model.OrgModel;
import com.example.contactManagement.repositories.OrgRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@NoArgsConstructor
@AllArgsConstructor
@Service
public class OrgService {
    @Autowired
    public OrgRepository orgRepository;
    public Response getOrgData(){
        Response response = new Response();
        List<OrgModel> org = this.orgRepository.findAll();
        response.setMessage("all organisation data");
        response.setResponse(org);
        return response;
    }
    public Response registerUser(OrgModel user){
        Response response = new Response();
        this.orgRepository.save(user);
        response.setMessage("register success");
        response.setResponse(user);
        return response;
    }
}
