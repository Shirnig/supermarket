const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const general = require('../general/general.function');

const OrderSchema = new Schema({
    user_id: String,
    cart_id: String,
    final_price: Number,
    city: String,
    street: String,
    date_to_send: String,
    date_of_order: {type: String, default: general.setTodayDate()},
    credit_card: Number,
});


module.exports = OrderSchema;
