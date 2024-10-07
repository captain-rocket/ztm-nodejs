const { filter } = require('graphql-yoga');

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

function addNewProduct(id, description, price) {
  const newProduct = {
    id,
    price,
    description,
    reviews: [],
  };
  products.push(newProduct);
  return newProduct;
}

function postReview(id, rating, comment) {
  const newReview = { rating, comment };
  const matchingProduct = products.find((product) => product.id === id);

  if (!matchingProduct) {
    throw {
      message: `No matching Product ID with ${id}`,
      productID: id,
      reason: 'PRODUCT_NOT_FOUND',
      userMessage: `We could not find the product you are trying to review with and id of '${id}'`,
    };
  }

  try {
    matchingProduct.reviews.push(newReview);
    return newReview;
  } catch (error) {
    console.error('Error adding review:', error.message);
    throw {
      message: `Error posting review: ${error.message}`,
      customCode: 'REVIEW_POST_ERROR',
      userMessage: 'An error occurred while posting your review. Please try again later.',
    };
  }
}
module.exports = {
  getAllProducts,
  getProductsByPrice,
  getProductById,
  addNewProduct,
  postReview,
};
