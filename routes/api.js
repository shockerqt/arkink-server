import { Router } from 'express';

import authRouter from './auth.js';
import guildRouter from './guild.js';
import userRouter from './user.js';
import rosterRouter from './roster.js';

const router = Router();

// routers
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/guild', guildRouter);
router.use('/roster', rosterRouter);

export default router;
