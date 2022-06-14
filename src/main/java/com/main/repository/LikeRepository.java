package com.main.repository;

import com.main.models.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LikeRepository extends JpaRepository<Like, Integer> {

    List<Like> findByUserId(Integer userId);

    @Procedure("delete_like")
    void deleteLike(@Param("recipe_id") Integer recipeId, @Param("user_id") Integer userId);

    @Procedure("delete_all_recipe_likes")
    void deleteAllRecipeLikes(Integer recipeId);
}
