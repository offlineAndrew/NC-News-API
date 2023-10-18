const db = require("../db/connection");

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article doesn't exist!" });
      }

      return { article: result.rows[0] };
    });
};

exports.fetchArticles = () => {
  const query = `SELECT articles.author,articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
    COUNT (comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`;

  return db.query(query).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Page not found!" });
    }
    return result.rows;
  });
};

exports.updateArticles = (article_id, inc_votes) => {
  if (isNaN(inc_votes)) {
    return Promise.reject({ status: 400, msg: "Input should be a number!" });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Article doesn't exist!" });
      }
      return result.rows[0];
    });
};
