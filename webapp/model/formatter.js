sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function(NumberFormat) {
	"use strict";

	var formatter = {

		formatMeetingInfo: function(oLocation, iDateTime) {
			var oDateTime = new Date(parseInt(iDateTime));
			var sLocalTime = oDateTime.toLocaleTimeString();
			return "Location - " + oLocation.name + " " + sLocalTime;
		}
	};

	return formatter;
});
