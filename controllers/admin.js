const { urlencoded } = require("body-parser");
const { Op } = require("sequelize");
const userSchema = require("../models/User");
const db = require("../database");
const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
var multiparty = require("connect-multiparty"),
  multipartyMiddleware = multiparty({ uploadDir: "./imagesPath" });
const fs = require("fs-extra");
const { getStorage, ref, uploadBytes, getDownloadURL } = require("../firestore/config");

const dashboard = (req, res, next) => {
  if (!req.session.user) {
    res.redirect("/login");
  } else if (req.session.user.role !== "admin") {
    res.redirect("/user/dashboard");
  } else {
    res.render("admin/dashboard", { user: req.session.user });
  }
};

const posts = (req, res, next) => {
  Post.find({})
    .sort({ date: -1 })
    .populate("author")
    .lean()
    .then(function (posts) {

      Promise.all(
        posts.map(async (post) => {
        const storage = getStorage();
        let gsReference = ref(
          storage,
          "gs://my-blog-729-98800.appspot.com/images/" + post.image
        );
        post.image = (await getDownloadURL(gsReference).then((url) => {
          return url;
        }));


      })
      ).then(function(){
        res.render("admin/posts", { user: req.session.user, posts });
      })

      
    });
};

const postEditView = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .lean()
    .then(async function (post) {
      const storage = getStorage();
        let gsReference = ref(
          storage,
          "gs://my-blog-729-98800.appspot.com/images/" + post.image
        );
        post.image = (await getDownloadURL(gsReference).then((url) => {
          return url;
        }));
      res.render("admin/editPost", { post });
    });
};

const updatePost = (req, res, next) => {
  let oldpath = req.files.postImage.path;
  let newFileName = (
    new Date().getTime() +
    "-" +
    req.files.postImage.name
  ).toLowerCase();
  newFileName = newFileName.replaceAll(' ', '-').replaceAll('_', '-').replaceAll(',', '-');
  let newpath = "./public/post-images/" + newFileName;
  // fs.rename(oldpath, newpath, function (err) {
  //   if (err) throw err;
  // });

  const storage = getStorage();
  const imageRef = ref(storage, "images/" + newFileName);
  uploadBytes(imageRef, req.files.postImage.data).then(async (snapshot) => {
    let newdata = {
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
    };

    if (req.files.postImage.name != "") {
      newdata.image = newFileName;
    }

    Post.findOneAndUpdate(
      { _id: req.params.id },
      newdata,
      { upsert: true },
      function (err, doc) {
        if (err) return res.send(500, { error: err });

        res.redirect("/admin/posts");
      }
    );
  });

  
};

const newPost = (req, res, next) => {
  let oldpath = req.files.postImage.path;
  let newFileName = (
    new Date().getTime() +
    "-" +
    req.files.postImage.name
  ).toLowerCase();
  newFileName = newFileName.replaceAll(' ', '-').replaceAll('_', '-').replaceAll(',', '-');
  let newpath = "./public/post-images/" + newFileName;
  // fs.rename(oldpath, newpath, function (err) {
  //   if (err) throw err;
  // });

  const storage = getStorage();
  const imageRef = ref(storage, "images/" + newFileName);
  uploadBytes(imageRef, req.files.postImage.data).then(async (snapshot) => {


    // after uploading image to firestore upload image name to database
    let post = {
      author: req.session.user._id,
      title: req.body.title,
      category: req.body.category,
      content: req.body.content,
      image: "",
    };

    if (req.files.postImage.name != "") {
      post.image = newFileName;
    }

    let newPost = new Post(post);
    newPost.save().then(function () {
      res.redirect("/admin/posts");
    });


  });

  
};

const deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(function () {
    res.redirect("/admin/posts");
  });
};

const newPostView = (req, res, next) => {
  res.render("admin/newPost", { user: req.session.user });
};

const users = (req, res, next) => {
  res.render("admin/posts", { user: req.session.user });
};

module.exports = {
  dashboard,
  posts,
  users,
  postEditView,
  deletePost,
  updatePost,
  newPostView,
  newPost,
};
