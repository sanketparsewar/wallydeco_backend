const express = require("express");
const {
  register,
  login,
  logout,
  refreshAccessToken,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validateMiddleware");
const {registerValidation} = require("../utils/userValidation");

const router = express.Router();

router.post("/register", validate(registerValidation), register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
