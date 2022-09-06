import { Router } from 'express';
import { fetchUser, fetchUserGuilds } from '../utils/discord.js';

import User from '../models/user.js';
import Guild from '../models/guild.js';
import { logged } from '../utils/middlewares.js';

const router = Router();

router.get('/', logged, async (req, res) => {
  const userData = await fetchUser(req.session.tokenData);

  req.session.userId = userData.id;
  res.send(userData);

  User.upsert({
    ...userData,
    accessToken: req.session.tokenData.accessToken,
  });

});

router.get('/guilds', logged, async (req, res) => {
  const guilds = await Guild.findAll({
    attributes: ['id'],
  });

  const userGuilds = await fetchUserGuilds(req.session.tokenData);

  const myGuilds = userGuilds.filter(guild => guilds.includes(guild.id));

  res.send(myGuilds);
});

router.get('/guilds/unregistered', logged, async (req, res) => {
  const tokenData = req.session.tokenData;

  const unregisteredGuilds = await Guild.getUnregisteredGuilds(tokenData);

  res.send(unregisteredGuilds);
});


export default router;
