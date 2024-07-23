require('dotenv').config()
const express = require('express');
const server = express();
const port = process.env.PORT;
const cors = require('cors');
const http = require('http')
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const typeDefs = require('./graphql/types/typeDefs');
const resolvers = require('./graphql/resolvers/index.resolver');
const { ApolloServerPluginDrainHttpServer } =require ('@apollo/server/plugin/drainHttpServer');
const httpServer = http.createServer(server);
const { client } = require('./cache/redis.client');

server.use(cors());
server.use(express.json());


/**
 * server initialization
 */
async function startServer() {
    try {
        const { connection } = require('./db/index');
        const graphQlServer = new ApolloServer({
            typeDefs,
            resolvers,
            plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],

        });
        // Note you must call `start()` on the `ApolloServer`
        // instance before passing the instance to `expressMiddleware`
        await graphQlServer.start();
        
        // db connection
        connection();
        server.use(
            '/graphql',
            cors(),
            express.json(),
            expressMiddleware(graphQlServer, {
                context: async ({ req }) => ({ req }),
              })
        );
        server.use("/test", (req, res) => {
            res.jsonp({message : "HEllo from normal REST API"});
        })
        httpServer.listen(port, () => console.log(`Server is running on port ${port}`));
    } catch (err) {
        console.log("Error in server.js file ::", err)
    }
}

startServer();
