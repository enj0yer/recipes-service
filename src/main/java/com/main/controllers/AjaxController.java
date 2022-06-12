package com.main.controllers;

import com.google.gson.Gson;
import com.main.AjaxResponse;
import com.main.models.*;
import com.main.repository.LikeRepository;
import com.main.repository.RecipeRepository;
import com.main.repository.SessionRepository;
import com.main.repository.UserRepository;
import net.bytebuddy.utility.RandomString;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.commons.CommonsMultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@RestController
public class AjaxController {

    @Value("${recipes.images.upload.path}")
    private String recipesImagesUploadPath;

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

    @PostMapping("/loadAdded")
    public AjaxResponse loadAdded(@RequestParam("sortBy") String sortBy, @RequestParam("username") String username){

        AjaxResponse ajaxResponse = new AjaxResponse();

        if (username == null){
            ajaxResponse.setStatus("FAIL");
            return ajaxResponse;
        }
        List<Recipe> recipes;
        switch (sortBy){
            case "likes":
                recipes = recipeRepository.findByCreatorNameSortByLikes(username);
                break;
            case "comments":
                recipes = recipeRepository.findByCreatorNameSortByComments(username);
                break;
            case "views":
                recipes = recipeRepository.findByCreatorNameSortByViews(username);
                break;
            default:
                ajaxResponse.setStatus("FAIL");
                return ajaxResponse;
        }

        ajaxResponse.setStatus("SUCCESS");
        ajaxResponse.setResult(recipes);
        return ajaxResponse;
    }

    @Transactional
    @PostMapping("/createRecipe")
    public AjaxResponse createRecipe(UserRecipe userRecipe) throws IOException {
        if (recipeRepository.findByName(userRecipe.getName()) != null){
            return new AjaxResponse("FAIL", "Рецепт с таким именем уже существует");
        }

        MultipartFile recipeFile = userRecipe.getRecipeImage();

        System.out.println(userRecipe.getConvertedIngredients());

        System.out.println(recipeFile.getName());

        String[] parsedOriginalFilename = recipeFile.getOriginalFilename().split("\\.");

        String extension = parsedOriginalFilename[parsedOriginalFilename.length - 1];

        String fileName = RandomString.make(32) + "." + extension;

        userRecipe.getRecipeImage().transferTo(new File(recipesImagesUploadPath + fileName));

        Recipe newRecipe = Recipe.createRecipe(userRecipe, fileName);

        recipeRepository.save(newRecipe);

        return new AjaxResponse("SUCCESS", null);
    }

    @PostMapping("/moderateList")
    public AjaxResponse moderateList(){
        AjaxResponse ajaxResponse = new AjaxResponse();

        List<Recipe> recipesForModeration = recipeRepository.findAllOnModeration();

        ajaxResponse.setStatus("SUCCESS");
        ajaxResponse.setResult(recipesForModeration);

        return ajaxResponse;
    }

    @Transactional
    @PostMapping("/commitRecipeById")
    public AjaxResponse commitRecipeById(@RequestParam("recipeId") Integer recipeId){
        AjaxResponse ajaxResponse = new AjaxResponse();
        recipeRepository.setModeratedState(recipeId, false);
        ajaxResponse.setStatus("SUCCESS");
        return ajaxResponse;
    }

    @Transactional
    @PostMapping("/commitRecipeByName")
    public AjaxResponse commitRecipeByName(@RequestParam("recipeName") String recipeName){
        AjaxResponse ajaxResponse = new AjaxResponse();
        Integer recipeId = recipeRepository.findByName(recipeName).getId();
        return commitRecipeById(recipeId);
    }

    @Transactional
    @PostMapping("/deleteRecipeByName")
    public AjaxResponse deleteRecipeByName(@RequestParam("recipeName") String recipeName) throws IOException {
        AjaxResponse ajaxResponse = new AjaxResponse();
        Integer recipeId = recipeRepository.findByName(recipeName).getId();
        return deleteRecipeById(recipeId);
    }

    @Transactional
    @PostMapping("/deleteRecipeById")
    public AjaxResponse deleteRecipeById(@RequestParam("recipeId") Integer recipeId) throws IOException {
        AjaxResponse ajaxResponse = new AjaxResponse();
        Recipe recipe = recipeRepository.getById(recipeId);
        Gson g = new Gson();
        String imageName = (String) g.fromJson(recipe.getData(), Map.class).get("imageName");
        recipeRepository.deleteById(recipeId);
        Files.deleteIfExists(Paths.get(recipesImagesUploadPath + imageName));
        ajaxResponse.setStatus("SUCCESS");
        return ajaxResponse;
    }

    @Transactional
    @PostMapping("/saveRecipeUpdates")
    public AjaxResponse saveRecipeUpdates(UserRecipe userRecipe) throws IOException {
        if (!Objects.equals(userRecipe.getName(), userRecipe.getRecipeOldName()) && recipeRepository.findByName(userRecipe.getName()) != null){
            return new AjaxResponse("FAIL", "Рецепт с таким именем уже существует");
        }
        Recipe oldRecipe = recipeRepository.findByName(userRecipe.getRecipeOldName());
        Gson g = new Gson();
        Map<String, String> oldRecipeData = g.fromJson(oldRecipe.getData(), Map.class);
        String fileName = "";

        if (userRecipe.getUpdatePhoto()){
            MultipartFile recipeFile = userRecipe.getRecipeImage();
            String[] parsedOriginalFilename = recipeFile.getOriginalFilename().split("\\.");
            String extension = parsedOriginalFilename[parsedOriginalFilename.length - 1];
            fileName = RandomString.make(32) + "." + extension;
            userRecipe.getRecipeImage().transferTo(new File(recipesImagesUploadPath + fileName));
            Files.deleteIfExists(Paths.get(recipesImagesUploadPath + oldRecipeData.get("imageName")));
        }
        else {
            fileName = oldRecipeData.get("imageName");
        }
        Recipe newRecipe = Recipe.createRecipe(userRecipe, fileName);
        newRecipe.setId(oldRecipe.getId());
        recipeRepository.save(newRecipe);

        return new AjaxResponse("SUCCESS", null);
    }

    @PostMapping("/loadModerateRecipeData")
    public AjaxResponse loadModerateRecipeData(@RequestParam("recipeName") String recipeName){

        Recipe recipe = recipeRepository.findByName(recipeName);
        if (recipe != null){
            return new AjaxResponse("SUCCESS", recipe);
        }

        return new AjaxResponse("FAIL", "Рецепт не найден");

    }

    @Transactional
    @PostMapping("/banUser")
    public AjaxResponse banUser(@RequestParam("username") String username){
        AjaxResponse ajaxResponse = new AjaxResponse();
        User user = userRepository.findByUsername(username);
        userRepository.changeBanState(user.getId(), !user.isBanned());

        Session session = sessionRepository.findByUsername(username);

        if (session != null){
            sessionRepository.deleteById(session.getId());
        }

        ajaxResponse.setStatus("SUCCESS");

        return ajaxResponse;
    }


    @Transactional
    @PostMapping("/unbanUser")
    public AjaxResponse unbanUser(@RequestParam("username") String username){
        AjaxResponse ajaxResponse = new AjaxResponse();
        User user = userRepository.findByUsername(username);

        userRepository.changeBanState(user.getId(), !user.isBanned());

        ajaxResponse.setStatus("SUCCESS");

        return ajaxResponse;
    }
    
}
