import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';

import authRouter from './routes/auth.js';
import guildRouter from './routes/guild.js';
import userRouter from './routes/user.js';
import rosterRouter from './routes/roster.js';

const app = express();
dotenv.config();

app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CLIENT_BASE_URL,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
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
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/guild', guildRouter);
app.use('/api/roster', rosterRouter);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App listening on port ${process.env.SERVER_PORT}`);
});
