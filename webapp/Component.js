sap.ui.define([
	'sap/ui/core/UIComponent', 'sap/m/routing/Router', 'sap/ui/model/resource/ResourceModel', 'sap/ui/model/odata/ODataModel', 'sap/ui/model/json/JSONModel', 'sap/dm/util/Beacon', "sap/dm/util/Orientation"
], function(UIComponent, Router, ResourceModel, ODataModel, JSONModel, Beacon, Orientatioin) {

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

			var oDebug = new JSONModel({
				debugInfo: "DEBUG: "
			});
			this.setModel(oDebug, "debug");
			try {
				
				Orientatioin.startWatchHeading();
				Beacon.startBeaconRegion();
				// Beacon : {majorId:xx, minorId:xx}
			} catch (e) {
				var dInfo = oDebug.getData().debugInfo;
				oDebug.getData().debugInfo = oDebug.getData().debugInfo.concat("     " + e.stack);
				oDebug.getData().debugInfo = oDebug.getData().debugInfo.concat("     " + "Beacon cannot start.");
				oDebug.refresh();
				sap.m.MessageToast.show("Beacon cannot start.");
			}

			/* will move to try block */

			var oCurrentLocationModel = new JSONModel();
			this.setModel(oCurrentLocationModel, "currentLocation");

			var oCurrentOrientationModel = new JSONModel({
				heading: 0
			});
			this.setModel(oCurrentOrientationModel, "currentOrientation");

			// runtime update the beacon and orientation info.
			this._loadDeviceInfo(Beacon, Orientatioin, oCurrentLocationModel, oCurrentOrientationModel);

		},

		_loadDeviceInfo: function(oBeacon, oOrientatioin, oCurrentLocationModel, oCurrentOrientationModel) {
			var that = this;
			var oInterval = new sap.ui.core.IntervalTrigger(5000);
			oInterval.addListener(function() {

				// set orientation.
				oCurrentOrientationModel.getData().heading = oOrientatioin.getCurrentLocationHeading();
				oCurrentOrientationModel.refresh();

				var oCurrentBeaconInfo = oBeacon.getCurrentBeacon();
				sap.m.MessageToast.show(JSON.stringify(oCurrentBeaconInfo));
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
