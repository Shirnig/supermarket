const _ = require('lodash');
const fs = require('fs');
const mongoose = require('mongoose');
const ProductSchema = require('../models/product.model');
const Product = mongoose.model('Product', ProductSchema);
const CategorySchema = require('../models/category.model');
const Category = mongoose.model('Category', CategorySchema);
const general = require('../general/general.function');

function uploadImg(files) {
    if (!files)
        console.log('No files were uploaded');
    const sampleFile = files.img;
    fs.writeFile(__dirname + '../../../client/dist/client/assets/pictures/' + sampleFile.name, sampleFile.data, err => {
        console.log('#################', err);
    });
}

const addProduct = (product, file, name) => {
    return new Promise(async (resolve, reject) => {
        try{
            let newProduct = new Product(product);
            newProduct.name = name;
            newProduct.save((e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                uploadImg(file);
                return resolve()
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};




const updateProductToDB = (id, product, name) => {
    return new Promise(async(resolve,reject) => {
        try{
            product.name = name;
            Product.updateOne({_id:id},product,(e,data)=>{
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

const updateProduct = (id, product, files, name) => {
    return new Promise(async(resolve,reject)=> {
        try{
            if (!files){
                await updateProductToDB(id, product, name);
            }
            else if (files){
                uploadImg(files);
                await updateProductToDB(id, product, name);
            }
            return resolve()
        }
        catch (err) {
            return reject(err)
        }
    })
};


const getCategories = () => {
    return new Promise(async (resolve, reject) => {
        try{
            Category.find({},(e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                //const categories = data.map(c => c.category_name);
                return resolve({data})
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};


const getProductsByCategory = (category_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Product.find({category_id}).populate('category_id').exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                //const products = general.relevantProductKeys(data);
                return resolve({data})
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};

const getProductsByChar = (name) => {
    return new Promise(async (resolve, reject) => {
        try{
            Product.find({name: {'$regex': `${name}`, '$options': 'i'}}).populate('category').exec((e,data)=>{
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve({data})
            });
        }catch(e){
            return reject({status: 400, message: e})
        }
    })
};

const categoryExists = (_id) => {
    return new Promise(async (resolve, reject) => {
        try{
            Category.find({_id},(e,data)=>{
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

const productExists = (value) => {
    return new Promise(async (resolve, reject) => {
        try{
            Product.find(value,(e,data)=>{
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


const countProducts = () => {
    return new Promise(async (resolve, reject) => {
        try{
            Product.find({}).countDocuments().exec((e,data) => {
                if(e){
                    return reject({status: 400, message: e})
                }
                return resolve(data)
            })
        }catch(e) {
            return reject({status: 400, message: e})
        }
    })
};

module.exports = {
    addProduct,
    updateProduct,
    getCategories,
    getProductsByCategory,
    getProductsByChar,
    categoryExists,
    productExists,
    countProducts
};
