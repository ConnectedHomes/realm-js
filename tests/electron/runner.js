"use strict";

const assert = require("assert");
const path = require("path");
const Application = require("spectron").Application;

const ELECTRON_PATH = path.join(__dirname, "node_modules", ".bin", "electron");
const MAIN_PATH = path.join(__dirname, "app", "main.js");
const POLL_LOG_DELAY = 500;

const doneMatcher = /Electron process stopped, with status ([-\d]+)/;

const app = new Application({
  path: ELECTRON_PATH,
  args: [ MAIN_PATH ]
});

console.log("Trying to start an Electron process.");

app.start().then(() => {
  console.log("The following messages are logs from the Electron process:");
  // Keep reading the log, until Jasmine prints "ALL DONE"
  return new Promise((resolve, reject) => {
    const timeout = setInterval(() => {
      app.client.getMainProcessLogs().then((logs) => {
        logs.forEach((msg) => {
          console.log(msg);
          const doneTest = doneMatcher.exec(msg);
          if(doneTest) {
            const statusCode = parseInt(doneTest[1], 10);
            clearTimeout(timeout);
            resolve(statusCode);
          }
        });
      });
    }, POLL_LOG_DELAY);
  });
}).then((statusCode) => {
  // Exit with the same status as the Electron process
  process.exit(statusCode);
}).catch((error) => {
  // Log any failures
  console.error("Failure", error.message);
  process.exit(-1);
})
