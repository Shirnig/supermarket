const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const general = require('../general/general.function');

const ItemSchema = new Schema({
    product_id: {type:Schema.Types.ObjectId, ref: 'Product'},
    amount: Number,
    total_price: Number,
    cart_id: {type:Schema.Types.ObjectId, ref: 'Cart'}
});


ItemSchema.methods.caclTotalPrice = function(price) {
    this.total_price = general.calculateItemTotalPrice(this.amount, price);
};


module.exports = ItemSchema;
