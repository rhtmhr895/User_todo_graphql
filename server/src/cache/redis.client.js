const Redis = require('ioredis');

const client = new Redis({
    host: '172.17.0.2',
    port: 6379,
    // db: 0 // Ensure this matches the database number you're viewing in the Redis Stack Browser
  });

client.on('connect', () => {
  console.log('Connected to Redis');
  console.log(`Connected to Redis database: ${client.options.db}`);

});

client.on('error', (err) => {
  console.error('Redis connection error:', err);
});



module.exports = { client };