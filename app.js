const express = require('express');             //the Express var is to require the express node.
const exphbs  = require("express-handlebars");  // Assigning Handlebars
const path = require('path');
const Mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require('passport');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();                          //Assigning the express() to a const 'app'

//Db LOADING
const db = require('./config/database');
// Map global promise - get rid of warning
Mongoose.Promise = global.Promise;
// Connect to mongoose
Mongoose.connect(db.mongoURI, {
  useMongoClient: true
})
  .then(() => console.log('MongoDB is connected')) // This is a promise (notice the lack of a ';' in the connect())
  .catch(err => console.log(err));                  // the promise will then (try) to do smth, if error, Catch

//setting up the views engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Adding static files
app.use(express.static(path.join(__dirname, 'public')));

//Body parser middleware to read the incoming info from forms
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method Override middle ware, to change form submit method to Delete and PUt
app.use(methodOverride('_method'))

//Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash middleware
app.use(flash());
//Global variables
app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  //this global var is to show is a user is logged in or
  res.locals.user = req.user || null;
  next();
});

/* ---------------------------------------------------------------------------------------------------------------------------------
                  HTTP Routes
---------------------------------------------------------------------------------------------------------------------------------*/
//catches all get requests for '/'
app.get("/",(req, res) => {
  let title = "VidJot"
  res.render('index', {
    "title": title
  });
});
//About route
app.get("/about",(req, res) => {
  let title = "About";
  res.render('about', {
    "title": title
  });
});

//Importing Routes from the routes folder
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//Passport Config
require("./config/passport")(passport);

app.use("/users", users)
app.use("/idea", ideas);

//Set-up a port on the localhost.
const Port = process.env.PORT || 1110;

app.listen(Port, () => {console.log(`The new VidJot application is running on port: ${ Port }`)})
