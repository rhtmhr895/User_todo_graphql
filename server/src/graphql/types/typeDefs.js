// graphql/typeDefs.js
const { gql } = require('graphql-tag');
const userTypeDef = require('./user.typeDefs');
const todoTypeDef = require('./todo.typeDef');

const rootTypeDef = gql`
 type Query {
    _: String
  }

  type Mutation {
    _: String
  }
 `

module.exports = [rootTypeDef , userTypeDef, todoTypeDef];
