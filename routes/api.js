import { Router } from 'express';
import { exchangeCode, fetchUser } from '../controllers/discord.js';

import { store } from '../controllers/store.js';

const router = Router();

// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

router.get('/auth', (_, res) => {
  const searchParams = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.CLIENT_BASE_URL,
    response_type: 'code',
    scope: 'identify',
  });

  res.redirect(`https://discord.com/api/oauth2/authorize?${searchParams.toString()}`);
});

router.post('/login', async (req, res) => {
  const code = req.body.code;
  
  if (!code) return res.status(400).send({ error: 'no code' });

  const tokenData = await exchangeCode(code);
  store.addToken(tokenData);

  if (tokenData) {
    req.session.tokenData = tokenData;

    const userData = await fetchUser(tokenData.token_type, tokenData.access_token);
    res.send({
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      banner: userData.banner,
      locale: userData.locale,
    });
  }

});

router.get('/user', async (req, res) => {
  const tokenData = req.session.tokenData;

  if (tokenData) {
    const userData = await fetchUser(tokenData.token_type, tokenData.access_token);
    res.send({
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      banner: userData.banner,
      locale: userData.locale,
    });
  } else {
    res.status(401).send({ error: 'No session attached' });
  }

});


export default router;
