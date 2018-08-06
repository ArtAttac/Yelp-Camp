var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    flash         = require("connect-flash"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride= require("method-override"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user"),   
    seedDB        = require("./seeds");

//Enables ability for PUT method for update route in CRUD
app.use(methodOverride("_method"));    
    
    
//Requring Routes
var commentRoutes = require("./routes/comments");
var campgroundRoutes= require("./routes/campgrounds");
var indexRoutes = require("./routes/index");


//To Use the local mongoose server, creates a different database after each //localhost    
mongoose.connect("mongodb://localhost/yelp_camp_v12");
//Sets up bodyParser
app.use(bodyParser.urlencoded({extended:true}));
//Makes the app see all incoming files ejs files unless otherwise specified.
app.set("view engine", "ejs");
//Adds CSS style sheet to thefile (dirname more convential way of doing in Node to make sure no mistakes with folder/file switches)
app.use(express.static(__dirname + "/public"));
//to install connect-flash plus the require at the top
app.use(flash());
//Uses the seedDB database from my local file
//seed the database
//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Woah ho hoooooooooo",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware that will apply to the rest of the code that enables req.user to be passed
//req.user will be empty if no one is signed in, full of info that is established in files if user is signed in
//calls this function on every single route
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Yelpcamp server has started"); 
});

