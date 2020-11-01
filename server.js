'use strict';


// Require dependencies
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());
const superAgent = require('superagent');
const pg = require('pg');

app.use(express.urlencoded({extended: true}));
app.use('/public',express.static('./public'));
app.set('view engine','ejs');
// Reqired KEYS
const PORT = process.env.PORT;

app.get('/hello',indexRender);

function indexRender(req,res){
    res.render('pages/index');
}
// server starting function
app.listen(PORT, () => {
    console.log('app is listning on port' + PORT);
});