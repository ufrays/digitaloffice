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
		}
	});
});
