const { Brand } = require('../models/brand');
const { ApiError} = require('../middleware/apiError');
const httpStatus = require('http-status');


const addBrand = async(brandname) => {
    try {
        const brand = new Brand({
            name: brandname
        })

        await brand.save();
        return brand;

    } catch (error) {
        throw error;
    }
}

// this function will find the brand by id and return it

const getBrandById = async(id) => {
    try {
    const brand = await Brand.findById(id);
    if (!brand) throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
    return brand;

    } catch (error) {
        throw error;
    }
}

const deleteBrandById = async(id) =>{
    try{
        const brand = await Brand.findByIdAndDelete(id); // findByIdAndRemove doesnt work on new versions of mongoDB;
        return brand;
    } catch(error){
        throw error;
    }
}

const getBrands = async(args) => {
    try {
        // {
        //     "order":"desc",
        //     "limit":3
        // } or default :
        let order = args.order ? args.order : "asc";
        let limit = args.limit ? args.limit : 5;


        // gives us everything that we have .find({})
        const brands = await Brand
        .find({})
        .sort([
            ["_id", order]
        ])
        .limit(limit); 
        if (!brands) throw new ApiError(httpStatus.NOT_FOUND, 'Brand not found');
        return brands;

    } catch (error) {
        throw error;
    }
}

module.exports = {
    addBrand,
    getBrandById,
    deleteBrandById,
    getBrands
}