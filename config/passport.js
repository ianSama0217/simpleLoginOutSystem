const passport = require("passport");
const googleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  console.log("serialize使用者...");
  //當done被執行時，將參數自動放入session內，並在用戶端設置cookie
  //設定req.isAuthenticated()=true
  done(null, user._id); //將mongoDB的id儲存在session內，並以signed之後的id形式儲存在cookie內
});

passport.deserializeUser(async (_id, done) => {
  console.log("deserialize使用者...");
  //使用serialize儲存的_id，去找mongoDB內儲存的資料
  let foundUser = await User.findOne({ _id });
  //當done被執行時，第二個參數會被設定在req.user內部
  done(null, foundUser); //將req.user設定為foundUser;
});

passport.use(
  new googleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    //profile是passport從google取得的用戶資料
    //done是一個fn，可將使用者的資訊儲存在done內，執行done()
    async (accessToken, refreshToken, profile, done) => {
      console.log("執行google strategy function。。。");
      // console.log(profile);
      // console.log("------------------------------");
      let foundUser = await User.findOne({ googleID: profile.id }).exec();
      if (foundUser) {
        console.log("使用者已註冊，無須再次儲存資料置資料庫");
        done(null, foundUser);
      } else {
        console.log("發現新用戶，將資料儲存置資料庫");
        try {
          let newUser = new User({
            name: profile.name,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.emails[0].value,
          });
          let saveUser = await newUser.save();
          console.log("成功創建新用戶!");
          done(null, saveUser);
        } catch (e) {
          console.log(e.message);
        }
      }
    }
  )
);
