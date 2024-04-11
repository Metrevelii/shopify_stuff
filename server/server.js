const express = require('express');
const app = express();

require('dotenv').config();
const mongoose = require("mongoose");
const xss = require('xss-clean');
const mongoSanitize = require( "express-mongo-sanitize" );
const routes = require('./routes')

//mongodb+srv://admin:<password>@cluster0.sc1zaxm.mongodb.net/?retryWrites=true&w=majority
const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`;
mongoose.connect(mongoUri);


// body parse -- newer version:
app.use(express.json());



// sanitize
app.use(xss());
app.use(mongoSanitize());

// routes
app.use('./api', routes);


const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})
