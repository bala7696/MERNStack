const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');


// Get Products - /api/v1/products
// Get Products by search name query = /api/v1/products?keyword=<any product name>

exports.getProducts = catchAsyncError(async (req, res, next) => {
    const resultPerPage = 3

    const apiFeatures = new APIFeatures(Product.find(), req.query).search()
        .filter()
        .paginate(resultPerPage);

    let buildQuery = () => {
        return new APIFeatures(Product.find(), req.query).search()
            .filter()
    }
    //this filterProductsCount will give only the filtered products count
    const filterProductsCount = await buildQuery().query.countDocuments();

    //this totalProductsCount will give all the products from table
    const totalProductsCount = await Product.countDocuments({});

    let productsCount = totalProductsCount;

    if (filterProductsCount != totalProductsCount) {
        productsCount = filterProductsCount;
    }

    // const products = await Product.find();
    // await new Promise(resolve => setTimeout(resolve, 3000))
    const products = await buildQuery().paginate(resultPerPage).query;

    // return next(new ErrorHandler('Unable to send Products', 400))
    res.status(200).json({
        success: true,
        count: productsCount,
        resultPerPage,
        products
    })
})

// Create Product -- /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {

    // Uploading Images array from request (Multiple Images)

    let images = [];

    let BASE_URL = process.env.BACKEND_URL
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }

    if (req.files.length > 0) {
        req.files.forEach((file) => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })

    }
    req.body.images = images;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    })
});

// Get single Product - /api/v1/product/:id

exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'name email');

    if (!product) {
        // return res.status(404).json({
        //     success: false,
        //     message: "Product not found!"
        // })
        return next(new ErrorHandler("Product not found!", 400));

    }

    res.status(201).json({
        success: true,
        product
    })

})

// Update Product  /api/v1/product/:id

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    // Uploading Images array from request (Multiple Images)
    let images = [];

    let BASE_URL = process.env.BACKEND_URL
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`
    }


    // If the old images not cleared by admin then we keep existing images here. 
    if (req.body.imagesCleared === "false") {
        images = product.images
    }

    if (req.files.length > 0) {
        req.files.forEach((file) => {
            let url = `${BASE_URL}/uploads/product/${file.originalname}`;
            images.push({ image: url })
        })

    }
    req.body.images = images;

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found!"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, /* new : true --> it is used to retrive the updated product and store into the product variable */
        runValidators: true /* It is used to validate all the validators in our Model productSchema */
    });

    res.status(200).json({
        success: true,
        product
    })
})

// Delete Product

exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found!"
        })
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Deleted!"
    })
}


// Create Review --- /api/v1/review

exports.createReview = catchAsyncError(async (req, res, next) => {

    const { productId, rating, comment } = req.body;

    const review = {
        user: req.user.id,
        rating,
        comment
    }

    const product = await Product.findById(productId);

    // finding user review exists
    const isReviewed = product.reviews.find(review => {
        return review.user.toString() == req.user.id.toString();
    })

    if (isReviewed) { // updating the review if the current user is already reviewed
        product.reviews.forEach(review => {
            if (review.user.toString() == req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

    } else {
        // creating the review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // find the average of the product reviews
    product.ratings = product.reviews.reduce((acc, reviewItem) => {
        return reviewItem.rating + acc;
    }, 0) / product.reviews.length;

    product.ratings = isNaN(product.ratings) ? 0 : product.ratings

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
    })

})


// Get Reviews --- /api/v1/reviews?id={productId}

exports.getReviews = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.id).populate('reviews.user', 'name email');;

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})


// Delete Review --- /api/v1/review 

exports.deleteReview = catchAsyncError(async (req, res, next) => {

    const product = await Product.findById(req.query.productId);

    // filtering the reviews which doesn't match the deleting review id
    const reviews = product.reviews.filter(review => {
        return review._id.toString() !== req.query.id.toString()
    });

    // number of reviews
    const numOfReviews = reviews.length;

    // finding the average with the filtered reviews
    let ratings = reviews.reduce((acc, reviewItem) => {
        return reviewItem.rating + acc;
    }, 0) / product.reviews.length;

    ratings = isNaN(ratings) ? 0 : ratings;

    // Saving the product document
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        numOfReviews,
        ratings
    })

    res.status(200).json({
        success: true,
    })
});


// Get Admin Products - /api/v1/admin/products

exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products
    });
})