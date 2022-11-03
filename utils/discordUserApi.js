import fetch from 'node-fetch';

import redis from '../utils/redis.js';

export const exchangeCode = async (code) => {
  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.DISCORD_REDIRECT_URI);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  try {
    const response = await fetch(`${process.env.DISCORD_API_ENDPOINT}/oauth2/token`, {
      method: 'POST',
      headers,
      body: params,
    });

    return response;
  } catch (error) {
    console.error('DISCORD API ERROR exchangeCode', error.response.data, error.response.status);
    return error.response;
  }
};

export const authUrl = () => {
  const searchParams = new URLSearchParams({
    'client_id': process.env.DISCORD_CLIENT_ID,
    'redirect_uri': process.env.DISCORD_REDIRECT_URI,
    'response_type': 'code',
    'scope': 'identify guilds guilds.members.read',
  });

  return `https://discord.com/api/oauth2/authorize?${searchParams.toString()}`;
};

export const fetchDiscord = async ({ tokenType, accessToken }, endpoint) => {
  const cacheKey = `${accessToken}${endpoint}`;

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
        authorization: `${tokenType} ${accessToken}`,
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

export const fetchUser = async (token) => await fetchDiscord(token, '/users/@me');
export const fetchUserGuilds = async (token) => await fetchDiscord(token, '/users/@me/guilds');
