package com.main.models;

import com.google.gson.Gson;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public class UserRecipe {
    private String name;
    private String shortDescription;
    private String  tags;
    private String ingredients;
    private String description;
    private MultipartFile recipeImage;
    private String creatorName;
    private Boolean updatePhoto;
    private String recipeOldName;

    public UserRecipe(){}

    public UserRecipe(String name, String shortDescription, String tags, String ingredients, String description, MultipartFile recipeImage, String creatorName, Boolean updatePhoto, String recipeOldName){
        this.name = name;
        this.shortDescription = shortDescription;
        this.tags = tags;
        this.ingredients = ingredients;
        this.description = description;
        this.recipeImage = recipeImage;
        this.creatorName = creatorName;
        this.updatePhoto = updatePhoto;
        this.recipeOldName = recipeOldName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
    }

    @Deprecated
    public String getIngredients() {
        return ingredients;
    }

    public void setIngredients(String ingredients) {
        this.ingredients = ingredients;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public String getRecipeOldName() {
        return recipeOldName;
    }

    public void setRecipeOldName(String recipeOldName) {
        this.recipeOldName = recipeOldName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getUpdatePhoto() {
        return updatePhoto;
    }

    public void setUpdatePhoto(Boolean updatePhoto) {
        this.updatePhoto = updatePhoto;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MultipartFile getRecipeImage() {
        return recipeImage;
    }

    public void setRecipeImage(MultipartFile recipeImage) {
        this.recipeImage = recipeImage;
    }

    public Map<String, String> getConvertedIngredients(){
        Gson g = new Gson();
        return g.fromJson(ingredients, Map.class);
    }

    public void setConvertedIngredients(Map<String, String> ingredients){
        Gson g = new Gson();
        this.ingredients = g.toJson(ingredients);
    }
}
