module.exports = function(Meteor) {
  Meteor._stubbedPublications = {};

  Meteor.publish = (name, publication) => {
    Meteor._stubbedPublications[name] = publication;
  };

  Meteor.subscribe = (name, args) => {
    return Meteor._stubbedPublications[name](args);
  };
};
