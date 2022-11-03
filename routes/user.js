import { Router } from 'express';
import { fetchUser, fetchUserGuilds } from '../utils/discordUserApi.js';

import User from '../models/user.js';
import Guild from '../models/guild.js';
import { logged } from '../utils/middlewares.js';
import { fetchBotGuilds } from '../utils/discordBotApi.js';

const router = Router();

router.get('/', logged, async (req, res) => {
  const { tokenData } = req.session;

  const response = await fetchUser(tokenData);

  if (response.ok) {
    const userData = response.data;
    req.session.userId = userData.id;
    res.send(userData);
    User.upsert({
      ...userData,
      accessToken: req.session.tokenData.accessToken,
    });
  } else {
    const { data, status } = response;
    res.status(status).send(data);
  }

});

router.get('/guilds', logged, async (req, res) => {
  const { tokenData } = req.session;

  if (!tokenData) {
    res.status(404).send({ message: 'Not logged in' });
    return;
  }

  const [
    userGuildsResponse,
    botGuildsResponse,
  ] = await Promise.all([fetchUserGuilds(tokenData), fetchBotGuilds()]);

  if (userGuildsResponse.ok && botGuildsResponse.ok) {
    const botGuilds = botGuildsResponse.data;
    const userGuilds = userGuildsResponse.data;

    const botGuildIds = botGuilds.map(guild => guild.id);

    const myGuilds = userGuilds.filter(guild => botGuildIds.includes(guild.id));
    res.send(myGuilds);
  } else {
    console.log(userGuildsResponse.ok, botGuildsResponse.ok);
    res.status(402).send({ message: 'An error occurred with the request' });
  }

});

router.get('/guilds/unregistered', logged, async (req, res) => {
  const { tokenData } = req.session;

  const response = await fetchUserGuilds(tokenData);

  if (response.ok) {
    const userGuilds = await response.data;
    const unregisteredGuilds = await Guild.getMyUnregisteredGuilds(userGuilds);
    res.send(unregisteredGuilds);
  } else {
    const data = await response.data;
    const { status } = response;
    res.status(status).send(data);
  }

});


export default router;
