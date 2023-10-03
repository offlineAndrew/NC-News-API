const app = require('../app');
const request = require('supertest');
const db = require ('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const { response } = require('../app');
const endpoints = require('../endpoints.json');


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



//endpoints test

describe('/api/', () => {
    test('GET:200 responds with and object of API endpoints', () => {
    return request(app)
    .get('/api')
    .expect(200).then(({body}) => {
    
    expect(body).toEqual(endpoints);

    for (let endpoint in body) {
        expect(typeof body[endpoint].description).toBe('string');
        
    }
    })
    })
})