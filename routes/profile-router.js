const router = require("express").Router();
const Post = require("../models/post-model");

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

router.get("/", checkAuth, async (req, res) => {
  console.log("進入profile..");
  let foundPost = await Post.find({ author: req.user._id });
  return res.render("profile", { user: req.user, posts: foundPost });
});

router.get("/post", checkAuth, (req, res) => {
  return res.render("post", { user: req.user });
});

router.post("/post", checkAuth, async (req, res) => {
  let { title, content } = req.body;
  let newPost = new Post({ title, content, author: req.user._id });
  try {
    await newPost.save();
    return res.redirect("/profile");
  } catch (e) {
    req.flash("error_msg", "標題與內容都需要填寫");
    return res.redirect("/profile/post");
  }
});

module.exports = router;
