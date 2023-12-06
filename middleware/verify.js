function verify(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    return res.status(401).send('Unauthorized');
  }
}
export default verify