const express = require('express');
const router = express.Router();
const cartService = require('../services/cart.service.js');
const cartValidation = require('../validations/cart.validation.js');
const general = require('../general/general.function');
const productValidation = require('../validations/product.validation.js');
const entryValidation = require('../validations/entry.validation.js');
const generalValidation = require('../general/general.validation');

router.use(entryValidation.checkCookie);
router.use(generalValidation.isUser);


router.put('/', cartValidation.cartNotExists, async(req,res) => {
    try{
        await cartService.addCart(req.user._id);
        return general.handleResponse(res, 201, 'Cart created')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});

router.use(cartValidation.cartExists);


//get all items in cart
router.get('/', async(req,res) => {
    try{
        const cart = await cartService.getCart(req.cart);
        return general.handleResponse(res, 200, cart)
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


//remove all items in cart
router.delete('/empty-cart', async(req,res) => {
    try{
        await cartService.deleteAllItemsInCart(req.cart._id);
        return general.handleResponse(res, 200, 'Cart is now empty')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.delete('/remove-item/:id', productValidation.productExistsById, async(req,res) => {
    try{
        const {id} = req.params;
        await cartService.deleteItem(id, req.cart._id);
        return general.handleResponse(res, 200, 'Item deleted')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.use(productValidation.productExistsById, cartValidation.allFieldsExists, cartValidation.fieldsTypeAndContentCorrect, cartValidation.amountPositive);


//update items' amount
router.patch('/update', async(req,res) => {
    try{
        const {product_id, amount} = req.body;
        await cartService.updateAmount(product_id, req.cart._id, amount, req.product_price);
        return general.handleResponse(res, 200,'Amount updated')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});



router.put('/add-item', cartValidation.itemNotExists, async(req,res) => {
    try{
        await cartService.addItem(req.body, req.cart._id, req.product_price);
        return general.handleResponse(res, 201,'Item added successfully into the cart')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


module.exports = router;
