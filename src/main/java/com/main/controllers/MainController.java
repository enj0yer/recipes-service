package com.main.controllers;

import com.main.AjaxResponse;
import com.main.models.Recipe;
import com.main.models.Session;
import com.main.models.User;
import com.main.repository.RecipeRepository;
import com.main.repository.SessionRepository;
import com.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.xml.ws.Service;


@Controller
public class MainController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private RecipeRepository recipeRepository;

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

    @GetMapping("/main/newRecipe")
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
                modelAndView.setViewName("newRecipe");
            }
            else{
                modelAndView.setViewName("redirect:/login");
            }
        }
        return modelAndView;
    }

    @GetMapping("/main/liked")
    public ModelAndView liked(@RequestParam(required = false, name = "token") String token){
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
                modelAndView.setViewName("liked");
            }
            else{
                modelAndView.setViewName("redirect:/login");
            }
        }
        return modelAndView;
    }

    @GetMapping("/best")
    @Transactional
    public ModelAndView best(@RequestParam(required = false, name = "token") String token){
        ModelAndView modelAndView = new ModelAndView("best");
        if (token != null){
            Session session = sessionRepository.findByToken(token);

            if (session != null){
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);
            }
        }
        return modelAndView;
    }

    @GetMapping("/recipe")
    public ModelAndView recipe(@RequestParam(required = false, name = "token") String token,
                               @RequestParam(required = false, name = "recipeName") String recipeName,
                               @RequestParam(required = false, name = "from") String from){
        ModelAndView modelAndView = new ModelAndView();

        Recipe recipe = recipeRepository.findByName(recipeName);

        if (recipe == null){
            if (token == null){
                modelAndView.setViewName("redirect:/");
            }
            else {
                modelAndView.setViewName("redirect:/main?token=" + token);
            }
            return modelAndView;
        }
        else{
            if (recipe.getModerated()){
                modelAndView.setViewName("redirect:/main?token=" + token);
            }
            else{
                recipeRepository.increaseViews(recipe.getId());
                modelAndView.addObject("recipeName", recipeName);
                modelAndView.addObject("from", from);
            }
        }

        if (token != null){
            Session session = sessionRepository.findByToken(token);

            if (session != null){
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);
            }
        }
        return modelAndView;
    }

    @GetMapping("/moderate")
    public ModelAndView moderate(@RequestParam(required = false, name = "token") String token){
        ModelAndView modelAndView = new ModelAndView("moderate");

        if (token != null){
            Session session = sessionRepository.findByToken(token);

            if (session != null){
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);

                if (!isAdmin){
                    modelAndView.setViewName("redirect:main?token" + token);
                }
            }
        }
        else{
            modelAndView.setViewName("redirect:/login");
        }

        return modelAndView;
    }

    @GetMapping("/updateRecipe")
    public ModelAndView updateRecipe(@RequestParam(required = false, name = "token") String token,
                                     @RequestParam(required = false, name = "recipeName") String recipeName){

        ModelAndView modelAndView = new ModelAndView("updateRecipe");

        if (token != null){
            Session session = sessionRepository.findByToken(token);

            if (session != null){
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);

                if (!isAdmin){
                    modelAndView.setViewName("redirect:/main?token" + token);
                }

                Recipe recipe = recipeRepository.findByName(recipeName);
                if (recipe != null) {
                    modelAndView.addObject("recipeName", recipeName);
                }
                else{
                    modelAndView.setViewName("redirect:/moderate?token=" + token);
                }
            }
        }
        else{
            modelAndView.setViewName("redirect:/login");
        }

        return modelAndView;

    }

    @GetMapping("/user")
    public ModelAndView userPage(@RequestParam(required = false, name = "token") String token,
                                 @RequestParam(required = false, name = "username") String username){

        ModelAndView modelAndView = new ModelAndView();

        User user = userRepository.findByUsername(username);

        if (user == null){
            if (token == null){
                modelAndView.setViewName("redirect:/");
            }
            else {
                modelAndView.setViewName("redirect:/main?token=" + token);
            }
            return modelAndView;
        }
        else{
            modelAndView.addObject("profileUsername", user.getUsername());
        }

        if (token != null){
            Session session = sessionRepository.findByToken(token);

            if (session != null){
                Boolean isAdmin = userRepository.findByUsername(session.getUsername()).isAdmin();
                modelAndView.addObject("username", session.getUsername());
                modelAndView.addObject("token", session.getToken());
                modelAndView.addObject("isAdmin", isAdmin);
                modelAndView.addObject("isBanned", user.isBanned());
                modelAndView.setViewName("user");
            }
            else{
                modelAndView.setViewName("redirect:/login");
            }
        }
        return modelAndView;
    }

    @GetMapping("/userList")
    public ModelAndView userList(@RequestParam(required = false, name = "token") String token){

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
                modelAndView.setViewName("userList");
            }
            else{
                modelAndView.setViewName("redirect:/login");
            }
        }
        return modelAndView;
    }
}