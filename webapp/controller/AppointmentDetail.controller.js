sap.ui.define([
	'sap/ui/core/mvc/Controller', "sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";

	return Controller.extend("sap.dm.controller.AppointmentDetail", {

		onInit: function() {
			var oComponent = this.getOwnerComponent();

			this._router = oComponent.getRouter();
			this._router.getRoute("appointmentDetail").attachPatternMatched(this._loadAppointmentDetail, this);

		},
		_loadAppointmentDetail: function(oEvent) {
			var sId = oEvent.getParameter("arguments").id;
			// var sId = oEvent.getParameter("arguments").appointmentId, oView = this.getView(), sPath = "/appointment('" + sId + "')";
			this.oAppointmentModel = new JSONModel();
			this.oAppointmentModel.loadData("model/appointment.json", null, false);
			var aData = this.oAppointmentModel.getData();
			if (aData && aData.length > 0) {
				var oCurrentAppointment = _.find(aData, function(oItem) {
					if (oItem.id === sId) {
						return true;
					}
				});
				if (!oCurrentAppointment) {
					this._router.navTo("notFound", {
						id: sId
					});
				}
				var oCurrentAppointmentModel = new JSONModel(oCurrentAppointment);
				this.getView().setModel(oCurrentAppointmentModel);

				this.initNavModel();
				this.addDemoAnimation();
			}
		},

		handleNavBack: function() {
			this.getOwnerComponent().myNavBack();
			clearInterval(this.oTimer);
		},

		onPressShowThumb: function() {
			this._router.navTo("appointment");
			clearInterval(this.oTimer);
		},

		initNavModel: function() {
			var oNavData = {
				location: "frontdesk",
				destination: "mr0824",
				orientation: 0
			}

			var oNavModel = new JSONModel(oNavData);
			this.getView().setModel(oNavModel, "nav");
		},

		addDemoAnimation: function() {
			var aDemoNavData = [
				{
					location: "frontdesk",
					destination: "mr0824",
					orientation: 0
				}, {
					location: "aisle1",
					destination: "mr0824",
					orientation: -30
				}, {
					location: "aisle2",
					destination: "mr0824",
					orientation: -30
				}, {
					location: "aisle3",
					destination: "mr0824",
					orientation: -30
				}, {
					location: "aisle4",
					destination: "mr0824",
					orientation: -30
				}, {
					location: "aisle5",
					destination: "mr0824",
					orientation: -60
				}, {
					location: "aisle6",
					destination: "mr0824",
					orientation: -60
				}, {
					location: "mr0824",
					destination: "mr0824",
					orientation: 30
				}
			];
			
			var that = this;
			var iIndex = 0;
			this.oTimer = setInterval(function() {
				that.getView().getModel("nav").setData(aDemoNavData[iIndex]);
				that.getView().getModel("nav").refresh(true);
				iIndex = (++iIndex) % aDemoNavData.length;
			}, 1000);
		}
	});
});
