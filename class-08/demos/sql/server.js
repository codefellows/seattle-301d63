'use strict';

const express = require('express');
require('dotenv').config();
const pg = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

app.get('/', (request, response) => {
  console.log('I am alive on the back end');
  response.status(200).send('I am alive on the front end');
});

app.get('/add', (request, response) => {
  // collect information to add to our database
  console.log('on the add route', request.query);
  // request.query = { first: 'Daisy', last: 'Johnson' }
  let first = request.query.first;
  let last = request.query.last;

  let sqlQuery = 'INSERT INTO people (first_name, last_name) VALUES ($1, $2);';
  let safeValue = [first, last];

  client.query(sqlQuery, safeValue)
    .then(() => {})
    .catch()
})

app.get('/select', (request, response) => {
  // see everyone in the database
  let sqlQuery = 'SELECT * FROM people;';

  client.query(sqlQuery)
    .then(sqlResults => {
      console.log(sqlResults.rows);
      response.status(200).send(sqlResults.rows);
    })
    .catch()
})

app.get('*', (request, response) => {
  response.status(404).send('route not found');
});

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })

