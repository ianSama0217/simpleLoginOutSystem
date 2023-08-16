const router = require("express").Router();

const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    return res.redirect("/auth/login");
  }
};

router.get("/", checkAuth, (req, res) => {
  console.log("進入profile..");
  return res.render("profile", { user: req.user });
});

module.exports = router;
