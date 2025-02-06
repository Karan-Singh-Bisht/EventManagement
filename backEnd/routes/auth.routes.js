const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controllers/auth.controller");
const upload = require("../middleware/multer.middleware");

router.post("/signup", upload.single("avatar"), signupUser);
router.post("/login", loginUser);

module.exports = router;
