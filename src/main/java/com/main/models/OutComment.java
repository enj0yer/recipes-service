package com.main.models;


public class OutComment {

    private Integer id;
    private String userName;
    private Integer postId;
    private String text;

    public OutComment(){}

    public OutComment(Integer id, String userName, Integer postId, String text){
        this.id = id;
        this.userName = userName;
        this.postId = postId;
        this.text = text;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Integer getPostId() {
        return postId;
    }

    public void setPostId(Integer postId) {
        this.postId = postId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
