
const mongoose = require('mongoose');
const Product = require('../models/productModuls');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middleware/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// Get All Products - GET /api/v1/products
exports.getProducts = async (req, res, next) => {
  try {

    const resPerPage = 2;
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter().paginate(resPerPage);

    const products = await apiFeatures.query;
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err) {
    next(err);
  }
};

// Create New Product - POST /api/v1/product/new
exports.newProduct = catchAsyncError (async (req, res, next) => {

  req.body.user = req.user.id
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product
  });
})

// Get Single Product - GET /api/v1/product/:id
exports.getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid Product ID', 400));
    }

    const product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

// Update Product - PUT /api/v1/product/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid Product ID', 400));
    }

    let product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    next(err);
  }
};

// Delete Product - DELETE /api/v1/product/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new ErrorHandler('Invalid Product ID', 400));
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully!',
    });
  } catch (err) {
    next(err);
  }
};
