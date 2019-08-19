const orderService = require('../services/order.service.js');
const general = require('../general/general.function');
const generalValidation = require('../general/general.validation');
const _ = require('lodash');


const orderFieldsArr = ['city','street','date_to_send','credit_card'];

const allFieldsExists = (req,res,next)=>{
    return generalValidation.matchFields(req,res,next,orderFieldsArr);
};


const checkCreditCard = (credit_card) => credit_card.toString().length === 16;

const validationsToCheck = (req, arr) => {
    return (generalValidation.checkFieldsStrings(arr) &&
        generalValidation.checkFieldNumber(req.body.credit_card) &&
        checkCreditCard(req.body.credit_card) &&
        generalValidation.checkFieldDate(req.body.date_to_send))
};

const fieldsTypeAndContentCorrect = (req, res, next) => {
    const stringFields = _.omit(req.body, ["credit_card"]);
    const results = validationsToCheck(req, stringFields);
    if(results){
        return next()
    }
    return general.handleResponse(res, 400, "One of the fields is missing")
};


const dateFieldAndContentCorrect = (req, res, next) => {
    const fieldExists = _.isEqual(Object.keys(req.body)[0], 'date_to_send');
    const typeCorrect = generalValidation.checkFieldDate(req.body.date_to_send);
    if(fieldExists && typeCorrect){
        return next()
    }
    return general.handleResponse(res, 400, "Please follow the instructions")
};


const checkDate = async(req,res,next) => {
    try{
        const {date_to_send} = req.body;
        let dates = await orderService.checkDate({date_to_send});
        if(dates.length < 4) {
            return next()
        }else {
            return general.handleResponse(res, 400, `Pick another date, shipping is full`)
        }
    }catch (e) {
        return general.handleResponse(res, 400, e)
    }
};

const orderExists = async(req,res,next) => {
    try{
        let order = await orderService.orderExists(req.cart._id, req.user._id);
        if(!_.isEmpty(order)) {
            req.cartId = order.cart_id;
            return next()
        }else {
            return general.handleResponse(res, 400, `order not found`)
        }
    }catch (e) {
        return general.handleResponse(res, 400, e)
    }
};


module.exports = {
    checkDate,
    orderExists,
    allFieldsExists,
    fieldsTypeAndContentCorrect,
    dateFieldAndContentCorrect
};
