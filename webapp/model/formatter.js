sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function(NumberFormat) {
	"use strict";

	var formatter = {

		formatMeetingInfo: function(oLocation, iDateTime) {
			var oDateTime = new Date(parseInt(iDateTime));
			var sLocalTime = oDateTime.toLocaleTimeString();
			return "Location - " + oLocation.name + " " + sLocalTime;
		},
		formatDateTime: function(iDateTime) {
			var oDateTime = new Date(parseInt(iDateTime));
			var sLocalTime = oDateTime.toLocaleTimeString();
			return sLocalTime;
		},

		formatAppointmentImg: function(sType) {
			switch (sType) {
				case "Meeting":
					return "img/meeting1.jpg";
					break;
				case "All Hands":
					return "img/meeting.jpeg";
					break;
				default:
					return "img/NewsImage.png";
			}
		}
	};

	return formatter;
});
