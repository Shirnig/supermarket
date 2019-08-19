const _ = require('lodash');
const general = require('../general/general.function');
const cartService = require('../services/cart.service.js');
const orderService = require('../services/order.service.js');
const mongoose = require('mongoose');
const UserSchema = require('../models/user.model');
const User = mongoose.model('User', UserSchema);
const cookieSchema = require('../models/cookie.model');
const Cookie = mongoose.model('Cookie', cookieSchema);

const addUser = (user) => {
    return new Promise(async (resolve, reject) => {
        try{
            let password = user.password;
            user = _.omit(user, ['password']);
            let newUser = new User(user);
            newUser.setPassword(password);
            newUser.save((e, data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(general.relevantUserKeys(newUser))
            })
        }catch{
            return reject()
        }
    })
};


const addCookie = (cookie, user) => {
    return new Promise(async (resolve, reject) => {
        try{
            if(_.isEmpty(cookie)){
                return reject({status: 401, message: "No cookie found"})
            }
            const newCookie = new Cookie({cookie, user});
            newCookie.save((e,data) => {
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

const findUserByValue = (value) => {
    return new Promise(async (resolve, reject) => {
        try{
            User.find(value,(e,user)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(user[0])
            });
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};



const checkCookie = (cookie) => {
    return new Promise(async(resolve,reject) => {
        try{
            Cookie.find({cookie}).populate('user').exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data[0])
            });
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};


const removeCookie = (cookie) => {
    return new Promise(async(resolve,reject) => {
        try{
            Cookie.deleteOne({cookie},(e,data)=>{
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

const action = (type, details)=>{return{type, details}};

const followingAction = async(user_id, isAdmin) => {
    return new Promise(async(resolve,reject) => {
        try {
            if(!isAdmin){
                const cart = await cartService.cartExistsByUser(user_id);
                if (!_.isEmpty(cart)) {
                    if (cart.ordered) {
                        const orderDetails = await orderService.checkOrderExistsByCartId(cart._id);
                        return resolve(action('Start Shopping', orderDetails))
                    }else {
                        const cartDetails = await cartService.getCartTotalPrice(cart);
                        const details = cartDetails ? cartDetails : await cartService.cartExistsByUser(user_id);
                        details.date_created = general.convertDateToClient(details.date_created);
                        return resolve(action('Resume Shopping', {cart: details}));
                    }
                }else {
                    return resolve(action('Start Shopping', ));
                }
            }else{
                return resolve(action('Admin Dashboard'));
            }
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};


module.exports = {
    addUser,
    addCookie,
    findUserByValue,
    checkCookie,
    removeCookie,
    followingAction
};
