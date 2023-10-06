const db = require("../db/connection");
const { fetchArticleById } = require("../models/articles.model");

exports.fetchComments = (article_id) => {
  return fetchArticleById(article_id)
    .then(() => {
      return db.query(
        `SELECT * from comments
        WHERE article_id = $1
        ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then((result) => {
      return result.rows;
    });
};
