const express = require('express');
const morgan = require('morgan');
require('dotenv').config()

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// cors
const cors = require('cors');
var corsOptions = {
    origin: process.env.URL_AUTHORIZED, // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));


const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
//const saleRoutes = require('./routes/sale');
const uploadRoutes = require('./routes/upload');
const buyRoutes = require('./routes/buy');

app.use('/api', authRoutes);
app.use('/api', productRoutes);
//app.use('/api', saleRoutes);
app.use('/api', uploadRoutes);
app.use('/api', buyRoutes);

app.use('/', express.static('ClientProd'));
app.get('*', function(req, res) {
    res.sendFile('/ClientProd/index.html',{ root: '.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})