package com.main.controllers;

import com.main.AjaxResponse;
import com.main.models.Session;
import com.main.models.User;
import com.main.repository.SessionRepository;
import com.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;


@Controller
public class MainController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @GetMapping("/main")
    public ModelAndView main(@RequestParam(required = false, name = "token") String token) {
        ModelAndView modelAndView = new ModelAndView();
        if (token == null) {
            modelAndView.setViewName("redirect:/login");
        } else {
            Session session = sessionRepository.findByToken(token);
            if (session != null) {
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);
                modelAndView.setViewName("main");
            } else {
                modelAndView.setViewName("redirect:/login");
            }
        }
        return modelAndView;
    }

    @GetMapping("/main/profile")
    public ModelAndView profile(@RequestParam(required = false, name = "token") String token){
        ModelAndView modelAndView = new ModelAndView();
        if (token == null){
            modelAndView.setViewName("redirect:/login");
        }
        else{
            Session session = sessionRepository.findByToken(token);

            if (session != null){
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);
                modelAndView.setViewName("profile");
            }
            else{
                modelAndView.setViewName("redirect:/login");
            }
        }
        return modelAndView;
    }

    @GetMapping("/main/")
    public ModelAndView newRecipe(@RequestParam(required = false, name = "token") String token){
        ModelAndView modelAndView = new ModelAndView();
        if (token == null){
            modelAndView.setViewName("redirect:/login");
        }
        else{
            Session session = sessionRepository.findByToken(token);

            if (session != null){
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);
                modelAndView.setViewName("profile");
            }
            else{
                modelAndView.setViewName("redirect:/login");
            }
        }
        return modelAndView;
    }


}