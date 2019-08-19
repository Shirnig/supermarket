const express = require('express');
const router = express.Router();
const entryService = require('../services/entry.service.js');
const entryValidation = require('../validations/entry.validation.js');
const general = require('../general/general.function');
const orderService = require('../services/order.service.js');
const productService = require('../services/product.service.js');



router.put('/sign-up', entryValidation.allFieldsExists, entryValidation.fieldsTypeAndContentCorrect, entryValidation.emailExists, entryValidation.idExists, async(req,res) => {
    try{
        const cookie = req.cookies['connect.sid'];
        const user = await entryService.addUser(req.body);
        await entryService.addCookie(cookie, user._id);
        return general.handleResponse(res, 201,'User added successfully')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});

router.post('/sign-up/check-id/:id', entryValidation.idTypeCorrect, entryValidation.idExists, async(req,res) => {
    try{
        return general.handleResponse(res, 200,'Id non taken')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});

router.post('/sign-up/check-email/:email', entryValidation.emailTypeCorrect, entryValidation.emailExists, async(req,res) => {
    try{
        return general.handleResponse(res, 200,'Email non taken')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.post('/login', entryValidation.allFieldsExists, entryValidation.validateEmptyFields, entryValidation.emailTypeCorrect, entryValidation.verifyUser, async(req,res) => {
    try{
        await entryService.addCookie(req.cookie, req.user._id);
        const action = await entryService.followingAction(req.user._id, req.user.is_admin);
        const details = {user: req.user, action};
        return general.handleResponse(res, 200, details)
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.get('/info', async(req,res) => {
    try{
        const countOrders = await orderService.countOrders();
        const countProducts = await productService.countProducts();
        const count = {orders: countOrders, products: countProducts};
        return general.handleResponse(res, 200, count)
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.get('/logout', async(req,res) => {
    try{
        await entryService.removeCookie(req.cookies['connect.sid']);
        req.session.destroy();
        return general.handleResponse(res, 200, 'logout successfully')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


//authentication
router.use(entryValidation.checkCookie);


router.get('/authenticated', async(req,res) => {
    try{
        const action = await entryService.followingAction(req.user._id, req.user.is_admin);
        const details = {user: req.user, action};
        return general.handleResponse(res, 200, details)
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});



module.exports = router;
