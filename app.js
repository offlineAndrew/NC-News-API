const express = require('express');
const app = express();
const { getTopics } = require('./controllers/topics-controllers');
const { getEndpoints } = require('./controllers/endpoints-controller')

//get topics

app.get('/api/topics', getTopics);

//get endpoints

  app.get('/api', getEndpoints);

// handling errors

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'Server Error!'});
  });


module.exports = app;
