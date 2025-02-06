const Category = require("../models/category.model");

const createCategory = async (name, description) => {
  try {
    if (!name || !description) {
      throw new Error("Name and description are required");
    }
    const category = await Category.create({ name, description });
    return category;
  } catch (err) {
    throw new Error("Error creating category: " + err.message);
  }
};

const getAllCategories = async () => {
  try {
    return await Category.find();
  } catch (err) {
    throw new Error("Error fetching categories: " + err.message);
  }
};

const getCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if (!category) throw new Error("Category not found");
    return category;
  } catch (err) {
    throw new Error("Error fetching category: " + err.message);
  }
};

const updateCategory = async (categoryId, updateData) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true, runValidators: true }
    );
    if (!updatedCategory) throw new Error("Category not found");
    return updatedCategory;
  } catch (err) {
    throw new Error("Error updating category: " + err.message);
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) throw new Error("Category not found");
    return deletedCategory;
  } catch (err) {
    throw new Error("Error deleting category: " + err.message);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
