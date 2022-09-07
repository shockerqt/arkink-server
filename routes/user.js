import { Router } from 'express';
import { fetchUser, fetchUserGuilds } from '../utils/discord.js';

import User from '../models/user.js';
import Guild from '../models/guild.js';
import { logged } from '../utils/middlewares.js';

const router = Router();

router.get('/', logged, async (req, res) => {
  const { tokenData } = req.session;

  const response = await fetchUser(tokenData);

  if (response.ok) {
    const userData = await response.json();
    req.session.userId = userData.id;
    res.send(userData);
    User.upsert({
      ...userData,
      accessToken: req.session.tokenData.accessToken,
    });
  } else {
    const data = await response.json();
    const { status } = response;
    console.log('/GUILDS response ERROR', status, data);
    res.status(status).send(data);
  }

});

router.get('/guilds', logged, async (req, res) => {
  const { tokenData } = req.session;

  const response = await fetchUserGuilds(tokenData);

  if (response.ok) {
    const userGuilds = await response.json();
    const guildInstances = await Guild.findAll({ attributes: ['id'] });
    const guilds = guildInstances.map(guild => guild.id);

    const myGuilds = userGuilds.filter(guild => guilds.includes(guild.id));
    res.send(myGuilds);
  } else {
    const data = await response.json();
    const { status } = response;
    console.log('/GUILDS response ERROR', status, data);
    res.status(status).send(data);
  }

});

router.get('/guilds/unregistered', logged, async (req, res) => {
  const { tokenData } = req.session;

  const response = await fetchUserGuilds(tokenData);

  if (response.ok) {
    const userGuilds = await response.json();
    const unregisteredGuilds = await Guild.getMyUnregisteredGuilds(userGuilds);
    res.send(unregisteredGuilds);
  } else {
    const data = await response.json();
    const { status } = response;
    console.log('/guilds/unregistered response ERROR', status, data);
    res.status(status).send(data);
  }

});


export default router;
