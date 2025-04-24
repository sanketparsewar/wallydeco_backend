const User = require("../models/user");

exports.getLoggedUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({user:user});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error"});
  }
};

exports.getUsers=async (req,res)=>{
  try {
    const users = await User.find().select("-password");
    res.status(200).json({users});
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


// Update user profile
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Update user
    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(400).json({ message: "Bad request" });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message:err.message  });
  }
};
