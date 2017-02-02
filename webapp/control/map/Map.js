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
				},
				isThumbnail: {
					type: "boolean",
					defaultValue: false
				}
			},

			aggregations: {
				_VBox: {
					type: "sap.m.VBox",
					visibility: "hidden",
					multiple: false
				}
			},

			events: {
				showThumbnail: {},
				showFullsize: {}
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

		_aPathData: null,
		_aThumbnailData: null,
		_sLocation: null,
		_sDestination: null,
		_sOrientation: null,
		_bIsThumbnail: null,

		init: function() {
			var oVBox = sap.ui.xmlfragment(this.getId(), "sap.dm.control.map.map");
			this.setAggregation("_VBox", oVBox);
		},

		onAfterRendering: function() {
			this._sLocation = this.getProperty("location");
			this._sDestination = this.getProperty("destination");
			this._bIsThumbnail = this.getProperty("isThumbnail");
			this._sOrientation = this.getProperty("orientation");

			if (this._bIsThumbnail) {
				this._showInThumbnail();
			} else {
				this._showInFullsize();
			}
		},

		_showInThumbnail: function() {
			var that = this;
			this._getPathData().then(function() {
				return that._getThumbnailData();
			}).then(function() {
				that._initControls();
				that._calcPath();
				that._adjustViewBox();
				that._hideFullScreenToolbar();
				that._attachShowFullsizeEvt();
				//that._adjustOrientation();
			});
		},

		_showInFullsize: function() {
			var that = this;
			this._getPathData().then(function() {
				that._initParams();
				that._initControls();
				that._prepareMap();
				that._prepareZoomInBtn();
				that._prepareZoomOutBtn();
				that._prepareResetBtn();
				that._prepareInfoPopup();
				that._hideThumbnailToolbar();
				that._attachShowThumbnailEvt();
				//that._adjustOrientation();
			});
		},

		_initParams: function() {
			this._iZoomRatio = 1;

			this._fOriginalX = 0;
			this._fOriginalY = 0;
			this._fCurrentX = 0;
			this._fCurrentY = 0;
		},

		_initControls: function() {
			this._oSvg = Snap(this._getId("svg"));
			this._oMap = this._oSvg.select(this._getId("map"));

			this._oZoomInBtn = this._oSvg.select(this._getId("zoomin"));
			this._oZoomOutBtn = this._oSvg.select(this._getId("zoomout"));
			this._oResetBtn = this._oSvg.select(this._getId("reset"));

			this._oLocIcon = this._oMap.select(this._getId("locationicon"));
			this._oDestIcon = this._oMap.select(this._getId("desticon"));

			this._oInfoPopup = this._oSvg.select(this._getId("information"));
		},

		_prepareMap: function() {
			this._enableDrag();
			this._calcPath();
		},

		_prepareZoomInBtn: function() {
			var that = this;
			this._oZoomInBtn.click(function() {
				that._iZoomRatio = that._iZoomRatio + 0.2;
				// that._oMap.transform('t' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio);
				that._oMap.animate({
					transform: 't' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio
				}, 300, mina.linear);
			});
		},

		_prepareZoomOutBtn: function() {
			var that = this;
			this._oZoomOutBtn.click(function() {
				that._iZoomRatio = that._iZoomRatio - 0.2;
				//that._oMap.transform('t' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio);
				that._oMap.animate({
					transform: 't' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio
				}, 300, mina.linear);
			});
		},

		_prepareResetBtn: function() {
			var that = this;
			this._oResetBtn.click(function() {
				that._initParams();
				//that._oMap.transform('t' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio);
				that._oMap.animate({
					transform: 't' + that._fCurrentX + ',' + that._fCurrentY + "s" + that._iZoomRatio
				}, 300, mina.linear);
				that._oInfoPopup.animate({
					opacity: 0
				}, 0, mina.easein, function() {
					this.attr({
						display: "none"
					});
				});
			});
		},

		_prepareInfoPopup: function() {
			var that = this;
			this._oInfoPopup.touchend(function() {
				this.animate({
					opacity: 0
				}, 500, mina.easein, function() {
					this.attr({
						display: "none"
					});
				});
			});

			var touchstartpoint = {
				x: null,
				y: null
			};
			var touchendpoint = {
				x: null,
				y: null
			};
			var destinationArea = this._oMap.select('.dest');
			destinationArea.touchstart(function(event) {
				touchstartpoint.x = event.changedTouches[0].clientX;
				touchstartpoint.y = event.changedTouches[0].clientY;
			});
			destinationArea.touchend(function(event) {
				touchendpoint.x = event.changedTouches[0].clientX;
				touchendpoint.y = event.changedTouches[0].clientY;
				if ((touchendpoint.x === touchstartpoint.x) && (touchendpoint.y === touchstartpoint.y)) {
					that._oInfoPopup.attr({
						display: "block"
					});
					that._oInfoPopup.animate({
						opacity: 1
					}, 500);

				}
			});
		},

		_enableDrag: function() {
			var that = this;
			var startX;
			var startY;

			this._oMap.touchstart(function(event) {
				startX = event.changedTouches[0].screenX;
				startY = event.changedTouches[0].screenY;
			});

			this._oMap.touchmove(function(event) {
				var curX = event.changedTouches[0].screenX;
				var curY = event.changedTouches[0].screenY;

				var offsetX = curX - startX;
				var offsetY = curY - startY;

				that._fCurrentX = offsetX + that._fOriginalX;
				that._fCurrentY = offsetY + that._fOriginalY;

				this.transform('t' + that._fCurrentX * 1.8 + ',' + that._fCurrentY * 1.58 + " s" + that._iZoomRatio);
			});

			this._oMap.touchend(function(event) {
				that._fOriginalX = that._fCurrentX;
				that._fOriginalY = that._fCurrentY;
			});
		},

		_calcPath: function() {
			var that = this;
			var oPath = _.find(this._aPathData, function(oPath) {
				return (oPath.location === that._sLocation) && (oPath.destination === that._sDestination);
			});

			this._oDestIcon.transform('t' + oPath.dest_coord);
			//this._oLocIcon.transform('t' + oPath.loc_coord + "r" + this._sOrientation);

			if (this._oLocIcon.attr("transform").string === "") {
				this._oLocIcon.transform('t' + oPath.loc_coord + "r" + this._sOrientation);
			} else {
				this._oLocIcon.animate({
					transform: 't' + oPath.loc_coord + "r" + this._sOrientation
				}, 500, mina.linear);
			}

			if (this._oSvg.select(".navi-path")) {
				this._oSvg.select(".navi-path").remove();
			}

			this._oNaviPath = this._oSvg.paper.polyline(oPath.path).attr({
				stroke: "orange",
				fill: "none",
				strokeWidth: 3,
				strokeDashoffset: 1200,
				strokeDasharray: "20,10,5,5,5,10"
			}).addClass("navi-path");

			this._oNaviPath.animate({
				strokeDashoffset: 0
			}, 60000, mina.linear);
			this._oSvg.select(this._getId("navigator")).append(that._oNaviPath);
		},

		_adjustOrientation: function() {
			this._sOrientation = this.getProperty("orientation");
			var sTranslate = this._oLocIcon.attr("transform").string.split("r")[0];
			this._oLocIcon.transform(sTranslate + "r" + this._sOrientation);
/*			this._oLocIcon.animate({
 transform: sTranslate + "r" + this._sOrientation
 }, 500, mina.linear);*/
		},

		_attachShowThumbnailEvt: function() {
			var that = this;
			this._oThumbnailBtn = this._oSvg.select(this._getId("thumbnail"));
			this._oThumbnailBtn.touchend(function() {
				that.fireEvent("showThumbnail");
			});
		},

		_attachShowFullsizeEvt: function() {
			var that = this;
			this._oThumbnailBtn = this._oSvg.select(this._getId("fullscreen"));
			this._oThumbnailBtn.touchend(function() {
				that.fireEvent("showFullsize");
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

		_adjustViewBox: function() {
			if (this._bIsThumbnail) {
				var that = this;
				var oThumbnail = _.find(this._aThumbnailData, function(oThumbnail) {
					return (oThumbnail.location === that._sLocation) && (oThumbnail.destination === that._sDestination);
				});
				var sViewBox = oThumbnail.x + "," + oThumbnail.y + "," + oThumbnail.width + "," + oThumbnail.height;
				this._oSvg.attr({
					viewBox: sViewBox
				});

				var oThumbToolbar = this._oSvg.select(this._getId("thumbnailtoolbar"));
				var fThumbToolbarX = parseFloat(oThumbnail.x) + parseFloat(oThumbnail.width) - 66 - 40;
				var fThumbToolbarY = parseFloat(oThumbnail.y) + 60;
				oThumbToolbar.transform("t" + fThumbToolbarX + "," + fThumbToolbarY);
			}
		},

		_hideFullScreenToolbar: function() {
			var oFullScrToolbar = this._oSvg.select(this._getId("fullscreentoolbar"));
			oFullScrToolbar.attr({
				display: "none"
			});
		},

		_hideThumbnailToolbar: function() {
			var oThumbToolbar = this._oSvg.select(this._getId("thumbnailtoolbar"));
			oThumbToolbar.attr({
				display: "none"
			});
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
