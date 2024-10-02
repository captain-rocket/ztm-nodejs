const express = require('express');

const { buildSchema } = require('graphql');
const { createSchema, createYoga } = require('graphql-yoga');

const app = express();
const port = 3000;

const resolvers = {
  Query: {
    description: () => 'Red Shoe',
    price: () => 42.99,
  },
};
const schema = createSchema({
  typeDefs: `type Query {
  description: String
  price: Float
}`,
  resolvers,
});

app.use(
  '/graphql',
  createYoga({
    schema: schema,
  }),
);

app.get('/', (req, res) => res.send('GraphQL is Great‼️‼️'));
app.listen(port, () => console.log(`Running GraphQL server listening on port ${port}!`));
