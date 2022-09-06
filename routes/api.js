import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { Router } from 'express';

import authRouter from './auth.js';
import guildRouter from './guild.js';
import userRouter from './user.js';
import rosterRouter from './roster.js';

const router = Router();

router.use(morgan('dev'));
router.use(bodyParser.json());
router.use(cookieParser());
router.use(session({
  secret: 'minisecreto',
  resave: false,
  saveUninitialized: true,

  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}))

// routers
router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/guild', guildRouter);
router.use('/roster', rosterRouter);

export default router;
