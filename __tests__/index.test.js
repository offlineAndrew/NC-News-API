const app = require('../app');
const request = require('supertest');
const db = require ('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const { response } = require('../app');


beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api/topics", () => {
test('GET: 200 sends and array of topics', () => {
    return request(app)
    .get('/api/topics').expect(200)
    .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string');
        })
    })
})
})