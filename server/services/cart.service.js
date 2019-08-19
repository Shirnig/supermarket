const _ = require('lodash');
const mongoose = require('mongoose');
const CartSchema = require('../models/cart.model');
const Cart = mongoose.model('Cart', CartSchema);
const ItemSchema = require('../models/item.model');
const Item = mongoose.model('Item', ItemSchema);
const general = require('../general/general.function');


const addCart = (id) => {
    return new Promise(async (resolve, reject) => {
        try{
            let newCart = new Cart();
            newCart.user_id = id;
            newCart.save((e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(newCart._id)
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};


const cartExists = (_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Cart.find({_id}).populate('user_id').exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data[0])
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};


const cartExistsByUser = (user_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Cart.find({user_id}).sort({$natural: -1}).limit(1).exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data[0])
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};


const addItem = (item, cartId, price) => {
    return new Promise(async (resolve, reject) => {
        try{
            let newItem = new Item(item);
            newItem.cart_id = cartId;
            newItem.caclTotalPrice(price);
            newItem.save((e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve()
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};



const getItemByCart = (product_id, cart_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Item.find({product_id, cart_id}).populate({ path: 'product_id', select: 'price' }).exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data[0])
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};


const updateAmount = (product_id, cart_id, amount, price) => {
    return new Promise(async (resolve, reject) => {
        try{
            const totalPrice = general.calculateItemTotalPrice(amount, price);
            const toUpdate = {amount:amount, total_price: totalPrice};
            Item.updateOne({product_id, cart_id},toUpdate,(e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve()
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};


const cartMetadata = (total_cart_price, cart) => {
    return {
        total_cart_price,
        date_created: cart.date_created,
        ordered: cart.ordered
    }
};

const cartData = (cart, data) => {
    const total_cart_price = general.calculateCartTotalPrice(data);
    const itemsData = general.relevantItemKeys(data);
    return {
        cart: {
            metadata: cartMetadata(total_cart_price, cart),
            data:itemsData}}
};

const getCart = (cart) => {
    return new Promise(async (resolve, reject) => {
        try{
            const cart_id = cart._id;
            Item.find({cart_id}).populate('product_id').populate('cart_id').exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                const relevantData = cartData(cart, data);
                return resolve(relevantData);
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};



const getCartTotalPrice = (cart) => {
    return new Promise(async (resolve, reject) => {
        try{
            const cart_id = cart._id;
            Item.find({cart_id}).select('total_price -_id').exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                const total_cart_price = general.calculateCartTotalPrice(data);
                const final = cartMetadata(total_cart_price, cart);
                return resolve(final)
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};


const setCartAsOrdered = (cartId) => {
    return new Promise(async (resolve, reject) => {
        try{
            Cart.updateOne({_id: cartId},{ordered: true},(e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve()
            })
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};

const deleteItem = (product_id, cart_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Item.deleteOne({product_id, cart_id},(e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve()
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};

const deleteAllItemsInCart = (cart_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Item.deleteMany({cart_id},(e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve()
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};





module.exports = {
    addCart,
    cartExists,
    cartExistsByUser,
    addItem,
    getItemByCart,
    updateAmount,
    getCart,
    setCartAsOrdered,
    deleteItem,
    deleteAllItemsInCart,
    getCartTotalPrice
};
