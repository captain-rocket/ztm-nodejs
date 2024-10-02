const express = require('express');

const { buildSchema } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');

const app = express();
const port = 3000;

const schema = buildSchema(`
  type Query {
  description: String
  price: Float
}
  `);

const root = {
  description: 'Red Shoe',
  price: 42.99,
};

app.use(
  '/graphql',
  createHandler({
    schema: schema,
    rootValue: root,
  }),
);

app.get('/', (req, res) => res.send('GraphQL is Great‼️‼️'));
app.listen(port, () => console.log(`Running GraphQL server listening on port ${port}!`));
