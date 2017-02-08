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
			var that = this;
			var oUserModel = new JSONModel();
			oUserModel.loadData("model/userProfile.json", null, false);
			if (oUserModel && oUserModel.getData() && oUserModel.getData().length > 0) {
				var oLoginUser = _.find(oUserModel.getData(), function(oItem) {
					if (oItem.pinCode === that.oFormLoginModel.getData().pinCode) {
						return true;
					}
				});
				if (oLoginUser) {
					var oLoginModel = new JSONModel();
					oLoginModel.setData(oLoginUser);
					that.getOwnerComponent().setModel(oLoginModel, "oLoginModel");
					that._router.navTo("appointment");
				} else {
					that.getView().byId("idPinCode").setValueState(sap.ui.core.ValueState.Error);
				}
			}
		}
	});
});
