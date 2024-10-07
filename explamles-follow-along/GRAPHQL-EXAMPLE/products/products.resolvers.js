const productsModel = require('./products.model');
const { GraphQLError } = require('graphql');

module.exports = {
  Query: {
    products: () => {
      return productsModel.getAllProducts();
    },
    productsByPrice: (_, args) => {
      console.log('by price', productsModel.getProductsByPrice(args.min, args.max));
      return productsModel.getProductsByPrice(args.min, args.max);
    },
    product: (_, args) => {
      return productsModel.getProductById(args.id);
    },
  },
  Mutation: {
    addNewProduct: (_, args) => {
      return productsModel.addNewProduct(args.id, args.description, args.price);
    },
    addNewProductReview: async (_, args) => {
      try {
        return await productsModel.postReview(args.id, args.rating, args.comment);
      } catch (error) {
        throw new GraphQLError(error.userMessage, {
          extensions: {
            message: error.message,
            code: error.reason || 'UNKNOWN_ERROR',
            productID: error.productID,
          },
        });
      }
    },
  },
};
