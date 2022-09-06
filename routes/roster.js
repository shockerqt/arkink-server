import { Router } from 'express';

import User from '../models/user.js';
import { logged } from '../utils/middlewares.js';

const router = Router();

router.get('/', logged, async (req, res) => {
  const user = await User.findByPk(req.session.userId);
  res.send(user);
});

router.post('/add', logged, (req, res) => {

});

export default router;
