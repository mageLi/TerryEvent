
var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//index.js is main file(special name)  no need ../middleware/index.js
var middleware = require("../middleware");

//show all campgrounds
router.get("/", function(req, res){
        
        //Get all campgrounds from DB
        Campground.find({}, function(err, allCampgrounds){
            if(err){
                console.log(err);
            } else {
                //user name and id
                // req.user  
                res.render("campgrounds/index", {campgrounds : allCampgrounds, page: 'campgrounds'})
            }
        });
        //res.render("campgrounds", {campgrounds: campgrounds});
});

//create a new campground to DB
router.post("/",middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author:author}
    //create a new campground and save to DB
    Campground.create(newCampground, function(err,newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect to campgrounds page
            res.redirect("/campgrounds");
        }
    });
   
});

//New show form to create a campgrouds
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
})

//show more info about one campgrounds
router.get("/:id", function(req, res) {
   //find the campground with provide id
   Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err){
           console.log(err);
       } else {
           
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
       }
   });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/campgrounds");
      } else {
          res.redirect("/campgrounds");
      }
   });
});


module.exports = router;