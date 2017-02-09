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
				this.getView().setModel(oCurrentAppointmentModel,"oCurrentAppointmentModel");

				this.initNavModel();
				//this.addDemoAnimation();
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
				destination: "collaboration",
				orientation: 0
			}

			var oNavModel = new JSONModel(oNavData);
			this.getView().setModel(oNavModel, "nav");
		},

		addDemoAnimation: function() {
			var sDestination = "mr0805-0806";
			var aDemoNavData = [
				{
					location: "frontdesk",
					destination: sDestination,
					orientation: 0
				},{
					location: "male",
					destination: sDestination,
					orientation: 0
				},{
					location: "pantry",
					destination: sDestination,
					orientation: 0
				},{
					location: "collaboration",
					destination: sDestination,
					orientation: 0
				},{
					location: "mr0805-0806",
					destination: sDestination,
					orientation: 0
				}, {
					location: "dt",
					destination: sDestination,
					orientation: -30
				}, {
					location: "aisle-1-1",
					destination: sDestination,
					orientation: -30
				}, {
					location: "aisle-1-2",
					destination: sDestination,
					orientation: -30
				}, {
					location: "aisle-1-3",
					destination: sDestination,
					orientation: -30
				}, {
					location: "aisle-1-4",
					destination: sDestination,
					orientation: -30
				}, {
					location: "aisle-2-1",
					destination: sDestination,
					orientation: -60
				}, {
					location: "aisle-2-2",
					destination: sDestination,
					orientation: -60
				}, {
					location: "aisle-2-3",
					destination: sDestination,
					orientation: -60
				}, {
					location: "aisle-2-4",
					destination: sDestination,
					orientation: -60
				}
/*				, {
					location: "aisle-2-2",
					destination: "dt",
					orientation: -60
				}, {
					location: "aisle-2-3",
					destination: "dt",
					orientation: 30
				}*/
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
