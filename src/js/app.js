
window.$ = window.jQuery = require('jquery');
const ipcRenderer = require('electron').ipcRenderer;

const pages = require('./js/pages.js');
const model = require('./js/model.js');
const welcome = require('./js/welcome.js');
const password = require('./js/password.js');


// TODO: Move this to a config file
var ignoredFolders = ['node_modules', 'dist'];


// Any window/document initialization happens here
$(document).ready(function() {


});


// Any app initialization happens here
ipcRenderer.on('app-ready', function(event, appConfig) {
  // Record the user data path passed in from the main process
  model.userDataPath(appConfig.userDataPath);

  var config = model.loadConfiguration();
  if (config) {
    // This is not a first run: collect password only
    model.gitRepoPath(config.gitRepoPath);
    model.remoteGitRepoPath(config.remoteGitRepoPath);
    model.gitUsername(config.gitUsername);

    pages.setPage(password);
  } else {
    // This is a first run: collect all GitHub info
    pages.setPage(welcome);
  }
});


