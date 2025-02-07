const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const uploadOnCloudinary = require("../utils/cloudinary");

const createUser = async (req) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists");
    }
    const avatarLocalPath = req.file?.path;

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const newUser = await User.create({
      name,
      email,
      password,
      avatar: avatar.url || "",
    });
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    return newUser;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error(`User not found with email ${email}`);
    }

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = { createUser, getUserByEmail };
