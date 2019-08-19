const _ = require('lodash');
const mongoose = require('mongoose');
const OrderSchema = require('../models/order.model');
const Order = mongoose.model('Order', OrderSchema);
const cartService = require('../services/cart.service.js');
const general = require('../general/general.function');

const fonts = {
    Verdana: {
        normal: 'fonts/Verdana-Regular.ttf',
        bold: 'fonts/Verdana-Medium.ttf',
        italics: 'fonts/Verdana-Italic.ttf',
    }
};

const PdfPrinter = require('pdfmake');
const printer = new PdfPrinter(fonts);
const fs = require('fs');



const addOrder = (order, userId, cartId, finalPrice) => {
    return new Promise( (resolve, reject) => {
        try{
            let newOrder = new Order(order);
            newOrder.user_id = userId;
            newOrder.cart_id = cartId;
            newOrder.final_price = finalPrice;
            newOrder.save(async(e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                await cartService.setCartAsOrdered(cartId);
                return resolve()
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};


const checkDate = (date) => {
    return new Promise(async (resolve, reject) => {
        try{
            Order.find(date,(e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data)
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};

const orderExists = (cart_id, user_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Order.find({cart_id, user_id},(e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data[0])
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};


const checkOrderExistsByCartId = async(cartId) => {
    const orderDetails = await orderExistsByCartId(cartId);
    if(!_.isEmpty(orderDetails)){
        let {date_of_order, final_price} = orderDetails;
        date_of_order = general.convertDateToClient(date_of_order);
        return ({order: {date_of_order, final_price}})
    }else{
        return ('no order')
    }
};


const orderExistsByCartId = (cart_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Order.find({cart_id},(e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data[0])
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};


const countOrders = () => {
    return new Promise(async (resolve, reject) => {
        try{
            Order.find({}).countDocuments().exec((e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data)
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};




const generatePDF = () => {
    return new Promise(async (resolve, reject) => {
        try{

            const docDefinition = {
                info: {
                    title: 'awesome Document',
                    author: 'john doe',
                    subject: 'subject of document',
                    keywords: 'keywords for document',
                },
                content: {},

            };



            const options = {

            };
            const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
            pdfDoc.pipe(fs.createWriteStream(`${__dirname}/../receipts/order.pdf`));
            pdfDoc.end();
            return resolve()
        }
        catch(e) {
            return reject({status: 400, message: e})
        }
    })
};



module.exports = {
    addOrder,
    checkDate,
    orderExists,
    checkOrderExistsByCartId,
    countOrders
    //generatePDF
};
