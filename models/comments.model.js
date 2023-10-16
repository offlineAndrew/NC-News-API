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

exports.addComment = (article_id, { author, body }) => {
  if (!author) {
    return Promise.reject({
      status: 400,
      msg: "Username is required!",
    });
  } else if (!body) {
    return Promise.reject({
      status: 400,
      msg: "Comment is required!",
    });
  }
  return fetchArticleById(article_id).then(() => {
    db.query(
      `INSERT INTO comments (article_id, author, comment)
      VALUES ($1, $2, $3)
      RETURNING *;`,
      [article_id, author, body]
    ).then(({ rows }) => rows[0]);
  });
};

exports.deleteComment = (comment_id) => {
  return db.query(
    `DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`,
    [comment_id]
  )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment doesn't exist!" });
      }
      return { comment: result.rows[0] };
    });
};

