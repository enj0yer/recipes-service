package com.main.models;


import javax.persistence.*;

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

    @Column(nullable = false, length = 20000)
    protected String data;

    public Recipe() {}

    public Recipe(String name, String tags, Integer likes, String data) {
        this.name = name;
        this.tags = tags;
        this.likes = likes;
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
}
