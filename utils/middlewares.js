export const logged = (req, res, next) => {
  const tokenData = req.session?.tokenData;

  if (tokenData) {
    next();
  } else {
    res.status(401).send({ error: 'Not logged in' });
  }
};
