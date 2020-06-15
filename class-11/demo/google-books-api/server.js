'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
  // body parser - takes the form data and parses it so that we can read it - translater
app.use(express.urlencoded({ extended: true }));
  // look in the public folder and serve files from it (index.html/ css/ frontend.js)
app.use(express.static('public'));
  // go look in the views folder for the ejs files
app.set('view engine', 'ejs');

//Routes
app.get('/', (request, response) => {
  response.render('index.ejs');
});

app.get('/searches', (request, response) => {
  response.render('./searches/new.ejs');
});

app.post('/searches', (request, response) => {
  // console.log(request.body.search);
  // { search: [ 'the great gatsby', 'title' ] }
  // { search: [ 'jeff noon', 'author' ] }

  let query = request.body.search[0];
  let titleOrAuthor = request.body.search[1];

  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(titleOrAuthor === 'title'){
    url+=`+intitle:${query}`;
  }else if(titleOrAuthor === 'author'){
    url+=`+inauthor:${query}`;
  }

  superagent.get(url)
    .then(results => {
      // console.log(results.body.items);
      let bookArray = results.body.items;

      const finalBookArray = bookArray.map(book => {
        return new Book(book.volumeInfo)
      });

      console.log(finalBookArray)

      response.render('show.ejs', {searchResults: finalBookArray})
    })
})


// HELPER FUNCTIONS
// Only show part of this to get students started
function Book(info) {
  const placeholderImage = 'https://i.imgur.com/J5LVHEL.jpg';

  this.title = info.title ? info.title : 'no title available';

}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})
