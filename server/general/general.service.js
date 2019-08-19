const _ = require('lodash');
const moment = require('moment');


const objectExists = (model, _id) => {
    return new Promise(async (resolve, reject) => {
        try{
            model.find({_id},(err,data)=>{
                return resolve(data)
            });
        }
        catch(e){
            return reject({status: 400, message: e})
        }
    })
};

module.exports = {
    objectExists
};
