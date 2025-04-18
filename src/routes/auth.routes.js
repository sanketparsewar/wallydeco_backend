const express = require("express");
const router = express.Router();
const {
  register,
  login,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validateMiddleware");
const { registerValidation } = require("../utils/userValidation");


router.post("/register", validate(registerValidation), register);
router.post("/login", login);

module.exports = router;
