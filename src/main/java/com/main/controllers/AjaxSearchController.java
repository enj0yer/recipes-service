package com.main.controllers;

import com.main.AjaxResponse;
import com.main.models.Like;
import com.main.models.LikedRecipe;
import com.main.models.Recipe;
import com.main.models.User;
import com.main.repository.LikeRepository;
import com.main.repository.RecipeRepository;
import com.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AjaxSearchController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    private LikeRepository likeRepository;

    private Boolean searchLike(List<Like> likes, int userId, int recipeId){
        for (var like : likes){
            if (like.getLiked() && like.getRecipeId() == recipeId && like.getUserId() == userId){
                return true;
            }
        }
        return false;
    }

    @PostMapping(value = "/main")
    public AjaxResponse displayRecipes(@RequestParam("username") String username, @RequestParam(name = "search") String search) {
        AjaxResponse ajaxResponse = new AjaxResponse();
        if (search.length() > 64){
            ajaxResponse.setStatus("FAIL");
            ajaxResponse.setResult("Слишком длинный поисковой запрос");
        }

        List<Recipe> recipes = recipeRepository.findByNameAndTags(search, search);


        if (recipes.size() == 0){
            ajaxResponse.setStatus("FAIL");
            ajaxResponse.setResult("По запросу " + search + " ничего не найдено");
        }
        else{
            User user = userRepository.findByUsername(username);
            List<Like> likes = likeRepository.findByUserId(user.getId());
            List<LikedRecipe> likedRecipes = new ArrayList<>();

            for(var recipe : recipes){
                likedRecipes.add(new LikedRecipe(recipe, searchLike(likes, user.getId(), recipe.getId())));
            }
            ajaxResponse.setStatus("SUCCESS");
            ajaxResponse.setResult(likedRecipes);

        }

        return ajaxResponse;
    }

    @PostMapping(value = "/likeInc")
    @Transactional
    public AjaxResponse incrementLike(@RequestParam("name") String recipe_name, @RequestParam("username") String username){
        AjaxResponse ajaxResponse = new AjaxResponse();
        User user = userRepository.findByUsername(username);
        Recipe recipe = recipeRepository.findByName(recipe_name);
        likeRepository.save(new Like(user.getId(), recipe.getId(), true));
        recipeRepository.incrementRecipeLikes(recipe.getId());

        ajaxResponse.setStatus("SUCCESS");
        return ajaxResponse;
    }

    @PostMapping(value = "/likeDec")
    @Transactional
    public AjaxResponse decrementLike(@RequestParam("name") String recipe_name, @RequestParam("username") String username){
        AjaxResponse ajaxResponse = new AjaxResponse();
        User user = userRepository.findByUsername(username);
        Recipe recipe = recipeRepository.findByName(recipe_name);
        likeRepository.deleteLike(recipe.getId(), user.getId());

        recipeRepository.decrementRecipeLikes(recipe.getId());

        ajaxResponse.setStatus("SUCCESS");
        return ajaxResponse;
    }

    @PostMapping(value = "/best")
    @Transactional
    public AjaxResponse loadBest(@RequestParam("sortBy") String sortBy){
        AjaxResponse ajaxResponse = new AjaxResponse();
        List<Recipe> recipes = recipeRepository.findAllSortBy(sortBy);

        ajaxResponse.setStatus("SUCCESS");
        ajaxResponse.setResult(recipes);

        return ajaxResponse;
    }

}
