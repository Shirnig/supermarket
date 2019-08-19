const general = require('../general/general.function');
const generalService = require('../general/general.service');
const cartService = require('../services/cart.service.js');
const _ = require('lodash');
const moment = require('moment');

const isAdmin = (req,res,next)=>{
    if(req.user.is_admin){
        return next()
    }
    return general.handleResponse(res, 403, 'Not allowed')
};

const isUser = (req,res,next)=>{
    if(!req.user.is_admin){
        return next()
    }
    return general.handleResponse(res, 403, 'Not allowed')
};

const checkFieldsStrings = (stringFields) => _.every(_.map(stringFields), field => {return !_.isEmpty(field) && field.charAt(0) !== ' '});

const checkFieldNumber = (field) => typeof field === "number";

const checkFieldDate = (date) =>{
    const newDate = moment(date, "YYYY-MM-DD").format('DD-MM-YYYY');
    return moment(newDate, "DD-MM-YYYY", true).isValid();
};


const matchFields = (req,res,next,arr) => {
    req.body.product?req.product = JSON.parse(req.body.product):null;
    if(_.isEqual(_.keysIn(req.product?req.product:req.body),arr)){
        return next()
    }
    return general.handleResponse(res, 400, "Please fill all fields")
};


const positivePrice = (req,res,next)=>{
    let x;
    req.final_price ? x = req.final_price : x = req.product.price;
    return x > 0 ? next() : general.handleResponse(res, 400, "Price should be positive, adjust changes")
};


const objectExists = async(req,res,next) => {
    const {id} = req.params;
    try{
        const object = await cartService.cartExists(id);
        if(!_.isEmpty(object)) {
            return next()
        }
        else{
            return general.handleResponse(res, 400, "Not exists")
        }
    }
    catch(e) {
        return general.handleResponse(res, 400, e)
    }
};


module.exports = {
    isAdmin,
    isUser,
    checkFieldsStrings,
    checkFieldNumber,
    checkFieldDate,
    matchFields,
    positivePrice,
    objectExists
};
