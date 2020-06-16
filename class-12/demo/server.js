'use strict';

const express = require('express');
const app = express();
require('dotenv').config();
const pg = require('pg');
require('ejs');

const PORT = process.env.PORT || 3001;

// tells express to look in views directory for ejs files
app.set('view engine', 'ejs');

// translates the body/ parses it
app.use(express.urlencoded({extended:true}));

app.get('/', getTasks);
app.get('/add', showAddForm);
app.post('/add', addTask);
app.get('/tasks/:task_id', getOneTask);

function getOneTask(request, response){
  //go to the database, get a specific task using an id and show details of that specific tasks
    // first we are going to have to get the id from the url - request.params
    // go into the database using that id to find that task
    // display that task on its own ejs page
  let id = request.params.task_id;

  let sql = 'SELECT * FROM tasks WHERE id=$1;';
  let safeValues = [id];

  client.query(sql, safeValues)
    .then(sqlResults => {
      console.log(sqlResults.rows);
      // [ { id: 3,
      //   title: 'eat',
      //   description: 'chewing',
      //   completion: 'second breakfast' } ]
      response.status(200).render('details.ejs', {oneTask: sqlResults.rows[0]});
    })
}


function getTasks(request, response){
  // get all of the tasks from my database and display them on my index.ejs page 
  let sql = 'SELECT * FROM tasks;';
  client.query(sql)
    .then(sqlResults => {
      let tasks = sqlResults.rows;
      response.status(200).render('index.ejs', {myToDoTasks: tasks})
    })
}

function showAddForm(request, response){
  // display the add form
  response.status(200).render('add.ejs');
}

function addTask(request, response){
  // collect information from the from and add it to the database
  let {title, description, completion} = request.body;
  let sql = 'INSERT INTO tasks (title, description, completion) VALUES ($1, $2, $3) RETURNING ID;';
  let safeValues = [title, description, completion];

  client.query(sql, safeValues)
    .then(results => {
      console.log(results.rows);
      let id=results.rows[0].id;
      // response.redirect('/');
      response.redirect(`/tasks/${id}`)
    })
}

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));
client.connect()
  .then(() =>{
    app.listen(PORT, () => {
      console.log(`listening on ${PORT}`);
    })
  })