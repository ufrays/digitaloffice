sap.ui.define([], function() {
	"use strict";

	return {
		onLoadImageFail: function(message) {
			navigator.notification.alert("Error：" + message, null, "Error");
			sap.m.MessageToast.show("Error：" + message, null, "Error");
		},
		analyzePhoto: function() {
			navigator.camera.getPicture(this.onLoadImageUploadSuccess, this.onLoadImageFail, {
				destinationType: Camera.DestinationType.FILE_URI,
				allowEdit: true
			});
		},
		onLoadImageUploadSuccess: function(imageURI) {
			var that = this;
			var options = new FileUploadOptions();
			options.fileKey = "image_file";
			options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
			options.mimeType = "image/jpeg";
			var params = {
				api_key: "bEeg8tOx5CmMBgVSAf3mPJnlE7f6XzLX",
				api_secret: "HHNdb_QSTDycsH4PRyYW82Gc_UzQIV27",
				outer_id: "sap_face_demo"
			};
			options.params = params;
			var ft = new FileTransfer();
			// ft.onprogress = function(progressEvt) {
			// if (progressEvt.lengthComputable) {
			// navigator.notification.progressValue(Math.round((progressEvt.loaded / progressEvt.total) * 100));
			// }
			// }, navigator.notification.progressStart("Info", "Progress");
			ft.upload(imageURI, encodeURI('https://api-cn.faceplusplus.com/facepp/v3/search'), function(r) {
				console.log("Response = " + JSON.stringify(r));
				var data = eval("(" + r.response + ")");
				// navigator.notification.progressStop();
				$("#getImageUpload").attr("src", imageURI);
				$("#previewImage").show();
				if (data.results && data.results.length > 0) {

					var oBus = sap.ui.getCore().getComponent("dmComponent").getEventBus();
					oBus.publish("sap.dm", "faceIdentified", data.results[0].face_token);
					/*
					 * Bmob.initialize("355ab3ce5e0318f437ec5829d2df3d74", "2a522b8d5d8cbc05dd6fabe47c1e49b2"); var Face = Bmob.Object.extend("face");
					 * var query = new Bmob.Query(Face); query.equalTo("token", data.results[0].face_token); query.find({ success: function(results) {
					 * if (results.length <= 0) { sap.m.MessageToast.show("Unfortunately, we don't know who you are."); } for (var i = 0; i <
					 * results.length; i++) { var object = results[i]; var oBus = sap.ui.getCore().getComponent("dmComponent").getEventBus();
					 * oBus.publish("sap.dm", "faceIdentified", object); navigator.notification.alert("Welcome, " + object.get('name')); } }, error:
					 * function(error) { var oBus = sap.ui.getCore().getComponent("dmComponent").getEventBus(); oBus.publish("sap.dm",
					 * "faceIdentified", null); sap.m.MessageToast.show("Query form server failed."); } }); //
					 * that.queryFromServer(data.results[0].face_token);
					 */} else {
					var oBus = sap.ui.getCore().getComponent("dmComponent").getEventBus();
					oBus.publish("sap.dm", "faceIdentified", null);
					sap.m.MessageToast.show("Unfortunately, we don't find out any face.");
				}
				// navigator.notification.alert("Found："+data.results[0].face_token+", Match "+data.results[0].confidence+"%", null, "Info");
			}, null, options);
		}
	};
});
