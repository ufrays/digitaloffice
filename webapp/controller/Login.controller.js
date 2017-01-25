sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.dm.controller.Login", {

		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._setupFormVisible();
		},

		_setupFormVisible: function() {
			this.oFormLoginModel = new JSONModel({
				bPinCode: false,
				bInital: true,
				pinCode: ""
			});
			this.getView().setModel(this.oFormLoginModel, "oFormLoginModel");
		},

		onPressPinCode: function(oEvent) {
			var oFormLoginData = this.oFormLoginModel.getData();
			oFormLoginData.bPinCode = true;
			oFormLoginData.bInital = false;
			this.oFormLoginModel.refresh();
		},

		onPinCodeLogin: function() {
			var oUserModel = new JSONModel("model/userProfile.json");
			var sPin = this.oFormLoginModel.getData().pinCode;
			this._router.navTo("menu");

		}
	});
});
