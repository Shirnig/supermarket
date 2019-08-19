const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const general = require('../general/general.function');

const UserSchema = new Schema({
    user_id: Number,
    email: String,
    first_name: String,
    last_name: String,
    hash : String,
    city: String,
    street: String,
    is_admin: {type: Boolean, default: false}
});


UserSchema.methods.setPassword = function(password) {
    this.hash = general.hashing(password);
};


module.exports = UserSchema;
