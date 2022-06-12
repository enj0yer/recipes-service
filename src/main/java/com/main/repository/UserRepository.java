package com.main.repository;

import com.main.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;


public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    User findByEmail(String email);

    @Procedure("change_ban_state")
    void changeBanState(Integer userId, Boolean state);
}
