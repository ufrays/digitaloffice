sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/dm/util/FaceIdentify"
], function(Controller, JSONModel, FaceIdentify) {
	"use strict";

	return Controller.extend("sap.dm.controller.Login", {

		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._setupFormVisible();
			this.getEventBus().subscribe("sap.dm", "faceIdentified", this.onFaceIdentified, this);
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

		onPressFaceIdentify: function(oEvent) {
			try {
				FaceIdentify.analyzePhoto();
			} catch (e) {
				var oDebug = this.getOwnerComponent().getModel("debug");
				oDebug.getData().debugInfo = oDebug.getData().debugInfo.concat("       " + e.stack);
				oDebug.refresh();
			}
		},

		onFaceIdentified: function(oEvent) {
			var oData = arguments[2];
			sap.m.MessageToast.show(JSON.stringify(oData));
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
