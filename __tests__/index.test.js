const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const endpoints = require("../endpoints.json");
const jestSorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

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

describe.only("/api/articles", () => {
  const getRequest = request(app).get("/api/articles");

  test("GET:200 responds with an array", () => {
    return getRequest.expect(200).then((response) => {
      const { articles } = response.body;
      expect(Array.isArray(articles)).toBe(true);
    });
  });

  test("GET:200 responds with an array of objects with comment_count included", () => {
    return getRequest.then((response) => {
      const { articles } = response.body;
      articles.forEach((article) => {
        expect(article).toHaveProperty("comment_count");
      });
    });
  });
  test("comment_counts has been matched properly", () => {
    return getRequest.then((response) => {
      const { articles } = response.body;
      const articleWithId3 = articles.find((article) => {
        return article.article_id === 3;
      });
      expect(articleWithId3.comment_count).toBe("2");
    });
  });

  test("GET:200 returns an array of articles sorted by created date descendingly", () => {
    return getRequest.then((response) => {
      const { articles } = response.body;
      console.log(articles, "res");
      expect(articles).toBeSortedBy("created_at", {
        descending: true,
      });
    });
  });
});
