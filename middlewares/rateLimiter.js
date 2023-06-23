// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimiter = require('express-rate-limit');

const apiRateLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { apiRateLimiter };
