sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/m/routing/Router', 'sap/ui/model/resource/ResourceModel', 'sap/ui/model/odata/ODataModel', 'sap/ui/model/json/JSONModel'
], function(UIComponent, Router, ResourceModel, ODataModel, JSONModel) {

	return UIComponent.extend("sap.dm.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			UIComponent.prototype.init.apply(this, arguments);

			// set device model
			var oDeviceModel = new JSONModel({
				isTouch: sap.ui.Device.support.touch,
				isNoTouch: !sap.ui.Device.support.touch,
				isPhone: sap.ui.Device.system.phone,
				isNoPhone: !sap.ui.Device.system.phone,
				listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
				listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
			});
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.setModel(oDeviceModel, "device");

			this._router = this.getRouter();
			this._router.getTargets().display("login");
			this._router.initialize();
		},

		myNavBack: function() {
			var oHistory = sap.ui.core.routing.History.getInstance();
			var oPrevHash = oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this._router.navTo("login", {}, true);
			}
		}
	});

});
