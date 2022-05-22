package com.main.repository;

import com.main.models.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;


public interface RecipeRepository extends JpaRepository<Recipe, Integer>{

    Recipe findByName(String name);

    @Query("from recipes where name like ?1% or tags like %?2%")
    List<Recipe> findByNameAndTags(String searchName, String searchTags);

    @Procedure("increment_recipe_likes")
    void incrementRecipeLikes(Integer id);

    @Procedure("decrement_recipe_likes")
    void decrementRecipeLikes(Integer id);

    @Query("from recipes order by ?1 asc")
    List<Recipe> findAllSortBy(String sortBy);
}
