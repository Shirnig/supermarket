const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cookieSchema = new Schema({
    cookie: String,
    user: {type:Schema.Types.ObjectId, ref: 'User'}
});

module.exports = cookieSchema;
