import { Router } from 'express';

import { authUrl, exchangeCode } from '../utils/discord.js';
import { logged } from '../utils/middlewares.js';

const router = Router();

router.get('/discord', (_, res) => {
  res.redirect(authUrl());
});

router.post('/login', async (req, res) => {
  const code = req.body.code;
  
  if (!code) return res.status(400).send({ error: 'no code' });

  const tokenData = await exchangeCode(code);

  if (tokenData) {
    req.session.tokenData = { tokenType: tokenData.token_type, accessToken: tokenData.access_token };
    res.redirect('/api/user');
  } else {
    res.end();
  }

});

router.delete('/logout', logged, (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(400).send({ error: 'Unable to log out' });
    } else {
      res.send('Logout successful');
    }
  });
});

export default router;
