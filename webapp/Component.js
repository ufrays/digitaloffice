sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/m/routing/Router', 'sap/ui/model/resource/ResourceModel', 'sap/ui/model/odata/ODataModel', 'sap/ui/model/json/JSONModel', 'sap/dm/util/Beacon'
], function(UIComponent, Router, ResourceModel, ODataModel, JSONModel, Beacon) {

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

			// init beacon

			try {
				Beacon.startBeaconRegion();
				// Beacon : {majorId:xx, minorId:xx}
			} catch (e) {
				jQuery.sap.log.error("Beacon cannot start.");
			}

			/* will move to try block */

			var oCurrentLocationModel = new JSONModel();
			this.setModel(oCurrentLocationModel, "currentLocation");

			// runtime update the beacon info.
			this._loadBeaconInfo(Beacon, oCurrentLocationModel);
		},

		_loadBeaconInfo: function(oBeacon, oCurrentLocationModel) {
			var that = this;
			var oInterval = new sap.ui.core.IntervalTrigger(1000);
			oInterval.addListener(function() {

				var oCurrentBeaconInfo = oBeacon.getCurrentBeacon();
				if (!_.isEmpty(oCurrentBeaconInfo)) {
					// get location from beacon
					var oCurrentLocation = that._mapBeaconLocation(oCurrentBeaconInfo);
					// set location data.
					oCurrentLocationModel.setData(oCurrentLocation);
					jQuery.sap.log.error(JSON.stringify(oCurrentBeaconInfo));
				}

				/* test code , will remove */
				else {
					oCurrentBeaconInfo = {
						majorId: "106",
						minorId: "1"
					};
					jQuery.sap.log.error(JSON.stringify(oCurrentLocationModel.getData()));
				}
				var oCurrentLocation = that._mapBeaconLocation(oCurrentBeaconInfo);
				oCurrentLocationModel.setData(oCurrentLocation);
				jQuery.sap.log.error(JSON.stringify(oCurrentLocation));

				/* end test */

				// refresh model
				oCurrentLocationModel.refresh();
			});
		},

		_mapBeaconLocation: function(oCurrentBeacon) {
			var locationsModel = new JSONModel();
			locationsModel.loadData("model/location.json", null, false);
			if (locationsModel.getData() && locationsModel.getData().length > 0) {
				var mappedLocation = _.find(locationsModel.getData(), function(oItem) {
					var bIsMatched = false;
					oItem.referenceBeacons.forEach(function(oPoint) {
						if (_.isEqual(oPoint, oCurrentBeacon)) {
							bIsMatched = true;
							return;
						}
					});
					return bIsMatched;
				});

				this._locationChangeEventDispather(mappedLocation);
				return mappedLocation;
			}
		},

		_locationChangeEventDispather: function(oCurrentLocation) {
			if (oCurrentLocation) {
				var oPreviousLocationModel = this.getModel("currentLocation");
				var oPreviousLocationData = null;
				if (oPreviousLocationModel && oPreviousLocationModel.getData()) {
					oPreviousLocationData = oPreviousLocationModel.getData();
				}
				if (!_.isEqual(oPreviousLocationData, oCurrentLocation)) {
					this.getEventBus().publish("sap.dm", "locationChange", oCurrentLocation);
				}
			}
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
