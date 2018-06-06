const express = require('express');
const Router = express.Router();
const Mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const passport = require('passport');

//load User models
require('../models/Users');
const Users = Mongoose.model('Users');


//User Login Routes
Router.get("/login", (req, res) =>{
  res.render("users/login")
});

//Login users
Router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/idea",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

//User register Routes
Router.get("/register", (req, res) =>{
  res.render("users/register")
});

Router.post('/register', (req, res) => {
    let errors = [];
if(req.body.password != req.body.password2){
  errors.push({text:"Passwords do not match"});
}
if(req.body.password.length < 4){
  errors.push({text:"Password must be more that 4 characters"});
}
if(errors.length > 0){
    res.render("users/register", {
    errors: errors,
    fname: req.body.fname,
    sname: req.body.sname,
    email: req.body.email,
    password: req.body.password,
    password2: req.body.password2
  });
} else{
  const newUser = new Users({
    first_name: req.body.fname,
    surname_name: req.body.sname,
    email: req.body.email,
    password: req.body.password,
  });
  bcrypt.genSalt(10, (err, salt) =>{
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save()
        .then(User => {
          req.flash('success_msg', 'You are now registered and you can log in');
          res.redirect('/users/login')
        })
        .catch(err => {
          console.log(err);
          return;
        })
    });
  });

}
})
// logout user
Router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "you are logged out");
  res.redirect("/users/login")
})
module.exports = Router;
