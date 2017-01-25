sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/m/MessageBox', "sap/ui/model/json/JSONModel", "sap/dm/model/formatter"
], function(Controller, MessageToast, MessageBox, JSONModel, formatter) {
	return Controller.extend("sap.dm.controller.Appointment", {

		formatter: formatter,

		onInit: function() {
			var oComponent = this.getOwnerComponent();

			this._router = oComponent.getRouter();
			this._router.getRoute("appointment").attachPatternMatched(this._loadAppointment, this);

		},

		_loadAppointment: function(oEvent) {
			this.oAppointmentModel = new JSONModel("model/appointment.json");
			this.getView().setModel(this.oAppointmentModel, "oAppointmentModel");
		},

		onPressMenuBtn: function() {
			this._router.navTo("menu");
		},

		onPressAppointment: function(oEvent) {
			var oListItem = oEvent.getSource().getParent();
			var oDetailContainer = oListItem.findAggregatedObjects(false, function(oElement) {
				if (oElement.getMetadata().getName() === "sap.m.VBox") {
					return oElement;
				}
			});
			if (oDetailContainer && oDetailContainer.length === 1) {
				if (oDetailContainer[0].getVisible()) {
					oDetailContainer[0].setVisible(false);
					return;
				}
				oDetailContainer[0].setVisible(true);
			}
		},

		onPressMap: function(oEvent) {
			var oListItem = oEvent.getSource().getParent().getParent();
			var oBindingCtx = oListItem.getBindingContext("oAppointmentModel");
			if (!_.isEmpty(oBindingCtx.getObject())) {
				this._router.navTo("appointmentDetail", {
					id: oBindingCtx.getObject().id
				});
			}
		},

		handleNavButtonPress: function() {
			this.getOwnerComponent().myNavBack();
		}

	});
});
