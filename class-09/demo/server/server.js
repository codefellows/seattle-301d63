'use strict';

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

require('dotenv').config();

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.error(err));

const superagent = require('superagent');

const PORT = process.env.PORT || 3001;

app.get('/location', locationHandler);
app.get('/restaurants', restaurantHandler);
app.use('*', handleNotFound);

function locationHandler(request, response){
  let city = request.query.city;
  let url = 'https://us1.locationiq.com/v1/search.php';

  // let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${city}&format=json`;

  const queryParams = {
    key: process.env.GEOCODE_API_KEY,
    q: city,
    format: 'json', 
    limit: 1
  }

  superagent.get(url)
    .query(queryParams)
    .then(data => {
      console.log('results from superagent', data.body);
      const geoData = data.body[0];  // we are taking the first one ...
      const location = new Location(city, geoData);

      response.status(200).send(location);
    }).catch()
};

function restaurantHandler(request, response){
  console.log('this is our restaurant route', request.query);
  // { search_query: 'seattle',
  // formatted_query: 'Seattle, King County, Washington, USA',
  // latitude: '47.6038321',
  // longitude: '-122.3300624',
  // page: '1' }

  const page = request.query.page;
  const numPerPage = 5;
  const start = (page - 1) * numPerPage; // this allows us to start with the 1-5 and then 5-10, and then 10-15 etc...etc...

  const url = 'https://developers.zomato.com/api/v2.1/search';

  const queryParams = {
    lat: request.query.latitude,
    start: start,
    count: numPerPage,
    lng: request.query.longitude
  }

  superagent.get(url)
    .set('user-key', process.env.ZOMATO_API_KEY)
    .query(queryParams)
    .then(data => {
      console.log('data from superagent', data.body);
      let restaurantArray = data.body.restaurants; // this is the array that I want
      console.log('this is my restaurantArray', restaurantArray[0]);

      const finalRestaurants = restaurantArray.map(eatery => {
        return new Restaurant(eatery);
      })

      response.status(200).send(finalRestaurants);
    })
};

function handleNotFound(request, response){
  response.status(404).send('this route does not exist');
};

// Location Constructor function (searchQuery is the city we are looking for)
function Location(searchQuery, obj){
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function Restaurant(obj){
  this.restaurant = obj.restaurant.name;
  this.cuisines = obj.restaurant.cuisines;
  this.locality = obj.restaurant.location.locality;
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })