/*!
 * Comexposium Events Search Form Module (mobile events)
 * Adapted from Mobile extended searchform for products and exhibitors
 *
 * Code design contributors: Geoffrey Crofte (Alsacréations), Philippe Vayssière (Alsacréations)
 * Vendors it depends on: jQuery UI 1.11.4 (custom build)
 *
 * File Last Update: 2015-12-02
 */

;jQuery(document).ready(function($){

	// evsf JavaScript only if we find the module

	if ( $('.events-search-form').length === 1 ) {


		// `evsf` = debug function for console.log (ex: evsf.log(string))
		// `evsf_text` is translation ready texts

		var $dataSrc = $('.evsf-all-filters');
		var evsf = {log:function(e){"undefined"!=typeof console&&console.log(e)}},
			evsf_text = {
				remove_filter : $dataSrc.data('evsfRemoveFilter'),
				unselect : $dataSrc.data('evsfUnselect'),
				select : $dataSrc.data('evsfSelect'),
				add : $dataSrc.data('evsfAdd'),
				remove : $dataSrc.data('evsfRemove'),
				space : '&nbsp;' // empty in english
			};

		$('html').addClass('js');

		/*
		 * AJAX actions
		 */

		function evsf_AJAX_do_something_selection(the_id, $the_button) {

			var $the_icon = $the_button.find('i'),
				the_class = $the_button.attr('class');

			$the_icon.attr('class', 'icon-loading');

			if ( the_class === 'evsf-action-add-to-selection' ) {

				// ** simulate request delay for adding exhibitor to favs **
				// have to replace setInterval by AJAX request and
				// "simulate positive" by the onsuccess respond

				// do what you want with the exhibitor id
				evsf.log('Adding: ' + the_id);

				var fake_ajax_request = setInterval(function(){

					// do what you want with the exhibitor id
					evsf.log('Added: '+the_id);

					// simulate positive
					$the_icon.attr('class','icon-remove-selection');
					$the_button.toggleClass('evsf-action-add-to-selection evsf-action-remove-from-selection').find('.evsf-action-text').text(evsf_text.remove);

					clearInterval(fake_ajax_request);
					fake_ajax_request = null;
				}, 900);

			}
			else {

				// ** simulate request delay for removing exhibitor to favs **
				// have to replace setInterval by AJAX request and
				// "simulate positive" by the onsuccess respond

				// do what you want with the exhibitor id
				evsf.log('Removing: '+the_id);

				var fake_ajax_request = setInterval(function(){

					// do what you want with the exhibitor id
					evsf.log('Removed: '+the_id);

					// simulate positive
					$the_icon.attr('class','icon-add-selection');
					$the_button.toggleClass('evsf-action-add-to-selection evsf-action-remove-from-selection').find('.evsf-action-text').text(evsf_text.add);

					clearInterval(fake_ajax_request);
					fake_ajax_request = null;

				}, 900);

			}

		}


		function evsf_AJAX_update_list() {

			// request begins
			// (mobile) Visual effect should only be applied once: this wasn't the case when removing _all_ filters (this function is then called as many times as there are main categories, 7 in test example)
			// Let's verify layer doesn't exist yet before creating it
			var $layer = $('.evsf-loader-layer'),
				layerCreated = false;
			if( $layer.length === 0 ) {
				layerCreated = true;
				$('.exhibitor-search-form').append('<div class="evsf-loader-layer"><div class="evsf-loader" title="0"><div class="loading"><div class="loading-inner"><span class="shape"></span><span class="shape"></span><span class="shape"></span></div></div></div></div>');
				$('.evsf-loader-layer').hide().fadeIn(200);
			}

			setTimeout( function() {
				// in request success
				// Layer is removed once (wouldn't harm if it was removed N times as it could only be done once)
				// Should be removed after the success of the _last_ successful AJAX request but that's not the case yet
				if( layerCreated === true ) {
					$('.evsf-loader-layer').fadeOut(200, function(){ $(this).remove(); });
				}
			}, 300);
		}
		// AJAX END


		/*
		 * Variables init
		 */

		var $panel_header	= $('.evsf-as-header'),
			$panel			= $('.evsf-filter-group'),
			$panel_filters	= $('.evsf-as-filters'),
			$panel_content	= $('.evsf-filter-list'),
			panel_cmd_close	= ".m-btn-to-close",
			isSafari = /constructor/i.test(window.HTMLElement); // Allows to correct buggy vw/vh unit in iOS <=7. @source http://browserhacks.com/#hack-8cbfaf04fe51ad543a597fbd2f249fa7


		/*
		 * Markup redesign
		 */
		// js placeholders for multilingual solution
		// "Remove filters" (on mobile) comes after filters
		var txtFilterRemoving = $('.evsf-all-filters').data('evsfRemoveFilters');
		$('.evsf-all-filters').find('.evsf-as-af-filters').after('<button type="button" class="evsf-remove-filters hidden" aria-hidden="true">'+txtFilterRemoving+'<i class="icon-catal icon-catal-cross" aria-hidden="true"></i></button>');

		// set correct widths on elements which width is set with vw unit though latter is buggy on iOS <= 7
		// This either corrects a buggy width on iOS <= 7 or - on iOS >=8 and all versions of OS X - sets the same wdth which is already correct (thus changes nothing)
		function esf_width_vw_safari() {
			if(isSafari) {
				// 100vw == window.width
				var w100 = $(window).width();
				var h100 = $(window).height();

				$panel_filters.width(w100);
				// @BUGFIX height set in CSS with vh vs. iOS7 is also buggy. But as it has !important modifier, jQuery method .css() doesn't work...
				// Using .(remove|set)Property from this answer on SO http://stackoverflow.com/a/18792741/137626 (see my comment (FelipeAls))
				// Seems like .removeProperty() does nothing (tested with background-color/backgroundColor and returns an empty
				// string/null, same with height property) but setProperty() works and iOS bug is solved nevertheless
				$panel_filters[0].style.removeProperty('height');
				$panel_filters[0].style.setProperty('height', h100+'px', 'important');
			}
		}

		/*
		 * some useful actions / functions
		 */

		// on filter activation
		$panel_header.on('click', function() {
			esf_width_vw_safari(); // @BUGFIX iOS <= 7 and vw unit (changes nothing on other Safari versions like iOS >= 8 and desktop)
			// @BUGFIX for iOS 8 and 7 at least, preventing scroll of page under modal extended searform
			$('html').addClass('is-modal-opened');
		});

		// when closing filters modal, manage removal of 2 classes
		$panel_filters.on('click', panel_cmd_close, function(event) {
			// @BUGFIX for iOS 8 and 7 at least, preventing scroll of page under modal extended searform
			$('html').removeClass('is-modal-opened');
		});

		// reset checked checkboxes
		function evsf_reset_panel(element_id) {
			var $the_tree = $('#evsf_'+element_id);

			$the_tree.find('input:checkbox').prop('checked', false);
			$the_tree.find('.evsf-item-checked').removeClass('evsf-item-checked');
		}

		// count the selected checkboxes and display the number
		// updates the global filters count
		function evsf_count_selected(element) {

			// element is the clicked checkbox
			var parent_tab		= element.closest('.evsf-filter-list'),
				element_id		= parent_tab.attr('id').split('evsf_')[1], // returns 'theme' from id="evsf_theme"
				nb_of_items_sel = parent_tab.find('input:checkbox:checked').length,
				$filter_tag		= $('.evsf-' + element_id + '-filter'),
				panel_name		= $('#evsf_title_'+element_id).text();

			if (nb_of_items_sel !== 0 ) {

				evsf_show_filter_ui(element_id);

				// tag filter creation
				if ( $filter_tag.length === 0 ) {
					var filter_markup ='<span class="evsf-' + element_id + '-filter"><span class="evsf-tag-filter-label">' + panel_name + evsf_text.space + ':&nbsp;</span><span class="evsf-tag-filter-nb">' + nb_of_items_sel + '</span><button type="button" class="evsf-tag-filter-remove" title="' + evsf_text.remove_filter +'"><i class="icon-catal icon-catal-cross" aria-hidden="true"></i></button></span>';
					$('.evsf-as-af-filters').append(filter_markup);
				}
				// tag filter update number
				else {
					$filter_tag.find('.evsf-tag-filter-nb').text(nb_of_items_sel);
				}
			}

			else {
				evsf_hide_filter_ui(element_id);
				$filter_tag.remove();
			}

			refresh_filters_activated();
		}

		function refresh_filters_activated() {
			if ( $('.evsf-as-af-filters').find('span').length !== 0 ) {
				$('.evsf-as-activated-filters').removeClass('hidden').attr('aria-hidden', 'false');
				return true;
			}
			else {
				$('.evsf-as-activated-filters').addClass('hidden').attr('aria-hidden', 'true');
				return false;
			}
		}

		// show filter UI elements
		function evsf_show_filter_ui(element_id) {
			$('.evsf-remove-filters').removeClass('hidden').attr('aria-hidden', 'false');
		}

		// remove filter UI elements ("Active filters")
		function evsf_hide_filter_ui(element_id) {
			$('.evsf-all-filters').find('.evsf-'+element_id+'-filter').remove();
		}


		/*
		 * Some useful actions
		 */

		// on checkbox check
		$panel_content.find('input:checkbox').on('change', function() {
			if ( $(this).is(':checked') ) {
				$(this).closest('li').addClass('evsf-item-checked').find('ul').find('li').addClass('evsf-item-checked').find('input:checkbox').prop('checked', true);
				evsf_count_selected($(this));
			}
			else {
				$(this).closest('li').removeClass('evsf-item-checked').find('ul').find('li').removeClass('evsf-item-checked').find('input:checkbox').prop('checked', false);
				evsf_count_selected($(this));
			}
			// AJAX update list
			evsf_AJAX_update_list();
		});

		// on remove (all) filterS click (on mobile, removes at once each filter from all panels)
		$('.evsf-remove-filters').on('click', function() {
			$('.evsf-filter-list').each(function() {
				var id	= $(this).attr('id'),
					name = id.split('evsf_');

				evsf_reset_panel(name[1]);
				evsf_count_selected($(this));
				// AJAX update list
				evsf_AJAX_update_list();
			});
		});

		// on remove tag filter click
		$('.evsf-as-af-filters').on('click', '.evsf-tag-filter-remove', function(){
			var id = $(this).closest('span').attr('class'),
				name = id.split('-');

			evsf_reset_panel(name[1]);
			evsf_count_selected($('#evsf_'+name[1]));
			// AJAX update list
			evsf_AJAX_update_list();
		});


	} // end of 'only if module here'


});
