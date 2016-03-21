
const async = require('async');
const del = require('del');
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const spawn = require('child_process').spawn;

const pages = require('./pages.js');
const model = require('./model.js');
const browser = require('./browser.js');

module.exports.hide = function() {
  $("#page-welcome").hide();
}
module.exports.show = function() {
  $("#page-welcome").show();
}

// All pages should start out hidden
module.exports.hide();


$(document).ready(function() {

  $("#button-start-editing").click(function() {
    // Disable button
    $(this).prop('disabled', true);

    // Update status message
    var msg = "Cloning Git repo (this could take awhile)....";
    $("#page-welcome-website-config .form-status").text(msg);


    // Gather user input
    var user = $("#welcome-full-name").val();
    var password = $("#welcome-password").val();
    var gitRepo = $("#welcome-git-repo").val();

    // Add HTTPS authentication parameters (INSECURE!)
    var gitRepoPath = gitRepo.split("https://github.com")[1];
    var destRepo = model.userDataPath() + path.sep +
                   path.basename(gitRepoPath, ".git");

    // Record the origin repo path
    model.remoteGitRepoPath(gitRepoPath);

    // Record the destination repo
    model.gitRepoPath(destRepo);

    // Record the GitHub username (for authenticated pushing)
    model.gitUsername(user);

    // Record the GitHub password (never saved to disk)
    model.gitPassword(password);

    var opts = {
      cwd: model.gitRepoPath()
    }
    async.waterfall([
      function(callback) {
        // Delete the repo if it already exists
        del(destRepo, {force: true}).then(function() {
          callback();
        });
      },
      function(callback) {
        // Clone the Git repo
        var gitClone = spawn('git',
            ['clone',
            model.authenticatedGitRepoURL(),
            model.gitRepoPath()]);
        
        gitClone.on('close', function(code) {
          callback();
        });
      },
      function(callback) {
        // Delete the default `origin` remote
        var gitRemoteRM = spawn('git', ['remote', 'rm', 'origin'], opts);
        
        gitRemoteRM.on('close', function(code) {
          callback();
        });

      },
      function(callback) {
        // Install npm dependencies (TODO: abstract this to be configurable)
        
        // Update status message
        msg = "Installing dependencies (this could also take awhile)....";
        $("#page-welcome-website-config .form-status").text(msg);
        
        var npmInstall = spawn('npm', ['install'], opts);
        
        npmInstall.on('close', function(code) {
          callback();
        });

      },
    ], function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      // Save configuration to disk if clone was successful
      model.saveConfiguration();
      
      // Switch to the browser page
      pages.setPage(browser);
    });

  });

});

