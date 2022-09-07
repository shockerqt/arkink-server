import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connect from 'connect-session-sequelize';

import api from './routes/api.js';
import sequelize from './models/sequelize.js';

dotenv.config();

const app = express();
const SequelizeStore = connect(session.Store);


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'pichula',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  store: new SequelizeStore({
    db: sequelize,
  }),
}));

app.use(cors({
  origin: process.env.CLIENT_BASE_URL,
  credentials: true,
}));

app.use('/api', api);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App listening on port ${process.env.SERVER_PORT}`);
});
