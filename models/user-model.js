const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 50,
  },
  googleID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  //圖片
  thumbnail: {
    type: String,
  },
  email: {
    type: String,
  },
  //local login才有
  password: {
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
});

module.exports = mongoose.model("User", userSchema);
