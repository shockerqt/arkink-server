import fetch from 'node-fetch';

import redis from '../utils/redis.js';

export const fetchBot = async (endpoint) => {
  const cacheKey = `bot${endpoint}`;

  try {
    const cacheResults = await redis.get(cacheKey);

    if (cacheResults) {
      return {
        cached: true,
        data: JSON.parse(cacheResults),
        status: 304,
        ok: true,
      };
    }

    const response = await fetch(`${process.env.DISCORD_API_ENDPOINT}${endpoint}`, {
      headers: {
        authorization: `Bot ${process.env.BOT_DISCORD_TOKEN}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const { status, ok } = response;
      redis.set(cacheKey, JSON.stringify(data), {
        EX: process.env.REDIS_DISCORD_DATA_LIFE,
        NX: true,
      });
      return {
        cached: false,
        data,
        status,
        ok,
      };
    } else {
      const data = await response.json();
      const { status, ok } = response;
      return {
        data,
        status,
        ok,
      };
    }

  } catch (error) {
    const data = error.response.json();
    return {
      data,
      status: error.response.status,
    };
  }
};

export const fetchGuild = async (guildId) => await fetchBot(`/guilds/${guildId}`);
export const fetchBotGuilds = async () => {
  const response = await fetchBot('/users/@me/guilds');
  // const guildInstances = await Guild.findAll({ attributes: ['id'] });
  console.log(response);
  return response;
};
export const fetchGuildMember = async (guildId, userId) => await fetchBot(`/guilds/${guildId}/members/${userId}`);
