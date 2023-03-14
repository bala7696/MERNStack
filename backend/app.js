const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, "config/config.env") });
/* based on OS the file's path will be changed. so we are using default node js path library  */

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
/*  this static fn  we use to define the uploads folder as a staic folder.
then only we can define the avatar url location in register api.
see authController.js --> registerUser fn avatar concept 

*/


const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');
const { dirname } = require('path');

app.use('/api/v1/', products);
app.use('/api/v1/', auth);
app.use('/api/v1/', order);
app.use('/api/v1/', payment);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'));
    })
}

app.use(errorMiddleware);

module.exports = app;