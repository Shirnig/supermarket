const express = require('express');
const router = express.Router();
const productService = require('../services/product.service.js');
const productValidation = require('../validations/product.validation.js');
const general = require('../general/general.function');
const generalValidation = require('../general/general.validation');
const entryValidation = require('../validations/entry.validation.js');

router.use(entryValidation.checkCookie);

router.get('/categories', async(req,res) => {
    try{
        const categories = await productService.getCategories();
        return general.handleResponse(res, 200, categories)
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});

router.get('/category/:id', productValidation.categoryExists, async(req,res) => {
    try{
        const {id} = req.params;
        const products = await productService.getProductsByCategory(id);
        return general.handleResponse(res, 200, products)
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.get('/:productName', async(req,res) => {
    try{
        const {productName} = req.params;
        const products = await productService.getProductsByChar(productName);
        return general.handleResponse(res, 200, products);
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.use(generalValidation.isAdmin);


router.post('/admin/check-product-name/:name', productValidation.productNotExistsByName, async(req,res) => {
    try{
        return general.handleResponse(res, 200,'Name non taken')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.use(productValidation.allFieldsExists, productValidation.fieldsTypeAndContentCorrect, generalValidation.positivePrice);


router.put('/admin', productValidation.productNotExistsByName, async(req,res) => {
    try{
        await productService.addProduct(req.product, req.files, req.product_name);
        return general.handleResponse(res, 201,'Product added successfully')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});


router.patch('/admin/:id', productValidation.productNotExistsByName, productValidation.productExistsById, async(req,res) => {
    try{
        const {id} = req.params;
        console.log(req.product);
        await productService.updateProduct(id, req.product, req.files, req.product_name);
        return general.handleResponse(res, 200,'Product updated successfully')
    }catch(e){
        return general.handleFailureResponse(res, e)
    }
});



module.exports = router;
