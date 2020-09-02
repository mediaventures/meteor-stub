class RoutePolicyConstructor {
  constructor() {
    // maps prefix to a type
    this.urlPrefixTypes = {};
  }

  urlPrefixMatches(urlPrefix, url) {
    return url.startsWith(urlPrefix);
  }

  checkType(type) {
    if (!['network', 'static-online'].includes(type)) {
      return 'the route type must be "network" or "static-online"';
    }
    return null;
  }

  checkUrlPrefix(urlPrefix, type) {
    if (!urlPrefix.startsWith('/')) {
      return 'a route URL prefix must begin with a slash';
    }

    if (urlPrefix === '/') {
      return 'a route URL prefix cannot be /';
    }

    const existingType = this.urlPrefixTypes[urlPrefix];
    if (existingType && existingType !== type) {
      return `the route URL prefix ${urlPrefix} has already been declared ` +
        `to be of type ${existingType}`;
    }

    return null;
  }

  checkForConflictWithStatic(urlPrefix, type, _testManifest) {
    if (type === 'static-online') {
      return null;
    }

    const policy = this;

    function check(manifest) {
      const conflict = manifest.find(resource => (
        resource.type === 'static' &&
        resource.where === 'client' &&
        policy.urlPrefixMatches(urlPrefix, resource.url)
      ));

      if (conflict) {
        return `static resource ${conflict.url} conflicts with ${type} ` +
          `route ${urlPrefix}`;
      }

      return null;
    };

    if (_testManifest) {
      return check(_testManifest);
    }

    // XXX BEGIN KSINAS MOD
    // const { WebApp } = require("meteor/webapp");
    // let errorMessage = null;
    //
    // Object.keys(WebApp.clientPrograms).some(arch => {
    //   const { manifest } = WebApp.clientPrograms[arch];
    //   return errorMessage = check(manifest);
    // });
    //
    // return errorMessage;
    return null;
    // XXX END KSINAS MOD

  }

  declare(urlPrefix, type) {
    const problem =
      this.checkType(type) ||
      this.checkUrlPrefix(urlPrefix, type) ||
      this.checkForConflictWithStatic(urlPrefix, type);
    if (problem) {
      throw new Error(problem);
    }
    // TODO overlapping prefixes, e.g. /foo/ and /foo/bar/
    this.urlPrefixTypes[urlPrefix] = type;
  }

  isValidUrl(url) {
    return url.startsWith('/');
  }

  classify(url) {
    if (!this.isValidUrl(url)) {
      throw new Error(`url must be a relative URL: ${url}`);
    }

    const prefix = Object.keys(this.urlPrefixTypes).find(prefix =>
      this.urlPrefixMatches(prefix, url)
    );

    return prefix ? this.urlPrefixTypes[prefix] : null;
  }

  urlPrefixesFor(type) {
    return Object.entries(this.urlPrefixTypes)
      .filter(([_prefix, _type]) => _type === type)
      .map(([_prefix]) => _prefix)
      .sort();
  }
}

const RoutePolicy = new RoutePolicyConstructor();
module.exports = { RoutePolicy };
