import { Router } from 'express';

import Guild from '../models/guild.js';
import { logged } from '../utils/middlewares.js';
import { fetchGuild, fetchUserGuilds } from '../utils/discord.js';

const router = Router();

router.get('/:guildId', logged, async (req, res) => {
  const { tokenData } = req.session;
  const { guildId } = req.params;

  const guild = await Guild.findByPk(guildId, {
    attributes: ['id'],
  });

  if (!guild) res.status(403).send({ message: 'Permission denied.' });

  // const response = await fetchUserGuilds(tokenData);

  // if (response.ok) {
  //   const userGuilds = await response.json();
  //   const myRegisteredGuilds = await Guild.getMyRegisteredGuilds(userGuilds);
  //   const requestedGuild = myRegisteredGuilds.find(myGuild => guildId === myGuild.id);
  //   console.log(requestedGuild);
  //   res.send(requestedGuild);
  // } else {
  //   const data = await response.json();
  //   const { status } = response;
  //   console.log('/guilds/unregistered response ERROR', status, data);
  //   res.status(status).send(data);
  // }

  const response = await fetchGuild(tokenData, guildId);

  if (response.ok) {
    const requestedGuild = await response.json();
    console.log('FDETCH GUILD', requestedGuild);
    res.send(requestedGuild);
  } else {
    const data = await response.json();
    const { status } = response;
    console.log('/guilds/:guildId response ERROR', status, data, response);
    res.status(status).send(data);
  }

});

router.post('/register', logged, async (req, res) => {
  const { tokenData } = req.session;

  const response = await fetchUserGuilds(tokenData);

  if (response.ok) {
    const userGuilds = await response.json();
    const unregisteredGuilds = await Guild.getMyUnregisteredGuilds(userGuilds);

    if (req.body.guildId && unregisteredGuilds.map(guild => guild.id).includes(req.body.guildId)) {
      const guild = await Guild.create({
        id: req.body.guildId,
      });

      res.send(guild);
    } else {
      res.status(400).send({ message: 'Couldn\'t register the guild.' });
    }

  } else {
    const data = await response.json();
    const { status } = response;
    console.log('/guilds/unregistered response ERROR', status, data);
    res.status(status).send(data);
  }


});


export default router;
