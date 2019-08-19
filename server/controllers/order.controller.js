const express = require('express');
const router = express.Router();
const orderService = require('../services/order.service.js');
const orderValidation = require('../validations/order.validation.js');
const general = require('../general/general.function');
const generalValidation = require('../general/general.validation');
const cartService = require('../services/cart.service.js');
const cartValidation = require('../validations/cart.validation.js');
const entryValidation = require('../validations/entry.validation.js');

router.use(entryValidation.checkCookie);
router.use(generalValidation.isUser);


router.put('/', cartValidation.cartExists, orderValidation.allFieldsExists, orderValidation.fieldsTypeAndContentCorrect, orderValidation.checkDate, generalValidation.positivePrice, async(req,res) => {
    try{
        await orderService.addOrder(req.body, req.user._id, req.cart._id, req.final_price);
        return general.handleResponse(res, 201,'Order placed successfully')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.post('/check-date-available', orderValidation.dateFieldAndContentCorrect, orderValidation.checkDate, async(req,res) => {
    try{
        return general.handleResponse(res, 200,'Date is available')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});

router.get('/download', orderValidation.orderExists, async(req,res) => {
    try{
        const cart = await cartService.getCart(req.cart);
        //await orderService.generatePDF();
        return general.handleResponse(res, 200,cart)
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});



module.exports = router;
