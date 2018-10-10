var express = require("express");
var app = express();
var bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport    = require("passport"),
    methodOverride = require("method-override"),
    LocalStrategy = require("passport-local"),
    User        = require("./models/user"),
    seedDB = require("./seeds");
     
     
    //requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
    // mongoose.connect('mongodb://localhost:27017/yelp_camp_v10', { useNewUrlParser: true }); 
    // mongodb://terry:xiaot930220@ds125673.mlab.com:25673/terrycamp
    mongoose.connect("mongodb://vs:xiaot930220@ds125673.mlab.com:25673/terrycamp");
    app.use(flash());
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine", "ejs");
    // __dirname is whole path for safe
    app.use(express.static(__dirname + "/public"));
    app.use(methodOverride("_method"));
    // caching disabled for every route
    app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
    });
    //seed the database
    // seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
// 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//pass req.user to every 
//if login display logout else display login and signup
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
// -----------------------

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Started!");
});