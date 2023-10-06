const articles = require("../db/data/test-data/articles");
const { fetchArticleById, fetchArticles } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((response) => {
      res.status(200).send({ article: response.article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  return fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
