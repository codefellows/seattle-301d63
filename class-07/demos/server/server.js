'use strict';

const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/location', (request, response) => {
  let city = request.query.city;

  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEO_DATA_API_KEY}&q=${city}&format=json`;

  superagent.get(url)
    .then(resultsFromSuperAgent => {
      let finalObj = new Location(city, resultsFromSuperAgent.body[0]);

      response.status(200).send(finalObj);
    })


  // go to the web and get real information using superagent
  // run that information through the constructor
  // send it to the front end
})

app.get('/weather', (request, response) => {
  let search_query = request.query.search_query;
  console.log('stuff I got from the front end on the weather route', search_query);

  let url = `https://api.weatherbit.io/v2.0/current?city=${search_query}&key=${process.env.WEATHER_API_KEY}`;

  superagent.get(url)
    .then(resultsFromSuperAgent => {
      console.log(resultsFromSuperAgent.body);
    }).catch(err => console.log(err));
})

function Location(searchQuery, obj){
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})
