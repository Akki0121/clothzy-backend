const express = require("express");

const {
  registerUser,
  loginUser,
  logOutUser,
  deleteUser,
  updateProfile,
  userProfile,
} = require("../controller/userController");

const {
  addtoCart,
  listCartItems,
  removeCartItems,
} = require("../controller/cartController");

const { authenticateToken, password_auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.delete("/delete", authenticateToken, deleteUser);
router.get("/profile/:id", authenticateToken, userProfile);
router.patch("/updateprofile", authenticateToken, updateProfile);

router.post("/addtocart", authenticateToken, addtoCart);
router.get("/cartitems", authenticateToken, listCartItems);
router.delete("/deletecartItem", authenticateToken, removeCartItems);

module.exports = router;
