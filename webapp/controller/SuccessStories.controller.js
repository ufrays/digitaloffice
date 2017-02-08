sap.ui.define([
	'sap/ui/core/mvc/Controller'
], function(Controller) {
	"use strict";

	return Controller.extend("sap.dm.controller.SuccessStories", {
		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
		},
		handleNavBack: function() {
			this.getOwnerComponent().myNavBack();
		},
		
		onPressTest1: function(){
			$.ajax("http://10.130.231.166:3000/service?key=1");
		},
		
		onPressTest2 : function(){
			$.ajax("http://10.130.231.166:3000/service?key=2");
		}
	});
});
