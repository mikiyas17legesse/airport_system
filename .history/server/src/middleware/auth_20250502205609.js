const jwt = require('jsonwebtoken');
const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secretKey'
};

passport.use(new Strategy(jwtOptions, (payload, done) => {
  return done(null, payload);
}));

const authenticate = passport.authenticate('jwt', { session: false });

const generateToken = (user) => {
  return jwt.sign(user, jwtOptions.secretOrKey, { expiresIn: '1h' });
};

module.exports = { authenticate, generateToken };