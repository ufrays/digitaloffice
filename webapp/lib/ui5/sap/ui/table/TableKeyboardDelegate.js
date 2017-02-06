/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/base/Object','./library','./Row','./TableExtension','./TableUtils'],function(q,B,l,R,T,a){"use strict";var S=l.SelectionBehavior;var b=B.extend("sap.ui.table.TableKeyboardDelegate",{constructor:function(t){B.call(this);if(t===T.TABLETYPES.ANALYTICAL){this.onsapselect=function(e){if(q(e.target).hasClass("sapUiAnalyticalTableSum")){e.preventDefault();return;}else{if(b.prototype.onsapselect){b.prototype.onsapselect.apply(this,arguments);}}};}else if(t===T.TABLETYPES.TREE){this.onkeydown=function(e){b.prototype.onkeydown.apply(this,arguments);var $=q(e.target),c=$.closest('td');if(e.keyCode==q.sap.KeyCodes.TAB&&this._getKeyboardExtension().isInActionMode()&&c.find('.sapUiTableTreeIcon').length>0){if($.hasClass('sapUiTableTreeIcon')){if(!$.hasClass("sapUiTableTreeIconLeaf")){c.find(':sapFocusable:not(.sapUiTableTreeIcon)').first().focus();}}else{c.find('.sapUiTableTreeIcon:not(.sapUiTableTreeIconLeaf)').focus();}e.preventDefault();}};}},destroy:function(){B.prototype.destroy.apply(this,arguments);},getInterface:function(){return this;}});b._restoreFocusOnLastFocusedDataCell=function(t,e){var i=a.getFocusedItemInfo(t);var L=t._getKeyboardExtension()._getLastFocusedCellInfo();a.focusItem(t,i.cellInRow+(i.columnCount*L.row),e);};b._getFocusedRowIndex=function(t){var i=a.getFocusedItemInfo(t);var f=i.cell;var c=i.columnCount;var s=i.cellInRow;var d=t.getFirstVisibleRow()+(f-s)/c;if(!t.getColumnHeaderVisible()){d++;}return d-1;};b._isFocusedRowSelected=function(t){var s=b._getFocusedRowIndex(t);var i=t.isIndexSelected(s);var I=a.getFocusedItemInfo(t).columnCount==0;if(I){return i;}else{if(a.hasRowHeader(t)){return null;}else{return i;}}};b._moveColumn=function(c,n){var t=c.getParent(),v=t._getVisibleColumns(),i=v.indexOf(c),d;if(n&&i<v.length-1){d=t.indexOfColumn(v[i+1]);}else if(!n&&i>0){d=t.indexOfColumn(v[i-1]);}if(d!=undefined){t.removeColumn(c);t.insertColumn(c,d);}};b.prototype.enterActionMode=function(A){var f=A.$Dom;var e=false;if(f.length>0){var t=f.filter(":sapTabbable");var E=this._getKeyboardExtension();if(t.length>0){e=true;var i=this._getItemNavigation();E._suspendItemNavigation();q(i.getFocusedDomRef()).attr("tabindex","-1");t.eq(0).focus();}if(E._getTableType()===T.TABLETYPES.TREE){var $=f.eq(0);if($.hasClass("sapUiTableTreeIcon")&&!$.hasClass("sapUiTableTreeIconLeaf")){e=true;$.attr("tabindex",0).focus();}}}return e;};b.prototype.leaveActionMode=function(A){var e=A.event;var E=this._getKeyboardExtension();var i=this._getItemNavigation();E._resumeItemNavigation();q(i.getFocusedDomRef()).attr("tabindex","0");if(e){if(q(e.target).closest("td[tabindex='-1']").length>0){var I=q(i.aItemDomRefs).index(q(e.target).closest("td[tabindex='-1']").get(0));a.focusItem(this,I,null);}else{if(q.sap.containsOrEquals(this.$().find(".sapUiTableCCnt").get(0),e.target)){a.focusItem(this,i.getFocusedIndex(),null);}}}else{a.focusItem(this,i.getFocusedIndex(),null);}if(E._getTableType()===T.TABLETYPES.TREE){this.$().find(".sapUiTableTreeIcon").attr("tabindex",-1);}};b.prototype.onmouseup=function(e){if(e.isMarked()){return;}var d=this.$().find(".sapUiTableCtrl td :focus");this._getKeyboardExtension().setActionMode(d.length>0,{$Dom:d,event:e});};b.prototype.onfocusin=function(e){if(e.isMarked("sapUiTableIgnoreFocusIn")){return;}var $=q(e.target);if($.hasClass("sapUiTableOuterBefore")||$.hasClass("sapUiTableOuterAfter")||(e.target!=this.getDomRef("overlay")&&this.getShowOverlay())){this._getKeyboardExtension().setActionMode(false);this.$("overlay").focus();return;}else if($.hasClass("sapUiTableCtrlBefore")){this._getKeyboardExtension().setActionMode(false);var n=a.isNoDataVisible(this);if(!n||(n&&e.isMarked("sapUiTableInitItemNavigation")&&this.getColumnHeaderVisible())){var i=a.getFocusedItemInfo(this);a.focusItem(this,i.cellInRow,e);}else if(n){this._getKeyboardExtension()._setSilentFocus(this.$("noDataCnt"));}if(!n){e.preventDefault();}}else if($.hasClass("sapUiTableCtrlAfter")){this._getKeyboardExtension().setActionMode(false);b._restoreFocusOnLastFocusedDataCell(this,e);}};b.prototype.onkeyup=function(e){if(!this._bEventSapSelect===true){return;}this._bEventSapSelect=false;if(e.keyCode!==q.sap.KeyCodes.ENTER&&e.keyCode!==q.sap.KeyCodes.SPACE&&e.keyCode!==q.sap.KeyCodes.F4||e.srcControl!==this&&q.inArray(e.srcControl,this.getRows())===-1&&q.inArray(e.srcControl,this.getColumns())===-1){return;}if(a.toggleGroupHeader(this,e.target)){e.preventDefault();return;}this._bShowMenu=true;this._onSelect(e);this._bShowMenu=false;e.preventDefault();};b.prototype.onsapselect=function(){this._bEventSapSelect=true;};b.prototype.onsapselectmodifiers=function(){this._bEventSapSelect=true;};b.prototype.onsapspace=function(e){var $=q(e.target);if((a.isRowSelectionAllowed(this)&&e.srcControl instanceof R)||$.hasClass("sapUiTableRowHdr")||$.hasClass("sapUiTableColRowHdr")||$.hasClass("sapUiTableCol")){e.preventDefault();}};b.prototype.onkeydown=function(e){var $=this.$();var A=this._getKeyboardExtension().isInActionMode();if(!A&&e.keyCode==q.sap.KeyCodes.F2||e.keyCode==q.sap.KeyCodes.ENTER){if($.find(".sapUiTableCtrl td:focus").length>0){this._getKeyboardExtension().setActionMode(true,{$Dom:$.find(".sapUiTableCtrl td:focus").find(":sapFocusable")});e.preventDefault();e.stopPropagation();}}else if(A&&e.keyCode==q.sap.KeyCodes.F2){this._getKeyboardExtension().setActionMode(false);}else if(e.keyCode==q.sap.KeyCodes.TAB&&A){if(this.getFixedColumnCount()>0){var c=q(e.target);if(c.is("td.sapUiTableTd")==false){c=c.parents("td.sapUiTableTd");}var d=c.parent("tr[data-sap-ui-rowindex]");var f=d.closest(".sapUiTableCtrl");var r=parseInt(d.attr("data-sap-ui-rowindex"),10);var g=d.find("td.sapUiTableTd");var C=g.index(c);var t=g.length;if(C===(t-1)){var h;if(f.hasClass("sapUiTableCtrlFixed")){h=$.find(".sapUiTableCtrl.sapUiTableCtrlScroll");}else{h=$.find(".sapUiTableCtrl.sapUiTableCtrlFixed");r++;if(r==this.getVisibleRowCount()){r=0;}}var i=h.find("tr[data-sap-ui-rowindex='"+r+"']");var j=i.find("td :sapFocusable[tabindex='0']").first();if(j.length>0){j.focus();e.preventDefault();}}}}else if(e.keyCode==q.sap.KeyCodes.A&&(e.metaKey||e.ctrlKey)){var I=a.getFocusedItemInfo(this);this._toggleSelectAll();a.focusItem(this,I.cell,e);e.preventDefault();e.stopImmediatePropagation(true);}else if(e.keyCode===q.sap.KeyCodes.F10&&(e.shiftKey)){this.oncontextmenu(e);}else if(e.keyCode===q.sap.KeyCodes.NUMPAD_PLUS){a.toggleGroupHeader(this,e.target,true);}else if(e.keyCode===q.sap.KeyCodes.NUMPAD_MINUS){a.toggleGroupHeader(this,e.target,false);}};b.prototype.onsapescape=function(e){this._getKeyboardExtension().setActionMode(false,{event:e});};b.prototype.onsaptabprevious=function(e){var $=this.$();if(this._getKeyboardExtension().isInActionMode()){var t=q(e.target);var c=t.hasClass("sapUiTableTreeIcon");var C=t.parent().find(".sapUiTableTreeIcon").length===1;var p=t.prev().hasClass("sapUiTableTreeIconLeaf");if(!C||p||c){this._getKeyboardExtension().setActionMode(false);e.preventDefault();}}else{if(e.target===this.getDomRef("overlay")){this._getKeyboardExtension()._setSilentFocus($.find(".sapUiTableOuterBefore"));return;}var i=a.getFocusedItemInfo(this);var n=a.isNoDataVisible(this);var s=$.find('.sapUiTableCCnt')[0];var f=q.contains(s,e.target);if(f&&this.getColumnHeaderVisible()){a.focusItem(this,i.cellInRow,e);e.preventDefault();}else if(i.domRef===e.target&&q.sap.containsOrEquals(s,e.target)||(!this.getColumnHeaderVisible()&&n&&f)){this._getKeyboardExtension()._setSilentFocus($.find(".sapUiTableCtrlBefore"));}}};b.prototype.onsaptabnext=function(e){var $=this.$();if(this._getKeyboardExtension().isInActionMode()){var t=q(e.target);var c=t.hasClass("sapUiTableTreeIcon");var C=t.parent().find(":visible").length>1;if(!c||!C){this._getKeyboardExtension().setActionMode(false);e.preventDefault();}}else{if(e.target===this.getDomRef("overlay")){this._getKeyboardExtension()._setSilentFocus($.find(".sapUiTableOuterAfter"));return;}var i=a.getFocusedItemInfo(this);var d=q.contains($.find('.sapUiTableColHdrCnt')[0],e.target);var n=a.isNoDataVisible(this);if(d&&!n){b._restoreFocusOnLastFocusedDataCell(this,e);e.preventDefault();}else if(i.domRef===e.target||(n&&d)){this._getKeyboardExtension()._setSilentFocus($.find(".sapUiTableCtrlAfter"));}}};b.prototype.onsapdown=function(e){if(!this._getKeyboardExtension().isInActionMode()&&a.isLastScrollableRow(this,e.target)){if(this.getFirstVisibleRow()!=this._getRowCount()-this.getVisibleRowCount()){e.stopImmediatePropagation(true);a.scroll(this,true,false);}}e.preventDefault();if(a.isNoDataVisible(this)){var i=a.getCellInfo(e.target);if(i&&(i.type===a.CELLTYPES.COLUMNHEADER||i.type===a.CELLTYPES.COLUMNROWHEADER)){i=a.getFocusedItemInfo(this);if(i.row-a.getHeaderRowCount(this)<=1){e.setMarked("sapUiTableSkipItemNavigation");}}}};b.prototype.onsapdownmodifiers=function(e){if(e.shiftKey){if(this.getSelectionMode()===l.SelectionMode.Single||this.getSelectionMode()===l.SelectionMode.None){e.setMarked("sapUiTableSkipItemNavigation");e.preventDefault();}else{var f=b._getFocusedRowIndex(this);var i=b._isFocusedRowSelected(this);if(i===true){this.addSelectionInterval(f+1,f+1);}else if(i===false){this.removeSelectionInterval(f+1,f+1);}if(a.isLastScrollableRow(this,e.target)){a.scroll(this,true,false);}}}else if(e.altKey){if(a.toggleGroupHeader(this,e.target)){e.preventDefault();e.setMarked("sapUiTableSkipItemNavigation");}}};b.prototype.onsapupmodifiers=function(e){if(e.shiftKey){if(this.getSelectionMode()===l.SelectionMode.Single||this.getSelectionMode()===l.SelectionMode.None){e.setMarked("sapUiTableSkipItemNavigation");e.preventDefault();}else{var f=b._getFocusedRowIndex(this);var i=b._isFocusedRowSelected(this);if(i===true){this.addSelectionInterval(f-1,f-1);}else if(i===false){this.removeSelectionInterval(f-1,f-1);}if(a.isFirstScrollableRow(this,e.target)){if(this.getFirstVisibleRow()!=0){e.stopImmediatePropagation(true);}a.scroll(this,false,false);}}}else if(e.altKey){if(a.toggleGroupHeader(this,e.target)){e.preventDefault();e.setMarked("sapUiTableSkipItemNavigation");}}};b.prototype.onsapup=function(e){if(!this._getKeyboardExtension().isInActionMode()&&a.isFirstScrollableRow(this,e.target)){if(this.getFirstVisibleRow()!=0){e.stopImmediatePropagation(true);}a.scroll(this,false,false);}e.preventDefault();};b.prototype.onsappagedown=function(e){if(!this._getKeyboardExtension().isInActionMode()){var $=this.$();var i=a.getFocusedItemInfo(this);var r=(this.getSelectionBehavior()!==S.RowOnly);var h=$.find(".sapUiTableColHdrScr>.sapUiTableColHdr").length;if(this.getColumnHeaderVisible()&&i.cell<(i.columnCount*h)){var c=i.cellInRow;if((i.cell<=(i.columnCount*h)&&i.cell>=(i.columnCount*h)-i.columnCount)||(c===0&&r)){this.setFirstVisibleRow(0);a.focusItem(this,i.columnCount*h+c,e);}else{a.focusItem(this,i.columnCount*h-i.columnCount+c,e);}e.stopImmediatePropagation(true);}else{if(a.isLastScrollableRow(this,e.target)){a.scroll(this,true,true);}var f=this.getFixedBottomRowCount();if(this.getFirstVisibleRow()===this._getRowCount()-this.getVisibleRowCount()){f=0;}var d=(i.cellCount/i.columnCount)-f;var c=i.cell%i.columnCount;var I=(d-1)*i.columnCount+c;a.focusItem(this,I,e);e.stopImmediatePropagation(true);}e.preventDefault();}};b.prototype.onsappagedownmodifiers=function(e){if(!this._getKeyboardExtension().isInActionMode()&&e.altKey){var i=a.getFocusedItemInfo(this);var r=(this.getSelectionBehavior()!==S.RowOnly);var c=i.columnCount;var n;if(c==0&&r){n=1;}else{var m=this._getVisibleColumns().length;if(!r){m--;}n=m;}a.focusItem(this,i.cell-(c-n),e);e.stopImmediatePropagation(true);e.preventDefault();}};b.prototype.onsappageup=function(e){if(!this._getKeyboardExtension().isInActionMode()){var $=this.$();var i=a.getFocusedItemInfo(this);var r=(this.getSelectionBehavior()!==S.RowOnly);var h=$.find(".sapUiTableColHdrScr>.sapUiTableColHdr").length;var c=i.cellInRow;if(this.getColumnHeaderVisible()&&i.cell<(i.columnCount*h)){if(i.cell>i.columnCount){a.focusItem(this,c,e);}e.stopImmediatePropagation(true);}else{if(this.getColumnHeaderVisible()&&this.getFirstVisibleRow()==0&&a.isFirstScrollableRow(this,e.target)){if(r&&c===0){a.focusItem(this,c,e);}else{a.focusItem(this,i.columnCount*h-i.columnCount+c,e);}e.stopImmediatePropagation(true);}else{var I=this.getColumnHeaderVisible()?i.columnCount*h:0;a.focusItem(this,I+c,e);e.stopImmediatePropagation(true);if(a.isFirstScrollableRow(this,e.target)){a.scroll(this,false,true);}}}e.preventDefault();}};b.prototype.onsappageupmodifiers=function(e){if(!this._getKeyboardExtension().isInActionMode()&&e.altKey){var i=a.getFocusedItemInfo(this);var r=(this.getSelectionBehavior()!==S.RowOnly);var c=i.columnCount;if(c>0){var n;if(c==1&&r){n=0;}else{if(r){n=1;}else{n=0;}}a.focusItem(this,i.cell-(c-n),e);}e.stopImmediatePropagation(true);e.preventDefault();}};b.prototype.onsaphome=function(e){var i=(this.getSelectionBehavior()==S.RowOnly);var I=q(e.target).parents(".sapUiTableGroupHeader").length>0;if(I){e.stopImmediatePropagation(true);return;}var o=a.getFocusedItemInfo(this);var f=o.cell;var s=o.cellInRow;var c=0;if(!i){c=1;}if(s>this.getFixedColumnCount()+c){e.stopImmediatePropagation(true);a.focusItem(this,f-s+this.getFixedColumnCount()+c,null);}else if(!i){if(s>1){e.stopImmediatePropagation(true);a.focusItem(this,f-s+1,null);}else if(s==1){e.stopImmediatePropagation(true);a.focusItem(this,f-1,null);}else{e.stopImmediatePropagation(true);}}};b.prototype.onsapend=function(e){var i=q(e.target).parents(".sapUiTableGroupHeader").length>0;if(i){e.stopImmediatePropagation(true);return;}var I=a.getFocusedItemInfo(this);var f=I.cell;var s=I.cellInRow;var c=(this.getSelectionBehavior()!==S.RowOnly);var o=0;if(!c){o=1;}if(s===0&&c){e.stopImmediatePropagation(true);a.focusItem(this,f+1,null);}else if(s<this.getFixedColumnCount()-o){e.stopImmediatePropagation(true);a.focusItem(this,f-s+this.getFixedColumnCount()-o,null);}};b.prototype.onsaphomemodifiers=function(e){if(e.metaKey||e.ctrlKey){var $=this.$();var t=$.find(".sapUiTableColHdrCnt")[0];var i=q.contains(t,e.target);if(i){e.stopImmediatePropagation(true);return;}var I=a.getFocusedItemInfo(this);var f=I.cell;var s=I.cellInRow;var c=I.columnCount;var d=Math.ceil(f/c)-1;if(this.getColumnHeaderVisible()){if(d==1){e.stopImmediatePropagation(true);a.focusItem(this,s,e);}else if(d>1){e.stopImmediatePropagation(true);this.setFirstVisibleRow(0);var g=s+c;a.focusItem(this,g,e);}}else{e.stopImmediatePropagation(true);this.setFirstVisibleRow(0);var g=f-d*c;a.focusItem(this,g,e);}}};b.prototype.onsapendmodifiers=function(e){if(e.metaKey||e.ctrlKey){var $=this.$();var t=$.find(".sapUiTableColHdrCnt")[0];var i=q.contains(t,e.target);var I=a.getFocusedItemInfo(this);var f=I.cell;var c=I.columnCount;var s=I.cellInRow;e.stopImmediatePropagation(true);if(i){a.focusItem(this,f+c,e);}else{this.setFirstVisibleRow(this._getRowCount()-this.getVisibleRowCount());var d=I.cellCount-(c-s);a.focusItem(this,d,e);}}};b.prototype.onsapleftmodifiers=function(e){var t=q(e.target);if(t.hasClass('sapUiTableCol')){var c=parseInt(t.attr('data-sap-ui-colindex'),10),C=this.getColumns()[c];if(e.shiftKey){var n=parseInt(C.getWidth(),10)-16;C.setWidth((n>20?n:20)+"px");e.preventDefault();e.stopImmediatePropagation();}else if(e.ctrlKey||e.metaKey){b._moveColumn(C,this._bRtlMode);e.preventDefault();e.stopImmediatePropagation();}}};b.prototype.onsaprightmodifiers=function(e){var t=q(e.target);if(t.hasClass('sapUiTableCol')){var c=parseInt(t.attr('data-sap-ui-colindex'),10),C=this.getColumns()[c];if(e.shiftKey){C.setWidth(parseInt(C.getWidth(),10)+16+"px");e.preventDefault();e.stopImmediatePropagation();}else if(e.ctrlKey||e.metaKey){b._moveColumn(C,!this._bRtlMode);e.preventDefault();e.stopImmediatePropagation();}}};return b;},true);
