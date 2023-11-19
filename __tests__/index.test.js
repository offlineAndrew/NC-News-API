const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const endpoints = require('../endpoints.json');

beforeEach(() => seed(testData));
afterAll(() => db.end());

// topics tests

describe('/api/topics', () => {
  test('GET: 200 sends and array of topics', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe('string');
          expect(typeof topic.description).toBe('string');
        });
      });
  });
});

//endpoints test

describe('/api/', () => {
  test('GET:200 responds with and object of API endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual(endpoints);
      });
  });
});

//articles tests

describe('/api/articles/:article_id', () => {
  test.only("GET: 200 responds with and article by it's id with correct keys", () => {
    return request(app)
      .get('/api/articles/5')
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe('object');
        expect(body.article.article_id).toBe(5);
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comments_count: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test('GET: 400 responds with bad id', () => {
    return request(app)
      .get('/api/articles/dog')
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Invalid input');
      });
  });

  test('GET: 404 responds with well-formed id that does not exist', () => {
    return request(app)
      .get('/api/articles/999999')
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Article doesn't exist!");
      });
  });
});

describe('/api/articles', () => {
  test('GET:200 responds with an array of objects with comment_count included', () => {
    return request(app)
      .get('/api/articles')
      .then((response) => {
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
          expect(article).not.toHaveProperty('body');
        });
      });
  });
  test('comment_counts has been matched properly', () => {
    return request(app)
      .get('/api/articles')
      .then((response) => {
        const { articles } = response.body;
        const articleWithId3 = articles.find((article) => {
          return article.article_id === 3;
        });
        expect(articleWithId3.comment_count).toBe('2');
      });
  });

  test('GET:200 returns an array of articles sorted by created date descendingly', () => {
    return request(app)
      .get('/api/articles')
      .then((response) => {
        const { articles } = response.body;
        expect(articles).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});

describe('patch article', () => {
  test('PATCH: 200 responds with updated article', () => {
    return request(app)
      .patch('/api/articles/1/')
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.response.votes).toBe(101);
      });
  });

  test('PATCH: 400 responds with bad input', () => {
    return request(app)
      .patch('/api/articles/dog/')
      .send({ inc_votes: '1' })
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Invalid input');
      });
  });
  test('PATCH: 404 responds with well-formed id that does not exist', () => {
    return request(app)
      .patch('/api/articles/999999/')
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Article doesn't exist!");
      });
  });
});

test('PATCH: 400 responds when inc_votes is not a number', () => {
  return request(app)
    .patch('/api/articles/1/')
    .send({ inc_votes: 'one' })
    .expect(400)
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Input should be a number!');
    });
});

//topics query tests
describe('/api/articles?topic=mitch', () => {
  test('GET:200 responds with and array of articles filtered by topic', () => {
    return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(article.topic).toBe('mitch');
        });
      });
  });
});

test('GET:200 responds with an empty array if there are no articles with that topic', () => {
  return request(app)
    .get('/api/articles?topic=paper')
    .expect(200)
    .then((response) => {
      const { articles } = response.body;
      expect(articles.length).toBe(0);
    });
});

test.only('GET:404 responds if no topic exists', () => {
  return request(app)
    .get('/api/articles?topic=bananas')
    .then((response) => {
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe('The specific topic does not exist!');
    });
});

// comments tests

describe('/api/articles/:article_id/comments', () => {
  test('GET:200 responds with all article comments sorted by created_at desc', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments).toBeSortedBy('created_at', {
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

  test('GET:200 sends an empty array if there is no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then((response) => {
        const comments = response.body;
        expect(comments.length).toBe(0);
      });
  });

  test('GET: 400 responds with bad id', () => {
    return request(app)
      .get('/api/articles/dog/comments')
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Invalid input');
      });
  });

  test('GET: 404 responds with well-formed id that does not exist', () => {
    return request(app)
      .get('/api/articles/999999/comments')
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Article doesn't exist!");
      });
  });
});

test('POST: 201 creates a new comment', () => {
  const newComment = {
    username: 'butter_bridge',
    body: 'Bar is the best place to find love',
  };

  return request(app)
    .post('/api/articles/12/comments')
    .send(newComment)
    .expect(201)
    .then(({ body }) => {
      expect(body.comment).toMatchObject(newComment);
    });
});

test('POST:201 ignores unnecessary properties', () => {
  const newComment = {
    username: 'butter_bridge',
    body: 'Bar is the best place to find love',
    cheese: 'cheddar',
    ham: 'ham',
  };

  return request(app)
    .post('/api/articles/12/comments')
    .send(newComment)
    .expect(201);
});

test('POST: 400 responds with bad input', () => {
  const newComment = {
    username: 'butter_bridge',
    body: 'Bar is the best place to find love',
  };

  return request(app)
    .post('/api/articles/dog/comments')
    .send(newComment)
    .expect(400)
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Invalid input');
    });
});

test('POST: 404 responds with well-formed id that does not exist', () => {
  const newComment = {
    username: 'butter_bridge',
    body: 'Bar is the best place to find love',
  };
  return request(app)
    .post('/api/articles/999999/comments')
    .send(newComment)
    .expect(404)
    .then((response) => {
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Article doesn't exist!");
    });
});

test('POST: 400 responds with missing body', () => {
  const newComment = {
    username: 'butter_bridge',
  };
  return request(app)
    .post('/api/articles/12/comments')
    .send(newComment)
    .expect(400)
    .then((response) => {
      expect(response.status).toBe(400);
      expect(response.body.msg).toBe('Comment is required!');
    });
});

test('POST:404 responds when username does not exist', () => {
  const newComment = {
    username: 'bred_sheeran',
    body: 'Bar is the best place to find love',
  };
  return request(app)
    .post('/api/articles/12/comments')
    .send(newComment)
    .expect(404)
    .then((response) => {
      expect(response.status).toBe(404);
      expect(response.body.msg).toBe("Username doesn't exist!");
    });
});

describe('Delete comments', () => {
  test('DELETE: 204 responds with no comment', () => {
    return request(app).delete('/api/comments/1').expect(204);
  });

  test('DELETE: 400 responds with bad id', () => {
    return request(app)
      .delete('/api/comments/dog')
      .expect(400)
      .then((response) => {
        expect(response.status).toBe(400);
        expect(response.body.msg).toBe('Invalid input');
      });
  });

  test('DELETE: 404 responds with well-formed id that does not exist', () => {
    return request(app)
      .delete('/api/comments/999999')
      .expect(404)
      .then((response) => {
        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Comment doesn't exist!");
      });
  });
});

// users tests

describe('/api/users', () => {
  test('GET:200 responds with all users', () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then((response) => {
        const { users } = response.body;

        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
