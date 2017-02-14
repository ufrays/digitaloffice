sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function(Controller) {
	"use strict";

	return Controller.extend("sap.dm.controller.Sitemap", {

		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
		},
		handleNavBack: function() {
			this.getOwnerComponent().myNavBack();
		},

		onSegmentSelected: function(oEvent) {
			var sKey = oEvent.getParameter("key");
			switch (sKey) {
				case "7":
					this.getView().byId("id7F").setVisible(true);
					this.getView().byId("id8F").setVisible(false);
					break;
				case "8":
					this.getView().byId("id7F").setVisible(false);
					this.getView().byId("id8F").setVisible(true);
					break;
				default:
					this.getView().byId("id7F").setVisible(true);
					this.getView().byId("id8F").setVisible(false);
					break;
			}
		}
	});
});
