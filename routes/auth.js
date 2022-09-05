import { Router } from 'express';
import { exchangeCode } from '../utils/discord.js';

const router = Router();

const logged = (req, res, next) => {
  const tokenData = req.session?.tokenData;

  if (tokenData) {
    next();
  } else {
    res.status(401).send({ error: 'Not logged in' })
  }
}

router.get('/discord', (_, res) => {
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

  if (tokenData) {
    req.session.tokenData = tokenData;
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
