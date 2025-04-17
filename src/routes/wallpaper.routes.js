const express = require("express");
const router = express.Router();
const {
  addWallpaper,
  updateWallpaper,
  getWallpapers,
  getWallpaperById,
  getFavouriteWallpapers,
  addWallpaperToFavourite,
  deleteWallpaper,
  getWallpapersByCategory,
} = require("../controllers/wallpaper.controller");
const validate = require("../middlewares/validateMiddleware");
const {
  WallpaperValidation,
} = require("../utils/wallpaperValidation");
const { verifyJwt } = require("../middlewares/auth.middleware");

router.post("/", verifyJwt, validate(WallpaperValidation), addWallpaper);
router.put("/:id", verifyJwt, validate(WallpaperValidation), updateWallpaper); // Update a wallpaper
router.get("/favourite", verifyJwt, getFavouriteWallpapers);
router.get("/favourite/:id", verifyJwt, addWallpaperToFavourite);
router.get("/:id", getWallpaperById);
router.get("/", getWallpapers);
router.get("/category/:category", getWallpapersByCategory);
router.delete("/:id", verifyJwt, deleteWallpaper);

module.exports = router;
