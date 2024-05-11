const { Product } = require("../models/product");
const { ApiError } = require("../middleware/apiError");
const httpStatus = require("http-status");
const mongoose = require('mongoose');

const addProduct = async (body) => {
  try {
    const product = new Product({
      ...body,
    });
    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
};

const getProductById = async (_id) => {
  try {
    const product = await Product.findById(_id).populate("brand");
    if (!product) throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
    return product;
  } catch (error) {
    throw error;
  }
};

const updateProductById = async (_id, body) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id },
      { $set: body },
      { new: true }
    );

    if (!product)
      throw new ApiError(httpStatus.NOT_FOUND, "Product not found.");
    return product;
  } catch (error) {
    throw error;
  }
};

const deleteProductById = async( _id  ) => {
    try {
        const product = await Product.findByIdAndDelete(_id);
        if(!product) throw new ApiError(httpStatus.NOT_FOUND, 'Product not found');
        return product
    } catch(error) {
        throw error
    }
}

const allProducts = async(req) => {
  try {
    const product = await Product
    .find({})
    .populate('brand')
    .sort([
      ['_id', req.query.order]
    ]);
    //.limit(parseInt(req.query.limit));// ar mushs ratomgac

    return product;
  } catch(error) {
    throw error;
  }
}

const paginateProducts = async(req) => {
  try {

      // const example = {
      //     "keywords":"elite",
      //     "brand":["605ad1e70738255874af0972","605ad1e70738255874af0972"],
      //     "min":200, --    
      //     "max":500,  --    
      //     "frets":24
      // }

      let aggQueryArray = [];

      // Filtering by keywords -- aka. title

      if (req.body.keywords && req.body.keywords != '') {
        const re = new RegExp(`${req.body.keywords}`, 'gi');

        aggQueryArray.push({
          $match: { model: { $regex: re } }
        });
      }

      // Filtering by brand
      if(req.body.brand && req.body.brand.length > 0){
        let newBrandsArray = req.body.brand.map((item)=>(
          new mongoose.Types.ObjectId(item)
        ));
        // $in searches inside the newBrandsArray
        aggQueryArray.push({
            $match:{ brand:{ $in: newBrandsArray }}
        });
      }

      if (req.body.min && req.body.min > 0 || req.body.max && req.body.max > 10000) {
        // we can do also $range: {price [0, 100]}} but not supported for free accounts

         if (req.body.min) {
          aggQueryArray.push({ $match: { price: { $gt: req.body.min }}});
          // minimum price. $gt
         }
         if (req.body.max) {
          aggQueryArray.push({ $match: { price: { $lt: req.body.max }}});
          // minimum price. $gt
         }
      }

      // add populate for the brand
      aggQueryArray.push(
      {
        $lookup : {
          from : "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand"
        },

      },
      { $unwind: '$brand'}
    
      )

     

      /////////

      let aggQuery = Product.aggregate(aggQueryArray);
      const options = {
          page:req.body.page,
          limit:4,
          sort:{ date:'desc' }
      };
      const products = await Product.aggregatePaginate(aggQuery,options);
      return products;
  } catch(error) {
      throw error
  }
}
module.exports = {
  addProduct,
  getProductById,
  updateProductById,
  deleteProductById,
  allProducts,
  paginateProducts
};
