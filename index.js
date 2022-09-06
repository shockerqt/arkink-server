import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import api from './routes/api.js'

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_BASE_URL,
  credentials: true,
}));

app.use('/api', api);

app.listen(process.env.SERVER_PORT, () => {
  console.log(`App listening on port ${process.env.SERVER_PORT}`);
});
