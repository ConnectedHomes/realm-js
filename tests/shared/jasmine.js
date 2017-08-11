"use strict";

const Jasmine = require("jasmine");
const JasmineConsoleReporter = require('jasmine-console-reporter');
const path = require("path");

const ADMIN_TOKEN_PATH = path.resolve(__dirname, "../../../../object-server-for-testing/admin_token.base64");
process.env.ADMIN_TOKEN_PATH = ADMIN_TOKEN_PATH;

const JASMIN_FILTER_KEY = "--filter";

function getFilterFromProcess() {
  const filterArg = process.argv.find((arg) => arg.indexOf(JASMIN_FILTER_KEY) === 0);
  return filterArg ? filterArg.slice(JASMIN_FILTER_KEY.length + 1) : null;
}

const jasmine = new Jasmine({
  projectBaseDir: __dirname
});

// Load the config file from the default path (${projectBaseDir}/spec/support/jasmine.json).
jasmine.loadConfigFile();

module.exports = jasmine;
module.exports.getFilterFromProcess = getFilterFromProcess;
