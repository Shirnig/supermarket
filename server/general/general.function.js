const crypto = require('crypto');
const _ = require('lodash');
const moment = require('moment');


const handleResponse = (res, code, data) => res.status(code).json(data);
const handleFailureResponse = (res, e) => res.status(e.status).json(e.message);



const hashing = (password) => {
    const secret = 'abcdefg';
    return crypto.createHmac('sha256', secret)
        .update(password)
        .digest('hex')
};

const setTodayDate = () => {
    const date = new Date();
    return moment(date).format('DD-MM-YYYY');
};

const convertDateToClient = (date) => {
    return moment(date, 'DD-MM-YYYY').format('LL');
};

const relevantUserKeys = (user) => {return _.omit(user.toJSON(),'user_id','hash','email','__v')};

const relevantProductKeys = (arr) => arr.map(({_id, name, price, img_path}) =>
    (({_id, name, price, img_path})));

const relevantItemKeys = (arr) => arr.map(({_id, product_id, amount, total_price}) =>
    (({
        _id,
        name:product_id.name,
        product_id: product_id._id,
        category:product_id.category_id,
        img_path:product_id.img_path,
        amount,
        total_price})));

const calculateItemTotalPrice = (amount, price) => {
    return amount * price;
};

const calculateCartTotalPrice = (arr) => {
    return _.sumBy(arr, 'total_price')
};


module.exports = {
    hashing,
    setTodayDate,
    convertDateToClient,
    handleResponse,
    handleFailureResponse,
    relevantUserKeys,
    relevantProductKeys,
    relevantItemKeys,
    calculateItemTotalPrice,
    calculateCartTotalPrice
};
