const userService = require("../services/user.service");

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    if (!users || users.length == 0) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
  } catch (err) {
    console.error("Error getting all users", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.getUserByToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await userService.getUserByToken(token);
    if (!user) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const { password, ...rest } = user._doc;
    return res.status(200).json({ user: rest });
  } catch (err) {
    console.error("Error getting user by token", err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
