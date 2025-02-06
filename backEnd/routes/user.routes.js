const express = require("express");
const router = express.Router();
const {
  getUserByToken,
  getAllUsers,
} = require("../controllers/user.controller");

router.get("/users", getAllUsers);
router.get("/profile", getUserByToken);

module.exports = router;
