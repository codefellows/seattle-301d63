// GOAL: to collect information from a form on the backend and send a thank you for your response back

// set up our server - check

// server our public directory - check

// listen on our /contact route for a method of post
  // collect the form information
  // send the thank you back

'use strict';

const express = require('express');
const app = express();

app.use(express.urlencoded({extended: true}));

require('dotenv').config();

const PORT = process.env.PORT || 3001;

// hey express - use this as our front end - serve our front end files here
app.use(express.static('./public'));

app.post('/contact', (request, response) => {
  console.log(request.body);
  // { firstName: 'bob',
  // lastName: 'smith',
  // message: 'hiya',
  // phone: '123-455-8989',
  // contact: 'phone' }

  response.sendFile('thanks.html', {root: 'public'})
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})