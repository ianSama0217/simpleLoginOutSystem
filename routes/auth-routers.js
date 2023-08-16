const router = require("express").Router();
const passport = require("passport");
const User = require("../models/user-model");
const bcrypt = require("bcrypt");

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

//登出系統
router.get("/logout", (req, res) => {
  //req.logout後，passport會自動刪除使用者
  req.logOut((err) => {
    if (err) return res.send(err);
    return res.redirect("/");
  });
});

//本地端註冊帳號
router.get("/signup", (req, res) => {
  return res.render("signup", { user: req.user });
});

router.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  if (password.length < 8) {
    req.flash("error_msg", "密碼過短，至少需要8個數字或字母");
    return res.redirect("/auth/signup");
  }

  router.post(
    "/login",
    passport.authenticate("local", {
      failureRedirect: "/auth/login",
      failureFlash: "登入失敗，請確認帳號密碼是否輸入正確",
    }),
    (req, res) => {
      return res.redirect("/profile");
    }
  );

  //確認信箱是否被註冊過
  const foundEmail = await User.findOne({ email }).exec();
  if (foundEmail) {
    req.flash("error_msg", "信箱已被註冊，請使用其他信箱");
    return res.redirect("/auth/signup");
  }
  let hashPassword = await bcrypt.hash(password, 12);
  let newUser = new User({ name, email, password: hashPassword });
  await newUser.save();
  req.flash("success_msg", "註冊成功!現在可以登入系統了");
  return res.redirect("/auth/login");
});

//使用google登入的路徑
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

//輸入google帳號後redirect的路徑
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("進入google redirect區域...");
  return res.redirect("/profile");
});

module.exports = router;
