const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "The Name is required !!!"],
  },
  email: {
    type: String,
    require: [true, "The Email is required !!!"],
    unique: [true, "The email already used !!"],
    lowercase: true,
    validate: [validator.isEmail, "You must set a valid email !!!"],
  },
  password: {
    type: String,
    require: [true, "The Password is required !!!"],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    require: [true, "The cPassword is required !!!"],
    minlength: 8,
    validate: {
      validator: function (cPass) {
        return cPass === this.password;
      },
      message: "cPass does not match !!!!",
    },
  },
  password_updated_at: {
    type: Date,
    default: Date.now(),
  },
  created_At: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
