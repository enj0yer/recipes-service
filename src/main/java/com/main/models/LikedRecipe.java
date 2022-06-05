package com.main.models;


public class LikedRecipe extends Recipe{
    private Boolean isLiked;

    public LikedRecipe(String name, String creatorName, String tags, String ingredients, Integer likes, Integer views, Integer comments, String data, Boolean isLiked){
        super(name, creatorName, tags, ingredients, likes, views, comments, data);
        this.isLiked = isLiked;
    }

    public LikedRecipe(Recipe recipe, Boolean isLiked){
        super(recipe.name, recipe.creatorName, recipe.tags, recipe.ingredients, recipe.likes, recipe.views, recipe.comments, recipe.data);
        this.isLiked = isLiked;
    }

    public LikedRecipe(){}

    public Boolean isLiked() {
        return isLiked;
    }

    public void setLiked(Boolean liked) {
        isLiked = liked;
    }
}
