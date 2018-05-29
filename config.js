const fs = require('fs');

// Parse in css.gz & reactBundle.js.gz file
const manifestPath = './build/asset-manifest.json';
const buildManifest = JSON.parse(fs.readFileSync(manifestPath, 'UTF-8'));

exports.cssProdFile = '';
exports.jsProdFile = '';
Object.entries(buildManifest).forEach(([key, value]) => {
  if (key.endsWith('css.gz')) {
    exports.cssProdFile = value.slice(7);
  }
  if (key.endsWith('js.gz')) {
    exports.jsProdFile = value.slice(7);
  }
});


// Parse in config
const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

// exporting the following
exports.app = parsed.app;
exports.auth = parsed.auth;
exports.crypto = parsed.crypto;
exports.database = parsed.database;
exports.discogs = parsed.discogs;
exports.expressSession = parsed.expressSession;
exports.smtp = parsed.smtp;
