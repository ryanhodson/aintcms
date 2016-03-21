
const fs = require('fs');
const path = require('path');

const pages = require('./pages.js');
const model = require('./model.js');
const editor = require('./editor.js');

module.exports.hide = function() {
  $("#page-browser").hide();
}

module.exports.show = function() {
  $("#page-browser").show();

  // Update title
  var displayTitle = path.basename(model.gitRepoPath());
  $("#page-browser .header h1").text(displayTitle);


  // Load the files from the Git repo
  var root = TreeNode('root', [], "");
  getDirectories(model.gitRepoPath(), root);


  // Display the files from the Git repo

  $("#browser-list").html(renderDirectory(root));

  $(".file-item").click(function(e) {
    e.stopPropagation();
    
    editor.editFile($(this).prop('dataset').path);
    pages.setPage(editor);
  });
}

// All pages should start out hidden
module.exports.hide();


// --- Document Stuff --

$(document).ready(function() {

});


// --- Tree Helpers ---

function renderDirectory(node) {
  var result = "<ul>";
  for (var childNode of node.contents) {
    result += "<li data-path='" + childNode.fullPath + "' class='file-item'>" // Add an id here to map to objects
    result += childNode.name;
    if (childNode.contents.length > 0) {
      // Add nested list for directories
      result += renderDirectory(childNode);
    }
    result += "</li>";
  }
  result += "</ul>";
  return result;
}

// Recursively record files into `node`, which should be a TreeNode object
function getDirectories(dir, node) {
  var files = fs.readdirSync(dir);
  for (var file of files) {
    if (file.startsWith(".")) {
      continue;
    }
    if (ignoredFolders.indexOf(file) > -1) {
      continue;
    }
    // Add the node
    var fullPath = path.join(dir, file);
    var newNode = TreeNode(file, [], fullPath);
    node.contents.push(newNode);
    if (fs.statSync(fullPath).isDirectory()) {
      // Add contents of that directory
      getDirectories(fullPath, newNode);
    }
  }
}

function TreeNode(name, contents, fullPath, id) {
  return {"name": name, "contents": contents, "fullPath": fullPath};
}


