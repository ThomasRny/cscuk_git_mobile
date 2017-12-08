jQuery(function($) {
	$.smartbanner({
		 title: $('#sb-datas').data('bannerTitle'), // What the title of the app should be in the banner (defaults to <title>)
        author: $('#sb-datas').data('bannerAuthor'), // What the author of the app should be in the banner (defaults to <meta name="author"> or hostname)
        price: $('#sb-datas').data('bannerPrice'), // Price of the app
        appStoreLanguage: $('#sb-datas').data('bannerAppStoreLanguage'), // Language code for App Store
        inAppStore: $('#sb-datas').data('bannerAppStore'), // Text of price for iOS
        inGooglePlay: $('#sb-datas').data('bannerGooglePlay'), // Text of price for Android
        inAmazonAppStore: $('#sb-datas').data('bannerAmazonAppStore'),
        inWindowsStore: $('#sb-datas').data('bannerWindowsStore'), //Text of price for Windows
        GooglePlayParams: null, // Aditional parameters for the market
        icon: null, // The URL of the icon (defaults to <meta name="apple-touch-icon">)
        iconGloss: null, // Force gloss effect for iOS even for precomposed
        button: $('#sb-datas').data('bannerBtnTxt'), // Text for the install button
        url: null, // The URL for the button. Keep null if you want the button to link to the app store.
        scale: 'auto', // Scale based on viewport size (set to 1 to disable)
        speedIn: 300, // Show animation speed of the banner
        speedOut: 400, // Close animation speed of the banner
        daysHidden: 15, // Duration to hide the banner after being closed (0 = always show banner)
        daysReminder: 90, // Duration to hide the banner after "VIEW" is clicked *separate from when the close button is clicked* (0 = always show banner)
        force: null, // Choose 'ios', 'android' or 'windows'. Don't do a browser check, just always show this banner
        hideOnInstall: true, // Hide the banner after "VIEW" is clicked.
        layer: false, // Display as overlay layer or slide down the page
        iOSUniversalApp: true, // If the iOS App is a universal app for both iPad and iPhone, display Smart Banner to iPad users, too.
        appendToSelector: 'body', //Append the banner to a specific selector
		pushSelector: 'html' // What element is going to push the site content down; this is where the banner append animation will start.
	});
} );
