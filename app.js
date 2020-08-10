//config .env
require("dotenv").config();
//acquiring packages
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//mongoose connection to db
let mongodbUrl = "mongodb+srv://" + process.env.DB_USERNAME + ":" + process.env.DB_PASSWORD + "@cluster0.j0bhk.mongodb.net/" + process.env.DB_NAME;
mongoose.connect(mongodbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//creating instance of express module
const app = express();

//using ejs templates
app.set('view engine', 'ejs');

//using body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));

//creating static files
app.use(express.static(__dirname + "/public"));

//listening to port
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started on port 3000");
});

//creating schema for posts
const blogSchema = {
  title: {
    type: String,
    required: 1,
  },
  body: {
    type: String,
    required: 1,
  }
};

//creating model for postSchema
const Blog = mongoose.model("blog", blogSchema);

//handling get on home route
app.get(["/", "/home"], function(req, res) {
  //reading new posts
  Blog.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        newPosts: docs,
      });
    }
  });
});

//handling get on about route
app.get("/about", function(req, res) {
  res.render("about");
});

//handling get on contact route
app.get("/contact", function(req, res) {
  res.render("contact");
});

//handling compose request
app.get("/compose", function(req, res) {
  res.render("compose");
});

//handling get for custom posts
app.get("/posts/:postId", function(req, res) {
  let postId = req.params.postId;
  //searching for the post
  Blog.findOne({
    _id: postId
  }, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      //rendering post
      res.render("post", {
        id: doc._id,
        title: doc.title,
        body: doc.body,
      });
    }
  });
});

//handling delete request
app.post("/delete/:postId", function(req, res) {
  let postId = req.params.postId;
  //searching for the post
  Blog.findByIdAndDelete(postId,
    function(err) {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
});

//handling post on home route
app.post("/", function(req, res) {
  //creating new post obj
  let post = new Blog({
    title: req.body.postTitle,
    body: req.body.postBody,
  });
  //saving and re-rendering blog collection
  post.save();
  res.redirect("/");
});
