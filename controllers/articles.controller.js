const { fetchArticleById } = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((response) => {
    res.status(200).send({ article: response.article });
    })
    .catch((err) => next(err));
};
