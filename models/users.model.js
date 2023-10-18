const db = require("../db/connection");

exports.fetchUsers = () => {
  const query = `SELECT * FROM users;`;
  return db.query(query).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, msg: "Page not found!" });
    } else {
        console.log(result.rows, "result");
      return result.rows;
    }
  });
};
