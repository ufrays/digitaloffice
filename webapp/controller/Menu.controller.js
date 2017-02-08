sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/ui/Device', 'sap/ui/model/Filter', 'sap/ui/model/FilterOperator'
], function(Controller, Device, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("sap.dm.controller.Menu", {

		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.getRoute("menu").attachMatched(this._loadMenu, this);
		},

		_loadMenu: function(oEvent) {
			return;
		},

		onPressAppointment: function() {
			this._router.navTo("appointment");
		},

		onPressSitemap: function() {
			this._router.navTo("sitemap");
		},
		onPressAbout: function() {
			this._router.navTo("about");
		},
		onPressSuccessStories: function() {
			this._router.navTo("successStories");
		}

	});
});
