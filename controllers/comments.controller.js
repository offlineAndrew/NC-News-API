const { response } = require('../app');
const {
  fetchComments,
  addComment,
  deleteComment,
} = require('../models/comments.model');

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  return fetchComments(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => next(err));
};

exports.postComments = (req, res, next) => {
  const { article_id } = req.params;
  addComment(article_id, req.body)
    .then(({ comment }) => {
      res.status(201).send({ comment: req.body });
    })
    .catch((err) => next(err));
};

exports.deleteComments = (req, res, next) => {
  const { comment_id } = req.params;
  return deleteComment(comment_id)
    .then((comment) => {
      res.status(204).send({ comment });
    })
    .catch((err) => next(err));
};
