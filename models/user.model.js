const mongoose = require("mongoose");
const { number } = require("yup/lib/locale");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    balance: {
      type: Number,
    },
  })
);
module.exports = User;
