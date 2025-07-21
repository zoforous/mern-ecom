const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const fs = require('fs');
const path = require('path');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 12;
  const page = Number(req.query.page) || 1;
  
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};
  const brand = req.query.brand ? { brand: req.query.brand } : {};

  // Handle sorting
  let sortQuery = {};
  if (req.query.sort) {
    switch (req.query.sort) {
      case 'price':
        sortQuery = { price: 1 }; // Low to High
        break;
      case '-price':
        sortQuery = { price: -1 }; // High to Low
        break;
      case 'rating':
        sortQuery = { rating: -1 }; // High to Low
        break;
      case '-rating':
        sortQuery = { rating: 1 }; // Low to High
        break;
      case 'createdAt':
        sortQuery = { createdAt: 1 }; // Oldest First
        break;
      case '-createdAt':
      default:
        sortQuery = { createdAt: -1 }; // Newest First
        break;
    }
  } else {
    sortQuery = { createdAt: -1 }; // Default sort: Newest First
  }
  
  const count = await Product.countDocuments({ ...keyword, ...category, ...brand });
  const products = await Product.find({ ...keyword, ...category, ...brand })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort(sortQuery);

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    console.log('Found product with images:', product.images);
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };
  
  // Handle image upload
  if (req.file) {
    console.log('Image file received:', req.file);
    productData.images = [{
      url: `/images/products/${req.file.filename}`,
      alt: req.body.name
    }];
    console.log('Image data being saved:', productData.images);
  } else {
    console.log('No image file received');
  }

  const product = await Product.create(productData);
  console.log('Created product with images:', product.images);
  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updateData = { ...req.body };

  // Handle image upload
  if (req.file) {
    // Delete old image if exists
    if (product.images && product.images.length > 0) {
      const oldImagePath = path.join(
        __dirname, 
        '../../frontend/public',
        product.images[0].url
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Add new image
    updateData.images = [{
      url: `/images/products/${req.file.filename}`,
      alt: req.body.name || product.name
    }];
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  );

  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Delete product image if exists
  if (product.images && product.images.length > 0) {
    const imagePath = path.join(
      __dirname, 
      '../../frontend/public',
      product.images[0].url
    );
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log('Product image deleted successfully:', imagePath);
      } catch (error) {
        console.error('Error deleting product image:', error);
        // Continue with product deletion even if image deletion fails
      }
    }
  }

  // Use deleteOne instead of remove
  await Product.deleteOne({ _id: req.params.id });
  
  res.json({ message: 'Product removed successfully' });
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.calculateAverageRating();

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
}; 