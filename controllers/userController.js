const User = require("../model/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const createToken = (id, name) => {
  return jwt.sign({ id, name, test: "abc" }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
};

exports.signup = async (req, res) => {
  try {
    // const newUser = await User.create({
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    //   confirmPassword: req.body.confirmPassword,
    // });
    const newUser = await User.create({ ...req.body, role: "user" });
    res.status(201).json({
      message: "User Created !!!",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(404).json({
        message: "email or pass not Found !!!",
        error: error,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        message: "no such user found !!!",
        error: error,
      });
    }
    if (!(await user.verifyPass(password, user.password))) {
      console.log(password);
      res.status(404).json({
        message: "incorrect pass !!!",
        error: error,
      });
    }
    const token = createToken(user._id, user.name);
    res.status(201).json({
      message: "Login !!!",
      token: token,
    });
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      message: "User Created !!!",
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json({
      message: "Users fetched !!!",
      nbr: users.length,
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      message: "User Fetched !!!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({
      message: "User updated !!!",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      message: "User Deleted !!!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};

exports.protectorMW = async (req, res, next) => {
  try {
    let token;
    // 1) bech nthabat ken el user 3ando token wala lé
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      res.status(401).json({
        message: "You are not logged in !!!",
        error: error,
      });
    }
    // 2) bech nthabat ken el token ala 3and el user valid or not
    const validToken = await promisify(jwt.verify)(
      token,
      process.env.JWT_SECRET
    );
    // 3) bech nthabat ken el user moula el token mizel mawjoud or not
    const user = await User.findById(validToken.id);
    if (!user) {
      res.status(401).json({
        message: "Token no longer valid !!!",
        error: error,
      });
    }
    // 4) bech nthabat ken el token tsan3et 9bal el update mta3 el pass

    if (user.verifyValidDate(validToken.iat)) {
      res.status(401).json({
        message: "Token no longer valid !!!",
        error: error,
      });
    }
    req.role = user.role;
    next();
  } catch (error) {
    res.status(400).json({
      message: "Fail !!!",
      error: error,
    });
  }
};
