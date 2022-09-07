import { Router } from 'express';

import { authUrl, exchangeCode } from '../utils/discord.js';

const router = Router();

router.get('/discord', (_, res) => {
  res.redirect(authUrl());
});

// router.post('/login', async (req, res) => {
//   const { code } = req.body;

//   if (!code) res.status(400).send({ message: 'No login code.' });

//   const response = await exchangeCode(code);

//   if (response.ok) {
//     const tokenData = await response.json();
//     req.session.tokenData = { tokenType: tokenData.token_type, accessToken: tokenData.access_token };
//     res.redirect('/api/user');
//   } else {
//     const data = await response.json();
//     const { status } = response;
//     console.error('/login response ERROR', status, data);
//     res.status(status).send(data);
//   }

// });

router.get('/login', async (req, res) => {
  const { code } = req.query;

  const error = new URLSearchParams({
    error: 'Couldn\'t log in. Try again.',
  }).toString();

  if (!code) {
    res.redirect(`${process.env.CLIENT_BASE_URL}?${error}`);
  } else {

    const response = await exchangeCode(code);

    if (response.ok) {
      const tokenData = await response.json();
      req.session.tokenData = { tokenType: tokenData.token_type, accessToken: tokenData.access_token };
      res.redirect(process.env.CLIENT_BASE_URL);
    } else {
      console.log(await response.json());
      res.redirect(`${process.env.CLIENT_BASE_URL}?${error}`);
    }

  }


});

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) {
      console.log(error);
    }
    res.redirect(process.env.CLIENT_BASE_URL);
  });
});

export default router;
