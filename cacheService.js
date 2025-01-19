const redis = require("redis");
const client = redis.createClient();

client.on("error", (err) => {
  console.error("Redis error:", err);
});

//Connect to Redis
client.connect();

const get = async (key) => {
  try {
    return await client.get(key);
  } catch (error) {
    console.error("Error fetching from cache:", error);
  }
};

const set = async (key, value, ttl = 3600) => {
  try {
    await client.setEx(key, ttl, value);
  } catch (error) {
    console.error("Error setting cache:", error);
  }
};

const del = async (key) => {
  try {
    await client.del(key);
  } catch (error) {
    console.error("Error deleting from cache:", error);
  }
};

module.exports = { get, set, del };
