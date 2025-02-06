const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const getUserByToken = async (token) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// Get all users
const getAllUsers = async () => {
  try {
    const users = await User.find({});

    if (users.length === 0) {
      throw new Error("No users found");
    }

    return users;
  } catch (err) {
    console.error("Error getting all users", err.message);
    throw err;
  }
};

module.exports = { getAllUsers, getUserByToken };
