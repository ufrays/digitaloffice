sap.ui.define([], function() {
	"use strict";

	var watchId;
	var magneticHeading;
	return {
		startWatchHeading: function() {
			var options = {
				frequency: 1
			};
			watchId = navigator.compass.watchHeading(this.onSuccess, this.onError, options);
		},
		getCurrentLocationHeading: function() {
			return magneticHeading;
		},

		onSuccess: function(heading) {
			magneticHeading = heading.magneticHeading;
		},

		onError: function(error) {
			alert('CompassError: ' + error.code);
		}
	};
});
