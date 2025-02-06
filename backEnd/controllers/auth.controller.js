const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");

module.exports.signupUser = async (req, res) => {
  try {
    const newUser = await authService.createUser(req);
    if (!newUser) {
      return res.status(400).json({ message: "Failed to create user" });
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
    return res.status(500).json({ message: "Cannot create user" });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const user = await authService.loginUser(req.body);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
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
