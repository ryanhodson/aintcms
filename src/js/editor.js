
const fs = require('fs');
const path = require('path');
const spawnSync = require('child_process').spawnSync;
const GitHubApi = require("github");

const pages = require('./pages.js');
const model = require('./model.js');
const browser = require('./browser.js');

module.exports.hide = function() {
  $("#page-editor").hide();
}

module.exports.show = function() {
  $("#page-editor").show();
}

module.exports.editFile = function(fullPath) {
  // Update title
  var displayTitle = path.basename(fullPath);
  $("#page-editor .header h1").text(displayTitle);


  // --- Git Prep ---

  var opts = {
    cwd: model.gitRepoPath()
  }

  // Reset any existing changes (e.g., from an abrupt application quit)
  var gitReset = spawnSync('git', ['checkout', '--', '.'], opts);
  if (gitReset.status != 0) {
    console.log("Could not reset repository");
    return;
  }
  
  // Make sure `master` is checked out
  var gitCheckoutMaster = spawnSync('git', ['checkout', 'master'], opts);
  if (gitCheckoutMaster.status != 0) {
    console.log("Could not checkout master branch");
    return;
  }

  // Sync with upstream changes
  var gitPull = spawnSync('git',
      ['pull',
      model.authenticatedGitRepoURL()],
      opts);
  if (gitPull.status != 0) {
    console.log("Could not pull upstream changes");
    return;
  }
  
  // Create a new branch
  var crappyHash = Math.random().toString().split(".")[1].substring(0, 6);
  var branchName = 'localcms-' + crappyHash;
  var gitCheckout = spawnSync('git', ['checkout', '-b', branchName], opts);
  if (gitCheckout.status != 0) {
    console.log("Could not create new branch");
    return;
  }

  // --- Done with Git Prep --


  // Display the contents of the file in the editor
  var contents = fs.readFileSync(fullPath, 'utf8');
  $("#editor").val(contents);

  // Record what path is being edited and its original contents
  model.editedFilePath(fullPath);
  model.editedFileOriginalContents(contents); // For aborting
  model.editedBranch(branchName);
}

// All pages should start out hidden
module.exports.hide();


$(document).ready(function() {

  // --- Button Initialization ---
  
  $("#button-preview").click(function(e) {
    // Write the changes, build the site, open a browser
    fs.writeFileSync(model.editedFilePath(),
                     $("#editor").val(), 'utf8');

    // Build the site
    var opts = {
      cwd: model.gitRepoPath()
    }
    var gulpBuild = spawnSync('gulp', ['build'], opts);
    if (gulpBuild.status != 0) {
      console.log("Could not build the site");
      return;
    }

    // Open in a browser (TODO: This only works for some pages!)
    // TODO: Would be nice if this refreshed the existing tab
    // Should configure this for `gulp watch` and browser reload?
    var destFile = model.editedFilePath();
    destFile = destFile.replace("src/public", "dist");
    var openCmd = spawnSync('open', [destFile]);
    if (openCmd.status != 0) {
      console.log("Could not open the web page");
      return;
    }

  });

  $("#button-publish").click(function(e) {
    // Write the changes, build the site, open a browser
    fs.writeFileSync(model.editedFilePath(),
                     $("#editor").val(), 'utf8');


    // Create a commit for the file edits
    var opts = {
      cwd: model.gitRepoPath()
    }

    var destFile = model.editedFilePath();
    var relativeDestFile = destFile.replace(opts.cwd + "/", "");
    var message = "LocalCMS edits to " + relativeDestFile;

    // Stage the file
    var gitAdd = spawnSync('git', ['add', relativeDestFile], opts);
    if (gitAdd.status != 0) {
      console.log("Could not stage the edits");
      return;
    }

    // Commit the file
    var gitCommit = spawnSync('git', ['commit', '-m', message], opts);
    if (gitCommit.status != 0) {
      console.log("Could not create the commit");
      return;
    }

    // Push the branch
    var branchName = model.editedBranch();
    var gitPush = spawnSync('git',
        ['push',
        model.authenticatedGitRepoURL(),
        branchName],
        opts);
    if (gitPush.status != 0) {
      console.log("Could not push the branch");
      return;
    }
    
    // Create a pull request for the changes
    var github = new GitHubApi({
      version: "3.0.0",
      debug: false,
      protocol: "https",
      host: "api.github.com",
      timeout: 5000,
      headers: {
        "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
      }
    });
    github.authenticate({
        type: "basic",
        username: model.gitUsername(),
        password: model.gitPassword()
    });
    github.pullRequests.create({
      user: model.gitUsername(),
      repo: model.gitRepoSlug(),
      title: message,
      body: "Please check and merge this automatically-generated pull request.",
      base: "master",
      head: branchName
    },
    function(err, res) {
      if (err) {
        console.log("ERROR!");
        console.log(err);
        return;
      }
      //console.log(res);
      // Go back to the browser page
      pages.setPage(browser);
    });
    
  });

  $("#button-abort").click(function(e) {
    // TODO: Need to abort on quit, too! Or refresh the git repo on edit start.
    
    // Rewrite the original file contents
    fs.writeFileSync(model.editedFilePath(),
                     model.editedFileOriginalContents(), 'utf8');
    
    // Go back to the browser page
    pages.setPage(browser);
  });
});


