var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground"); 
var middleWare = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

//INDEX route - show all campgrounds
router.get("/", function(req, res){
       //Get all campgrounds from campground database
       Campground.find({}, function(err, allCampgrounds){
          if(err){
              console.log(err);
          } else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds, page:'campgrounds'});  
          }
       });
       
});

//CREATE - add new campground to DB
router.post("/", middleWare.isLoggedin, function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user_id,
        username:req.user.username
    };
    var newCampground = {name:name, image:image, description:desc, author:author};
    //Create a new campground and save to database
    Campground.create(newCampground, function(err, newlyCreated){
       if (err){
           console.log(err);
       }
       else{
           res.redirect("/campgrounds");
       }
    });
    //redirect back to campgrounds page
});

//NEW route - Show form to create new campground
router.get("/new", middleWare.isLoggedin, function(req, res){
    res.render("campgrounds/new");
});

// SHOW route - Show a more info about a single entity in an object
router.get("/:id", function(req, res){
    //Find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }
        else{
            console.log(foundCampground);
                //Show the campground with that ID
            res.render("campgrounds/show", {campground:foundCampground});    
        }
    });
});


//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleWare.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            }else{
                 res.render("campgrounds/edit", {campground:foundCampground});
            }
        });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleWare.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            //redirect to the show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

/*router.put("/:id", middleWare.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            //redirect to the show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});*/

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleWare.checkCampgroundOwnership, function(req, res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/campgrounds");
       }
       else{
           res.redirect("/campgrounds");
       }
   });
});


module.exports = router;