const cartService = require('../services/cart.service.js');
const generalValidation = require('../general/general.validation');
const general = require('../general/general.function');
const _ = require('lodash');


const itemFieldsArr = ['product_id','amount'];

const allFieldsExists = (req,res,next)=>{
    return generalValidation.matchFields(req,res,next,itemFieldsArr);
};


const fieldsTypeAndContentCorrect = (req, res, next) => {
    const stringFields = _.omit(req.body, 'amount');
    if(generalValidation.checkFieldsStrings(stringFields) && generalValidation.checkFieldNumber(req.body.amount)){
        return next()
    }
    return general.handleResponse(res, 400, "Please follow the instructions")
};



const amountPositive = (req,res,next)=>{
    let check = req.body.amount;
    return check >= 0 ? next() : general.handleResponse(res, 400, "Amount should be positive")
};


const checkCartNotOrdered = async(cart,req,res,next) => {
    if(!cart.ordered){
        if(req.body.credit_card){
            const cartData = await cartService.getCartTotalPrice(cart);
            req.final_price = cartData.total_cart_price;
            return next();
        }
        return next();
    }
    else{
        return general.handleResponse(res, 400, "Cart already ordered")
    }
};


const cartNotExists = async(req,res,next) => {
    try{
        const {cart} = req;
        if(_.isEmpty(cart) || cart.ordered) {
            return next()
        }else{
            return general.handleResponse(res, 400, "you have an open cart, resume shopping")
        }
    }catch(e) {
        return general.handleResponse(res, 400, e)
    }
};


const cartExists = async(req,res,next) => {
    try{
        const {cart} = req;
        if(!_.isEmpty(cart)) {
            return checkCartNotOrdered(cart,req,res,next);
        }else{
            return general.handleResponse(res, 400, "Cart not exists")
        }
    }catch(e) {
        return general.handleResponse(res, 400, e)
    }
};



const itemNotExists = async(req,res,next) => {
    const {product_id} = req.body;
    try{
        const item = await cartService.getItemByCart(product_id,req.cart._id);
        if(_.isEmpty(item)) {
            return next()
        }else{
            return general.handleResponse(res, 400, "item exists, you can update amount")
        }
    }catch(e) {
        return general.handleResponse(res, 400, e)
    }
};




module.exports = {
    allFieldsExists,
    fieldsTypeAndContentCorrect,
    amountPositive,
    cartExists,
    cartNotExists,
    itemNotExists
};
