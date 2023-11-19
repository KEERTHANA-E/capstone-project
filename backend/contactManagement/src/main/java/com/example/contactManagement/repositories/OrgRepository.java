package com.example.contactManagement.repositories;


import com.example.contactManagement.model.OrgModel;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrgRepository extends MongoRepository<OrgModel, String> {
    List<OrgModel> findByEmail(String email);
}
