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
			}
		},
		
		handleNavBack: function() {
			this.getOwnerComponent().myNavBack();
		},
		
		onPressShowThumb: function() {
			this._router.navTo("appointment");
		}
	});
});
