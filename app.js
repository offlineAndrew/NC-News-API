const express = require("express");
const { getTopics } = require("./controllers/topics-controllers");
const { getEndpoints } = require("./controllers/endpoints-controller");
const {
  getArticleById,
  getArticles,
  patchArticles,
} = require("./controllers/articles.controller");
const {
  getComments,
  postComments,
  deleteComments,
} = require("./controllers/comments.controller");

const app = express();
app.use(express.json());

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

//post comments

app.post("/api/articles/:article_id/comments", postComments);

//patch Articles

app.patch("/api/articles/:article_id", patchArticles);

//delete comments

app.delete("/api/comments/:comment_id", deleteComments);

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
  console.log(err, "psql err");
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Username doesn't exist!" });
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err, "500 error");
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
