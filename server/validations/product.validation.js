const generalValidation = require('../general/general.validation');
const general = require('../general/general.function');
const productService = require('../services/product.service.js');
const _ = require('lodash');

const productFieldsArr = ['name','category_id','price','img_path'];

const allFieldsExists = (req,res,next)=>{
    return generalValidation.matchFields(req,res,next,productFieldsArr);
};

const fieldsTypeAndContentCorrect = (req, res, next) => {
    const stringFields = _.omit(req.product, "category_id", "price");
    if(generalValidation.checkFieldsStrings(stringFields) && generalValidation.checkFieldNumber(req.product.price)){
        return next()
    }
    return general.handleResponse(res, 400, "Please follow the instructions")
};


const categoryExists = async(req,res,next) => {
    const {id} = req.params;
    try{
        const category = await productService.categoryExists(id);
        if(!_.isEmpty(category)) {
            return next()
        }else{
            return general.handleResponse(res, 400, "Not exists")
        }
    }catch(e) {
        return general.handleResponse(res, 400, e)
    }
};



const productExistsById = async(req,res,next) => {
    let _id;
    _.isEmpty(req.params) ? _id = req.body.product_id : _id = req.params.id;
    try{
        const product = await productService.productExists({_id});
        if(!_.isEmpty(product)) {
            req.product_price = product.price;
            return next()
        }else{
            return general.handleResponse(res, 400, "Product not exists")
        }
    }catch(e) {
        return general.handleResponse(res, 400, e)
    }
};


const productNotExistsByName = async(req,res,next) => {
    req.body.product?req.product = JSON.parse(req.body.product):null;
    let name = req.product.name;
    name = _.startCase(_.toLower(name));
    try{
        const product = await productService.productExists({name});
        if(_.isEmpty(product)) {
            req.product_name = name;
            return next()
        }else{
            if(req.params.id){
                if(req.params.id === product._id.toString()){
                    req.product_name = name;
                    return next()
                }else{
                    return general.handleResponse(res, 400, "Product already exists")
                }
            }
            return general.handleResponse(res, 400, "Product already exists")
        }
    }catch(e) {
        return general.handleResponse(res, 400, e)
    }
};


module.exports = {
    allFieldsExists,
    fieldsTypeAndContentCorrect,
    categoryExists,
    productExistsById,
    productNotExistsByName
};
