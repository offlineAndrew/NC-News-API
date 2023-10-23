const articles = require("../db/data/test-data/articles");
const {
  fetchArticleById,
  fetchArticles,
  updateArticles,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((response) => {
      res.status(200).send({ article: response.article });
    })
    .catch((err) => next(err));
};

exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  return fetchArticles(topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticles = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return updateArticles(article_id, inc_votes)
    .then((response) => {
      res.status(200).send({ response });
    })
    .catch((err) => next(err));
};
