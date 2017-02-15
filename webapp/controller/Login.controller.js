sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/dm/util/FaceIdentify"
], function(Controller, JSONModel, FaceIdentify) {
	"use strict";

	return Controller.extend("sap.dm.controller.Login", {

		onInit: function() {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this._router.getRoute("login").attachPatternMatched(this._setupFormVisible, this);
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

			jQuery.sap.delayedCall(500, this, function() {
				this.getView().byId("idPinCode").focus();
			});
		},

		onPinCodeCancel: function() {
			var oFormLoginData = this.oFormLoginModel.getData();
			oFormLoginData.bPinCode = false;
			oFormLoginData.bInital = true;
			this.oFormLoginModel.refresh();
		},

		onPressFaceIdentify: function(oEvent) {
			try {
				this.getView().setBusy(true);
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
					oLoginModel.refresh();
					return oLoginModel;
				}
			}
		},

		onFaceIdentified: function(oEvent) {
			var sToken = arguments[2];
			if (_.isEmpty(sToken)) {
				sap.m.MessageToast.show("Face Recognition Failed.");
				this.getView().setBusy(false);
				return;
			}
// this._router.navTo("appointment");
			var oLoginModel = this._getUserModel(null, null, sToken);
			if (oLoginModel && oLoginModel.getData()) {
				this.getOwnerComponent().setModel(oLoginModel, "oLoginModel");
				this._router.navTo("appointment");
				this.showWelcomeMsg();
			} else {
				sap.m.MessageToast.show("Face Unknown");
			}
			this.getView().setBusy(false);
		},

		showWelcomeMsg: function() {
			var oLoginModel = this.getOwnerComponent().getModel("oLoginModel");
			if (oLoginModel && oLoginModel.getData()) {
				sap.m.MessageToast.show("Welcome, " + oLoginModel.getData().firstName, null, 1000);
			}
		},

		onPinCodeLogin: function() {
			var sPinCode = this.oFormLoginModel.getData().pinCode;
			var oLoginModel = this._getUserModel(null, sPinCode, null);
			if (oLoginModel) {
				this.getOwnerComponent().setModel(oLoginModel, "oLoginModel");
				this._router.navTo("appointment");
				this.showWelcomeMsg();
			} else {
				this.getView().byId("idPinCode").setValueState(sap.ui.core.ValueState.Error);
			}
		}
	});
});
