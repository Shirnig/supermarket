const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: String,
    category_id: {type:Schema.Types.ObjectId, ref: 'Category'},
    price: Number,
    img_path: String
});

module.exports = ProductSchema;
