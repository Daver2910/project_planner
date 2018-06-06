const express = require('express');
const Router = express.Router();
const Mongoose = require('mongoose');
const {ensureAuthenticated} = require("../helpers/Auth")


//Load idea models
require('../models/Ideas');
const Ideas = Mongoose.model('Ideas');


//Add Ideas Form
Router.get("/add", ensureAuthenticated, (req, res) => {
  res.render('idea/add')});
//Idea Index page
Router.get("/", ensureAuthenticated, (req, res) => {
  Ideas.find({user: req.user.id})
    .sort({ date: 'desc' })
    .then( Ideas => {
      res.render("idea/index", {
        Ideas: Ideas
      });
    });
});
//Adding Ideas to the DB and redirecting
Router.post("/", ensureAuthenticated, (req, res) => {
//Form validation
  let errors = [];
  if (!req.body.title) {
    errors.push({text:"Please enter a title"});  }
  if (!req.body.details) {
    errors.push({text:"Please enter a description"});  }
  if (errors.length > 0) {
    res.render("idea/add", {
      errors : errors,
      title: req.body.title,
      details: req.body.details
    })
//End of form validation
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Ideas(newUser)
      .save()
      .then(idea => {
        req.flash("success_msg", 'Your Idea has been added');
        res.redirect("/idea");
      });
  }});

Router.post("/:id", ensureAuthenticated, (req, res) => {
  res.send("this is deleted")
});

Router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  })
  .then(Ideas => {
    if(Ideas.user != req.user.id){
      req.flash("error_msg", 'Not Authorised');
      res.redirect('/idea')
    }else{
    res.render('idea/edit',{
      Ideas: Ideas
    });
  }
  });
});
//When we use Ideas in this case it represents the DB
//Edit form process
Router.put("/:id", ensureAuthenticated, (req, res) => {
  Ideas.findOne({
    _id: req.params.id
  })
  .then(Ideas => {
    //These are the new Values
      Ideas.title = req.body.title,
      Ideas.details = req.body.details
      Ideas.save().then(Ideas => {
        req.flash("success_msg", 'Your Idea has been successfully updated');
        res.redirect("/idea");});
    });
  });
//Delete Idea
Router.delete("/:id", ensureAuthenticated, (req, res) => {
    Ideas.remove({_id: req.params.id})
    .then(() => {
      req.flash("error_msg", 'Your Idea has been removed');
      res.redirect("/idea");
    })
  })

module.exports = Router;
