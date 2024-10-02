const path = require('path');
const express = require('express');
const { createYoga } = require('graphql-yoga');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const app = express();
const port = 3000;

const typesArray = loadFilesSync(path.join(__dirname, '**/*.graphql'));

const resolvers = {
  Query: {
    products: () => require('./products/products.model').products,
    orders: () => require('./orders/orders.model').orders,
  },
};

const schema = makeExecutableSchema({
  typeDefs: typesArray,
  resolvers,
});

app.use(
  '/graphql',
  createYoga({
    schema,
    graphiql: true,
  }),
);

app.get('/', (req, res) => res.send('GraphQL is Great‼️‼️'));
app.listen(port, () => console.log(`Running GraphQL server listening on port ${port}!`));
