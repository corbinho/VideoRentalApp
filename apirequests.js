const mongoose = require('mongoose');
const Joi = require('joi');
const express = require('express');
//const logger = require('./logger');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const config = require('config');
const genres = require('./routes/genres');

//connect to mongoose localhost
mongoose.connect('mongodb://localhost/vidly')
    .then(function () {
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error("Could not connect to MongoDB " + err));

//populate req.body 
app.use(express.json());
//parses encoded url and populate req.body
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static('public'));

//initiate helmet for https
app.use(helmet())
app.use('/api/genres', genres);

if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    console.log("Morgan enabled")
}

//default get request to return hello world
app.get('/', (req, res) => {
    res.send("Hello world!!!!");
});



//PORT variable
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
})