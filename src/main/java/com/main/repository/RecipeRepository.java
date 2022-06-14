package com.main.repository;

import com.main.models.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;

import java.util.List;


public interface RecipeRepository extends JpaRepository<Recipe, Integer>{

    Recipe findByName(String name);

    @Query("from recipes where (name like ?1% or tags like %?2%) and is_moderated = 0")
    List<Recipe> findByNameAndTags(String searchName, String searchTags);

    @Procedure("increment_recipe_likes")
    void incrementRecipeLikes(Integer id);

    @Procedure("decrement_recipe_likes")
    void decrementRecipeLikes(Integer id);

    @Query("from recipes where is_moderated = 0 order by likes desc")
    List<Recipe> findAllSortByLikes();

    @Query("from recipes where is_moderated = 0 order by views desc")
    List<Recipe> findAllSortByViews();

    @Query("from recipes where is_moderated = 0 order by comments desc")
    List<Recipe> findAllSortByComments();

    @Procedure("increase_views")
    void increaseViews(Integer id);

    @Query("from recipes where is_moderated = 1")
    List<Recipe> findAllOnModeration();

    @Procedure("set_moderated_state")
    void setModeratedState(Integer id, Boolean state);

    @Query("from recipes where creator_name = ?1 and is_moderated = 0 order by likes desc")
    List<Recipe> findByCreatorNameSortByLikes(String creatorName);

    @Query("from recipes where creator_name = ?1 and is_moderated = 0 order by views desc")
    List<Recipe> findByCreatorNameSortByViews(String creatorName);

    @Query("from recipes where creator_name = ?1 and is_moderated = 0 order by comments desc")
    List<Recipe> findByCreatorNameSortByComments(String creatorName);

    @Procedure("increase_comments")
    void increaseComments(Integer recipeId);

    @Procedure("decrease_comments")
    void decreaseComments(Integer recipeId);

}
