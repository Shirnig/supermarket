const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const entryRouter = require('./controllers/entry.controller.js');
const productRouter = require('./controllers/product.controller.js');
const cartRouter = require('./controllers/cart.controller.js');
const orderRouter = require('./controllers/order.controller.js');


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload());

app.use(session({
    secret:'secret',
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 100,
        httpOnly: true,
        secure: false
    }
}));

app.use(express.static('../client/dist/client'));

app.use('/shopping/entry',entryRouter);
app.use('/shopping/product',productRouter);
app.use('/shopping/cart',cartRouter);
app.use('/shopping/order',orderRouter);


const listen = () => new Promise((resolve, reject) => {
    app.listen(4008, err => {
        if(err) {
            return reject(err)
        }
        return resolve()
    });
});


const init = async () => {
    try{
        await mongoose.connect('mongodb://localhost:27017/project_4', {useNewUrlParser:true});
        await listen();
        console.log('Server Up, DB Ready');
    }
    catch (e) {
        console.log(e);
    }
};


init();

app.use('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'../client/dist/client','index.html'))
});
