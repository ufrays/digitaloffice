sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/dm/util/FaceIdentify"
], function(Controller, JSONModel, FaceIdentify) {
	"use strict";

	return Controller.extend("sap.dm.controller.Login", {

		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._setupFormVisible();
			oComponent.getEventBus().subscribe("sap.dm", "faceIdentified", this.onFaceIdentified, this);
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

		_getUserModel: function(sUserId, sPinCode, sTokenId) {
			var oUserModel = new JSONModel();
			oUserModel.loadData("model/userProfile.json", null, false);
			var oLoginUser = null;
			if (oUserModel && oUserModel.getData() && oUserModel.getData().length > 0) {
				if (!_.isEmpty(sUserId)) {
					oLoginUser = _.find(oUserModel.getData(), function(oItem) {
						if (oItem.id === sUserId) {
							return true;
						}
					});
				} else if (!_.isEmpty(sPinCode)) {
					oLoginUser = _.find(oUserModel.getData(), function(oItem) {
						if (oItem.pinCode === sPinCode) {
							return true;
						}
					});
				} else if (!_.isEmpty(sTokenId)) {
					oLoginUser = _.find(oUserModel.getData(), function(oItem) {
						if (oItem.photoTokenId === sTokenId) {
							return true;
						}
					});
				}
				if (oLoginUser) {
					var oLoginModel = new JSONModel();
					oLoginModel.setData(oLoginUser);
					return oLoginModel;
				}
			}
		},

		onFaceIdentified: function(oEvent) {
			var oData = arguments[2];
			this._router.navTo("appointment");
			var oLoginModel = this._getUserModel("6", null, null);
			if (oLoginModel) {
				this.getOwnerComponent().setModel(oLoginModel, "oLoginModel");
				this._router.navTo("appointment");
			} else {
				sap.m.MessageToast.show("Face Unknown");
			}
			// sap.m.MessageToast.show(JSON.stringify(oData));
		},

		onPinCodeLogin: function() {
			var sPinCode = this.oFormLoginModel.getData().pinCode;
			var oLoginModel = this._getUserModel(null, sPinCode, null);
			if (oLoginModel) {
				this.getOwnerComponent().setModel(oLoginModel, "oLoginModel");
				this._router.navTo("appointment");
			} else {
				that.getView().byId("idPinCode").setValueState(sap.ui.core.ValueState.Error);
			}
		}
	});
});
