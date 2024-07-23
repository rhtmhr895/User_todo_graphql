const { gql } = require('graphql-tag');
module.exports = gql`
type User {
    id: ID!
    email: String!
    token: String
    firstName : String!,
    lastName : String!,
    mobile : String!
}
    
    extend type Query {
    me: User
    }

    extend type Mutation {
    register(firstName: String!, lastName : String!, email: String!, password: String!, mobile : String!): User!
    login(email: String!, password: String!): User!
  }
  `