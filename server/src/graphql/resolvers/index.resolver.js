const userResolver = require('./user.resolver');
const todoResolver = require('./todo.resolver');


const RootResolver = [
    userResolver,
    todoResolver
]

module.exports = RootResolver;