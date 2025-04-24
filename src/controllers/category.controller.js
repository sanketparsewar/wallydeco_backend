const Category = require('../models/category');

exports.createCategory = async (req, res) => {
    try {
        let { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        // Format name: Capitalize first letter
        name = name.trim();
        name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" });
        }

        const category = new Category({ name });
        await category.save();
        return res.status(201).json({ message: "Category created successfully", category });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        return res.status(200).json({ categories });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ category });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category updated successfully", category });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}
exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}