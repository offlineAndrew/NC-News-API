const express = require('express');
const app = express();
const {
getTopics
} = require('./controllers/topics-controllers');


app.use(express.json());


app.get('/api/topics', getTopics);

// handling errors

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({msg: 'Server Error!'});
  });









module.exports = app;
