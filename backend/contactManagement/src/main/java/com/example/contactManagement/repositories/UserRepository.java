package com.example.contactManagement.repositories;

import com.example.contactManagement.model.UserModel;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserRepository extends MongoRepository<UserModel, String> {
    @Query("{'name' : ?0}")
    List<UserModel> findByName(String name);
    @Query("{'email' : ?0}")
    List<UserModel> findByEmail(String email);
    @Query("{'phonenumber': ?0}")
    List<UserModel> findByPhonenumber(String phonenumber);
    @Query("{'role': ?0}")
    List<UserModel> findByRole(String role);
    @Query("{'company':?0}")
    List<UserModel> findByCompany(String company);

    @Query("{'createdBy' : ?0}")
    List<UserModel> findByCreatedBy(String createdBy);
}
