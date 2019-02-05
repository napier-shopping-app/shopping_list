var path = require("path");

module.exports = function(url, prev, done) {
  if (url[0] === '~' && url[1] !== '/') {
    // Resolve "~" paths to node_modules
    url = path.resolve(process.env.PROJECT_DIR, "node_modules", url.substr(1));
  } else if (url[0] === '~' && url[1] === '/') {
    // Resolve "~/" paths to the app root
    url = path.resolve(process.env.APP_DIR, url.substr(2));
  }

  return { file: url };
}