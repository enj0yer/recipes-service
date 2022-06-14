package com.main.repository;

import com.main.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;


public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);

    User findByEmail(String email);

    @Procedure("change_ban_state")
    void changeBanState(Integer userId, Boolean state);

    @Query("from users where username like ?1 and email like ?2 and is_admin = 0 order by username asc")
    List<User> findAllSortByUsername(String username, String email);

    @Query("from users where username like ?1 and email like ?2 and is_admin = 0 order by email asc")
    List<User> findAllSortByEmail(String username, String email);

    @Query("from users where username like ?1 and email like ?2 and is_admin = 0 order by phone_number asc")
    List<User> findAllSortByPhoneNumber(String username, String email);

}
