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
const { WallpaperValidation, } = require("../utils/wallpaperValidation");
const { verifyJwt } = require("../middlewares/auth.middleware");

router.get("/", getWallpapers);
router.get("/favourites", verifyJwt, getFavouriteWallpapers);
router.get("/category/:category", getWallpapersByCategory);
router.get("/favourite/:id", verifyJwt, addWallpaperToFavourite);
router.get("/:id", getWallpaperById);
router.post("/", verifyJwt, validate(WallpaperValidation), addWallpaper);
router.put("/:id", verifyJwt, validate(WallpaperValidation), updateWallpaper);
// router.put("/:id", verifyJwt, updateWallpaper);
router.delete("/:id", verifyJwt, deleteWallpaper);

module.exports = router;
