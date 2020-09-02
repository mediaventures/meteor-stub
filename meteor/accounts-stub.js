module.exports = function (Meteor) {
  const Accounts = {
    _hashLoginToken(token) {
      return token
    },
    destroyToken(userId, token) {
      Meteor.users.update(userId, {
        $pull: {
          'services.resume.loginTokens': {
            $or: [
              { hashedToken: token },
              { token }
            ]
          }
        }
      });
    },
  };
  Meteor.Accounts = Accounts;
};
