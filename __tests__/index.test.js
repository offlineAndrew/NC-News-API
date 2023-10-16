const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
const { response } = require("../app");

beforeEach(() => seed(testData));
afterAll(() => db.end());

// topics tests

describe("/api/topics", () => {
  test("GET: 200 sends and array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        });
      });
  });
});

//endpoints test

describe("/api/", () => {
  test("GET:200 responds with and object of API endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

//articles tests

describe("/api/articles/:article_id", () => {
  test("GET: 200 responds with and article by it's id with correct keys", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
        expect(body.article.article_id).toBe(5);
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("GET: 400 responds with bad id", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Invalid input");
      });
  });

  test("GET: 404 responds with well-formed id that does not exist", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Article doesn't exist!");
      });
  });
});

describe("/api/articles", () => {

  test("GET:200 responds with an array of objects with comment_count included", () => {
    return request(app).get("/api/articles").then((response) => {
      const { articles } = response.body;
      articles.forEach((article) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String),
        });
        expect(article).not.toHaveProperty("body");
      });
    });
  });
  test("comment_counts has been matched properly", () => {
    return request(app).get("/api/articles").then((response) => {
      const { articles } = response.body;
      const articleWithId3 = articles.find((article) => {
        return article.article_id === 3;
      });
      expect(articleWithId3.comment_count).toBe("2");
    });
  });

  test("GET:200 returns an array of articles sorted by created date descendingly", () => {
    return request(app).get("/api/articles").then((response) => {
      const { articles } = response.body;
      expect(articles).toBeSortedBy("created_at", {
        descending: true,
      });
    });
  });
});

// comments tests

describe("/api/articles/:article_id/comments", () => {
  test("GET:200 responds with all article comments sorted by created_at desc", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments).toBeSortedBy("created_at", {
          descending: true,
        });

        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });

  test("GET:200 sends an empty array if there is no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments.length).toBe(0);
      });
  });

  test("GET: 400 responds with bad id", () => {
    return request(app)
      .get("/api/articles/dog/comments")
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe("Invalid input");
      });
  });

  test("GET: 404 responds with well-formed id that does not exist", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Article doesn't exist!");
      });
  });
});

test("POST: 201 creates a new comment", () => {
  const newComment = {
    username: "bred_sheeran",
    comment: "Bar is the best place to find love"
  };
  
  return request(app)
    .post("/api/articles/12/comments")
    .send(newComment)
    .expect(201)
    .then((response) => {
     
      console.log(response.body, "response body");

      expect(response.body).toMatchObject(newComment);
    });
});

test("PATCH: 200 responds with updated article", () => {
  return request(app)
  .patch("/api/articles/1/")
  .send({ inc_votes : 1 })
  .expect(200)
  .then((response) => {
    expect(response.body.votes).toBe(101);
  });
});


describe.only("/api/comments/:comment_id", () => {

test("DELETE: 204 responds with no comment", () => {
return request(app)
 .delete("/api/comments/1")
 .expect(204);
});

test("DELETE: 400 responds with bad id", () => {
return request(app)
.delete("/api/comments/dog")
.expect(400)
.then((response) => {
  expect(response.status).toBe(400);
  expect(response.body.msg).toBe("Invalid input");
});
});

test("DELETE: 404 responds with well-formed id that does not exist", () => {
  return request(app)
    .delete("/api/comments/999999")
    .expect(404)
    .then((response) => {
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Comment doesn't exist!"); 
    });
});


});