const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
  return res.render("login", { user: req.user });
});

//登出系統
router.get("/logout", (req, res) => {
  req.logOut((err) => {
    if (err) return res.send(err);
    return res.redirect("/");
  });
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
