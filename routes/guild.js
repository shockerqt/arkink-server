import { Router } from 'express';

import Guild from '../models/guild.js';
import { logged } from '../utils/middlewares.js';

const router = Router();

router.get('/:guildId', logged, async (req, res) => {
  const guildId = req.params.guildId;
  const guild = await Guild.findByPk(guildId, {
    attributes: ['id'],
  });

  res.send(guild);
});

router.post('/register', logged, async (req, res) => {
  const tokenData = req.session.tokenData;

  const unregisteredGuilds = await Guild.getUnregisteredGuilds(tokenData);
  // console.log(unregisteredGuilds.map(guild => guild.id).includes(req.body.guildId));
  if (req.body.guildId && unregisteredGuilds.map(guild => guild.id).includes(req.body.guildId)) {
    const guild = await Guild.create({
      id: req.body.guildId,
    });
    
    res.send(guild);
  } else {
    res.end();
  }
  

});


export default router;
