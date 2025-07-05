const express = require("express");
const {
  addProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../controller/productController");

const router = express.Router();

router.post("/add", addProduct);
router.get("/listproducts", getAllProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
