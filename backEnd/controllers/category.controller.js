const categoryService = require("../services/category.service");

module.exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await categoryService.createCategory(name, description);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

module.exports.updateCategory = async (req, res) => {
  try {
    const updatedCategory = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports.deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
