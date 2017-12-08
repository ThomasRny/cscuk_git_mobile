/**!
 * CMXP Mobile Catalogue Dropdown for sorting results
 *
 * @contributors: Philippe Vayssière (Alsacréations)
 * @date-created: 2015-10-26
 * @last-update: 2015-10-28
 *
 * These dropdowns were in (Mobile) Catalogue and Events Lists + My selection between number of results and actual results.
 * They've been replaced by native selects thus this script isn't used anymore. Related Redmine #11146
 *
 * */

;
(function($) {

  // dd stands for dropdown
  var selDdWrapper = '.js-dd',
      selDdCmd = '.js-dd-cmd',
      selDdTarget = '.js-dd-target',
      selDdChoice = '.js-dd-choice',
      $dd = $(selDdWrapper),
      $ddCmd = $(selDdCmd),
      $ddTarget = $(selDdTarget),
      $ddChoice = $(selDdChoice),
      titleExplanation = $ddCmd.data('title');

  $.fn.catalogueResultsSort = function() {
    var $button = $(this),
        $wrapper = $button.closest(selDdWrapper),
        $cmd = $wrapper.find(selDdCmd);

    htmlVisible = $button.text().trim(); // Neither <span> tags nor whitespace in this string

    $cmd.html(htmlVisible);
    $cmd.attr('title', titleExplanation + htmlVisible.toString());
  };

  // Opening/closing the dropdown
  if ($dd.length) {
    $ddCmd.on('click.dd', function() {
      // Let's find parent wrapper of Command button and then its descendant to be opened/closed
      $(this).closest(selDdWrapper).find(selDdTarget).toggleClass('is-open');
    });
  }

  // A choice is made by clicking on an item
  if ($ddChoice.length) {
    $ddChoice.on('click.dd', function() {
      $(this).catalogueResultsSort();
      $ddTarget.removeClass('is-open');
    });
  }
}(jQuery));
