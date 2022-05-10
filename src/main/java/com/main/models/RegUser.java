package com.main.models;

public class RegUser extends User{
    private String password_reply;

    public RegUser(){
        super();
    }

    public RegUser(String username, String email, String phoneNumber, String gender, Integer age, String password, String password_reply){
        super(username, email, phoneNumber, gender, age, password);
        this.password_reply = password_reply;
    }

    public User getModelUser(){
        return new User(super.username, super.email, super.phoneNumber, super.gender, super.age, super.password);
    }

    public String getPassword_reply() {
        return password_reply;
    }

    public void setPassword_reply(String password_reply) {
        this.password_reply = password_reply;
    }
}
