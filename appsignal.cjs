// appsignal.cjs
const Appsignal = require("@appsignal/javascript").default;
const config = require('./src/config');

const monitor = new Appsignal({
  active: true,
  name: config.montitorPrj,
  pushApiKey: config.montitorKey,
});

module.exports = monitor;
