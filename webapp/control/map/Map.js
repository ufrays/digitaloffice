sap.ui.define([
	"sap/ui/core/Control", "sap/m/VBox"
], function(Control, VBox) {
	"use strict";
	return Control.extend("sap.dm.control.map.Map", {
		metadata: {
			properties: {
				location: {
					type: "string"
				},
				destination: {
					type: "string"
				},
				orientation: {
					type: "float",
					defaultValue: 0
				}
			},

			aggregations: {
				_VBox: {
					type: "sap.m.VBox",
					visibility: "hidden",
					multiple: false
				}
			}
		},

		_iZoomRatio: null,

		_fOriginalX: null,
		_fOriginalY: null,
		_fCurrentX: null,
		_fCurrentY: null,

		_oSvg: null,
		_oMap: null,
		_oZoomInBtn: null,
		_oZoomOutBtn: null,
		_oResetBtn: null,
		_oInfoPopup: null,

		_oLocIcon: null,
		_oDestIcon: null,
		_oNaviPath: null,

		_oCoffeeIcon: null,

		_aPathData: null,
		_aThumbnailData: null,
		_sLocation: null,
		_sDestination: null,
		_fOrientation: null,

		_sManualSetDestination: null,
		_fOriOffset: null,

		init: function() {
			var oVBox = sap.ui.xmlfragment(this.getId(), "sap.dm.control.map.map");
			this.setAggregation("_VBox", oVBox);

			this._initParams();
		},

		onBeforeRendering: function() {
			this._sLocation = this.getProperty("location");
			this._sDestination = this.getProperty("destination");
			var sLocationInfo = "Location: " + this._sLocation + " \nDestination: " + this._sDestination;
			sap.m.MessageToast.show(sLocationInfo, {
				duration: 2000,
				width: "15em",
				my: "center top",
				at: "center top",
				of: window,
				offset: "0, 100"
			});
		},

		onAfterRendering: function() {
			sap.m.MessageToast.show("onAfterRendering", {
				duration: 2000,
				width: "15em",
				my: "center top",
				at: "center top",
				of: window,
				offset: "0, 200"
			});
			this._fOrientation = this.getProperty("orientation") - this._fOriOffset;

			if (this._oSvg) {
				this._calcPath();
			} else {
				this._showInFullsize();
			}

		},

		_showInFullsize: function() {
			var that = this;
			that._initControls();

			this._getPathData().then(function() {
				return that._getThumbnailData();
			}).then(function() {
				that._prepareMap();
				that._prepareZoomInBtn();
				that._prepareZoomOutBtn();
				that._prepareResetBtn();
				that._attachCoffeeIconEvt();
				that._attachInfoPopupEvt();
				that._prepareSetDestIcon();
			});
		},

		_initParams: function() {
			this._iZoomRatio = 1;

			this._fOriginalX = 0;
			this._fOriginalY = 0;
			this._fCurrentX = 0;
			this._fCurrentY = 0;
			this._fOriOffset = 227;
		},

		_initControls: function() {
			this._oSvg = Snap(this._getId("svg"));
			this._oMap = this._oSvg.select(this._getId("map"));

			this._oZoomInBtn = this._oSvg.select(this._getId("zoomin"));
			this._oZoomOutBtn = this._oSvg.select(this._getId("zoomout"));
			this._oResetBtn = this._oSvg.select(this._getId("reset"));

			this._oLocIcon = this._oMap.select(this._getId("locationicon"));
			this._oDestIcon = this._oMap.select(this._getId("desticon"));

			this._oCoffeeIcon = this._oSvg.select(this._getId("coffeeicon"));
			this._oInfoPopup = this._oSvg.select(this._getId("information"));
		},

		_prepareMap: function() {
			this._enableDrag();
			this._calcPath();
		},

		_prepareZoomInBtn: function() {
			var that = this;
			this._oZoomInBtn.touchend(function() {
				that._iZoomRatio = that._iZoomRatio * 1.2;
				that._oMap.animate({
					transform: 't' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio
				}, 200, mina.linear);
			});
		},

		_prepareZoomOutBtn: function() {
			var that = this;
			this._oZoomOutBtn.touchend(function() {
				that._iZoomRatio = that._iZoomRatio * 0.8;
				that._oMap.animate({
					transform: 't' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio
				}, 200, mina.linear);
			});
		},

		_prepareResetBtn: function() {
			var that = this;
			this._oResetBtn.touchend(function() {
				that._resetMap();
			});
		},
		
		_prepareSetDestIcon: function(){
			var that = this;
			var oSetdestIcon = this._oMap.select(that._getId("setdest"));
			oSetdestIcon.touchend(function() {
				that._sManualSetDestination = "male";
				that._calcPath();
				that._hideSetDestIcon();
			});
		},

		_resetMap: function() {
			this._initParams();

			this._oMap.animate({
				transform: 't' + this._fCurrentX + ',' + this._fCurrentY + "s" + this._iZoomRatio
			}, 200, mina.linear);

			this._hideInfoPopup();

			this._sManualSetDestination = null;
			this._calcPath();
			this._showSetDestIcon();
		},

		_enableDrag: function() {
			var that = this;
			var startX;
			var startY;

			var startX1;
			var startY1;
			var startX2;
			var startY2;
			var startDistance;

			var iZoomRatio = this._iZoomRatio;
			;

			this._oMap.touchstart(function(event) {
				iZoomRatio = that._iZoomRatio;
				if (event.changedTouches.length === 1) {
					startX = event.changedTouches[0].screenX;
					startY = event.changedTouches[0].screenY;
				} else {
					startX1 = event.changedTouches[0].clientX;
					startY1 = event.changedTouches[0].clientY;

					startX2 = event.changedTouches[1].clientX;
					startY2 = event.changedTouches[1].clientY;

					// startX2 = 161;
					// startY2 = 356;
					startDistance = Math.sqrt(Math.pow(startX2 * 1.8 - startX1 * 1.8, 2) + Math.pow(startY2 * 1.58 - startY1 * 1.58, 2));
				}
			});

			this._oMap.touchmove(function(event) {
				if (event.changedTouches.length === 1) {
					var curX = event.changedTouches[0].screenX;
					var curY = event.changedTouches[0].screenY;

					var offsetX = curX - startX;
					var offsetY = curY - startY;

					that._fCurrentX = offsetX + that._fOriginalX;
					that._fCurrentY = offsetY + that._fOriginalY;
				} else {
					var curX1 = event.changedTouches[0].clientX;
					var curY1 = event.changedTouches[0].clientY;

					// console.log("curX1="+curX1);
					// console.log("curY1="+curY1);

					var curX2 = event.changedTouches[1].clientX;
					var curY2 = event.changedTouches[1].clientY;
					// var curX2 = 161;
					// var curY2 = 356;

					var curDistance = Math.sqrt(Math.pow(curX2 * 1.58 - curX1 * 1.8, 2) + Math.pow(curY2 * 1.58 - curY1 * 1.58, 2));
					iZoomRatio = that._iZoomRatio * (curDistance / startDistance);

					/*
					 * startX1 = curX1; startY1 = curY1; startX2 = curX2; startY2 = curY2; startDistance = Math.sqrt(Math.pow(startX2 - startX1, 2) +
					 * Math.pow(startY2 - startY1, 2));
					 */
				}

				this.transform('t' + that._fCurrentX * 1.8 + ',' + that._fCurrentY * 1.58 + " s" + iZoomRatio);

			});

			this._oMap.touchend(function(event) {
				that._fOriginalX = that._fCurrentX;
				that._fOriginalY = that._fCurrentY;

				that._iZoomRatio = iZoomRatio;
			});
		},

		_calcPath: function() {
			sap.m.MessageToast.show("Calc path begin", {
				duration: 2000,
				width: "15em",
				my: "center top",
				at: "center top",
				of: window,
				offset: "0, 280"
			});
			var that = this;
			var oPath;

			if (this._sManualSetDestination) {
				oPath = _.find(this._aPathData, function(oPath) {
					return (oPath.location === that._sLocation) && (oPath.destination === that._sManualSetDestination);
				});
			} else {
				oPath = _.find(this._aPathData, function(oPath) {
					return (oPath.location === that._sLocation) && (oPath.destination === that._sDestination);
				});
			}

			this._oDestIcon.transform('t' + oPath.dest_coord);

			if (this._oLocIcon.attr("transform").string === "") {
				this._oLocIcon.transform('t' + oPath.loc_coord + "r" + this._fOrientation);
			} else {
				this._oLocIcon.animate({
					transform: 't' + oPath.loc_coord + "r" + this._fOrientation
				}, 200, mina.linear);
			}

			if (this._oSvg.select(".navi-path")) {
				this._oSvg.select(".navi-path").remove();
			}

			this._oNaviPath = this._oSvg.paper.polyline(oPath.path).attr({
				stroke: "orange",
				fill: "none",
				strokeWidth: 3,
				strokeDashoffset: 555.5,
				strokeDasharray: "20,10,5,5,5,10"
			// strokeDasharray: "20,10,20,10"
			}).addClass("navi-path");

			this._oNaviPath.animate({
				strokeDashoffset: 550
			}, 100, mina.linear, function() {
				that._animatePath();
			});

			this._oSvg.select(this._getId("navigator")).append(that._oNaviPath);

			if (this._sLocation === "pantry") {
				this._showCoffeeIcon();
			} else {
				var oCoffeeInfo = this._oSvg.select(this._getId("coffeeinfo"));
				oCoffeeInfo.attr("display", "none");
			}

			this._highlightDestination();
			sap.m.MessageToast.show("Calc path end", {
				duration: 2000,
				width: "15em",
				my: "center top",
				at: "center top",
				of: window,
				offset: "0, 360"
			});
		},

		_animatePath: function() {
			var that = this
			this._oNaviPath.animate({
				strokeDashoffset: 0
			}, 10000, mina.linear, function() {
				that._oNaviPath.attr({
					strokeDashoffset: 550
				});
				that._animatePath();
			});
		},

		_showCoffeeIcon: function() {
			this._oSvg.select(this._getId("coffeeinfo")).attr("display", "block");
			this._animateCoffeeIcon();
		},

		_animateCoffeeIcon: function() {
			var that = this;
			this._oCoffeeIcon.animate({
				transform: "s1.2,1.2",
				opacity: 1
			}, 500, mina.linear, function() {
				that._oCoffeeIcon.animate({
					transform: "s0.8,0.8",
					opacity: 0.2
				}, 500, mina.linear, function() {
					that._animateCoffeeIcon();
				});

			});
		},

		_attachCoffeeIconEvt: function() {
			var that = this;
			this._oSvg.select(this._getId("coffeeinfo")).touchend(function() {
				if (that._oInfoPopup.attr("display") === "none") {
					that._showInfoPopup();
				} else {
					that._hideInfoPopup();
				}

			});
		},

		_attachInfoPopupEvt: function() {
			var that = this;
			this._oInfoPopup.touchend(function() {
				that._hideInfoPopup();
			});
		},

		_getPathData: function() {
			var that = this;
			return $.getJSON("control/map/model/path.json", function(aPath) {
				that._aPathData = aPath;
			});
		},

		_getThumbnailData: function() {
			var that = this;
			return $.getJSON("control/map/model/thumbnail.json", function(aThumbnail) {
				that._aThumbnailData = aThumbnail;
			});
		},

		_showResetBtn: function() {
			this._oResetBtn.attr("display", "block");
			this._oResetBtn.attr("transform", "t20,40");
			this._oResetBtn.animate({
				transform: "t20,140"
			}, 200, mina.linear);
		},

		_showZoomInBtn: function() {
			this._oZoomInBtn.attr("display", "block");
			this._oZoomInBtn.attr("transform", "t20,40");
			this._oZoomInBtn.animate({
				transform: "t20,240"
			}, 200, mina.linear);
		},

		_showZoomOutBtn: function() {
			this._oZoomOutBtn.attr("display", "block");
			this._oZoomOutBtn.attr("transform", "t20,40");
			this._oZoomOutBtn.animate({
				transform: "t20,309"
			}, 200, mina.linear);
		},

		_hideResetBtn: function() {
			var that = this;
			this._oResetBtn.animate({
				transform: "t20,40"
			}, 200, mina.linear, function() {
				that._oResetBtn.attr("display", "none");
			});
		},

		_hideZoomInBtn: function() {
			var that = this;
			this._oZoomInBtn.animate({
				transform: "t20,40"
			}, 200, mina.linear, function() {
				that._oZoomInBtn.attr("display", "none");
			});
		},

		_hideZoomOutBtn: function() {
			var that = this;
			this._oZoomOutBtn.animate({
				transform: "t20,40"
			}, 200, mina.linear, function() {
				that._oZoomOutBtn.attr("display", "none");
			});
		},

		_highlightDestination: function() {
			this._oSvg.selectAll(".dest").forEach(function(oDest) {
				oDest.removeClass("dest");
			});

			this._oSvg.selectAll(".dest-text").forEach(function(oDest) {
				oDest.removeClass("dest-text");
			});

			var sDestinationId;
			if (this._sManualSetDestination) {
				sDestinationId = this._getId(this._sManualSetDestination);
			} else {
				sDestinationId = this._getId(this._sDestination);
			}

			if (sDestinationId != this._getId("male")) {
				var oDestination = this._oSvg.select(sDestinationId);
				oDestination.select("polygon").addClass("dest");
				oDestination.selectAll("text").forEach(function(oText) {
					oText.addClass("dest-text")
				});
			}
		},

		_hideInfoPopup: function() {
			/*
			 * this._oInfoPopup.animate({ opacity: 0 }, 200, mina.easein, function() { this.attr({ display: "none" }); });
			 */

			this._oInfoPopup.attr({
				display: "none"
			});
		},

		_showInfoPopup: function() {
			this._oInfoPopup.attr({
				display: "block"
			});
			/*
			 * this._oInfoPopup.animate({ opacity: 1 }, 200);
			 */
		},

		_showSetDestIcon: function() {
			this._oSvg.select(this._getId("setdest")).attr("display", "block");
		},

		_hideSetDestIcon: function() {
			this._oSvg.select(this._getId("setdest")).attr("display", "none");
		},

		_getId: function(sId) {
			return ("#" + this.getId() + "--" + sId);
		},

		renderer: function(oRm, oControl) {
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.addClass("map-container");
			oRm.writeClasses();
			oRm.write(">");
			oRm.renderControl(oControl.getAggregation("_VBox"));
			oRm.write("</div>");
		}
	});
});
