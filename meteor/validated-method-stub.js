class ValidatedMethod {
  constructor(options) {
    // Default to no mixins
    options.mixins = options.mixins || [];
    options = applyMixins(options, options.mixins);

    // connection argument defaults to Meteor, which is where Methods are defined on client and
    // server
    options.connection = { methods: {}};

    // Allow validate: null shorthand for methods that take no arguments
    if (options.validate === null) {
      options.validate = function () {};
    }

    // If this is null/undefined, make it an empty object
    options.applyOptions = options.applyOptions || {};

    // Default options passed to Meteor.apply, can be overridden with applyOptions
    const defaultApplyOptions = {
      // Make it possible to get the ID of an inserted item
      returnStubValue: true,

      // Don't call the server method if the client stub throws an error, so that we don't end
      // up doing validations twice
      throwStubExceptions: true,
    };

    options.applyOptions = {
      ...defaultApplyOptions,
      ...options.applyOptions
    };

    // Attach all options to the ValidatedMethod instance
    Object.assign(this, options);

    const method = this;
    this.connection.methods[options.name] = function(args) {
      // Silence audit-argument-checks since arguments are always checked when using this package
      const methodInvocation = this;
      return method._execute(methodInvocation, args);
    };
  }

  call(args, callback) {
    // Accept calling with just a callback
    if ( typeof args === 'function' ) {
      callback = args;
      args = {};
    }

    try {
      return callback(null, this.connection.methods[this.name](args));
    } catch (err) {
      if (callback) {
        // Get errors from the stub in the same way as from the server-side method
        callback(err);
      } else {
        // No callback passed, throw instead of silently failing; this is what
        // "normal" Methods do if you don't pass a callback.
        throw err;
      }
    }
  }

  _execute(methodInvocation = {}, args) {
    // Add `this.name` to reference the Method name
    methodInvocation.name = this.name;

    const validateResult = this.validate.bind(methodInvocation)(args);

    if (typeof validateResult !== 'undefined') {
      throw new Error(`Returning from validate doesn't do anything; \
perhaps you meant to throw an error?`);
    }

    return this.run.bind(methodInvocation)(args);
  }
};

// Mixins get a chance to transform the arguments before they are passed to the actual Method
function applyMixins(args, mixins) {
  // Save name of the method here, so we can attach it to potential error messages
  const { name } = args;

  mixins.forEach((mixin) => {
    args = mixin(args);
  });

  return args;
}

module.exports = { ValidatedMethod };
