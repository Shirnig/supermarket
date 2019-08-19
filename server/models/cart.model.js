const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const general = require('../general/general.function');

const CartSchema = new Schema({
    user_id: {type:Schema.Types.ObjectId, ref: 'User'},
    date_created: {type: String, default: general.setTodayDate()},
    ordered: {type: Boolean, default: false}
});


module.exports = CartSchema;
