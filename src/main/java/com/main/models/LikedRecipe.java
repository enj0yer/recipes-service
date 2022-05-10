package com.main.models;


public class LikedRecipe extends Recipe{
    private Boolean isLiked;

    public LikedRecipe(String name, String tags, Integer likes, String data, Boolean isLiked){
        super(name, tags, likes, data);
        this.isLiked = isLiked;
    }

    public LikedRecipe(Recipe recipe, Boolean isLiked){
        super(recipe.name, recipe.tags, recipe.likes, recipe.data);
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
