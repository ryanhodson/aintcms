
var currentPage;

module.exports.setPage = function(page) {
  // Pages must have a `hide()` and `show()` method
  if (currentPage) {
    currentPage.hide();
  }
  currentPage = page;
  currentPage.show();
}
