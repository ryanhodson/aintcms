
const fs = require('fs');
const path = require('path');

var config = {};
var state = {};


// --- Configuration Variables ---

module.exports.gitRepoPath = function(value) {
  if (value !== undefined) {
    config.gitRepoPath = value;
  } else {
    return config.gitRepoPath;
  }
}

module.exports.remoteGitRepoPath = function(value) {
  if (value !== undefined) {
    config.remoteGitRepoPath = value;
  } else {
    return config.remoteGitRepoPath;
  }
}

module.exports.gitUsername = function(value) {
  if (value !== undefined) {
    config.gitUsername = value;
  } else {
    return config.gitUsername;
  }
}


// --- State Variables ---

module.exports.gitPassword = function(value) {
  if (value !== undefined) {
    state.gitPassword = value;
  } else {
    return state.gitPassword;
  }
}

module.exports.userDataPath = function(value) {
  if (value !== undefined) {
    state.userDataPath = value;
  } else {
    return state.userDataPath;
  }
}

module.exports.editedFilePath = function(value) {
  if (value !== undefined) {
    state.editedFilePath = value;
  } else {
    return state.editedFilePath;
  }
}

module.exports.editedFileOriginalContents = function(value) {
  if (value !== undefined) {
    state.editedFileOriginalContents = value;
  } else {
    return state.editedFileOriginalContents;
  }
}

module.exports.editedBranch = function(value) {
  if (value !== undefined) {
    state.editedBranch = value;
  } else {
    return state.editedBranch;
  }
}


// --- Helper Functions ---

module.exports.gitRepoSlug = function() {
  // Returns the slug used in the GitHub URL
  // (assumes local repo path was unaltered)
  return path.basename(model.gitRepoPath());
}

module.exports.authenticatedGitRepoURL = function() {
  // Be careful where you use this
  var escapedPassword = state.gitPassword.replace("@", "%40");
  var p = "https://" + config.gitUsername + ":" + escapedPassword +
                             "@github.com" + config.remoteGitRepoPath;
  return p
}

module.exports.saveConfiguration = function() {
  // state.userDataPath should be set before calling this function
  var configFilePath = path.join(state.userDataPath, "config.json");
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 4));
}

module.exports.loadConfiguration = function() {
  // state.userDataPath should be set before calling this function
  var configFilePath = path.join(state.userDataPath, "config.json");
  var config = null;
  try {
    config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  } catch(err) {
    // Don't need to do anything here
  }
  return config;
}


