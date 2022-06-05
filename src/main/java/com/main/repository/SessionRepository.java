package com.main.repository;

import com.main.models.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;

public interface SessionRepository extends JpaRepository<Session, Integer> {
    Session findByToken(String token);
    Session findByUsername(String username);

    @Procedure("delete_session")
    void deleteSession(String token);
}
