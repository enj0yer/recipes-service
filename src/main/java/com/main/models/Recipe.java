package com.main.models;


import com.google.gson.Gson;

import javax.persistence.*;
import java.util.*;

@Entity(name = "recipes")
public class Recipe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Integer id;

    @Column(nullable = false)
    protected String name;

    @Column(nullable = false)
    protected String creatorName;

    @Column(nullable = false)
    protected String tags;

    @Column(nullable = false)
    protected String ingredients;

    @Column(nullable = false)
    protected Integer likes;

    @Column(nullable = false)
    protected Integer views;

    @Column(nullable = false)
    protected Integer comments;

    @Column(nullable = false, columnDefinition = "boolean default false")
    protected Boolean isModerated;

    @Column(nullable = false, columnDefinition = "text", length = 20000)
    protected String data;

    public Recipe() {}

    public Recipe(String name, String creatorName, String tags, String ingredients, Integer likes, Integer views, Integer comments, Boolean isModerated, String data) {
        this.name = name;
        this.creatorName = creatorName;
        this.tags = tags;
        this.ingredients = ingredients;
        this.likes = likes;
        this.views = views;
        this.comments = comments;
        this.isModerated = isModerated;
        this.data = data;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTags() {
        return tags;
    }

    public Boolean getModerated() {
        return isModerated;
    }

    public void setModerated(Boolean moderated) {
        isModerated = moderated;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    public String getData() {
        return data;
    }

    public void setData(String data) {
        this.data = data;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public Integer getViews() {
        return views;
    }

    public void setViews(Integer views) {
        this.views = views;
    }

    public Integer getComments() {
        return comments;
    }

    public void setComments(Integer comments) {
        this.comments = comments;
    }

    public static Recipe createRecipe(UserRecipe userRecipe, String recipeImageName){
        Recipe recipe = new Recipe();

        Gson g = new Gson();

        //Adding name
        recipe.name = userRecipe.getName().trim();
        //

        //Adding creator name
        recipe.creatorName = userRecipe.getCreatorName().trim();
        //

        //Adding tags for search
        StringBuilder searchTags = new StringBuilder();
        List<String> tags = g.fromJson(userRecipe.getTags(), List.class);

        for (int i = 0; i < tags.size(); i++){
            if (i != 0) searchTags.append("//");
            searchTags.append(tags.get(i).trim());
        }
        recipe.tags = searchTags.toString();
        //

        //Converting JSON ingredients to map
        Map<String, String> mapIngredients = userRecipe.getConvertedIngredients();

        //Adding ingredients for search
        StringBuilder searchIngredients = new StringBuilder();
        String[] ingredientsArray = mapIngredients.keySet().toArray(String[]::new);
        for (int i = 0; i < ingredientsArray.length; i++){
            if (i != 0) searchIngredients.append("//");
            searchIngredients.append(ingredientsArray[i]);
        }
        recipe.ingredients = searchIngredients.toString();
        //

        //Creating String representation of ingredients
//        StringBuilder recipeDataIngredients = new StringBuilder();

//        for (int i = 0; i < ingredientsArray.length; i++){
//            if (i != 0 ) recipeDataIngredients.append("\\");
//            recipeDataIngredients.append(ingredientsArray[i]).append(" - ").append(mapIngredients.get(ingredientsArray[i]));
//        }
        //

        //Creating String representation of main recipe description
        String description = userRecipe.getDescription().replace("\n", "//")
                                                        .replace("\r", "");
        //



        recipe.likes = 0;
        recipe.views = 0;
        recipe.comments = 0;
        recipe.isModerated = true;

        Map<String, String> recipeData = new HashMap<>();

        recipeData.put("imageName", recipeImageName);
        recipeData.put("previewText", userRecipe.getShortDescription());
        recipeData.put("ingredients", g.toJson(mapIngredients));
        recipeData.put("description", description);



        recipe.data = g.toJson(recipeData);

        return recipe;
    }
}
