const { addHook } = require('pirates');

require('./window/window');
const { meteorPackageList } = require('./meteor');

/**
 * Sets up global stubs for the meteor packages contained in the meteorPackageList.
 * Additional packages can be added through the optional stubs argument.
 *
 * @param {Object[]} [stubs=[]] stub objects
 * @param {string} stubs[].find package name to be replaced
 * @param {string} stubs[].replace value to be filled instead of package name
 */
function setupGlobalStubs(stubs = []) {
  const pattern = new RegExp(`['"]meteor\/(${meteorPackageList.join('|')})['"]`, 'g');

  // Add stubbing from this package to the given list
  stubs = stubs.concat([
    { find: pattern, replace: '"@mediaventures/meteor-stub/meteor"'},
  ]);

  addHook(
    (code, _) => {
      stubs.forEach(({ find, replace }) => code = code.replace(find, replace));
      return code;
    },
    { exts: ['.js'] },
  );
}

/**
 * Imports a file and prevents unwanted imports from happening.
 * Unhooks after importing the requested file
 *
 * @param {string} path absolute path of the file which should be imported
 * @param {Array} removedImports list of import strings which should never be imported
 * @param {Function} matcher optional matching function to limit the checked files
 */
function safeImport(path, removedImports, matcher) {
  // Make sure specific imports are never called
  const revert = addHook((code, _) => {
    const name = `(?=${removedImports.join('|')})`;
    return code.replace(new RegExp(`.+${name}.+`, 'g'), '');
  }, { matcher });

  // Import the file after stubbing
  require(path); //eslint-disable-line

  // Unhook to prevent unwanted behaviour afterwards
  revert();
}

module.exports = {
  setupGlobalStubs,
  safeImport
};
