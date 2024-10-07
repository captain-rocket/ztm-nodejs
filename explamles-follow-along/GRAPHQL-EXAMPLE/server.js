const cors = require('cors');
const express = require('express');

const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
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

async function startApolloServer() {
  const app = express();

  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
  });

  const server = new ApolloServer({
    schema,
  });

  await server.start();

  app.use(cors());
  app.use(express.json());

  app.use('/graphql', expressMiddleware(server));

  app.get('/', (req, res) => res.send('GraphQL is Great‼️‼️'));
  app.listen(port, () => console.log(`Running GraphQL server listening on port ${port}!`));
}
startApolloServer();
