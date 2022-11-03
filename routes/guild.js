import { Router } from 'express';

import { logged, raidManager } from '../utils/middlewares.js';
import { fetchGuild } from '../utils/discordBotApi.js';

const router = Router();

router.get('/:guildId', logged, async (req, res) => {
  const { guildId } = req.params;

  const guildResponse = await fetchGuild(guildId);

  if (guildResponse.ok) {
    const requestedGuild = guildResponse.data;
    res.send(requestedGuild);
  } else {
    const { data } = guildResponse;
    const { status } = guildResponse;
    res.status(status).send(data);
  }

});

router.post('/:guildId/add-raid', logged, raidManager, async (req, res) => {

});

export default router;
