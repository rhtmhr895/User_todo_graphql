const { gql } = require('graphql-tag');

module.exports = gql`
    type TodoData {
        name: String!,
        description: String!,
    }
    input TodoDataInput {
        name: String!,
        description: String!,
    }
    type Todo  {
        id: ID,
        name : String,
        todos: [TodoData!]!,
        user : User!
    }

    extend type Query  {
        todo (userId: ID!) : Todo
    }

    extend type Mutation {
        addTodo(name: String!, todos : TodoDataInput!, userId: ID!): Todo!
  }

`