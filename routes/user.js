const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const adminController = require("../controllers/admin");
// file upload
var multiparty = require("connect-multiparty"),
  multipartyMiddleware = multiparty({ uploadDir: "./public/post-images/" });

router.get("/", userController.home);
router.get("/login", userController.loginView);
router.post("/login", userController.login);
router.get("/register", userController.registerView);
router.post("/register", userController.register);
router.get("/article/:id", userController.article);
router.get("/user/dashboard", userController.dashboard);
router.get("/user/posts", userController.posts);
router.get("/user/newpost", userController.newpostView);
router.post("/user/newpost", userController.savePost);
router.get("/deletePost", userController.deletePost);
router.get("/editPost", userController.editPostView);
router.post("/editPost", userController.updatePost);
router.get("/logout", userController.logout);
router.get("/category/:category", userController.category);
router.get("/init", userController.init);

router.get("/admin/dashboard", adminController.dashboard);
router.get("/admin/posts", adminController.posts);
router.get("/admin/posts/edit/:id", adminController.postEditView);
router.post(
  "/admin/posts/edit/:id",
  adminController.updatePost
);
router.get("/admin/posts/delete/:id", adminController.deletePost);
router.get("/admin/posts/new", adminController.newPostView);
router.post("/admin/posts/new", adminController.newPost);
router.get("/admin/users", adminController.users);

module.exports = router;
