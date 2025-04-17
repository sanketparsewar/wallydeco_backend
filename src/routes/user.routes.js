// userRoutes.js
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
router.get("/:id",verifyJwt, getUserById);
router.get("/",verifyJwt, getUsers);
router.put("/:id",verifyJwt, validate(updateUserValidation), updateUser);
router.delete("/:id",verifyJwt, deleteUser);


module.exports = router;
