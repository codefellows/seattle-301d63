'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const superagent = require('superagent');
const cors = require('cors');

const PORT = process.env.PORT || 3001;

app.use(cors());

app.get('/location', (request, response) => {
  let city = request.query.city;
  console.log('on the location route, looking at the request.query', request.query);
  console.log('on the locaiton route, looking at the request.query.city', request.query.city);

  let url = `https://us1.locationiq.com/v1/search.php?key=${process.env.GEO_DATA_API_KEY}&q=${city}&format=json`;

  superagent.get(url)
    .then(resultsFromSuperAgent => {
      let finalObj = new Location(city, resultsFromSuperAgent.body[0]);

      response.status(200).send(finalObj);
    })


  // go to the web and get real information using superagent
  // run that information through the constructor
  // send it to the front end
});

app.get('/trails', (request, response) => {
  console.log('things I got from the front end on the /trails route: ', request.query);

  let {search_query, formatted_query, latitude, longitude} = request.query;
  // { search_query: 'buffalo',
  // formatted_query: 'Buffalo, Erie County, New York, USA',
  // latitude: '42.8867166',
  // longitude: '-78.8783922',
  // page: '1' }

  let url = `https://www.hikingproject.com/data/get-trails`;

  superagent.get(url)
    .query({
      lat: latitude,
      lon: longitude,
      maxDistance: 200,
      key: process.env.TRAIL_API_KEY,
    })
    .then(resultsFromTrails => {
      console.log(resultsFromTrails.body.trails)
      let trailsArr = resultsFromTrails.body.trails;

      const finalArr = trailsArr.map(trailPath => {
        return new Trail(trailPath);
      })
      
      response.status(200).send(finalArr);
    })
})

function Trail(obj){
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url
  this.conditions = obj.conditionStatus
  this.condition_date = new Date(obj.conditionDate).toDateString();
  this.condition_time = obj.conditionDate.slice(11);
}

function Location(searchQuery, obj){
  this.search_query = searchQuery;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
})