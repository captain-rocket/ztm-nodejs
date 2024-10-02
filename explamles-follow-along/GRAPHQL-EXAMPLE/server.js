const express = require('express');
const { createYoga } = require('graphql-yoga');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const app = express();
const port = 3000;

const resolvers = {
  Query: {
    products: () => [
      {
        id: 'redshoes',
        description: 'Red Shoes',
        price: 59.99,
      },
      {
        id: 'bluejeanpair',
        description: 'Blue Jeans Pair',
        price: 74.99,
      },
    ],
    orders: () => [
      {
        date: '10-2-2004',
        subtotal: 97.98,
        items: [
          {
            product: {
              id: 'redshoes',
              description: 'Old Red Shoes',
              price: 48.99,
            },
            quantity: 2,
          },
        ],
      },
    ],
    reviews: () => [
      {
        rating: 5,
        comment: 'These shoes are awesomely red!',
      },
    ],
  },
};
const typeDefs = `
  type Query {
  products: [Product]
  orders: [Order]
  reviews: [Review]
  }

  type Product {
  id: ID!
  description: String!
  reviews: [Review]
  price: Float!
  }

  type Review {
  rating: Int!
  comment: String
  }

  type Order {
  date: String!
  subtotal: Float!
  items: [OrderItem]
  }

  type OrderItem {
  product: Product!
  quantity: Int!
  }
`;

const schema = makeExecutableSchema({
  typeDefs,
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
