const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");
const bcrypt = require("bcrypt");

module.exports.signupUser = async (req, res) => {
  try {
    const newUser = await authService.createUser(req);
    if (!newUser) {
      return res.status(400).json({ message: "Cannot Create User" });
    }
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    return res.status(200).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: "User Already Registered" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid  password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot login user" });
  }
};
