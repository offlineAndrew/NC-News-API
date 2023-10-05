const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getEndpoints } = require("./controllers/endpoints-controller");
const { getArticleById } = require("./controllers/articles.controller");

//get topics

app.get("/api/topics", getTopics);

//get endpoints

app.get("/api", getEndpoints);

//get articles by id

app.get("/api/articles/:article_id", getArticleById);

// handling errors

app.all('*', (req, res, next) => {
  res.status(404).send({msg: 'Path not found!'})
})

app.use((err, req, res, next) => {
  console.log(err);
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({ msg: 'Invalid input' });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
