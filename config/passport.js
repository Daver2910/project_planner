const localStrategy = require('passport-local')
.Strategy;
const Mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//load user models
const User = Mongoose.model('Users');

module.exports = function(passport){
  passport.use(new localStrategy({ usernameField: "email"}, (email,
     password, done) => {
       //Match user
      User.findOne({
      email: email
    }).then(User => {
      if(!User){
        return done(null, false, {message: "No User Found"});
      }

      bcrypt.compare(password, User.password, (err, isMatch)=> {
        if(err) throw err;
        if(isMatch){
          return done(null, User)
        } else{
          return done(null, false, {message: "Password incorrect"});
        }
      })
    })
  }));
passport.serializeUser(function(user, done){
    done(null, user.id);
  });

passport.deserializeUser(function(id, done){
User.findById(id, function(err, user){
  done(err, user);
});
});
}
