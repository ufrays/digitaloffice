/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','./BindingMode','./ChangeReason','./PropertyBinding','./CompositeType','./CompositeDataState'],function(q,B,C,P,a,b){"use strict";var c=P.extend("sap.ui.model.CompositeBinding",{constructor:function(d,r){P.apply(this,[null,""]);this.aBindings=d;this.aValues=null;this.bRawValues=r;this.bPreventUpdate=false;},metadata:{publicMethods:["getBindings","attachChange","detachChange"]}});c.prototype.getPath=function(){return null;};c.prototype.getModel=function(){return null;};c.prototype.getContext=function(){return null;};c.prototype.isResolved=function(){var r=false;q.each(this.aBindings,function(i,o){r=o.isResolved();if(!r){return false;}});return r;};c.prototype.setType=function(t,i){if(t&&!(t instanceof a)){throw new Error("Only CompositeType can be used as type for composite bindings!");}P.prototype.setType.apply(this,arguments);if(this.oType){this.bRawValues=this.oType.getUseRawValues();}};c.prototype.setContext=function(o){q.each(this.aBindings,function(i,d){if(!o||d.updateRequired(o.getModel())){d.setContext(o);}});};c.prototype.setValue=function(v){var V;if(this.bSuspended){return;}q.each(this.aBindings,function(i,o){V=v[i];if(V!==undefined){o.setValue(V);}});this.getDataState().setValue(this.getValue());};c.prototype.getValue=function(){var v=[],V;q.each(this.aBindings,function(i,o){V=o.getValue();v.push(V);});return v;};c.prototype.getOriginalValue=function(){var v=[],V;q.each(this.aBindings,function(i,o){V=o.getDataState().getOriginalValue();v.push(V);});return v;};c.prototype.setExternalValue=function(v){var V,d;if(this.fnFormatter){q.sap.log.warning("Tried to use twoway binding, but a formatter function is used");return;}var D=this.getDataState();if(this.oType){try{if(this.oType.getParseWithValues()){d=[];if(this.bRawValues){d=this.getValue();}else{q.each(this.aBindings,function(i,o){d.push(o.getExternalValue());});}}V=this.oType.parseValue(v,this.sInternalType,d);this.oType.validateValue(V);}catch(e){D.setInvalidValue(v);this.checkDataState();throw e;}}else{if(typeof v=="string"){V=v.split(" ");}else{V=[v];}}if(this.bRawValues){this.setValue(V);}else{q.each(this.aBindings,function(i,o){v=V[i];if(v!==undefined){o.setExternalValue(v);}});}D.setValue(this.getValue());D.setInvalidValue(null);};c.prototype.getExternalValue=function(){var v=[];if(this.bRawValues){v=this.getValue();}else{q.each(this.aBindings,function(i,o){v.push(o.getExternalValue());});}return this._toExternalValue(v);};c.prototype._toExternalValue=function(v){var V;if(this.fnFormatter){V=this.fnFormatter.apply(this,v);}else if(this.oType){V=this.oType.formatValue(v,this.sInternalType);}else if(v.length>1){V=v.join(" ");}else{V=v[0];}return V;};c.prototype.getBindings=function(){return this.aBindings;};c.prototype.hasValidation=function(){if(this.getType()){return true;}var d=this.getBindings();for(var i=0;i<d.length;++i){if(d[i].hasValidation()){return true;}}return false;};c.prototype.attachChange=function(f,l){var t=this;this.fChangeHandler=function(e){if(t.bSuspended){return;}var o=e.getSource();if(o.getBindingMode()==B.OneTime){o.detachChange(t.fChangeHandler);}t.checkUpdate(true);};this.attachEvent("change",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachChange(t.fChangeHandler);});}};c.prototype.detachChange=function(f,l){var t=this;this.detachEvent("change",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachChange(t.fChangeHandler);});}};c.prototype.attachDataStateChange=function(f,l){var t=this;this.fDataStateChangeHandler=function(e){var o=e.getSource();if(o.getBindingMode()==B.OneTime){o.detachDataStateChange(t.fChangeHandler);}t.checkDataState();};this.attachEvent("DataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.detachDataStateChange=function(f,l){var t=this;this.detachEvent("DataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.attachAggregatedDataStateChange=function(f,l){var t=this;if(!this.fDataStateChangeHandler){this.fDataStateChangeHandler=function(e){var o=e.getSource();if(o.getBindingMode()==B.OneTime){o.detachDataStateChange(t.fChangeHandler);}t.checkDataState();};}this.attachEvent("AggregatedDataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.attachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.detachAggregatedDataStateChange=function(f,l){var t=this;this.detachEvent("AggregatedDataStateChange",f,l);if(this.aBindings){q.each(this.aBindings,function(i,o){o.detachEvent("DataStateChange",t.fDataStateChangeHandler);});}};c.prototype.updateRequired=function(m){var u=false;q.each(this.aBindings,function(i,o){u=u||o.updateRequired(m);});return u;};c.prototype.initialize=function(){this.bPreventUpdate=true;if(this.aBindings){q.each(this.aBindings,function(i,o){o.initialize();});}this.bPreventUpdate=false;if(!this.bSuspended){this.checkUpdate(true);}return this;};c.prototype.getDataState=function(){if(!this.oDataState){this.oDataState=new b(this.aBindings.map(function(o){return o.getDataState();}));}return this.oDataState;};c.prototype.suspend=function(){this.bSuspended=true;q.each(this.aBindings,function(i,o){o.suspend();});};c.prototype.resume=function(){q.each(this.aBindings,function(i,o){o.resume();});this.bSuspended=false;this.checkUpdate(true);};c.prototype.checkUpdate=function(f){var d=false;if(this.bPreventUpdate||(this.bSuspended&&!f)){return;}var D=this.getDataState();var o=this.getOriginalValue();if(f||!q.sap.equal(o,this.aOriginalValues)){this.aOriginalValues=o;D.setOriginalValue(o);d=true;}var v=this.getValue();if(!q.sap.equal(v,this.aValues)||f){this.aValues=v;D.setValue(v);this._fireChange({reason:C.Change});d=true;}if(d){this.checkDataState();}};return c;});
