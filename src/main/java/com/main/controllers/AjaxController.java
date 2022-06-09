package com.main.controllers;

import com.main.AjaxResponse;
import com.main.models.*;
import com.main.repository.LikeRepository;
import com.main.repository.RecipeRepository;
import com.main.repository.SessionRepository;
import com.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AjaxController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RecipeRepository recipeRepository;
    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private SessionRepository sessionRepository;

    private Boolean searchLike(List<Like> likes, int userId, int recipeId){
        for (var like : likes){
            if (like.getLiked() && like.getRecipeId() == recipeId && like.getUserId() == userId){
                return true;
            }
        }
        return false;
    }

    @PostMapping(value = "/main")
    public AjaxResponse displayRecipes(@RequestParam("username") String username,
                                       @RequestParam(name = "search") String search) {
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
    public AjaxResponse incrementLike(@RequestParam("name") String recipe_name,
                                      @RequestParam("username") String username){
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
    public AjaxResponse decrementLike(@RequestParam("name") String recipe_name,
                                      @RequestParam("username") String username){
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
        List<Recipe> recipes;
        switch (sortBy){
            case "likes":
                recipes = recipeRepository.findAllSortByLikes();
                break;
            case "comments":
                recipes = recipeRepository.findAllSortByComments();
                break;
            case "views":
                recipes = recipeRepository.findAllSortByViews();
                break;
            default:
                ajaxResponse.setStatus("FAIL");
                return ajaxResponse;
        }
        ajaxResponse.setStatus("SUCCESS");
        ajaxResponse.setResult(recipes);

        return ajaxResponse;
    }

    @PostMapping("/loadRecipe")
    public AjaxResponse loadRecipe(@RequestParam("recipeName") String recipeName){
        AjaxResponse ajaxResponse = new AjaxResponse();

        Recipe recipe = recipeRepository.findByName(recipeName);

        if (recipe == null){
            ajaxResponse.setStatus("FAIL");
        }
        else{
            ajaxResponse.setStatus("SUCCESS");
            ajaxResponse.setResult(recipe);
        }

        return ajaxResponse;
    }

    @PostMapping("/logout")
    public AjaxResponse logout(@RequestParam("token") String token){
        AjaxResponse ajaxResponse = new AjaxResponse();

        if (token == null){
            ajaxResponse.setStatus("FAIL");
        }
        else{
            sessionRepository.deleteSession(token);
            ajaxResponse.setStatus("SUCCESS");
        }

        return ajaxResponse;
    }

    @PostMapping("/loadLiked")
    public AjaxResponse loadLiked(@RequestParam("sortBy") String sortBy,
                                  @RequestParam("username") String username){
        AjaxResponse ajaxResponse = new AjaxResponse();

        if (username == null){
            ajaxResponse.setStatus("FAIL");
            return ajaxResponse;
        }
        List<Recipe> recipes;
        switch (sortBy){
            case "likes":
                recipes = recipeRepository.findAllSortByLikes();
                break;
            case "comments":
                recipes = recipeRepository.findAllSortByComments();
                break;
            case "views":
                recipes = recipeRepository.findAllSortByViews();
                break;
            default:
                ajaxResponse.setStatus("FAIL");
                return ajaxResponse;
        }

        User user = userRepository.findByUsername(username);

        List<Like> likes = likeRepository.findByUserId(user.getId());

        List<LikedRecipe> likedRecipes = new ArrayList<>();

        for (var recipe : recipes){
            if (searchLike(likes, user.getId(), recipe.getId())){
                likedRecipes.add(new LikedRecipe(recipe, true));
            }
        }
        ajaxResponse.setStatus("SUCCESS");
        ajaxResponse.setResult(likedRecipes);

        return ajaxResponse;
    }


//    @PostMapping("/createRecipe")
//    public AjaxResponse createRecipe(UserRecipe userRecipe){
//        if (recipeRepository.findByName(userRecipe.getName()) != null){
//            return new AjaxResponse("FAIL", "Рецепт с таким именем уже существует");
//        }
//
//        userRecipe.getRecipeImage().
//
//
//    }
}
