YUI.add("dd-ddm-base",function(B){var A=function(){A.superclass.constructor.apply(this,arguments);};A.NAME="ddm";A.ATTRS={dragCursor:{value:"move"},clickPixelThresh:{value:3},clickTimeThresh:{value:1000},throttleTime:{value:-1},dragMode:{value:"point",setter:function(C){this._setDragMode(C);return C;}}};B.extend(A,B.Base,{_createPG:function(){},_active:null,_setDragMode:function(C){if(C===null){C=B.DD.DDM.get("dragMode");}switch(C){case 1:case"intersect":return 1;case 2:case"strict":return 2;case 0:case"point":return 0;}return 0;},CSS_PREFIX:"yui3-dd",_activateTargets:function(){},_drags:[],activeDrag:false,_regDrag:function(C){if(this.getDrag(C.get("node"))){return false;}if(!this._active){this._setupListeners();}this._drags.push(C);return true;},_unregDrag:function(D){var C=[];B.each(this._drags,function(F,E){if(F!==D){C[C.length]=F;}});this._drags=C;},_setupListeners:function(){this._createPG();this._active=true;},_start:function(){this.fire("ddm:start");this._startDrag();},_startDrag:function(){},_endDrag:function(){},_dropMove:function(){},_end:function(){if(this.activeDrag){this._endDrag();this.fire("ddm:end");this.activeDrag.end.call(this.activeDrag);this.activeDrag=null;}},stopDrag:function(){if(this.activeDrag){this._end();}return this;},_move:function(C){if(this.activeDrag){this.activeDrag._move.call(this.activeDrag,C);this._dropMove();}},cssSizestoObject:function(D){var C=D.split(" ");switch(C.length){case 1:C[1]=C[2]=C[3]=C[0];break;case 2:C[2]=C[0];C[3]=C[1];break;case 3:C[3]=C[1];break;}return{top:parseInt(C[0],10),right:parseInt(C[1],10),bottom:parseInt(C[2],10),left:parseInt(C[3],10)};},getDrag:function(D){var C=false,E=B.one(D);if(E instanceof B.Node){B.each(this._drags,function(G,F){if(E.compareTo(G.get("node"))){C=G;}});}return C;},swapPosition:function(D,C){D=B.DD.DDM.getNode(D);C=B.DD.DDM.getNode(C);var F=D.getXY(),E=C.getXY();D.setXY(E);C.setXY(F);return D;},getNode:function(C){if(C&&C.get){if(B.Widget&&(C instanceof B.Widget)){C=C.get("boundingBox");}else{C=C.get("node");}}else{C=B.one(C);}return C;},swapNode:function(E,C){E=B.DD.DDM.getNode(E);C=B.DD.DDM.getNode(C);var F=C.get("parentNode"),D=C.get("nextSibling");if(D==E){F.insertBefore(E,C);}else{if(C==E.get("nextSibling")){F.insertBefore(C,E);}else{E.get("parentNode").replaceChild(C,E);F.insertBefore(E,D);}}return E;}});B.namespace("DD");B.DD.DDM=new A();},"@VERSION@",{requires:["node","base","yui-throttle"],skinnable:false});YUI.add("dd-ddm",function(A){A.mix(A.DD.DDM,{_pg:null,_debugShim:false,_activateTargets:function(){},_deactivateTargets:function(){},_startDrag:function(){if(this.activeDrag&&this.activeDrag.get("useShim")){this._pg_activate();this._activateTargets();}},_endDrag:function(){this._pg_deactivate();this._deactivateTargets();},_pg_deactivate:function(){this._pg.setStyle("display","none");},_pg_activate:function(){var B=this.activeDrag.get("activeHandle"),C="auto";if(B){C=B.getStyle("cursor");}if(C=="auto"){C=this.get("dragCursor");}this._pg_size();this._pg.setStyles({top:0,left:0,display:"block",opacity:((this._debugShim)?".5":"0"),cursor:C});},_pg_size:function(){if(this.activeDrag){var B=A.one("body"),D=B.get("docHeight"),C=B.get("docWidth");this._pg.setStyles({height:D+"px",width:C+"px"});}},_createPG:function(){var D=A.Node.create("<div></div>"),B=A.one("body"),C;D.setStyles({top:"0",left:"0",position:"absolute",zIndex:"9999",overflow:"hidden",backgroundColor:"red",display:"none",height:"5px",width:"5px"});D.set("id",A.stamp(D));D.addClass("yui3-dd-shim");B.prepend(D);this._pg=D;this._pg.on("mousemove",A.throttle(A.bind(this._move,this),this.get("throttleTime")));this._pg.on("gesturemoveend",A.bind(this._end,this));C=A.one("win");A.on("window:resize",A.bind(this._pg_size,this));C.on("scroll",A.bind(this._pg_size,this));}},true);},"@VERSION@",{requires:["dd-ddm-base","event-resize"],skinnable:false});YUI.add("dd-ddm-drop",function(A){A.mix(A.DD.DDM,{_noShim:false,_activeShims:[],_hasActiveShim:function(){if(this._noShim){return true;}return this._activeShims.length;},_addActiveShim:function(B){this._activeShims[this._activeShims.length]=B;},_removeActiveShim:function(C){var B=[];A.each(this._activeShims,function(E,D){if(E._yuid!==C._yuid){B[B.length]=E;}});this._activeShims=B;},syncActiveShims:function(B){A.later(0,this,function(C){var D=((C)?this.targets:this._lookup());A.each(D,function(F,E){F.sizeShim.call(F);},this);},B);},mode:0,POINT:0,INTERSECT:1,STRICT:2,useHash:true,activeDrop:null,validDrops:[],otherDrops:{},targets:[],_addValid:function(B){this.validDrops[this.validDrops.length]=B;return this;},_removeValid:function(B){var C=[];A.each(this.validDrops,function(E,D){if(E!==B){C[C.length]=E;}});this.validDrops=C;return this;},isOverTarget:function(C){if(this.activeDrag&&C){var G=this.activeDrag.mouseXY,F,B=this.activeDrag.get("dragMode"),E,D=C.shim;if(G&&this.activeDrag){E=this.activeDrag.region;if(B==this.STRICT){return this.activeDrag.get("dragNode").inRegion(C.region,true,E);}else{if(C&&C.shim){if((B==this.INTERSECT)&&this._noShim){F=((E)?E:this.activeDrag.get("node"));return C.get("node").intersect(F).inRegion;}else{if(this._noShim){D=C.get("node");}return D.intersect({top:G[1],bottom:G[1],left:G[0],right:G[0]},C.region).inRegion;}}else{return false;}}}else{return false;}}else{return false;}},clearCache:function(){this.validDrops=[];this.otherDrops={};this._activeShims=[];},_activateTargets:function(){this._noShim=true;this.clearCache();A.each(this.targets,function(C,B){C._activateShim([]);if(C.get("noShim")==true){this._noShim=false;}},this);this._handleTargetOver();},getBestMatch:function(F,D){var C=null,E=0,B;A.each(F,function(I,H){var G=this.activeDrag.get("dragNode").intersect(I.get("node"));I.region.area=G.area;if(G.inRegion){if(G.area>E){E=G.area;C=I;}}},this);if(D){B=[];A.each(F,function(H,G){if(H!==C){B[B.length]=H;}},this);return[C,B];}else{return C;}},_deactivateTargets:function(){var B=[],C,E=this.activeDrag,D=this.activeDrop;if(E&&D&&this.otherDrops[D]){if(!E.get("dragMode")){B=this.otherDrops;
delete B[D];}else{C=this.getBestMatch(this.otherDrops,true);D=C[0];B=C[1];}E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");if(D){D.fire("drop:hit",{drag:E,drop:D,others:B});E.fire("drag:drophit",{drag:E,drop:D,others:B});}}else{if(E&&E.get("dragging")){E.get("node").removeClass(this.CSS_PREFIX+"-drag-over");E.fire("drag:dropmiss",{pageX:E.lastXY[0],pageY:E.lastXY[1]});}else{}}this.activeDrop=null;A.each(this.targets,function(G,F){G._deactivateShim([]);},this);},_dropMove:function(){if(this._hasActiveShim()){this._handleTargetOver();}else{A.each(this.otherDrops,function(C,B){C._handleOut.apply(C,[]);});}},_lookup:function(){if(!this.useHash||this._noShim){return this.validDrops;}var B=[];A.each(this.validDrops,function(D,C){if(D.shim&&D.shim.inViewportRegion(false,D.region)){B[B.length]=D;}});return B;},_handleTargetOver:function(){var B=this._lookup();A.each(B,function(D,C){D._handleTargetOver.call(D);},this);},_regTarget:function(B){this.targets[this.targets.length]=B;},_unregTarget:function(C){var B=[],D;A.each(this.targets,function(F,E){if(F!=C){B[B.length]=F;}},this);this.targets=B;D=[];A.each(this.validDrops,function(F,E){if(F!==C){D[D.length]=F;}});this.validDrops=D;},getDrop:function(C){var B=false,D=A.one(C);if(D instanceof A.Node){A.each(this.targets,function(F,E){if(D.compareTo(F.get("node"))){B=F;}});}return B;}},true);},"@VERSION@",{requires:["dd-ddm"],skinnable:false});YUI.add("dd-drag",function(D){var E=D.DD.DDM,V="node",G="dragging",O="dragNode",C="offsetHeight",L="offsetWidth",K="gesturemove",T=K+"end",Q=K+"start",N="dragstart",H="drag:mouseDown",B="drag:afterMouseDown",F="drag:removeHandle",M="drag:addHandle",S="drag:removeInvalid",U="drag:addInvalid",J="drag:start",I="drag:end",P="drag:drag",R="drag:align",A=function(X){this._lazyAddAttrs=false;A.superclass.constructor.apply(this,arguments);var W=E._regDrag(this);if(!W){D.error("Failed to register node, already in use: "+X.node);}};A.NAME="drag";A.ATTRS={node:{setter:function(W){var X=D.one(W);if(!X){D.error("DD.Drag: Invalid Node Given: "+W);}else{X=X.item(0);}return X;}},dragNode:{setter:function(W){var X=D.one(W);if(!X){D.error("DD.Drag: Invalid dragNode Given: "+W);}return X;}},offsetNode:{value:true},startCentered:{value:false},clickPixelThresh:{value:E.get("clickPixelThresh")},clickTimeThresh:{value:E.get("clickTimeThresh")},lock:{value:false,setter:function(W){if(W){this.get(V).addClass(E.CSS_PREFIX+"-locked");}else{this.get(V).removeClass(E.CSS_PREFIX+"-locked");}return W;}},data:{value:false},move:{value:true},useShim:{value:true},activeHandle:{value:false},primaryButtonOnly:{value:true},dragging:{value:false},parent:{value:false},target:{value:false,setter:function(W){this._handleTarget(W);return W;}},dragMode:{value:null,setter:function(W){return E._setDragMode(W);}},groups:{value:["default"],getter:function(){if(!this._groups){this._groups={};}var W=[];D.each(this._groups,function(Y,X){W[W.length]=X;});return W;},setter:function(W){this._groups={};D.each(W,function(Y,X){this._groups[Y]=true;},this);return W;}},handles:{value:null,setter:function(W){if(W){this._handles={};D.each(W,function(Y,X){var Z=Y;if(Y instanceof D.Node||Y instanceof D.NodeList){Z=Y._yuid;}this._handles[Z]=Y;},this);}else{this._handles=null;}return W;}},bubbles:{setter:function(W){this.addTarget(W);return W;}}};D.extend(A,D.Base,{_bubbleTargets:D.DD.DDM,addToGroup:function(W){this._groups[W]=true;E._activateTargets();return this;},removeFromGroup:function(W){delete this._groups[W];E._activateTargets();return this;},target:null,_handleTarget:function(W){if(D.DD.Drop){if(W===false){if(this.target){E._unregTarget(this.target);this.target=null;}return false;}else{if(!D.Lang.isObject(W)){W={};}W.bubbleTargets=("bubbleTargets" in W)?W.bubbleTargets:D.Object.values(this._yuievt.targets);W.node=this.get(V);W.groups=W.groups||this.get("groups");this.target=new D.DD.Drop(W);}}else{return false;}},_groups:null,_createEvents:function(){this.publish(H,{defaultFn:this._defMouseDownFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(R,{defaultFn:this._defAlignFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(P,{defaultFn:this._defDragFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});this.publish(I,{preventedFn:this._prevEndFn,queuable:false,emitFacade:true,bubbles:true,prefix:"drag"});var W=[B,F,M,S,U,J,"drag:drophit","drag:dropmiss","drag:over","drag:enter","drag:exit"];D.each(W,function(Y,X){this.publish(Y,{type:Y,emitFacade:true,bubbles:true,preventable:false,queuable:false,prefix:"drag"});},this);},_ev_md:null,_startTime:null,_endTime:null,_handles:null,_invalids:null,_invalidsDefault:{"textarea":true,"input":true,"a":true,"button":true,"select":true},_dragThreshMet:null,_fromTimeout:null,_clickTimeout:null,deltaXY:null,startXY:null,nodeXY:null,lastXY:null,actXY:null,realXY:null,mouseXY:null,region:null,_handleMouseUp:function(W){this._fixIEMouseUp();if(E.activeDrag){E._end();}},_fixDragStart:function(W){W.preventDefault();},_ieSelectFix:function(){return false;},_ieSelectBack:null,_fixIEMouseDown:function(){if(D.UA.ie){this._ieSelectBack=D.config.doc.body.onselectstart;D.config.doc.body.onselectstart=this._ieSelectFix;}},_fixIEMouseUp:function(){if(D.UA.ie){D.config.doc.body.onselectstart=this._ieSelectBack;}},_handleMouseDownEvent:function(W){this.fire(H,{ev:W});},_defMouseDownFn:function(X){var W=X.ev;this._dragThreshMet=false;this._ev_md=W;if(this.get("primaryButtonOnly")&&W.button>1){}if(this.validClick(W)){this._fixIEMouseDown();W.halt();this._setStartPosition([W.pageX,W.pageY]);E.activeDrag=this;this._clickTimeout=D.later(this.get("clickTimeThresh"),this,this._timeoutCheck);}this.fire(B,{ev:W});},validClick:function(a){var Z=false,d=false,W=a.target,Y=null,X=null,b=null,c=false;if(this._handles){D.each(this._handles,function(e,f){if(e instanceof D.Node||e instanceof D.NodeList){if(!Z){b=e;if(b instanceof D.Node){b=new D.NodeList(e._node);}b.each(function(g){if(g.contains(W)){Z=true;
}});}}else{if(D.Lang.isString(f)){if(W.test(f+", "+f+" *")&&!Y){Y=f;Z=true;}}}});}else{d=this.get(V);if(d.contains(W)||d.compareTo(W)){Z=true;}}if(Z){if(this._invalids){D.each(this._invalids,function(e,f){if(D.Lang.isString(f)){if(W.test(f+", "+f+" *")){Z=false;}}});}}if(Z){if(Y){X=a.currentTarget.all(Y);c=false;X.each(function(f,e){if((f.contains(W)||f.compareTo(W))&&!c){c=true;this.set("activeHandle",f);}},this);}else{this.set("activeHandle",this.get(V));}}return Z;},_setStartPosition:function(W){this.startXY=W;this.nodeXY=this.lastXY=this.realXY=this.get(V).getXY();if(this.get("offsetNode")){this.deltaXY=[(this.startXY[0]-this.nodeXY[0]),(this.startXY[1]-this.nodeXY[1])];}else{this.deltaXY=[0,0];}},_timeoutCheck:function(){if(!this.get("lock")&&!this._dragThreshMet){this._fromTimeout=this._dragThreshMet=true;this.start();this._alignNode([this._ev_md.pageX,this._ev_md.pageY],true);}},removeHandle:function(X){var W=X;if(X instanceof D.Node||X instanceof D.NodeList){W=X._yuid;}if(this._handles[W]){delete this._handles[W];this.fire(F,{handle:X});}return this;},addHandle:function(X){if(!this._handles){this._handles={};}var W=X;if(X instanceof D.Node||X instanceof D.NodeList){W=X._yuid;}this._handles[W]=X;this.fire(M,{handle:X});return this;},removeInvalid:function(W){if(this._invalids[W]){this._invalids[W]=null;delete this._invalids[W];this.fire(S,{handle:W});}return this;},addInvalid:function(W){if(D.Lang.isString(W)){this._invalids[W]=true;this.fire(U,{handle:W});}return this;},initializer:function(W){this.get(V).dd=this;if(!this.get(V).get("id")){var X=D.stamp(this.get(V));this.get(V).set("id",X);}this.actXY=[];this._invalids=D.clone(this._invalidsDefault,true);this._createEvents();if(!this.get(O)){this.set(O,this.get(V));}this.on("initializedChange",D.bind(this._prep,this));this.set("groups",this.get("groups"));},_prep:function(){this._dragThreshMet=false;var W=this.get(V);W.addClass(E.CSS_PREFIX+"-draggable");W.on(Q,D.bind(this._handleMouseDownEvent,this),{minDistance:this.get("clickPixelThresh"),minTime:this.get("clickTimeThresh")});W.on(T,D.bind(this._handleMouseUp,this));W.on(N,D.bind(this._fixDragStart,this));W.on(K,D.throttle(D.bind(E._move,E),E.get("throttleTime")));},_unprep:function(){var W=this.get(V);W.removeClass(E.CSS_PREFIX+"-draggable");W.detachAll();},start:function(){if(!this.get("lock")&&!this.get(G)){var X=this.get(V),W,Y,Z;this._startTime=(new Date()).getTime();E._start();X.addClass(E.CSS_PREFIX+"-dragging");this.fire(J,{pageX:this.nodeXY[0],pageY:this.nodeXY[1],startTime:this._startTime});X=this.get(O);Z=this.nodeXY;W=X.get(L);Y=X.get(C);if(this.get("startCentered")){this._setStartPosition([Z[0]+(W/2),Z[1]+(Y/2)]);}this.region={"0":Z[0],"1":Z[1],area:0,top:Z[1],right:Z[0]+W,bottom:Z[1]+Y,left:Z[0]};this.set(G,true);}return this;},end:function(){this._endTime=(new Date()).getTime();if(this._clickTimeout){this._clickTimeout.cancel();}this._dragThreshMet=false;this._fromTimeout=false;if(!this.get("lock")&&this.get(G)){this.fire(I,{pageX:this.lastXY[0],pageY:this.lastXY[1],startTime:this._startTime,endTime:this._endTime});}this.get(V).removeClass(E.CSS_PREFIX+"-dragging");this.set(G,false);this.deltaXY=[0,0];return this;},_prevEndFn:function(W){this.get(O).setXY(this.nodeXY);},_align:function(W){this.fire(R,{pageX:W[0],pageY:W[1]});},_defAlignFn:function(W){this.actXY=[W.pageX-this.deltaXY[0],W.pageY-this.deltaXY[1]];},_alignNode:function(W){this._align(W);this._moveNode();},_moveNode:function(W){var X=[],Y=[],a=this.nodeXY,Z=this.actXY;X[0]=(Z[0]-this.lastXY[0]);X[1]=(Z[1]-this.lastXY[1]);Y[0]=(Z[0]-this.nodeXY[0]);Y[1]=(Z[1]-this.nodeXY[1]);this.region={"0":Z[0],"1":Z[1],area:0,top:Z[1],right:Z[0]+this.get(O).get(L),bottom:Z[1]+this.get(O).get(C),left:Z[0]};this.fire(P,{pageX:Z[0],pageY:Z[1],scroll:W,info:{start:a,xy:Z,delta:X,offset:Y}});this.lastXY=Z;},_defDragFn:function(W){if(this.get("move")){if(W.scroll){W.scroll.node.set("scrollTop",W.scroll.top);W.scroll.node.set("scrollLeft",W.scroll.left);}this.get(O).setXY([W.pageX,W.pageY]);this.realXY=[W.pageX,W.pageY];}},_move:function(Y){if(this.get("lock")){return false;}else{this.mouseXY=[Y.pageX,Y.pageY];if(!this._dragThreshMet){var X=Math.abs(this.startXY[0]-Y.pageX),W=Math.abs(this.startXY[1]-Y.pageY);if(X>this.get("clickPixelThresh")||W>this.get("clickPixelThresh")){this._dragThreshMet=true;this.start();this._alignNode([Y.pageX,Y.pageY]);}}else{if(this._clickTimeout){this._clickTimeout.cancel();}this._alignNode([Y.pageX,Y.pageY]);}}},stopDrag:function(){if(this.get(G)){E._end();}return this;},destructor:function(){this._unprep();this.detachAll();if(this.target){this.target.destroy();}E._unregDrag(this);}});D.namespace("DD");D.DD.Drag=A;},"@VERSION@",{requires:["dd-ddm-base","event-synthetic","event-gestures"],skinnable:false});YUI.add("dd-proxy",function(H){var F=H.DD.DDM,B="node",C="dragNode",A="host",D=true,E,G=function(I){G.superclass.constructor.apply(this,arguments);};G.NAME="DDProxy";G.NS="proxy";G.ATTRS={host:{},moveOnEnd:{value:D},hideOnEnd:{value:D},resizeFrame:{value:D},positionProxy:{value:D},borderStyle:{value:"1px solid #808080"},cloneNode:{value:false}};E={_hands:null,_init:function(){if(!F._proxy){F._createFrame();H.on("domready",H.bind(this._init,this));return;}if(!this._hands){this._hands=[];}var K,J,L=this.get(A),I=L.get(C);if(I.compareTo(L.get(B))){if(F._proxy){L.set(C,F._proxy);}}H.each(this._hands,function(M){M.detach();});K=F.on("ddm:start",H.bind(function(){if(F.activeDrag===L){F._setFrame(L);}},this));J=F.on("ddm:end",H.bind(function(){if(L.get("dragging")){if(this.get("moveOnEnd")){L.get(B).setXY(L.lastXY);}if(this.get("hideOnEnd")){L.get(C).setStyle("display","none");}if(this.get("cloneNode")){L.get(C).remove();L.set(C,F._proxy);}}},this));this._hands=[K,J];},initializer:function(){this._init();},destructor:function(){var I=this.get(A);H.each(this._hands,function(J){J.detach();});I.set(C,I.get(B));},clone:function(){var I=this.get(A),K=I.get(B),J=K.cloneNode(true);J.set("id","");J.setStyle("position","absolute");
delete J._yuid;H.stamp(J);K.get("parentNode").appendChild(J);I.set(C,J);return J;}};H.namespace("Plugin");H.extend(G,H.Base,E);H.Plugin.DDProxy=G;H.mix(F,{_createFrame:function(){if(!F._proxy){F._proxy=D;var J=H.Node.create("<div></div>"),I=H.one("body");J.setStyles({position:"absolute",display:"none",zIndex:"999",top:"-999px",left:"-999px"});I.prepend(J);J.set("id",H.guid());J.addClass(F.CSS_PREFIX+"-proxy");F._proxy=J;}},_setFrame:function(J){var M=J.get(B),L=J.get(C),I,K="auto";if(J.proxy.get("resizeFrame")){F._proxy.setStyles({height:M.get("offsetHeight")+"px",width:M.get("offsetWidth")+"px"});}I=F.activeDrag.get("activeHandle");if(I){K=I.getStyle("cursor");}if(K=="auto"){K=F.get("dragCursor");}L.setStyles({visibility:"hidden",display:"block",cursor:K,border:J.proxy.get("borderStyle")});if(J.proxy.get("cloneNode")){L=J.proxy.clone();}if(J.proxy.get("positionProxy")){L.setXY(J.nodeXY);}L.setStyle("visibility","visible");}});},"@VERSION@",{requires:["dd-ddm","dd-drag"],skinnable:false});YUI.add("dd-constrain",function(B){var K="dragNode",M="offsetHeight",F="offsetWidth",P="host",G="tickXArray",N="tickYArray",O=B.DD.DDM,E="top",I="right",L="bottom",D="left",J="view",H=null,A=function(C){this._lazyAddAttrs=false;A.superclass.constructor.apply(this,arguments);};A.NAME="ddConstrained";A.NS="con";A.ATTRS={host:{},stickX:{value:false},stickY:{value:false},tickX:{value:false},tickY:{value:false},tickXArray:{value:false},tickYArray:{value:false},gutter:{value:"0",setter:function(C){return B.DD.DDM.cssSizestoObject(C);}},constrain:{value:J,setter:function(C){var Q=B.one(C);if(Q){C=Q;}return C;}},constrain2region:{setter:function(C){return this.set("constrain",C);}},constrain2node:{setter:function(C){return this.set("constrain",B.one(C));}},constrain2view:{setter:function(C){return this.set("constrain",J);}},cacheRegion:{value:true}};H={initializer:function(){this.get(P).on("drag:start",B.bind(this._handleStart,this));this.get(P).after("drag:align",B.bind(this.align,this));},_handleStart:function(){this.resetCache();},_regionCache:null,_cacheRegion:function(){this._regionCache=this.get("constrain").get("region");},resetCache:function(){this._regionCache=null;},_getConstraint:function(){var C=this.get("constrain"),Q=this.get("gutter"),R;if(C){if(C instanceof B.Node){if(!this._regionCache){B.on("resize",B.bind(this._cacheRegion,this),B.config.win);this._cacheRegion();}R=B.clone(this._regionCache);if(!this.get("cacheRegion")){this.resetCache();}}else{if(B.Lang.isObject(C)){R=C;}}}if(!C||!R){C=J;}if(C===J){R=this.get(P).get(K).get("viewportRegion");}B.each(Q,function(S,T){if((T==I)||(T==L)){R[T]-=S;}else{R[T]+=S;}});return R;},getRegion:function(T){var R={},S=null,C=null,Q=this.get(P);R=this._getConstraint();if(T){S=Q.get(K).get(M);C=Q.get(K).get(F);R[I]=R[I]-C;R[L]=R[L]-S;}return R;},_checkRegion:function(C){var R=C,T=this.getRegion(),S=this.get(P),U=S.get(K).get(M),Q=S.get(K).get(F);if(R[1]>(T[L]-U)){C[1]=(T[L]-U);}if(T[E]>R[1]){C[1]=T[E];}if(R[0]>(T[I]-Q)){C[0]=(T[I]-Q);}if(T[D]>R[0]){C[0]=T[D];}return C;},inRegion:function(R){R=R||this.get(P).get(K).getXY();var Q=this._checkRegion([R[0],R[1]]),C=false;if((R[0]===Q[0])&&(R[1]===Q[1])){C=true;}return C;},align:function(){var R=this.get(P),C=R.actXY,Q=this.getRegion(true);if(this.get("stickX")){C[1]=(R.startXY[1]-R.deltaXY[1]);}if(this.get("stickY")){C[0]=(R.startXY[0]-R.deltaXY[0]);}if(Q){C=this._checkRegion(C);}C=this._checkTicks(C,Q);R.actXY=C;},_checkTicks:function(V,T){var S=this.get(P),U=(S.startXY[0]-S.deltaXY[0]),R=(S.startXY[1]-S.deltaXY[1]),C=this.get("tickX"),Q=this.get("tickY");if(C&&!this.get(G)){V[0]=O._calcTicks(V[0],U,C,T[D],T[I]);}if(Q&&!this.get(N)){V[1]=O._calcTicks(V[1],R,Q,T[E],T[L]);}if(this.get(G)){V[0]=O._calcTickArray(V[0],this.get(G),T[D],T[I]);}if(this.get(N)){V[1]=O._calcTickArray(V[1],this.get(N),T[E],T[L]);}return V;}};B.namespace("Plugin");B.extend(A,B.Base,H);B.Plugin.DDConstrained=A;B.mix(O,{_calcTicks:function(W,V,S,U,T){var Q=((W-V)/S),R=Math.floor(Q),C=Math.ceil(Q);if((R!==0)||(C!==0)){if((Q>=R)&&(Q<=C)){W=(V+(S*R));if(U&&T){if(W<U){W=(V+(S*(R+1)));}if(W>T){W=(V+(S*(R-1)));}}}}return W;},_calcTickArray:function(X,Y,W,T){var Q=0,U=Y.length,S=0,R,C,V;if(!Y||(Y.length===0)){return X;}else{if(Y[0]>=X){return Y[0];}else{for(Q=0;Q<U;Q++){S=(Q+1);if(Y[S]&&Y[S]>=X){R=X-Y[Q];C=Y[S]-X;V=(C>R)?Y[Q]:Y[S];if(W&&T){if(V>T){if(Y[Q]){V=Y[Q];}else{V=Y[U-1];}}}return V;}}return Y[Y.length-1];}}}});},"@VERSION@",{requires:["dd-drag"],skinnable:false});YUI.add("dd-scroll",function(B){var H=function(){H.superclass.constructor.apply(this,arguments);},C,D,L="host",A="buffer",J="parentScroll",G="windowScroll",I="scrollTop",F="scrollLeft",E="offsetWidth",K="offsetHeight";H.ATTRS={parentScroll:{value:false,setter:function(M){if(M){return M;}return false;}},buffer:{value:30,validator:B.Lang.isNumber},scrollDelay:{value:235,validator:B.Lang.isNumber},host:{value:null},windowScroll:{value:false,validator:B.Lang.isBoolean},vertical:{value:true,validator:B.Lang.isBoolean},horizontal:{value:true,validator:B.Lang.isBoolean}};B.extend(H,B.Base,{_scrolling:null,_vpRegionCache:null,_dimCache:null,_scrollTimer:null,_getVPRegion:function(){var M={},N=this.get(J),R=this.get(A),Q=this.get(G),U=((Q)?[]:N.getXY()),S=((Q)?"winWidth":E),P=((Q)?"winHeight":K),T=((Q)?N.get(I):U[1]),O=((Q)?N.get(F):U[0]);M={top:T+R,right:(N.get(S)+O)-R,bottom:(N.get(P)+T)-R,left:O+R};this._vpRegionCache=M;return M;},initializer:function(){var M=this.get(L);M.after("drag:start",B.bind(this.start,this));M.after("drag:end",B.bind(this.end,this));M.on("drag:align",B.bind(this.align,this));B.one("win").on("scroll",B.bind(function(){this._vpRegionCache=null;},this));},_checkWinScroll:function(Y){var X=this._getVPRegion(),M=this.get(L),O=this.get(G),S=M.lastXY,N=false,e=this.get(A),R=this.get(J),g=R.get(I),U=R.get(F),V=this._dimCache.w,a=this._dimCache.h,T=S[1]+a,W=S[1],d=S[0]+V,Q=S[0],f=W,P=Q,Z=g,c=U;if(this.get("horizontal")){if(Q<=X.left){N=true;P=S[0]-((O)?e:0);c=U-e;}if(d>=X.right){N=true;
P=S[0]+((O)?e:0);c=U+e;}}if(this.get("vertical")){if(T>=X.bottom){N=true;f=S[1]+((O)?e:0);Z=g+e;}if(W<=X.top){N=true;f=S[1]-((O)?e:0);Z=g-e;}}if(Z<0){Z=0;f=S[1];}if(c<0){c=0;P=S[0];}if(f<0){f=S[1];}if(P<0){P=S[0];}if(Y){M.actXY=[P,f];M._moveNode({node:R,top:Z,left:c});if(!Z&&!c){this._cancelScroll();}}else{if(N){this._initScroll();}else{this._cancelScroll();}}},_initScroll:function(){this._cancelScroll();this._scrollTimer=B.Lang.later(this.get("scrollDelay"),this,this._checkWinScroll,[true],true);},_cancelScroll:function(){this._scrolling=false;if(this._scrollTimer){this._scrollTimer.cancel();delete this._scrollTimer;}},align:function(M){if(this._scrolling){this._cancelScroll();M.preventDefault();}if(!this._scrolling){this._checkWinScroll();}},_setDimCache:function(){var M=this.get(L).get("dragNode");this._dimCache={h:M.get(K),w:M.get(E)};},start:function(){this._setDimCache();},end:function(M){this._dimCache=null;this._cancelScroll();},toString:function(){return H.NAME+" #"+this.get("node").get("id");}});B.namespace("Plugin");C=function(){C.superclass.constructor.apply(this,arguments);};C.ATTRS=B.merge(H.ATTRS,{windowScroll:{value:true,setter:function(M){if(M){this.set(J,B.one("win"));}return M;}}});B.extend(C,H,{initializer:function(){this.set("windowScroll",this.get("windowScroll"));}});C.NAME=C.NS="winscroll";B.Plugin.DDWinScroll=C;D=function(){D.superclass.constructor.apply(this,arguments);};D.ATTRS=B.merge(H.ATTRS,{node:{value:false,setter:function(M){var N=B.one(M);if(!N){if(M!==false){B.error("DDNodeScroll: Invalid Node Given: "+M);}}else{N=N.item(0);this.set(J,N);}return N;}}});B.extend(D,H,{initializer:function(){this.set("node",this.get("node"));}});D.NAME=D.NS="nodescroll";B.Plugin.DDNodeScroll=D;B.DD.Scroll=H;},"@VERSION@",{optional:["dd-proxy"],requires:["dd-drag"],skinnable:false});YUI.add("dd-plugin",function(B){var A=function(C){C.node=((B.Widget&&C.host instanceof B.Widget)?C.host.get("boundingBox"):C.host);A.superclass.constructor.call(this,C);};A.NAME="dd-plugin";A.NS="dd";B.extend(A,B.DD.Drag);B.namespace("Plugin");B.Plugin.Drag=A;},"@VERSION@",{optional:["dd-constrain","dd-proxy"],requires:["dd-drag"],skinnable:false});YUI.add("dd-drop",function(A){var B="node",G=A.DD.DDM,F="offsetHeight",C="offsetWidth",I="drop:over",H="drop:enter",D="drop:exit",E=function(){this._lazyAddAttrs=false;E.superclass.constructor.apply(this,arguments);A.on("domready",A.bind(function(){A.later(100,this,this._createShim);},this));G._regTarget(this);};E.NAME="drop";E.ATTRS={node:{setter:function(J){var K=A.one(J);if(!K){A.error("DD.Drop: Invalid Node Given: "+J);}return K;}},groups:{value:["default"],setter:function(J){this._groups={};A.each(J,function(L,K){this._groups[L]=true;},this);return J;}},padding:{value:"0",setter:function(J){return G.cssSizestoObject(J);}},lock:{value:false,setter:function(J){if(J){this.get(B).addClass(G.CSS_PREFIX+"-drop-locked");}else{this.get(B).removeClass(G.CSS_PREFIX+"-drop-locked");}return J;}},bubbles:{setter:function(J){this.addTarget(J);return J;}},useShim:{value:true,setter:function(J){A.DD.DDM._noShim=!J;return J;}}};A.extend(E,A.Base,{_bubbleTargets:A.DD.DDM,addToGroup:function(J){this._groups[J]=true;return this;},removeFromGroup:function(J){delete this._groups[J];return this;},_createEvents:function(){var J=[I,H,D,"drop:hit"];A.each(J,function(L,K){this.publish(L,{type:L,emitFacade:true,preventable:false,bubbles:true,queuable:false,prefix:"drop"});},this);},_valid:null,_groups:null,shim:null,region:null,overTarget:null,inGroup:function(J){this._valid=false;var K=false;A.each(J,function(M,L){if(this._groups[M]){K=true;this._valid=true;}},this);return K;},initializer:function(J){A.later(100,this,this._createEvents);var K=this.get(B),L;if(!K.get("id")){L=A.stamp(K);K.set("id",L);}K.addClass(G.CSS_PREFIX+"-drop");this.set("groups",this.get("groups"));},destructor:function(){G._unregTarget(this);if(this.shim&&(this.shim!==this.get(B))){this.shim.detachAll();this.shim.remove();this.shim=null;}this.get(B).removeClass(G.CSS_PREFIX+"-drop");this.detachAll();},_deactivateShim:function(){if(!this.shim){return false;}this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-valid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-active-invalid");this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");if(this.get("useShim")){this.shim.setStyles({top:"-999px",left:"-999px",zIndex:"1"});}this.overTarget=false;},_activateShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")){return false;}var J=this.get(B);if(this.inGroup(G.activeDrag.get("groups"))){J.removeClass(G.CSS_PREFIX+"-drop-active-invalid");J.addClass(G.CSS_PREFIX+"-drop-active-valid");G._addValid(this);this.overTarget=false;if(!this.get("useShim")){this.shim=this.get(B);}this.sizeShim();}else{G._removeValid(this);J.removeClass(G.CSS_PREFIX+"-drop-active-valid");J.addClass(G.CSS_PREFIX+"-drop-active-invalid");}},sizeShim:function(){if(!G.activeDrag){return false;}if(this.get(B)===G.activeDrag.get(B)){return false;}if(this.get("lock")){return false;}if(!this.shim){A.later(100,this,this.sizeShim);return false;}var O=this.get(B),M=O.get(F),K=O.get(C),Q=O.getXY(),P=this.get("padding"),J,N,L;K=K+P.left+P.right;M=M+P.top+P.bottom;Q[0]=Q[0]-P.left;Q[1]=Q[1]-P.top;if(G.activeDrag.get("dragMode")===G.INTERSECT){J=G.activeDrag;N=J.get(B).get(F);L=J.get(B).get(C);M=(M+N);K=(K+L);Q[0]=Q[0]-(L-J.deltaXY[0]);Q[1]=Q[1]-(N-J.deltaXY[1]);}if(this.get("useShim")){this.shim.setStyles({height:M+"px",width:K+"px",top:Q[1]+"px",left:Q[0]+"px"});}this.region={"0":Q[0],"1":Q[1],area:0,top:Q[1],right:Q[0]+K,bottom:Q[1]+M,left:Q[0]};},_createShim:function(){if(!G._pg){A.later(10,this,this._createShim);return;}if(this.shim){return;}var J=this.get("node");if(this.get("useShim")){J=A.Node.create('<div id="'+this.get(B).get("id")+'_shim"></div>');J.setStyles({height:this.get(B).get(F)+"px",width:this.get(B).get(C)+"px",backgroundColor:"yellow",opacity:".5",zIndex:"1",overflow:"hidden",top:"-900px",left:"-900px",position:"absolute"});
G._pg.appendChild(J);J.on("mouseover",A.bind(this._handleOverEvent,this));J.on("mouseout",A.bind(this._handleOutEvent,this));}this.shim=J;},_handleTargetOver:function(){if(G.isOverTarget(this)){this.get(B).addClass(G.CSS_PREFIX+"-drop-over");G.activeDrop=this;G.otherDrops[this]=this;if(this.overTarget){G.activeDrag.fire("drag:over",{drop:this,drag:G.activeDrag});this.fire(I,{drop:this,drag:G.activeDrag});}else{if(G.activeDrag.get("dragging")){this.overTarget=true;this.fire(H,{drop:this,drag:G.activeDrag});G.activeDrag.fire("drag:enter",{drop:this,drag:G.activeDrag});G.activeDrag.get(B).addClass(G.CSS_PREFIX+"-drag-over");}}}else{this._handleOut();}},_handleOverEvent:function(){this.shim.setStyle("zIndex","999");G._addActiveShim(this);},_handleOutEvent:function(){this.shim.setStyle("zIndex","1");G._removeActiveShim(this);},_handleOut:function(J){if(!G.isOverTarget(this)||J){if(this.overTarget){this.overTarget=false;if(!J){G._removeActiveShim(this);}if(G.activeDrag){this.get(B).removeClass(G.CSS_PREFIX+"-drop-over");G.activeDrag.get(B).removeClass(G.CSS_PREFIX+"-drag-over");this.fire(D);G.activeDrag.fire("drag:exit",{drop:this});delete G.otherDrops[this];}}}}});A.DD.Drop=E;},"@VERSION@",{requires:["dd-ddm-drop","dd-drag"],skinnable:false});YUI.add("dd-drop-plugin",function(A){var B=function(C){C.node=C.host;B.superclass.constructor.apply(this,arguments);};B.NAME="dd-drop-plugin";B.NS="drop";A.extend(B,A.DD.Drop);A.namespace("Plugin");A.Plugin.Drop=B;},"@VERSION@",{requires:["dd-drop"],skinnable:false});YUI.add("dd-delegate",function(E){var D=function(F){D.superclass.constructor.apply(this,arguments);},C="container",B="nodes",A=E.Node.create("<div>Temp Node</div>");E.extend(D,E.Base,{_bubbleTargets:E.DD.DDM,dd:null,_shimState:null,_handles:null,_onNodeChange:function(F){this.set("dragNode",F.newVal);},_afterDragEnd:function(F){E.DD.DDM._noShim=this._shimState;this.set("lastNode",this.dd.get("node"));this.get("lastNode").removeClass(E.DD.DDM.CSS_PREFIX+"-dragging");this.dd._unprep();this.dd.set("node",A);this.dd._fixIEMouseUp();},_delMouseDown:function(H){var G=H.currentTarget,F=this.dd;if(G.test(this.get(B))&&!G.test(this.get("invalid"))){this._shimState=E.DD.DDM._noShim;E.DD.DDM._noShim=true;this.set("currentNode",G);F.set("node",G);if(F.proxy){F.set("dragNode",E.DD.DDM._proxy);}else{F.set("dragNode",G);}F._prep();F.fire("drag:mouseDown",{ev:H});}},_onMouseEnter:function(F){this._shimState=E.DD.DDM._noShim;E.DD.DDM._noShim=true;},_onMouseLeave:function(F){E.DD.DDM._noShim=this._shimState;},initializer:function(G){this._handles=[];var H=this.get("dragConfig")||{},F=this.get(C);H.node=A.cloneNode(true);H.bubbleTargets=this;if(this.get("handles")){H.handles=this.get("handles");}this.dd=new E.DD.Drag(H);this.dd.after("drag:end",E.bind(this._afterDragEnd,this));this.dd.on("dragNodeChange",E.bind(this._onNodeChange,this));this._handles.push(E.delegate("gesturemovestart",E.bind(this._delMouseDown,this),F,this.get(B)));this._handles.push(E.on("mouseenter",E.bind(this._onMouseEnter,this),F));this._handles.push(E.on("mouseleave",E.bind(this._onMouseLeave,this),F));E.later(50,this,this.syncTargets);E.DD.DDM.regDelegate(this);},syncTargets:function(){if(!E.Plugin.Drop||this.get("destroyed")){return;}var G,F,H;if(this.get("target")){G=E.one(this.get(C)).all(this.get(B));F=this.dd.get("groups");H=this.get("dragConfig");if(H&&"groups" in H){F=H.groups;}G.each(function(I){this.createDrop(I,F);},this);}return this;},createDrop:function(H,F){var G={useShim:false,bubbleTargets:this};if(!H.drop){H.plug(E.Plugin.Drop,G);}H.drop.set("groups",F);return H;},destructor:function(){if(this.dd){this.dd.destroy();}if(E.Plugin.Drop){var F=E.one(this.get(C)).all(this.get(B));F.unplug(E.Plugin.Drop);}E.each(this._handles,function(G){G.detach();});}},{NAME:"delegate",ATTRS:{container:{value:"body"},nodes:{value:".dd-draggable"},invalid:{value:"input, select, button, a, textarea"},lastNode:{value:A},currentNode:{value:A},dragNode:{value:A},over:{value:false},target:{value:false},dragConfig:{value:null},handles:{value:null}}});E.mix(E.DD.DDM,{_delegates:[],regDelegate:function(F){this._delegates.push(F);},getDelegate:function(G){var F=null;G=E.one(G);E.each(this._delegates,function(H){if(G.test(H.get(C))){F=H;}},this);return F;}});E.namespace("DD");E.DD.Delegate=D;},"@VERSION@",{optional:["dd-drop-plugin"],requires:["dd-drag","event-mouseenter"],skinnable:false});YUI.add("dd",function(A){},"@VERSION@",{use:["dd-ddm-base","dd-ddm","dd-ddm-drop","dd-drag","dd-proxy","dd-constrain","dd-plugin","dd-drop","dd-drop-plugin","dd-scroll","dd-delegate"],skinnable:false});