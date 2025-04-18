const express = require("express");
const router = express.Router();
const {
  getUserById,getLoggedUser,
  updateUser,
  deleteUser,getUsers
} = require("../controllers/user.controller");
const validate = require("../middlewares/validateMiddleware");
const {verifyJwt} =require('../middlewares/auth.middleware')

const { updateUserValidation } = require("../utils/userValidation");


router.get("/logged",verifyJwt, getLoggedUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id",verifyJwt, validate(updateUserValidation), updateUser);
router.delete("/:id", deleteUser);


module.exports = router;
