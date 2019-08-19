const entryService = require('../services/entry.service.js');
const general = require('../general/general.function');
const generalValidation = require('../general/general.validation');
const cartService = require('../services/cart.service.js');
const _ = require('lodash');
const validator = require('validator');

const signUpFieldsArr = ['user_id','email','password','first_name','last_name','city','street'];
const loginFieldsArr = ['email','password'];
const checkMail = (email) => validator.isEmail(email);
const checkId = (user_id) => user_id.toString().length === 9;

const allFieldsExists = (req, res, next) => {
    const checkURL = req.originalUrl.includes('login');
    if(checkURL){
        return generalValidation.matchFields(req,res,next,loginFieldsArr)
    }else if(!checkURL){
        return generalValidation.matchFields(req,res,next,signUpFieldsArr)
    }
};


const validationsToCheck = (email, user_id, allFields) => {
    return (checkMail(email) &&
        checkId(user_id) &&
        generalValidation.checkFieldsStrings(allFields) &&
        generalValidation.checkFieldNumber(user_id))
};

const fieldsTypeAndContentCorrect = (req, res, next) => {
    const {user_id, email} = req.body;
    const allFields = _.omit(req.body, 'user_id');
    const results = validationsToCheck(email, user_id, allFields);
    if(results){
        return next()
    }
    return general.handleResponse(res, 400, "Please follow the instructions")
};

const validateEmptyFields = (req, res, next) => {
    if (_.every(_.map(req.body), field => !_.isEmpty(field))) {
        return next()
    }
    return general.handleResponse(res, 400, "Fields cannot be empty");
};

const emailTypeCorrect = (req, res, next) => {
    let email;
    req.body.email ? email = req.body.email : email = req.params.email;
    if(checkMail(email)){
        return next()
    }
    return general.handleResponse(res, 400, "Email not valid")
};

const idTypeCorrect = (req, res, next) => {
    let id;
    req.body.user_id ? id = req.body.user_id : id = req.params.id;
    if(checkId(id)){
        req.id = id;
        return next()
    }
    return general.handleResponse(res, 400, "Id not valid")
};



const verifyUser = async(req,res,next) => {
    let {email,password} = req.body;
    try{
        let user = await entryService.findUserByValue({email});
        if(_.isEmpty(user)) {
            return general.handleResponse(res, 401, "User not found")
        }else {
            const hash = general.hashing(password);
            if (hash === user.hash) {
                req.user = general.relevantUserKeys(user);
                req.cookie = req.cookies['connect.sid'];
                return next()
            }else {
                return general.handleResponse(res, 401, "Wrong Password")
            }
        }
    }catch (e) {
        return general.handleResponse(res, 400, e)
    }
};


const idExists = async(req,res,next) => {
    let user_id;
    req.body.user_id ? user_id = req.body.user_id : user_id = req.params.id;
    try{
        const user = await entryService.findUserByValue({user_id});
        if(_.isEmpty(user)) {
            return next()
        }else {
            return general.handleResponse(res, 400, "Id already exists")
        }
    }catch (e) {
        return general.handleResponse(res, 400, e)
    }
};


const emailExists = async(req,res,next) => {
    let email;
    req.body.email ? email = req.body.email : email = req.params.email;
    try{
        const user = await entryService.findUserByValue({email});
        if(_.isEmpty(user)) {
            return next()
        }else {
            return general.handleResponse(res, 400, "Email already exists")
        }
    }catch (e) {
        return general.handleResponse(res, 400, e)
    }
};



const checkCookie = async(req,res,next) => {
    const cookieValue = req.cookies['connect.sid'];
    try{
        const data = await entryService.checkCookie(cookieValue);
        if(!_.isEmpty(data)) {
            req.user = general.relevantUserKeys(data.user);
            const cart = await cartService.cartExistsByUser(req.user._id);
            if(cart) req.cart = cart;
            return next()
        }else {
            return general.handleResponse(res, 401, 'Unauthenticated')
        }
    }catch(e){
        return general.handleResponse(res, 400, e)
    }
};


module.exports = {
    allFieldsExists,
    fieldsTypeAndContentCorrect,
    validateEmptyFields,
    emailTypeCorrect,
    idTypeCorrect,
    verifyUser,
    emailExists,
    idExists,
    checkCookie,
};
