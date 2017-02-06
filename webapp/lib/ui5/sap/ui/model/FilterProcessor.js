/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global'],function(q){"use strict";var F={};F.apply=function(d,f,g){if(!f||f.length==0){return d.slice();}var t=this,o={},a,b=[],G=false,c=true;q.each(f,function(j,e){if(e.sPath!==undefined){a=o[e.sPath];if(!a){a=o[e.sPath]=[];}}else{a=o["__multiFilter"];if(!a){a=o["__multiFilter"]=[];}}a.push(e);});q.each(d,function(i,r){c=true;q.each(o,function(p,a){if(p!=="__multiFilter"){var v=g(r,p);v=t.normalizeFilterValue(v);G=false;q.each(a,function(j,e){var T=t.getFilterFunction(e);if(v!==undefined&&T(v)){G=true;return false;}});}else{G=false;q.each(a,function(j,e){G=t._resolveMultiFilter(e,r,g);if(G){return false;}});}if(!G){c=false;return false;}});if(c){b.push(r);}});return b;};F.normalizeFilterValue=function(v){if(typeof v=="string"){if(String.prototype.normalize){v=v.normalize("NFC");}return v.toUpperCase();}if(v instanceof Date){return v.getTime();}return v;};F._resolveMultiFilter=function(m,r,g){var t=this,M=!!m.bAnd,f=m.aFilters;if(f){q.each(f,function(i,o){var l=false;if(o._bMultiFilter){l=t._resolveMultiFilter(o,r,g);}else if(o.sPath!==undefined){var v=g(r,o.sPath);v=t.normalizeFilterValue(v);var T=t.getFilterFunction(o);if(v!==undefined&&T(v)){l=true;}}if(l!==M){M=l;return false;}});}return M;};F.getFilterFunction=function(f){if(f.fnTest){return f.fnTest;}var v=this.normalizeFilterValue(f.oValue1),V=this.normalizeFilterValue(f.oValue2);switch(f.sOperator){case"EQ":f.fnTest=function(a){return a==v;};break;case"NE":f.fnTest=function(a){return a!=v;};break;case"LT":f.fnTest=function(a){return a<v;};break;case"LE":f.fnTest=function(a){return a<=v;};break;case"GT":f.fnTest=function(a){return a>v;};break;case"GE":f.fnTest=function(a){return a>=v;};break;case"BT":f.fnTest=function(a){return(a>=v)&&(a<=V);};break;case"Contains":f.fnTest=function(a){if(a==null){return false;}if(typeof a!="string"){throw new Error("Only \"String\" values are supported for the FilterOperator: \"Contains\".");}return a.indexOf(v)!=-1;};break;case"StartsWith":f.fnTest=function(a){if(a==null){return false;}if(typeof a!="string"){throw new Error("Only \"String\" values are supported for the FilterOperator: \"StartsWith\".");}return a.indexOf(v)==0;};break;case"EndsWith":f.fnTest=function(a){if(a==null){return false;}if(typeof a!="string"){throw new Error("Only \"String\" values are supported for the FilterOperator: \"EndsWith\".");}var p=a.lastIndexOf(v);if(p==-1){return false;}return p==a.length-new String(f.oValue1).length;};break;default:f.fnTest=function(a){return true;};}return f.fnTest;};return F;});
