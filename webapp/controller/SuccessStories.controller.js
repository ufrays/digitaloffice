sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function(Controller) {
	"use strict";

	return Controller.extend("sap.dm.controller.SuccessStories", {
		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			$.ajax("http://10.130.231.166:3000/service?key=1");
		},
		handleNavBack: function() {
			this.getOwnerComponent().myNavBack();
		},

		onPageChanged: function(oEvent) {
			var sPageId = oEvent.getParameter("newActivePageId");
			var sViewId = this.getView().getId();
			switch (sPageId) {
				case sViewId + "--" + "idImgINPEX":
					$.ajax("http://10.130.231.166:3000/service?key=1");
					break;
				case sViewId + "--" + "idImgHILTI":
					$.ajax("http://10.130.231.166:3000/service?key=2");
					break;
				case sViewId + "--" + "idImgPOSTNL":
					$.ajax("http://10.130.231.166:3000/service?key=3");
					break;
				case sViewId + "--" + "idImgSHFA":
					$.ajax("http://10.130.231.166:3000/service?key=4");
					break;
				default:
			}
		}
	});
});
