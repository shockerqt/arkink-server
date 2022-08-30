import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

import swaggerDocument from '../swagger.json' assert { type: 'json' };

const router = Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));



// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now());
  next();
})


// define the about route
router.get('/about', (req, res) => {
  res.send('About birds');
});

export default router;
