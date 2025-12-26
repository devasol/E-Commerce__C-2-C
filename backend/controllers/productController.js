const Product = require('../models/Product');
const ErrorResponse = require('../utils/errorResponse');

// @desc      Get all products
// @route     GET /api/products
// @access    Public
exports.getAllProducts = async (req, res, next) => {
  try {
    // Extract and validate query parameters
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 60; // Default to 60, which is within the 50-70 range

    // Validate page and limit
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {  // Set a reasonable max limit
      limit = 60;
    }

    const skip = (page - 1) * limit;

    // Build query object
    // Start with active products filter
    const conditions = [
      {
        $or: [
          { isActive: true },
          { isActive: { $exists: false } }  // For products created before isActive field existed
        ]
      }
    ];

    // Add search functionality if search parameter is provided
    if (req.query.search) {
      conditions.push({
        $or: [
          { name: { $regex: req.query.search, $options: 'i' } },
          { description: { $regex: req.query.search, $options: 'i' } }
        ]
      });
    }

    // Add category filter if provided
    if (req.query.category) {
      conditions.push({
        category: { $regex: req.query.category, $options: 'i' }
      });
    }

    // Add price range filter if provided
    if (req.query.minPrice || req.query.maxPrice) {
      const priceFilter = {};
      if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice);
        if (!isNaN(minPrice)) {
          priceFilter.$gte = minPrice;
        }
      }
      if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice);
        if (!isNaN(maxPrice)) {
          priceFilter.$lte = maxPrice;
        }
      }
      if (Object.keys(priceFilter).length > 0) {
        conditions.push({
          price: priceFilter
        });
      }
    }

    // Create query object based on number of conditions
    const query = conditions.length === 1 ? conditions[0] : { $and: conditions };

    // Get total count for pagination info
    const total = await Product.countDocuments(query);

    // Build sort object based on query parameter
    let sort = { createdAt: -1 }; // Default sort by newest first
    if (req.query.sort) {
      switch (req.query.sort) {
        case 'price-low':
          sort = { price: 1 }; // Sort by price low to high
          break;
        case 'price-high':
          sort = { price: -1 }; // Sort by price high to low
          break;
        case 'rating':
          sort = { 'ratings.average': -1, createdAt: -1 }; // Sort by rating (highest first), then by newest
          break;
        case 'featured':
          sort = { 'ratings.average': -1, createdAt: -1 }; // Sort by rating, then by newest
          break;
        default:
          sort = { createdAt: -1 }; // Default sort
      }
    }

    // Get products with pagination
    const products = await Product.find(query)
      .populate({
        path: 'category',
        select: 'name',
        options: { strictPopulate: false } // Don't fail if category doesn't exist
      })
      .skip(skip)
      .limit(limit)
      .sort(sort);

    // Calculate pagination info
    const pagination = {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1
    };

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    // Send a more descriptive error response
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
};

// @desc      Get single product
// @route     GET /api/products/:id
// @access    Public
exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({
        path: 'category',
        select: 'name',
        options: { strictPopulate: false } // Don't fail if category doesn't exist
      })
      .populate({
        path: 'seller',
        select: 'name email',
        options: { strictPopulate: false } // Don't fail if seller doesn't exist
      });

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
};

// @desc      Create new product
// @route     POST /api/products
// @access    Private/Seller
exports.createProduct = async (req, res, next) => {
  try {
    // Add user to req.body
    req.body.seller = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    // Check if it's a validation error to return 400, otherwise 500
    if (error.name === 'ValidationError' || error.code === 11000) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server error while creating product'
      });
    }
  }
};

// @desc      Update product
// @route     PUT /api/products/:id
// @access    Private/Seller
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }

    // Make sure user is the product seller or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    // Check if it's a validation error to return 400, otherwise 500
    if (error.name === 'ValidationError' || error.code === 11000) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server error while updating product'
      });
    }
  }
};

// @desc      Delete product
// @route     DELETE /api/products/:id
// @access    Private/Seller
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found with id of ${req.params.id}`
      });
    }

    // Make sure user is the product seller or admin
    if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
};

// @desc      Get products by seller
// @route     GET /api/products/seller/:id
// @access    Private
exports.getProductsBySeller = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.params.id });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error in getProductsBySeller:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching seller products'
    });
  }
};