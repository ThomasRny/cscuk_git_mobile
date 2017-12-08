/*!
 * Comexposium Extended Search Form Module (mobile)
 * Formerly known as Exhibitor instead of Extended but works as well for Exhibitors and Products.
 * Class used for both is .exhibitor-search-form though
 *
 * Redesign by Alsacréations (alsacreations.fr)
 * Code design contributors: Geoffrey Crofte (Alsacréations), Philippe Vayssière (Alsacréations)
 * Vendors it depends on: jQuery UI 1.11.4 (custom build)
 *
 * File Last Update: 2015-11-24
 */

;jQuery(document).ready(function($){

	// ESF JavaScript only if we find the module

	if ( $('.exhibitor-search-form').length === 1 ) {


		// `esf` = debug function for console.log (ex: esf.log(string))
		// `esf_text` is translation ready texts

		var $dataSrc = $('.esf-all-filters');
		var esf={log:function(e){"undefined"!=typeof console&&console.log(e)}},
			esf_text = {
				remove_filter : $dataSrc.data('esfRemoveFilter'),
				unselect : $dataSrc.data('esfUnselect'),
				select : $dataSrc.data('esfSelect'),
				add : $dataSrc.data('esfAdd'),
				remove : $dataSrc.data('esfRemove'),
				space : '&nbsp;' // empty in english
			};

		$('html').addClass('js');

		/*
		 * AJAX actions
		 */

		function esf_AJAX_do_something_selection(the_id, $the_button) {

			var $the_icon = $the_button.find('i'),
				the_class = $the_button.attr('class');

			$the_icon.attr('class', 'icon-loading');

			if ( the_class === 'esf-action-add-to-selection' ) {

				// ** simulate request delay for adding exhibitor to favs **
				// have to replace setInterval by AJAX request and
				// "simulate positive" by the onsuccess respond

				// do what you want with the exhibitor id
				//esf.log('Adding: ' + the_id);

				var fake_ajax_request = setInterval(function(){

					// do what you want with the exhibitor id
					//esf.log('Added: '+the_id);

					// simulate positive
					$the_icon.attr('class','icon-remove-selection');
					$the_button.toggleClass('esf-action-add-to-selection esf-action-remove-from-selection').find('.esf-action-text').text(esf_text.remove);

					clearInterval(fake_ajax_request);
					fake_ajax_request = null;
				}, 900);

			}
			else {

				// ** simulate request delay for removing exhibitor to favs **
				// have to replace setInterval by AJAX request and
				// "simulate positive" by the onsuccess respond

				// do what you want with the exhibitor id
				//esf.log('Removing: '+the_id);

				var fake_ajax_request = setInterval(function(){

					// do what you want with the exhibitor id
					//esf.log('Removed: '+the_id);

					// simulate positive
					$the_icon.attr('class','icon-add-selection');
					$the_button.toggleClass('esf-action-add-to-selection esf-action-remove-from-selection').find('.esf-action-text').text(esf_text.add);

					clearInterval(fake_ajax_request);
					fake_ajax_request = null;

				}, 900);

			}

		}


		// ALSA 05/01/2016 Not called anymore because it conflicts with real script from Kaliop (but it still exists here and is called elsewhere in this file)
		function esf_AJAX_update_list() {

			// request begins
			// (mobile) Visual effect should only be applied once: this wasn't the case when removing _all_ filters (this function is then called as many times as there are main categories, 7 in test example)
			// Let's verify layer doesn't exist yet before creating it
			//var $layer = $('.esf-loader-layer'),
			//	layerCreated = false;
			//if( $layer.length === 0 ) {
			//	layerCreated = true;
			//	$('.exhibitor-search-form').append('<div class="esf-loader-layer"><div class="esf-loader" title="0"><div class="loading"><div class="loading-inner"><span class="shape"></span><span class="shape"></span><span class="shape"></span></div></div></div></div>');
			//	$('.esf-loader-layer').hide().fadeIn(200);
			//}

			//setTimeout( function() {
				//in request success
				// Layer is removed once (wouldn't harm if it was removed N times as it could only be done once)
				// Should be removed after the success of the _last_ successful AJAX request but that's not the case yet
		//		if( layerCreated === true ) {
		//			$('.esf-loader-layer').fadeOut(200, function(){ $(this).remove(); });
		//		}
		//	}, 300);
		}
		// AJAX END

		// on prev lvl click
		// This function is called either after pressing Back button of the browser or - along with .go(-1) and without popstate event - after a "real" click on backlink
		// tl;dr we don't want .go(-1) while triggering a click in order to manage popstate event. We just want to call the following function
		$.fn.manageBacklink = function () {
			var $_this			= $(this),
				arr_current_lvl	= $_this.closest('.js-panel-right').attr('class').match(/tree-lvl-([0-9])/), // Current level is obtained from .tree-lvl-N
				// Either the captured number in tree-lvl-(N) or level is 1 in case we encountered class="esf-tree (etc)"
				current_lvl		= (arr_current_lvl !== null) ? parseInt(arr_current_lvl[1], 10) : 1,
				sel_prev_level = 'esf-as-list-filters'; // default

			// We'll need to select the level N-1, in order to update position of its top border.
			// N-1 can be level "0" (default, set above) or 1 or 2..5
			if( current_lvl === 2 ) {
				sel_prev_level = 'esf-tree';
			} else if(current_lvl > 2) {
				sel_prev_level = 'tree-lvl-'+(current_lvl - 1);
			}
			$('.js-panel-right.'+sel_prev_level).setTopPosition();

			$panel_filters.removeClass('displaying-lvl-'+current_lvl);

			// When animation has ended, remove the panel level 1 or >1 that just disappeared
			window.setTimeout( function() {
				if(current_lvl === 1) {
					$('.js-panel-right.esf-tree').remove();
				} else {
					$('.js-panel-right.tree-lvl-' + current_lvl).remove();
				}
			}, 300);

			return false;
		};

		// Managing Back button
		// If user clicks Back button, we go up 1 level (note: if we are at level "0", then modal closes as do(es) every modal(s), see modal.js)
		// Info we have: { modal: opened } then { esfAction: 'next', esfLevel: 1 }, 2 and 3 (there are 3 sub-levels but could easily be 5)
		function manageBackButton() {
			$(window).on("popstate", function(e) {
				var state = e.originalEvent.state;

				if(state) {
					if (state.esfAction === "next" && parseInt(state.esfLevel, 10) >= 1) {
						// Case "going back from 2 to 1 (or 3 to 2, etc)"
						$('.go-to-next-lvl').last().find('.esf-back-to-prev-lvl').manageBacklink(); // .go-to-next-lvl is only in 1 panel (but not unique if we're at level > 2) while .esf-back-to-prev-lvl isn't after a while
					} else if (state.modal === "opened" && $('.displaying-lvl-1').length) {
						// Case 1 to main panel
						$('.displaying-lvl-1').find('.esf-back-to-prev-lvl').first().manageBacklink();
					}
				}
			});
		}


		/*
		 * Variables init
		 */

		var $panel_header	= $('.esf-as-header'),
			$panel			= $('.esf-as-tree'),
			$panel_filters	= $('.esf-as-filters'),
			$panel_content	= $('.esf-as-panel-content'),
			$list_filters	= $('.esf-as-list-filters'),
			$tree_first_lvl = $(".esf-tree"),
			panel_cmd_close	= ".m-btn-to-close",
			max_lvl			= 1,
			slide_panels	= '';


		/*
		 * Markup redesign
		 */

		$panel_content.find('.esf-tree li ul').closest('li').addClass('esf-has-sub-items');

		// js placeholders for multilingual solution
		// "Remove filters" (on mobile) comes after filters
		var txtFilterRemoving = $('.esf-all-filters').data('esfRemoveFilters');
		$('.esf-all-filters').find('.esf-as-af-filters').after('<button type="button" class="esf-remove-filters hidden">'+txtFilterRemoving+'<i class="icon-catal icon-catal-cross" aria-hidden="true"></i></button>');

		// adds tree lvl class
		$tree_first_lvl.each(function(){
			$(this).find("ul").each(function() {
				var lvl = $(this).parentsUntil(".esf-tree").filter("ul").length + 2;
				$(this).addClass("tree-lvl-" + lvl);
				max_lvl = max_lvl < lvl ? lvl : max_lvl;
			});
			$(this).closest('.esf-as-tree').addClass('max-depth-'+ (max_lvl-2));
		});

		// hide all panels
		$('.esf-as-filter-panel').hide();
		// Lvl 2+ that won't be clicked are hidden (they are the original sub-panels, their content will be used to create the visible levels)
		$list_filters.find('.tree-lvl-2').addClass('is-hidden');

		// marks tree with only one basic lvl
		$tree_first_lvl.addClass('esf-only-one-lvl').find('.esf-has-sub-items:first').closest('.esf-only-one-lvl').removeClass('esf-only-one-lvl');


		/*
		 * some useful functions
		 */

		// Synchronizes all the checkbox in an element (as built panels ul.js-panel_right). There should be a total of 3-50 checkbox so it's faster to sync it this way imho
		$.fn.sync_checkbox_in_built_panels = function () {
			var $_this = $(this),
				$checksToSync = $_this.find('input:checkbox');

			$checksToSync.each(function () {
				var $one_check = $(this),
					check_orig_id = $one_check.attr('id').match(/lnk_(.*)$/)[1],
					state_check_orig_id = $('#'+check_orig_id).prop('checked');
				$one_check.prop('checked', state_check_orig_id);
			});
		};

		// reset checked checkboxes
		function esf_reset_panel(element_id) {
			var $the_tree = $('#tree_'+element_id);

			$the_tree.find('input:checkbox').prop('checked', false);
			$the_tree.find('.esf-item-checked').removeClass('esf-item-checked');
			$('.js-panel-right').sync_checkbox_in_built_panels();
		}


		// count the selected checkboxes and display the number
		// updates the global filters count
		function esf_count_selected(element) {

			// element is the clicked checkbox
			var parent_tab		= element.closest('.esf-as-filter-panel'),
				element_id		= parent_tab.attr('id'),
				nb_of_items_sel = parent_tab.find('input:checkbox:checked').length,
				$filter_tag		= $('.esf-' + element_id + '-filter'),
				panel_name		= $('.esf-as-list-filters').find('a[href="#'+element_id+'"]').find('.esf-as-filter-name').text();

			if (nb_of_items_sel !== 0 ) {

				$list_filters.find('[href="#'+element_id+'"]').find('.esf-as-count').addClass('counted').find('.esf-as-count-nb').text(nb_of_items_sel);

				esf_show_filter_ui(element_id);

				// tag filter creation
				if ( $filter_tag.length === 0 ) {
					var filter_markup ='<span class="esf-' + element_id + '-filter"><span class="esf-tag-filter-label">' + panel_name + esf_text.space + ':&nbsp;</span><span class="esf-tag-filter-nb">' + nb_of_items_sel + '</span><button type="button" class="esf-tag-filter-remove" title="' + esf_text.remove_filter +'"><i class="icon-catal icon-catal-cross" aria-hidden="true"></i></button></span>';
					$('.esf-as-af-filters').append(filter_markup);
				}
				// tag filter update number
				else {
					$filter_tag.find('.esf-tag-filter-nb').text(nb_of_items_sel);
				}
			}

			else {

				$list_filters.find('[href="#' + element_id + '"]').find('.esf-as-count').removeClass('counted').find('.esf-as-count-nb').text('');
				esf_hide_filter_ui(element_id);
				$filter_tag.remove();

			}

			refresh_filters_activated();
		}

		function refresh_filters_activated() {
			var state = false;

			if ( $('.esf-as-af-filters').find('span').length !== 0 ) {
				$('.esf-as-activated-filters').removeClass('hidden').attr('aria-hidden', 'false');
				state = true;
			}
			else {
				$('.esf-as-activated-filters').addClass('hidden').attr('aria-hidden', 'true');
				state = false;
			}
			$('.js-panel-right:last').setTopPosition();
			return state; // 1 return per function avoids überfails
		}

		/*function refresh_global_filter_counts() {
			// empty
		}*/

		// show filter UI elements
		function esf_show_filter_ui(element_id) {
			$('.esf-remove-filters').removeClass('hidden').attr('aria-hidden', 'false');
		}

		// remove filter UI elements ("Active filters")
		function esf_hide_filter_ui(element_id) {
			$('.esf-all-filters').find('.esf-'+element_id+'-filter').remove();
		}


		/*
		 * Some useful actions
		 */

		// on advanced search activation
		$panel_header.addClass('is-closed').attr('tabindex', '0');
		$panel_filters.hide();
		$panel_header.on('click', function() {
			$(this).toggleClass('is-closed');
			$panel_filters.slideToggle(300);
			// @BUGFIX for iOS 8 and 7 at least, preventing scroll of page under modal extended searform
			$('html').addClass('is-modal-opened');
		});
		$panel_header.on('keypress', function(e) {
			if(e.keyCode === 13 || e.keyCode === 0) {
				$(this).trigger('click');
			}
			return false;
		});

		// when closing filters modal, manage removal of 2 classes
		$panel_filters.on('click', panel_cmd_close, function(event) {
			// @BUGFIX for iOS 8 and 7 at least, preventing scroll of page under modal extended searform
			$('html').removeClass('is-modal-opened');
			$(this).toggleClass('is-closed');
		});

		// Building level N from scratch
		// @param $(this): (jQuery object) The corresponding or parent element related to the correct subpanel (from level "0": activity or country or..., from level N=1..5: parent list ul.tree-lvl-N)
		// @param sel_level: (string) selector that will select the correct level class, without a dot (ex: 'esf-tree' for level 1 or 'tree-lvl-4' for level 4)
		// @param rel: A unique identifier that will link 'level built from scratch' by this function to the original
		$.fn.buildLevel = function (sel_level, rel) {
			var html_next_panel = '',
				class_level = (sel_level == 0) ? 'esf-tree' : 'tree-lvl-'+sel_level; // Level "0" -> .esf-tree but levels N=1-5 -> .tree-lvl-N

			$(this).children('li').each( function(i, elt) {
				// Extracts needed infos from each item and builds a single-level list
				var li_class = this.className,
					$span = $(this).children('.esf-choice-container'),
					label_txt = $span.children('label').text(),
					check_id = $span.children('input').attr('id'),
					check_state = $('#'+check_id).prop('checked'),
					attr_check_state = (check_state === true) ? ' checked' : ''; // If original checkbox is checked, copy should also be checked

				html_next_panel += (li_class === '') ? '<li>' : '<li class="' + li_class + '">'; // If there were sub-levels 1/2 li has a class
				html_next_panel += '<span class="esf-choice-container form-item-checkbox">';
				html_next_panel += '<input type="checkbox" value="nope" class="form-checkbox" name="nope[]" id="lnk_' + check_id + '"'+attr_check_state+'>'; // Not the original id as it'd be a dupe
				html_next_panel += '<label for="lnk_' + check_id + '" class="checkbox-title">' + label_txt + '</label>';
				html_next_panel += (li_class === '') ? '' : '<span class="esf-next-lvl"></span>'; // If there were sub-levels 2/2 adding arrow '[>]' on right
				html_next_panel += '</span></li>';
			});
			html_next_panel = '<ul id="'+rel+'" class="'+class_level+' js-panel-right is-opened">' + html_next_panel + '</ul>';

			var $nextPanel = $(html_next_panel);
			$nextPanel.insertBefore( $('.esf-as-filter-panel:first') );
			return $nextPanel;
		};

		// Sets top of an element (a built level) right under title+number of results(+filter tags if any)
		$.fn.setTopPosition = function () {
			var $_this = $(this),
				selRef = '.esf-panels', // Taken Into Account for occupied height: all elements before the one correponding to this selector (if visible)
				$tia = $(selRef).prevAll(':not(:hidden)'),
				h = 0;

			$tia.each( function() {
				h += $(this).outerHeight();
			});
			$(this).css({'top': h + 'px'});
		};

		// on filter panel type click. Going from level "0" to 1
		$('.esf-as-list-filters').find('a').on('click', function(){
			var the_id = $(this).attr('href');

			$(this).closest('ul').find('li').removeClass('current');
			$(this).closest('li').addClass('current');

			// There's already an id on list level 1 corresponding to the clicked item in level "0",(ex: tree_activity)
			var list_id = $(the_id).find('.esf-tree').attr('id');
			// Building level 1 from scratch
			$('#'+list_id).buildLevel(0, 'lnk_'+list_id);

			// adds a link back to list filters ("level 0") (if there isn't already one). Different text in each panel
			var txtFilterBacklink = $(the_id).data("filterBacklink");
			$('.js-panel-right.esf-tree').prepend('<li class="esf-sublvl-heading"><button class="esf-back-to-prev-lvl" type="button"><i aria-hidden="true" class="icon-catal icon-catal-arrow-left" aria-hidden="true"></i>'+txtFilterBacklink+'</button></li>');

			// Setting top of visible level right under title+number of results(+filter tags if any)
			$('.js-panel-right.esf-tree').setTopPosition();

			// bugfix WebKit/Blink: waiting 1ms so the CSS transition on this new element is taken into account...
			window.setTimeout( function() {
				$panel_filters.addClass('displaying-lvl-1');
			}, 100);

			//  #10824: pushState: going from level "0" (default view of modal when opened) to level 1
			if (typeof history.pushState !== "undefined") {
				history.pushState({ esfAction: 'next', esfLevel: "1" }, "", ""); // "1" is a string (because 2 and 3 are below)
			}

			return false;
		});


		// on checkbox check in visible levels (in built and destroyed .js-panel-right)
		// We sync checkbox state in original panel from the state of checkbox in visible level
		$(document).on('change', '.js-panel-right input:checkbox', function() {
			var $_this = $(this),
				check_orig_id = $_this.attr('id').match(/lnk_(.*)$/)[1],
				check_state = $_this.prop('checked');
			$('#'+check_orig_id).click();
		});

		// on checkbox check in original levels
		$panel_content.find('input:checkbox').on('change', function() {
			if ( $(this).is(':checked') ) {
				$(this).closest('li').addClass('esf-item-checked').find('ul').find('li').addClass('esf-item-checked').find('input:checkbox').prop('checked', true);
				esf_count_selected($(this));
			}
			else {
				$(this).closest('li').removeClass('esf-item-checked').find('ul').find('li').removeClass('esf-item-checked').find('input:checkbox').prop('checked', false);
				esf_count_selected($(this));
			}
			// AJAX update list
			esf_AJAX_update_list();
		});

		// on checkbox check all in the current lvl
		/*$panel_content.on('change', '.esf-checkbox-select-all', function() {
			if ( $(this).is(':checked') ) {
				$(this).closest('li').nextAll('li').addClass('esf-item-checked').find('input:checkbox').prop('checked', true);
				$(this).closest('li').nextAll('li').find('li').addClass('esf-item-checked');
			}
			else {
				$(this).closest('li').nextAll('li').removeClass('esf-item-checked').find('input:checkbox').prop('checked', false);
				$(this).closest('li').nextAll('li').find('li').removeClass('esf-item-checked');
			}
			esf_count_selected($(this));
			// AJAX update list
			esf_AJAX_update_list();
		});*/

		// on next lvl click (in a .clone()'d panel)
		$(document).on('click', '.js-panel-right .esf-next-lvl', function() {

			var $cmd			= $(this),
				// Search the related/corresponding subpanel from the id of parent list of clicked span (ex: 'lnk_tree_activity' ==> 'tree_activity')
				// id of the input checkbox without the 'lnk_' part
				next_lvl_id			= $(this).prev().prev().attr('id').match(/lnk_(.*)/)[1],
				// From the corresponding input in the original list of items, parent is the span and next is the sub-list
				$next_lvl = $('#'+next_lvl_id).parent().next(),
				next_lvl = $next_lvl.attr('class').match(/[0-9]$/),
				label_text		= $(this).prev('label').text();

			$next_lvl.attr('id', next_lvl_id + '_list' ); // Not necessary for 1..5 but was for "0"
			var $built_lvl = $next_lvl.buildLevel(next_lvl, 'lnk_'+next_lvl_id+'_list');

			// #10824 - Fermeture critères - Retour à la liste
			// pushState will allow to intercept Back button when any modal is opened (not only advanced searchform)
			// and close the modal while staying on the same page instead of actually go back to previous page
			if (typeof history.pushState !== "undefined") {
				history.pushState({ esfAction: 'next', esfLevel: next_lvl }, "", ""); // object, title (unrecognized at least by Fx?) and fake URL (none because closing the modal would leave this fake URL visible)
			}

			// Adding to the created next level a backlink to current level
			$built_lvl.find('li:first').before('<li class="esf-sublvl-heading"><button type="button" class="esf-back-to-prev-lvl"><i class="icon-catal icon-catal-arrow-left" aria-hidden="true"></i>' + label_text + '</button>');

			// Setting top of visible level right under title+number of results(+filter tags if any)
			$built_lvl.setTopPosition();

			// bugfix Firefox: waiting not 1ms but ~30ms so the CSS transition on this new element is taken into account... (at least 15ms so)
			window.setTimeout( function() {
				$panel_filters.addClass('displaying-lvl-'+next_lvl);
			}, 100);

		});

		// on prev lvl click (in a .clone()'d panel)
		$('.esf-panels').on('click', '.esf-back-to-prev-lvl', function() {
			$(this).manageBacklink(); // Also sets position of top border

			// Syncing browser history with clicks on this backlink
			// We need to *not* react to the event which will be fired by go(-1) and then re-enable it
			$(window).off();
			history.go(-1);
			// @BUGFIX setTimeout of 1ms fixes a WebKit/Blink bug where history.go(-1) immediately followed by setting again the management of popstate event will fire the latter twice and thus partially go back 2 levels above while still displaying 1 level above.
			// tl;dr avoids a blank screen when going back from level 3 to 2 (with a click on backlink, it's ok with Back button)
			// Firefox has no such buggy behavior
			var timer = setTimeout(function() {
				manageBackButton();
			}, 100);
		});

		// on (browser) Back button (uses function defined above with popstate event and across this script with pushState)
		manageBackButton();

		// on remove filterS click (on mobile, removes at once each filter from all panels)
		$('.esf-remove-filters').on('click', function() {
			$('.esf-as-tree').each(function() {
				var id	= $(this).attr('id'),
					name = id.split('_tree');

				esf_reset_panel(name[0]);
				esf_count_selected($(this));
				// AJAX update list
				esf_AJAX_update_list();
			});
		});

		// on remove tag filter click
		$('.esf-as-af-filters').on('click', '.esf-tag-filter-remove', function(){
			var id = $(this).closest('span').attr('class'),
				name = id.split('-');

			esf_reset_panel(name[1]);
			esf_count_selected($('#'+name[1]+'_tree'));
			// AJAX update list
			esf_AJAX_update_list();
		});

		//simulate alpha filter click
		$('.esf-results-alpha-list').find('a').on('click', function(){
			// AJAX update list
			esf_AJAX_update_list();
			return false;
		});


	} // end of 'only if module here'


});
