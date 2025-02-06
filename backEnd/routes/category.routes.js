const express = require("express");
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");
const verifyUserToken = require("../middleware/verifyUserToken");

const router = express.Router();

router.post("/create", verifyUserToken, createCategory);
router.get("/", verifyUserToken, getAllCategories);
router.get("/:id", verifyUserToken, getCategoryById);
router.put("/:id", verifyUserToken, updateCategory);
router.delete("/:id", verifyUserToken, deleteCategory);

module.exports = router;
