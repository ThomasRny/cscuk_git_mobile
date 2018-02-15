/**
 * Accordion jQuery plugin
 *
 * @author  Damien Senger <damien@alsacreations.fr>
 * @version 0.1
 */

;(function ($) {
  'use strict';

  $.alsaAccordion = function (container, options) {
    var base = this;
    base.container = container;
    base.$container = $(container);

    // add a reverse reference to the DOM object
    base.$container.data('alsaAccordion', base);

    /**
     * jQuery plugin init method
     * @return {void}
     */
    base.init = function () {
      // we load any custom or default options
      base.options = $.extend({}, $.alsaAccordion.defaultOptions, options);

      // we close all tabs except the first
      base.firstLoad();

      // we create all user events actions
      base.events();
    };

    /**
     * Pour chaque élement de contenu, on remplace sa classe par celle indiquant
     * un état "fermé"
     *
     * @return {void}
     */
    base.closeEverything = function () {
      var contentClass = base.options.contentItem,
          $contentItems = base.$container.find(contentClass);

      // For each content item, we replace the status class
      $contentItems.removeClass(base.options.isOpenClass);
      $contentItems.addClass(base.options.isCloseClass);
    };

    /**
     * Ouvre un élément demandé et ferme ceux précédemment ouvert
     *
     * @param  {object} element Élément du DOM à ouvrir
     *
     * @return {void}
     */
    base.open = function (element) {
      var openClass = base.options.isOpenClass,
          closeClass = base.options.isCloseClass,
          $oldOpenElements = base.$container.find('.' + openClass);

      $oldOpenElements.removeClass(openClass).addClass(closeClass);
      $(element).removeClass(closeClass).addClass(openClass);
    };

    /**
     * Changement les classes d'état d'un élément pour indiquer sa fermeture
     *
     * @param  {object} element Élément du DOM à fermer
     *
     * @return {void}
     */
    base.close = function (element) {
      var openClass = base.options.isOpenClass,
          closeClass = base.options.isCloseClass;

      $(element).removeClass(openClass).addClass(closeClass);
    };

    /**
     * Ferme tous les éléments de contenu de l'accordéon, sauf le premier
     *
     * @return {void}
     */
    base.firstLoad = function () {
      var allChildren = base.$container.children(base.options.contentItem),
          allChildrenToClose = allChildren.not(':first-of-type'),
          firstChild = allChildren[0];

      allChildrenToClose.each(function () {
        base.close(this);
      });

      base.open(firstChild);
    };

    /**
     * Create all events handlers
     *
     * @return {void}
     */
    base.events = function () {
      var btnClass = base.options.labelItem,
          btnItems = base.$container.find(btnClass);

      // ouverture d'un nouvel élément
      btnItems.on('click.alsaAccordion', function () {
        var relatedContent = $(this).next(base.options.contentItem);
        base.open(relatedContent);
      });
    };

    /**
     * Destroy all plugin's events handlers
     * @return {void}
     */
    base.destroy = function () {
      var btnClass = base.options.labelItem,
          btnItems = base.$container.find(btnClass);

      btnItems.off('click.alsaAccordion');
    };

    // we launch the plugin!
    base.init();
  };

  $.alsaAccordion.defaultOptions = {
    labelItem: '.js-accordion-label',
    contentItem: '.js-accordion-content',
    isOpenClass: 'is-open',
    isCloseClass: 'is-close',
  };

  $.fn.alsaAccordion = function (options) {
    return this.each(function () {
      (new $.alsaAccordion(this, options));
    });
  };
})(jQuery);


/* -----------------------------
 * Appel du plugin alsaAccordion
 * ----------------------------- */
var $accordionContainer = $('.js-accordion');
if ($accordionContainer.length) {
  $accordionContainer.alsaAccordion({
    isOpenClass: 'js-ah-is-opened',
    isCloseClass: 'js-ah-is-closed',
  });
}
