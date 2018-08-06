var express = require("express");
var router  = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleWare = require("../middleware")


//===============================================================
//COMMENTS ROUTES
//===============================================================

//comments new
//run this route, first checks function isLoggedin which tells system is user is logged in or not then proceeds.
router.get("/new", middleWare.isLoggedin, function(req, res){
    //find campground by id
    console.log(req.params.id)
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            //render the comments page but also pass the comment id to the comments/new file
            res.render("comments/new", {campground: campground});
        }
    });
    
});

//Comments Create
router.post("/", middleWare.isLoggedin, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground) {
        if (err){
            console.log(err);
             res.redirect("/campgrounds");
        }
        else{
            //create new comment
           Comment.create(req.body.comment, function(err, comment){
            if(err){
                req.flash("error", "Something went wrong");
                console.log(err);
            }
            else{
                //add username and id to comment
                //req.user is the user content, and it exists because of the middleware check above for the function findById.
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();
                campground.comments.push(comment);
                campground.save();
                console.log(comment);
                req.flash("success", "Successfully added comment, good job lavar!");
                res.redirect("/campgrounds/" + campground._id);
            }
           });
        }
    });
});

//COMMENT EDIT ROUTE
router.get("/:comment_id/edit", middleWare.checkCommentOwnership, function(req,res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } 
      else{
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment} );
      }
   });
});

//COMMENT UPDATE ROUTE
router.put("/:comment_id", middleWare.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            req.flash("success", "Good job! Updating like Steve Kerr");
            //redirect to the show page
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleWare.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       }
       else{
           req.flash("success", "Deleted that like Ewing's season in Orlando. Balla!");
           res.redirect("/campgrounds/" + req.params.id);
       }
   });
});


module.exports = router;
