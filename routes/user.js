import { Router } from 'express';
import { fetchUser } from '../utils/discord.js';

import User from '../models/user.js';
import { logged } from '../utils/middlewares.js';

const router = Router();

router.get('/', logged, async (req, res) => {
  const tokenData = req.session.tokenData;

  const userData = await fetchUser(tokenData.token_type, tokenData.access_token);

  req.session.userId = userData.id;
  res.send(userData);

  User.upsert({
    ...userData,
    accessToken: tokenData.access_token,
  });

});

router.get('/guilds', logged, async (req, res) => {
  const user = await User.findByPk(req.session.userId);
  console.log(user);
  res.send(user);
});


export default router;
