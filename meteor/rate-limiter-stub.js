const DDPRateLimiter = {
  addRule: (matcher) => {
    if (matcher && typeof matcher.connectionId === 'function') {
      matcher.connectionId();
    }
  }
};

module.exports = { DDPRateLimiter };
