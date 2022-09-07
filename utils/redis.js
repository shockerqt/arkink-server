import redis from 'redis';

let redisClient;

const init = async () => {
  redisClient = redis.createClient();
  redisClient.on('error', (error) => console.error(`Error : ${error}`));
  await redisClient.connect();
};

init();

export default redisClient;
