const products = [
  {
    id: 'redshoes',
    description: 'Red Shoes',
    price: 59.99,
    reviews: [
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
    reviews: [
      {
        rating: 4,
        comment: 'These shoes are pretty comfy!',
      },
    ],
  },
];

function getAllProducts() {
  return products;
}

function getProductsByPrice(min, max) {
  return products.filter((product) => product.price >= min && product.price <= max);
}

function getProductById(id) {
  return products.find((product) => product.id === id);
}

module.exports = {
  getAllProducts,
  getProductsByPrice,
  getProductById,
};
