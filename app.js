const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics-controllers");
const { getEndpoints } = require("./controllers/endpoints-controller");
const {
  getArticleById,
  getArticles,
} = require("./controllers/articles.controller");
const { getComments } = require("./controllers/comments.controller");

//get topics

app.get("/api/topics", getTopics);

//get endpoints

app.get("/api", getEndpoints);

//get articles by id

app.get("/api/articles/:article_id", getArticleById);

// get articles

app.get("/api/articles", getArticles);

// get comments

app.get("/api/articles/:article_id/comments", getComments);

// handling errors

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Path not found!" });
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
