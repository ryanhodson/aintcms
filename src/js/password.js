
const pages = require('./pages.js');
const model = require('./model.js');
const browser = require('./browser.js');

module.exports.hide = function() {
  $("#page-password").hide();
}
module.exports.show = function() {
  $("#page-password").show();
}

// All pages should start out hidden
module.exports.hide();


$(document).ready(function() {

  $("#button-password-done").click(function() {
    var password = $("#password-password").val();

    // Record the GitHub password (never saved to disk)
    model.gitPassword(password);

    // Switch to the browser page
    pages.setPage(browser);
  });

});

