const Todos = require('../../schema/todo')
const { TodoInputError } = require('apollo-server-errors');
const User = require('../../schema/user');
const { client } = require('../../cache/redis.client');

module.exports = {
    Query: {
        todo: async (_, {userId}) => {
            try {
                const cacheValue = await client.get(`todos : ${userId}`);
                if (cacheValue) return JSON.parse(cacheValue);
                const todo = await Todos.findOne({userId : userId, isDeleted: false });
                console.log(todo)
                if (!todo) {
                    throw new Error("Todos not found");
                }
                console.log(userId)
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                const data = { ...todo._doc, user }

                // Include user data in the response and save the data to redis server
                await client.set(`todos : ${userId}`,JSON.stringify(data));
                await client.expire(`todos : ${userId}`,30000);
                return { ...todo._doc, user };
                // return todo;
            } catch (error) {
                return error;
            }
        }
    },
    Mutation: {
        addTodo: async (_, { name, todos, userId }) => {
            const newTodo = new Todos({
                name,
                todos,
                userId
            });
            try {
                const res = await newTodo.save();
                return { ...res._doc };
            } catch (error) {
                return error;
            }
        }
    }
}