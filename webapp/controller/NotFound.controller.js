sap.ui.controller("sap.dm.controller.NotFound", {

	onInit: function() {
		this._router = sap.ui.core.UIComponent.getRouterFor(this);
		this._router.getTargets().getTarget("notFound").attachDisplay(this._handleDisplay, this);
	},

	_msg: "<div class='titlesNotFound'>resource not found</div>",

	_handleDisplay: function(oEvent) {
		var oData = oEvent.getParameter("data");
		var html = this._msg.replace("{0}", oData.hash);
		this.getView().byId("msgHtml").setContent(html);
	},

	handleNavBack: function() {
		this.getOwnerComponent().myNavBack();
	}
});
