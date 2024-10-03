const express = require('express');
const { createYoga } = require('graphql-yoga');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const app = express();
const port = 3000;

const typesArray = loadFilesSync('**/*', {
  extensions: ['graphql'],
});
const resolversArray = loadFilesSync('**/*', {
  extensions: ['resolvers.js'],
});

const schema = makeExecutableSchema({
  typeDefs: typesArray,
  resolvers: resolversArray,
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
