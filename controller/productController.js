const Product = require("../model/productModel");

const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      originalprice,
      imageUrl,
      rating,
      bestseller,
    } = req.body;

    const newProduct = new Product({
      name,
      category,
      price,
      originalprice,
      imageUrl,
      rating,
      bestseller,
    });
    const product = await newProduct.save();
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Error while adding product",
      });
    }
    return res
      .status(201)
      .json({ success: true, message: "Product added successfully" });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error adding product: " + error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching products: " + error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, originalprice, imageUrl, rating, bestseller } =
    req.body;

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, price, originalprice, imageUrl, rating, bestseller },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedProduct) {
      return res.status(404).send("Product not found");
    }
    return res.send("Product updated successfully");
  } catch (error) {
    return res.status(400).send("Error updating product: " + error.message);
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }
    return res.send("Product deleted successfully");
  } catch (error) {
    return res.status(400).send("Error deleting product: " + error.message);
  }
};

module.exports = { addProduct, getAllProducts, updateProduct, deleteProduct };
