sap.ui.define([], function() {
	"use strict";

	var beacons = [];
	return {
		startBeaconRegion: function() {
			var uuid = 'E2C56DB5-DFFB-48D2-B060-D0F5A71096E0';
	        var identifier = 'BrightBeacon';

	        var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(identifier, uuid);

	        cordova.plugins.locationManager.requestWhenInUseAuthorization();
	        // cordova.plugins.locationManager.requestAlwaysAuthorization()

	        var delegate = new cordova.plugins.locationManager.Delegate();

	        delegate.didRangeBeaconsInRegion = function (pluginResult) {
	        	beacons = pluginResult.beacons;

	            console.log(JSON.stringify(pluginResult));
	        };

	        cordova.plugins.locationManager.setDelegate(delegate);

	        cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
	            .fail()
	            .done();
		},	

		getCurrentBeacon: function() {
			if (!beacons) {
				return;
			}

			if (beacons.length === 0) { 
				return;
			}

			// Sort beacons by distance
			// beacons[0].accuracy   major    minor   rssi   proximity   uuid
			beacons.sort(function(a, b) {
				if (a.accuracy === -1) {
					return true;
				}
				
				if (b.accuracy === -1) {
					return true;
				}

				return a.accuracy < b.accuracy;
			});

			var firstBeacon = beacons[0];

			// 过道
			if ((firstBeacon.major === 201) || (firstBeacon.major === 202)) {
				return {"majorId": firstBeacon.major, "minorId": firstBeacon.minor};
			}

			// 不在过道 计算加权房间位置
			var r805Accuracy = 0;
			var count805 = 0;
			var r822Accuracy = 0;
			var count822 = 0;
			var r801Accuracy = 0;
			var count801 = 0;
			var r807Accuracy = 0;
			var count807 = 0;
			var rWcAccuracy = 0;
			var countWc = 0;
			var rFrontAccuracy = 0;
			var countFront = 0;
			var r824Accuracy = 0;
			var count824 = 0;
			var r803Accuracy = 0;
			var count803 = 0;

			for (var i = beacons.length - 1; i >= 0; i--) {
				if (beacons[i].accuracy > 0) {
					if (beacons[i].major === 101) {
						r805Accuracy += beacons[i].accuracy;
						count805 += 1;
					} else if (beacons[i].major === 102) {
						r822Accuracy += beacons[i].accuracy;
						count822 += 1;
					} else if (beacons[i].major === 103) {
					r801Accuracy += beacons[i].accuracy;
					count801 += 1;
					} else if (beacons[i].major === 104) {
					    r807Accuracy += beacons[i].accuracy;
					    count807 += 1;
					} else if (beacons[i].major === 105) {
					    rWcAccuracy += beacons[i].accuracy;
					    countWc += 1;
					} else if (beacons[i].major === 106) {
					    rFrontAccuracy += beacons[i].accuracy;
					    countFront += 1;
					} else if (beacons[i].major === 107) {
					    r824Accuracy += beacons[i].accuracy;
					    count824 += 1;
					} else if (beacons[i].major === 108) {
					    r803Accuracy += beacons[i].accuracy;
					    count803 += 1;
					}
				}
			}

			var wRooms = [];
			if (count805 != 0) {
			    var w805Accuracy = r805Accuracy / count805;
			    if (w805Accuracy >= 0) {
			        wRooms.push({"major": "101", "minor": "1", "rssi": w805Accuracy});
			    }
			}

			if (count822 != 0) {
			    var w822Accuracy = r822Accuracy / count822;
			    if (w822Accuracy >= 0) {
			        wRooms.push({"major": "102", "minor": "1", "rssi": w822Accuracy});
			    }
			}

			if (count801 != 0) {
			    var w801Accuracy = r801Accuracy / count801;
			    if (w801Accuracy >= 0) {
			        wRooms.push({"major": "103", "minor": "1", "rssi": w801Accuracy});
			    }
			}


			if (count807 != 0) {
			    var w807Accuracy = r807Accuracy / count807;
			    if (w807Accuracy >= 0) {
			        wRooms.push({"major": "104", "minor": "1", "rssi": w807Accuracy});
			    }
			}

			if (countWc != 0) {
			    var wWcAccuracy = rWcAccuracy / countWc;
			    if (wWcAccuracy >= 0) {
			        wRooms.push({"major": "105", "minor": "1", "rssi": wWcAccuracy});
			    }
			}

			if (countFront != 0) {
			    var wFrontAccuracy = rFrontAccuracy / countFront;
			    if (wFrontAccuracy >= 0) {
			        wRooms.push({"major": "106", "minor": "1", "rssi": wFrontAccuracy});
			    }
			}
			if (count824 != 0) {
			    var w824Accuracy = r824Accuracy / count824;
			    if (w824Accuracy >= 0) {
			        wRooms.push({"major": "107", "minor": "1", "rssi": w824Accuracy});
			    }
			}

			if (count803 != 0) {
			    var w803Accuracy = r803Accuracy / count803;
			    if (w803Accuracy >= 0) {
			        wRooms.push({"major": "108", "minor": "1", "rssi": w803Accuracy});
			    }
			}

			// Sort
			wRooms.sort(function(a, b) {
				return a.rssi < b.rssi;
			});

			if (wRooms.length > 0) {
				return {"majorId": wRooms[0].major, "minorId": wRooms[0].minor};
			}
		}
	};
});