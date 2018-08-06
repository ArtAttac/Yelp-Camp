var mongoose = require("mongoose");

//Schema set-up

var campgroundSchema = new mongoose.Schema({
    name: String,
    //Step 1 -- Move to campgrounds/new.ejs
    price: String,
    image: String,
    description: String,
    author:{
        id:{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        username: String
    },
    comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Campground", campgroundSchema);