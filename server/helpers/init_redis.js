const redis = require("redis");

const client = redis.createClient({
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
  host: process.env.REDIS_HOSTNAME,
});

client.on("connect", () => {
  console.log("Client connected to redis");
});

client.on("ready", (err) => {
  console.log("Client connected to redis and ready to use");
});

client.on("error", (err) => {
  console.log(err.message);
});

client.on("end", (err) => {
  console.log("Client disconnected from redis");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
