'use strict';


// Require dependencies
const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(cors());
const superagent = require('superagent');
const pg = require('pg');

const DATABASE_URL = process.env.DATABASE_URL;

const client = new pg.Client(DATABASE_URL);

app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static('./public'));
app.set('view engine', 'ejs');
// Reqired KEYS
const PORT = process.env.PORT;

app.get('/', indexRender);

function indexRender(req, res) {
    client.query(`SELECT author, title, image_url FROM books`).then(data=>{
       
        res.render('pages/index',{savedBook:data});
    })
    

};

app.get('/form', formRender);
app.post('/searches', searchFunction);
app.get('/*',handelError);

function formRender(req, res) {
    res.render('pages/searches/new.ejs');
}



let regex=/^(https).*/g;
function Book(item) {
  if(item.title){
    this.title = item.title;
  }else{this.title = 'Not found';}
  if(item.imageLinks.thumbnail){
    if(regex.test(item.imageLinks.thumbnail)){
      this.image = item.imageLinks.thumbnail;
    }else{
      this.image = item.imageLinks.thumbnail.replace('http', 'https');
    }
  }else{this.image = `https://i.imgur.com/J5LVHEL.jpg`;}
  if(item.authors){
    this.authors = item.authors;
  }else{this.authors = 'Not found'; }
  if(item.description){
    this.description = item.description;
  }else{this.description ='Not found'; }
  this.isbn = item.industryIdentifiers.type + ' ' + item.industryIdentifiers.identifier;
}

function searchFunction(req, res) {
    
    let q = '';
    if (req.body.search[1] === 'title') { q = `+intitle:${req.body.search[0]}` }
    if (req.body.search[1] === 'author') { q = `+inauthor:${req.body.search[0]}` }

    superagent.get(`https://www.googleapis.com/books/v1/volumes?q=${q}`)
    
    .then(apiResponse => apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => res.render('pages/searches/show', { searchResults: results }));
    
    
}
function handelError(req,res){
    res.render('pages/error');
    };

// server starting function
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log('app is listning on port' + PORT);
    });
}).catch(err => {
    console.log('Sorry there is an error' + err);
});