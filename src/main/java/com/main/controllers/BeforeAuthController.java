package com.main.controllers;


import com.main.models.RegUser;
import com.main.models.Session;
import com.main.models.User;
import com.main.repository.SessionRepository;
import com.main.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import java.util.ArrayList;
import java.util.List;


@Controller
public class BeforeAuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SessionRepository sessionRepository;

    private boolean checkEmptyString(String... strings){
        for (var str : strings){
            if (str == null || str.equals("")) return true;
        }
        return false;
    }

    private boolean validateUser(String username, String password){

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        User user = userRepository.findByUsername(username);

        if (user == null) return false;

        return passwordEncoder.matches(password, user.getPassword());
    }

    private boolean checkUsername(String username){

        User user = userRepository.findByUsername(username);

        return user != null;
    }

    private boolean checkEmail(String email){
        User user = userRepository.findByEmail(email);

        return user != null;
    }


    @GetMapping(value = "/")
    public ModelAndView index(){
        return new ModelAndView("index");
    }

    @GetMapping("/login")
    public ModelAndView loginGet(@RequestParam(required = false, name = "isValid", defaultValue = "true") String isValid,
                                 @RequestParam(required = false, name = "info", defaultValue = "") String info){
        ModelAndView modelAndView = new ModelAndView("login");
        modelAndView.addObject("isValid", Boolean.valueOf(isValid));
        modelAndView.addObject("info", info);
        return modelAndView;
    }

    @PostMapping("/login")
    public ModelAndView loginPost(@RequestParam String username, @RequestParam String password){
        ModelAndView modelAndView = new ModelAndView();
        if (checkEmptyString(username, password) || !validateUser(username, password)){
            modelAndView.setViewName("redirect:/login");
            modelAndView.addObject("isValid", false);
        }
        else{
            Session currSession = sessionRepository.findByUsername(username);
            String token;
            if (currSession == null){
                token = BCrypt.gensalt(31);
                Session session = new Session(username, token);
                sessionRepository.save(session);
            }
            else{
                token = currSession.getToken();
            }
            modelAndView.addObject("token", token);
            modelAndView.setViewName("redirect:/main");

        }
        return modelAndView;
    }

    @GetMapping("/register")
    public ModelAndView register(){
        ModelAndView modelAndView = new ModelAndView("register");
        modelAndView.addObject("isValid", true);
        return modelAndView;
    }

    @PostMapping("/register")
    public ModelAndView register(RegUser user){
        ModelAndView modelAndView = new ModelAndView();
        List<String> errors = new ArrayList<>();

        if (checkUsername(user.getUsername())) {
            errors.add("Имя пользователя " + user.getUsername() + " уже используется");
        }

        if (checkEmail(user.getEmail())) {
            errors.add("Email " + user.getEmail() + " уже используется");
        }

        if (errors.size() == 0){
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            User newUser = user.getModelUser();
            newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
            userRepository.save(newUser);
            modelAndView.setViewName("redirect:/login");
            modelAndView.addObject("info", "Регистрация успешна");
            modelAndView.addObject("isValid", true);
        }
        else{
            modelAndView.setViewName("register");
            modelAndView.addObject("isValid", false);
            modelAndView.addObject("errors", errors);
        }

        return modelAndView;
    }
}

