package com.main.models;

import java.io.File;
import java.util.List;
import java.util.Map;

public class UserRecipe {
    private String name;
    private String shortDescription;
    private List<String> tags;
    private Map<String, String> ingredients;
    private String description;
    private File recipeImage;

    public UserRecipe(){}

    public UserRecipe(String name, String shortDescription, List<String> tags, Map<String, String> ingredients, String description, File recipeImage){
        this.name = name;
        this.shortDescription = shortDescription;
        this.tags = tags;
        this.ingredients = ingredients;
        this.description = description;
        this.recipeImage = recipeImage;
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

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public Map<String, String> getIngredients() {
        return ingredients;
    }

    public void setIngredients(Map<String, String> ingredients) {
        this.ingredients = ingredients;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public File getRecipeImage() {
        return recipeImage;
    }

    public void setRecipeImage(File recipeImage) {
        this.recipeImage = recipeImage;
    }
}
