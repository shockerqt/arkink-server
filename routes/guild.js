import { Router } from 'express';

import User from '../models/user.js';
import Guild, { GuildMembers } from '../models/guild.js';
import { logged } from '../utils/middlewares.js';
import { getGuildRole } from '../utils/index.js';

const router = Router();

router.get('/all', logged, async (req, res) => {
  const guilds = await Guild.findAll({
    attributes: ['id', 'guildname'],
  });
  res.send(guilds);
});

router.get('/:guildId', logged, async (req, res) => {
  const guildId = req.params.guildId;
  const guild = await Guild.findByPk(guildId, { include: {
    model: User,
    through: { attributes: ['role'] },
    attributes: ['id', 'username', 'discriminator', 'avatar', 'banner'],
  } });
  guild.role = await getGuildRole(req.params.guildId, req.session.userId);
  // guild.Users.forEach(user => {
  //   user.role = getGuildRole(req.params.guildId, user.id);
  // });

  res.send(guild);
});


router.post('/add', logged, async (req, res) => {
  console.log(req.body.guildname);
  
  const guild = await Guild.create({
    guildname: req.body.guildname,
  });

  guild.addUser(req.session.userId, {
    through: { role: 'master' },
  });

  res.send(guild);
});

router.get('/join/:invite', logged, async (req, res) => {

});







export default router;
