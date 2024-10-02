module.exports = {
  products: [
    {
      id: 'redshoes',
      description: 'Red Shoes',
      price: 59.99,
      reviews: () => [
        {
          rating: 5,
          comment: 'These shoes are awesomely red!',
        },
      ],
    },
    {
      id: 'bluejeanpair',
      description: 'Blue Jeans Pair',
      price: 74.99,
      reviews: () => [
        {
          rating: 4,
          comment: 'These shoes are pretty comfy!',
        },
      ],
    },
  ],
};
