const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routes/auth-routers");
const profileRouter = require("./routes/profile-router");
require("./config/passport");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

mongoose
  .connect("mongodb://127.0.0.1/googleDB")
  .then(() => {
    console.log("連接googleDB資料庫成功");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
//讓passport運行認證功能
app.use(passport.initialize());
app.use(passport.session());
//設定錯誤訊息提示
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//設定routers
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.get("/", (req, res) => {
  return res.render("index", { user: req.user });
});

app.listen(8080, () => {
  console.log("正在port8080運行中。。。");
});
