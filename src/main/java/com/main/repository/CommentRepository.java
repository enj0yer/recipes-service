package com.main.repository;

import com.main.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Integer> {

    @Query("from comments where recipe_id = ?1")
    List<Comment> findAllByRecipeId(Integer recipeId);

    @Procedure("delete_all_by_recipe_id")
    void deleteAllByRecipeId(Integer recipeId);


}
