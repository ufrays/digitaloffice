sap.ui.define([
	'sap/ui/core/mvc/Controller', 'sap/m/MessageToast', 'sap/m/MessageBox', "sap/ui/model/json/JSONModel", "sap/dm/model/formatter"
], function(Controller, MessageToast, MessageBox, JSONModel, formatter) {
	return Controller.extend("sap.dm.controller.Appointment", {

		formatter: formatter,

		onInit: function() {
			var oComponent = this.getOwnerComponent();

			this._router = oComponent.getRouter();
			this._router.getRoute("appointment").attachPatternMatched(this._loadAppointment, this);

			// subscribe location change event
			var oBus = oComponent.getEventBus();
			oBus.subscribe("sap.dm", "locationChange", this.onLocationChange, this);

		},

		onLocationChange: function(oEvent) {
			var that = this;
			var oLocation = arguments[2];
			sap.m.MessageToast.show("location changed to " + oLocation.locationId);
			if (oLocation) {
				switch (oLocation.locationId) {
					case "pantry":
						var dialog = new sap.m.Dialog({
							title: "Success Stories",
							type: "Message",
							content: new sap.m.Text({
								text: "Do you interesting our success stories?"
							}),
							beginButton: new sap.m.Button({
								text: "Sure, Show me",
								press: function() {
									that._router.navTo("successStories");
									dialog.close();
								}
							}),
							endButton: new sap.m.Button({
								text: "I Don't like",
								press: function() {
									dialog.close();
								}
							}),
							afterClose: function() {
								dialog.destroy();
							}
						});
						dialog.open();
						break;
					default:
						break;
				}
			}
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

		onUserMenuAction: function(oEvent) {
			var oItem = oEvent.getParameter("item"), sItemPath = "";
			while (oItem instanceof sap.m.MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}
			sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));
			sap.m.MessageToast.show("Action triggered on item: " + sItemPath);
		}

	});
});
