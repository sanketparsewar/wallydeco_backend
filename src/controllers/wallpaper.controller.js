const Wallpaper = require("../models/wallpaper");
const User = require("../models/user")
const { capitalizeFirst, upperCase } = require('../utils/stringTransform')


exports.addWallpaper = async (req, res) => {
  try {
    let { wallpaperId, title } = req.body
    title = capitalizeFirst(title.trim())
    wallpaperId = upperCase(wallpaperId.trim())

    const wallpaper = new Wallpaper({ ...req.body, wallpaperId, title });
    const savedWallpaper = await wallpaper.save();
    res.status(201).json(savedWallpaper);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getWallpapers = async (req, res) => {
  try {
    const { search, category, price, stock, page = 1, limit = 10 } = req.query;
    let filter = {};

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      filter.category = category;
    }
    if (price) {
      filter.price = { $lte: Number(price) }; // Fetch wallpapers with price ≤ given price
    }
    if (stock) {
      filter.stock = Number(stock);
    }

    // Convert page & limit to numbers
    const pageNum = Math.max(1, Number(page)); // Ensure page is at least 1
    const limitNum = Math.max(1, Number(limit)); // Ensure limit is at least 1
    const skip = (pageNum - 1) * limitNum;

    // Get total count (for frontend pagination)
    const total = await Wallpaper.countDocuments(filter);

    // Fetch paginated wallpapers
    const wallpapers = await Wallpaper.find(filter)
      .skip(skip)
      .limit(limitNum).sort({ title: 1 }).select('-__v');

    res.status(200).json({
      total, // Total number of wallpapers (without pagination)
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      wallpapers, // Paginated wallpapers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getWallpapersByCategory = async (req, res) => {
  try {
    const category = req.params
    const wallpapers = await Wallpaper.find(category).select('-__v');
    if (!wallpapers || wallpapers.length === 0) {
      return res.status(404).json({ message: "No wallpapers found in this category" });
    }
    res.status(200).json(wallpapers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get a wallpaper by ID
exports.getWallpaperById = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findById(req.params.id).select('-__v');
    if (!wallpaper)
      return res.status(404).json({ message: "Wallpaper not found" });
    res.status(200).json(wallpaper);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFavouriteWallpapers = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated and req.user is set by auth middleware

    const user = await User.findById(userId).populate('favourite').select('-__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ favourites: user.favourite });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


// Add a wallpaper to favourites
exports.addWallpaperToFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const id = req.params.id;
    // Check if wallpaper exists
    const wallpaper = await Wallpaper.findById(id).select('-__v');
    if (!wallpaper) {
      return res.status(404).json({ message: 'Wallpaper not found' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFavourite = user.favourite.includes(id);

    if (isFavourite) {
      // Remove from favourites
      user.favourite = user.favourite.filter(favId => favId.toString() !== id);
    } else {
      // Add to favourites
      user.favourite.push(id);
    }

    await user.save();

    res.status(200).json({
      message: isFavourite ? 'Removed from favourites' : 'Added to favourites',
      favourite: user.favourite,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};


exports.updateWallpaper = async (req, res) => {
  try {
    let { wallpaperId, title } = req.body
    title = capitalizeFirst(title.trim())
    wallpaperId = upperCase(wallpaperId.trim())

    const wallpaper = await Wallpaper.findByIdAndUpdate(req.params.id, { ...req.body, wallpaperId:wallpaperId, title:title }, { new: true }).select('-__v');
    if (!wallpaper) return res.status(404).json({ message: 'Wallpaper not found' });
    res.status(200).json(wallpaper);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



// Delete a wallpaper
exports.deleteWallpaper = async (req, res) => {
  try {
    const wallpaper = await Wallpaper.findByIdAndDelete(req.params.id);
    if (!wallpaper)
      return res.status(404).json({ message: "Wallpaper not found" });
    res.status(200).json({ message: "Wallpaper deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
