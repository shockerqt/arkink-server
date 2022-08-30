import express from 'express';

import apiRouter from './routes/api.js';

const app = express();

const myLogger = (req, res, next) => {
  console.log('LOGGED');
  next();
};

app.use(myLogger);

app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('ES6 is the Node way to go');
});

app.post('/api/login', (request, response) => {

});

app.listen(3001,() => {
    console.log(`App listening on port 3001!`);
});
