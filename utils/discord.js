import axios from 'axios';

export const fetchDiscord = () => {

};

export const exchangeCode = async (code) => {
  const params = new URLSearchParams();
  params.append('client_id', process.env.DISCORD_CLIENT_ID);
  params.append('client_secret', process.env.DISCORD_CLIENT_SECRET);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', process.env.CLIENT_BASE_URL);

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'application/json',
  }
  try {
    const response = await axios({
      url: `${process.env.DISCORD_API_ENDPOINT}/oauth2/token`,
      method: 'POST',
      headers,
      data: params,
    });
    return response.data;
  }
  catch (error) {
    console.error(error);
    return false;
  }
};

export const fetchUser = async ({ tokenType, accessToken }) => {
  const response = await axios(`${process.env.DISCORD_API_ENDPOINT}/users/@me`, {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    }
  });

  const userData = {
    id: response.data.id,
    username: response.data.username,
    discriminator: response.data.discriminator,
    avatar: response.data.avatar,
    banner: response.data.banner,
    locale: response.data.locale,
  }

  return userData;
};

export const fetchUserGuilds = async ({ tokenType, accessToken }) => {
  try {
    const response = await axios(`${process.env.DISCORD_API_ENDPOINT}/users/@me/guilds`, {
      headers: {
        authorization: `${tokenType} ${accessToken}`,
      }
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const authUrl = () => {
  const searchParams = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.CLIENT_BASE_URL,
    response_type: 'code',
    scope: 'identify guilds guilds.members.read',
  });

  return `https://discord.com/api/oauth2/authorize?${searchParams.toString()}`;
};
