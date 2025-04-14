const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "The Name is required !!!"],
  },
  email: {
    type: String,
    require: [true, "The Email is required !!!"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "You must set a valid email !!!"],
  },
  password: {
    type: String,
    require: [true, "The Password is required !!!"],
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
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

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
  return next();
});

userSchema.methods.verifyPass = async function (userPass, cPass) {
  return await bcryptjs.compare(userPass, cPass);
};

userSchema.methods.verifyValidDate = function (iat) {
  console.log(iat);
  console.log(parseInt(this.password_updated_at.getTime() / 1000));
  return iat < parseInt(this.password_updated_at.getTime() / 1000);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
