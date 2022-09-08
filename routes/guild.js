import { Router } from 'express';

import { logged } from '../utils/middlewares.js';
import { fetchGuild } from '../utils/discordBotApi.js';

const router = Router();

router.get('/:guildId', logged, async (req, res) => {
  const { guildId } = req.params;

  const guildResponse = await fetchGuild(guildId);

  if (guildResponse.ok) {
    const requestedGuild = await guildResponse.json();
    console.log('FDETCH GUILD', requestedGuild);
    res.send(requestedGuild);
  } else {
    const data = await guildResponse.json();
    const { status } = guildResponse;
    console.log('/guilds/:guildId response ERROR', status, data, guildResponse);
    res.status(status).send(data);
  }

});

// router.post('/register', logged, async (req, res) => {
//   const { tokenData } = req.session;

//   const response = await fetchUserGuilds(tokenData);

//   if (response.ok) {
//     const userGuilds = await response.json();
//     const unregisteredGuilds = await Guild.getMyUnregisteredGuilds(userGuilds);

//     if (req.body.guildId && unregisteredGuilds.map(guild => guild.id).includes(req.body.guildId)) {
//       const guild = await Guild.create({
//         id: req.body.guildId,
//       });

//       res.send(guild);
//     } else {
//       res.status(400).send({ message: 'Couldn\'t register the guild.' });
//     }

//   } else {
//     const data = await response.json();
//     const { status } = response;
//     console.log('/guilds/unregistered response ERROR', status, data);
//     res.status(status).send(data);
//   }


// });


export default router;
