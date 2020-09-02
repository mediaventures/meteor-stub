const Meteor = require('meteor-core')(require('underscore'));
const { DDP } = require('./ddp');
const { DDPCommon } = require('./ddp-common');
const { DDPRateLimiter } = require('./rate-limiter-stub');
const { Email } = require('./email');
const { HTTP } = require('./http');
const { JobCollection } = require('./job-collection-stub');
const { RoutePolicy } = require('./routepolicy');
const { ValidatedMethod } = require('./validated-method-stub');
const { WebApp } = require('./webapp');

require('meteor-id-map')(Meteor);
require('meteor-base64')(Meteor);
require('meteor-ejson-safe')(Meteor);
require('meteor-diff-sequence')(Meteor);
require('meteor-random-window-crypto')(Meteor);

require('./id')(Meteor);
require('./geojson')(Meteor);
require('./minimongo')(Meteor);
require('./collection-hooks')(Meteor);
require('./accounts-stub')(Meteor);
require('./publications-stub')(Meteor);
require('./check')(Meteor);

Meteor.startup = () => {};

Meteor.Session = new Map();
Meteor.wrapAsync = (func, ctx) => {
  return func.bind(ctx);
};

// set ROOT_URL
if (!Meteor.absoluteUrl.defaultOptions.rootUrl) {
  Meteor.absoluteUrl.defaultOptions.rootUrl = 'http://localhost';
}

Meteor.Promise = {
  await: (result) => result
};

Meteor.users = new Meteor.Mongo.Collection('users');
Meteor.user = () => {};
Meteor.userId = () => Meteor.user() && Meteor.user()._id;

Meteor.isClient = false;
Meteor.isServer = true;
Meteor.isDevelopment = false;
Meteor.isFake = true;

const { Mongo, Minimongo, Session, Promise, Random, EJSON, Accounts, check, Match } = Meteor;
function ReactiveDict() { return new Map() }

const meteorPackageList = [
  'accounts-base',
  'check',
  'ddp-common',
  'ddp-rate-limiter',
  'ddp',
  'ejson',
  'email',
  'http',
  'mdg:validated-method',
  'meteor',
  'minimongo',
  'mongo',
  'promise',
  'random',
  'reactive-dict',
  'routepolicy',
  'session',
  'simonsimcity:job-collection',
  'webapp',
];

module.exports = {
  Accounts,
  check,
  DDP,
  DDPCommon,
  DDPRateLimiter,
  EJSON,
  Email,
  HTTP,
  JobCollection,
  Match,
  Meteor,
  Minimongo,
  Mongo,
  Promise,
  Random,
  ReactiveDict,
  RoutePolicy,
  Session,
  ValidatedMethod,
  WebApp,
  meteorPackageList,
};
