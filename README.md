# Northcoders News API

## Quick Overview

Welcome to Northcoders News API! This project provides you with an API built using Node.js, allowing interaction with a PostgreSQL (PSQL) database. It follows RESTful principles and adheres to the Model-View-Controller (MVC) pattern. The API offers Create, Read, Update, and Delete (CRUD) operations through various endpoints. During the development, Test Driven Development (TDD) was used to ensure the code met expected outcomes. You can use this API to retrieve articles based on specific queries, post new comments on articles, and delete comments, all related to the nc_news database.

### Hosted Version:

https://andrii-nc-news.onrender.com

## Installation

To run this project on your local computer you will need to:

1. Clone the repository:

```bash
git clone https://github.com/offlineAndrew/NC-News-API.git
```

2. Switch into project directory

```bash
cd NC-News-API
```

3. Install project dependencies:

```bash
npm install
```

4. Create a `.env.test` file with `PGDATABASE=nc_news_test` and a `.env.development` file with `PGDATABASE=nc_news`. These files are required for connecting to the databases.

5. Run database table creation script and seed data:

```bash
npm run setup-dbs
npm run seed
```

6. Start the server:

```bash
npm start
```

### Minimum Requirements

Node.js: v14.0.0
PostgreSQL: v12.0.0
Make sure to have Node.js and PostgreSQL installed with the specified minimum versions before running the project.

### List of devDependencies and dependencies:

```javascript

   "devDependencies": {
   "husky": "^8.0.2",
   "jest": "^27.5.1",
   "jest-extended": "^2.0.0",
   "jest-sorted": "^1.0.14",
   "pg-format": "^1.0.4"
 },
 "dependencies": {
   "cors": "^2.8.5",
   "dotenv": "^16.0.0",
   "express": "^4.18.2",
   "pg": "^8.7.3",
   "supertest": "^6.3.3"
 },

```
