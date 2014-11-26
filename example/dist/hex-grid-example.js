/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */
var dat=dat||{};dat.gui=dat.gui||{};dat.utils=dat.utils||{};dat.controllers=dat.controllers||{};dat.dom=dat.dom||{};dat.color=dat.color||{};dat.utils.css=function(){return{load:function(e,a){var a=a||document,c=a.createElement("link");c.type="text/css";c.rel="stylesheet";c.href=e;a.getElementsByTagName("head")[0].appendChild(c)},inject:function(e,a){var a=a||document,c=document.createElement("style");c.type="text/css";c.innerHTML=e;a.getElementsByTagName("head")[0].appendChild(c)}}}();
dat.utils.common=function(){var e=Array.prototype.forEach,a=Array.prototype.slice;return{BREAK:{},extend:function(c){this.each(a.call(arguments,1),function(a){for(var f in a)this.isUndefined(a[f])||(c[f]=a[f])},this);return c},defaults:function(c){this.each(a.call(arguments,1),function(a){for(var f in a)this.isUndefined(c[f])&&(c[f]=a[f])},this);return c},compose:function(){var c=a.call(arguments);return function(){for(var d=a.call(arguments),f=c.length-1;f>=0;f--)d=[c[f].apply(this,d)];return d[0]}},
each:function(a,d,f){if(e&&a.forEach===e)a.forEach(d,f);else if(a.length===a.length+0)for(var b=0,n=a.length;b<n;b++){if(b in a&&d.call(f,a[b],b)===this.BREAK)break}else for(b in a)if(d.call(f,a[b],b)===this.BREAK)break},defer:function(a){setTimeout(a,0)},toArray:function(c){return c.toArray?c.toArray():a.call(c)},isUndefined:function(a){return a===void 0},isNull:function(a){return a===null},isNaN:function(a){return a!==a},isArray:Array.isArray||function(a){return a.constructor===Array},isObject:function(a){return a===
Object(a)},isNumber:function(a){return a===a+0},isString:function(a){return a===a+""},isBoolean:function(a){return a===false||a===true},isFunction:function(a){return Object.prototype.toString.call(a)==="[object Function]"}}}();
dat.controllers.Controller=function(e){var a=function(a,d){this.initialValue=a[d];this.domElement=document.createElement("div");this.object=a;this.property=d;this.__onFinishChange=this.__onChange=void 0};e.extend(a.prototype,{onChange:function(a){this.__onChange=a;return this},onFinishChange:function(a){this.__onFinishChange=a;return this},setValue:function(a){this.object[this.property]=a;this.__onChange&&this.__onChange.call(this,a);this.updateDisplay();return this},getValue:function(){return this.object[this.property]},
updateDisplay:function(){return this},isModified:function(){return this.initialValue!==this.getValue()}});return a}(dat.utils.common);
dat.dom.dom=function(e){function a(b){if(b==="0"||e.isUndefined(b))return 0;b=b.match(d);return!e.isNull(b)?parseFloat(b[1]):0}var c={};e.each({HTMLEvents:["change"],MouseEvents:["click","mousemove","mousedown","mouseup","mouseover"],KeyboardEvents:["keydown"]},function(b,a){e.each(b,function(b){c[b]=a})});var d=/(\d+(\.\d+)?)px/,f={makeSelectable:function(b,a){if(!(b===void 0||b.style===void 0))b.onselectstart=a?function(){return false}:function(){},b.style.MozUserSelect=a?"auto":"none",b.style.KhtmlUserSelect=
a?"auto":"none",b.unselectable=a?"on":"off"},makeFullscreen:function(b,a,d){e.isUndefined(a)&&(a=true);e.isUndefined(d)&&(d=true);b.style.position="absolute";if(a)b.style.left=0,b.style.right=0;if(d)b.style.top=0,b.style.bottom=0},fakeEvent:function(b,a,d,f){var d=d||{},m=c[a];if(!m)throw Error("Event type "+a+" not supported.");var l=document.createEvent(m);switch(m){case "MouseEvents":l.initMouseEvent(a,d.bubbles||false,d.cancelable||true,window,d.clickCount||1,0,0,d.x||d.clientX||0,d.y||d.clientY||
0,false,false,false,false,0,null);break;case "KeyboardEvents":m=l.initKeyboardEvent||l.initKeyEvent;e.defaults(d,{cancelable:true,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,keyCode:void 0,charCode:void 0});m(a,d.bubbles||false,d.cancelable,window,d.ctrlKey,d.altKey,d.shiftKey,d.metaKey,d.keyCode,d.charCode);break;default:l.initEvent(a,d.bubbles||false,d.cancelable||true)}e.defaults(l,f);b.dispatchEvent(l)},bind:function(b,a,d,c){b.addEventListener?b.addEventListener(a,d,c||false):b.attachEvent&&
b.attachEvent("on"+a,d);return f},unbind:function(b,a,d,c){b.removeEventListener?b.removeEventListener(a,d,c||false):b.detachEvent&&b.detachEvent("on"+a,d);return f},addClass:function(b,a){if(b.className===void 0)b.className=a;else if(b.className!==a){var d=b.className.split(/ +/);if(d.indexOf(a)==-1)d.push(a),b.className=d.join(" ").replace(/^\s+/,"").replace(/\s+$/,"")}return f},removeClass:function(b,a){if(a){if(b.className!==void 0)if(b.className===a)b.removeAttribute("class");else{var d=b.className.split(/ +/),
c=d.indexOf(a);if(c!=-1)d.splice(c,1),b.className=d.join(" ")}}else b.className=void 0;return f},hasClass:function(a,d){return RegExp("(?:^|\\s+)"+d+"(?:\\s+|$)").test(a.className)||false},getWidth:function(b){b=getComputedStyle(b);return a(b["border-left-width"])+a(b["border-right-width"])+a(b["padding-left"])+a(b["padding-right"])+a(b.width)},getHeight:function(b){b=getComputedStyle(b);return a(b["border-top-width"])+a(b["border-bottom-width"])+a(b["padding-top"])+a(b["padding-bottom"])+a(b.height)},
getOffset:function(a){var d={left:0,top:0};if(a.offsetParent){do d.left+=a.offsetLeft,d.top+=a.offsetTop;while(a=a.offsetParent)}return d},isActive:function(a){return a===document.activeElement&&(a.type||a.href)}};return f}(dat.utils.common);
dat.controllers.OptionController=function(e,a,c){var d=function(f,b,e){d.superclass.call(this,f,b);var h=this;this.__select=document.createElement("select");if(c.isArray(e)){var j={};c.each(e,function(a){j[a]=a});e=j}c.each(e,function(a,b){var d=document.createElement("option");d.innerHTML=b;d.setAttribute("value",a);h.__select.appendChild(d)});this.updateDisplay();a.bind(this.__select,"change",function(){h.setValue(this.options[this.selectedIndex].value)});this.domElement.appendChild(this.__select)};
d.superclass=e;c.extend(d.prototype,e.prototype,{setValue:function(a){a=d.superclass.prototype.setValue.call(this,a);this.__onFinishChange&&this.__onFinishChange.call(this,this.getValue());return a},updateDisplay:function(){this.__select.value=this.getValue();return d.superclass.prototype.updateDisplay.call(this)}});return d}(dat.controllers.Controller,dat.dom.dom,dat.utils.common);
dat.controllers.NumberController=function(e,a){var c=function(d,f,b){c.superclass.call(this,d,f);b=b||{};this.__min=b.min;this.__max=b.max;this.__step=b.step;d=this.__impliedStep=a.isUndefined(this.__step)?this.initialValue==0?1:Math.pow(10,Math.floor(Math.log(this.initialValue)/Math.LN10))/10:this.__step;d=d.toString();this.__precision=d.indexOf(".")>-1?d.length-d.indexOf(".")-1:0};c.superclass=e;a.extend(c.prototype,e.prototype,{setValue:function(a){if(this.__min!==void 0&&a<this.__min)a=this.__min;
else if(this.__max!==void 0&&a>this.__max)a=this.__max;this.__step!==void 0&&a%this.__step!=0&&(a=Math.round(a/this.__step)*this.__step);return c.superclass.prototype.setValue.call(this,a)},min:function(a){this.__min=a;return this},max:function(a){this.__max=a;return this},step:function(a){this.__step=a;return this}});return c}(dat.controllers.Controller,dat.utils.common);
dat.controllers.NumberControllerBox=function(e,a,c){var d=function(f,b,e){function h(){var a=parseFloat(l.__input.value);c.isNaN(a)||l.setValue(a)}function j(a){var b=o-a.clientY;l.setValue(l.getValue()+b*l.__impliedStep);o=a.clientY}function m(){a.unbind(window,"mousemove",j);a.unbind(window,"mouseup",m)}this.__truncationSuspended=false;d.superclass.call(this,f,b,e);var l=this,o;this.__input=document.createElement("input");this.__input.setAttribute("type","text");a.bind(this.__input,"change",h);
a.bind(this.__input,"blur",function(){h();l.__onFinishChange&&l.__onFinishChange.call(l,l.getValue())});a.bind(this.__input,"mousedown",function(b){a.bind(window,"mousemove",j);a.bind(window,"mouseup",m);o=b.clientY});a.bind(this.__input,"keydown",function(a){if(a.keyCode===13)l.__truncationSuspended=true,this.blur(),l.__truncationSuspended=false});this.updateDisplay();this.domElement.appendChild(this.__input)};d.superclass=e;c.extend(d.prototype,e.prototype,{updateDisplay:function(){var a=this.__input,
b;if(this.__truncationSuspended)b=this.getValue();else{b=this.getValue();var c=Math.pow(10,this.__precision);b=Math.round(b*c)/c}a.value=b;return d.superclass.prototype.updateDisplay.call(this)}});return d}(dat.controllers.NumberController,dat.dom.dom,dat.utils.common);
dat.controllers.NumberControllerSlider=function(e,a,c,d,f){var b=function(d,c,f,e,l){function o(b){b.preventDefault();var d=a.getOffset(g.__background),c=a.getWidth(g.__background);g.setValue(g.__min+(g.__max-g.__min)*((b.clientX-d.left)/(d.left+c-d.left)));return false}function y(){a.unbind(window,"mousemove",o);a.unbind(window,"mouseup",y);g.__onFinishChange&&g.__onFinishChange.call(g,g.getValue())}b.superclass.call(this,d,c,{min:f,max:e,step:l});var g=this;this.__background=document.createElement("div");
this.__foreground=document.createElement("div");a.bind(this.__background,"mousedown",function(b){a.bind(window,"mousemove",o);a.bind(window,"mouseup",y);o(b)});a.addClass(this.__background,"slider");a.addClass(this.__foreground,"slider-fg");this.updateDisplay();this.__background.appendChild(this.__foreground);this.domElement.appendChild(this.__background)};b.superclass=e;b.useDefaultStyles=function(){c.inject(f)};d.extend(b.prototype,e.prototype,{updateDisplay:function(){this.__foreground.style.width=
(this.getValue()-this.__min)/(this.__max-this.__min)*100+"%";return b.superclass.prototype.updateDisplay.call(this)}});return b}(dat.controllers.NumberController,dat.dom.dom,dat.utils.css,dat.utils.common,".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");
dat.controllers.FunctionController=function(e,a,c){var d=function(c,b,e){d.superclass.call(this,c,b);var h=this;this.__button=document.createElement("div");this.__button.innerHTML=e===void 0?"Fire":e;a.bind(this.__button,"click",function(a){a.preventDefault();h.fire();return false});a.addClass(this.__button,"button");this.domElement.appendChild(this.__button)};d.superclass=e;c.extend(d.prototype,e.prototype,{fire:function(){this.__onChange&&this.__onChange.call(this);this.__onFinishChange&&this.__onFinishChange.call(this,
this.getValue());this.getValue().call(this.object)}});return d}(dat.controllers.Controller,dat.dom.dom,dat.utils.common);
dat.controllers.BooleanController=function(e,a,c){var d=function(c,b){d.superclass.call(this,c,b);var e=this;this.__prev=this.getValue();this.__checkbox=document.createElement("input");this.__checkbox.setAttribute("type","checkbox");a.bind(this.__checkbox,"change",function(){e.setValue(!e.__prev)},false);this.domElement.appendChild(this.__checkbox);this.updateDisplay()};d.superclass=e;c.extend(d.prototype,e.prototype,{setValue:function(a){a=d.superclass.prototype.setValue.call(this,a);this.__onFinishChange&&
this.__onFinishChange.call(this,this.getValue());this.__prev=this.getValue();return a},updateDisplay:function(){this.getValue()===true?(this.__checkbox.setAttribute("checked","checked"),this.__checkbox.checked=true):this.__checkbox.checked=false;return d.superclass.prototype.updateDisplay.call(this)}});return d}(dat.controllers.Controller,dat.dom.dom,dat.utils.common);
dat.color.toString=function(e){return function(a){if(a.a==1||e.isUndefined(a.a)){for(a=a.hex.toString(16);a.length<6;)a="0"+a;return"#"+a}else return"rgba("+Math.round(a.r)+","+Math.round(a.g)+","+Math.round(a.b)+","+a.a+")"}}(dat.utils.common);
dat.color.interpret=function(e,a){var c,d,f=[{litmus:a.isString,conversions:{THREE_CHAR_HEX:{read:function(a){a=a.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);return a===null?false:{space:"HEX",hex:parseInt("0x"+a[1].toString()+a[1].toString()+a[2].toString()+a[2].toString()+a[3].toString()+a[3].toString())}},write:e},SIX_CHAR_HEX:{read:function(a){a=a.match(/^#([A-F0-9]{6})$/i);return a===null?false:{space:"HEX",hex:parseInt("0x"+a[1].toString())}},write:e},CSS_RGB:{read:function(a){a=a.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
return a===null?false:{space:"RGB",r:parseFloat(a[1]),g:parseFloat(a[2]),b:parseFloat(a[3])}},write:e},CSS_RGBA:{read:function(a){a=a.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);return a===null?false:{space:"RGB",r:parseFloat(a[1]),g:parseFloat(a[2]),b:parseFloat(a[3]),a:parseFloat(a[4])}},write:e}}},{litmus:a.isNumber,conversions:{HEX:{read:function(a){return{space:"HEX",hex:a,conversionName:"HEX"}},write:function(a){return a.hex}}}},{litmus:a.isArray,conversions:{RGB_ARRAY:{read:function(a){return a.length!=
3?false:{space:"RGB",r:a[0],g:a[1],b:a[2]}},write:function(a){return[a.r,a.g,a.b]}},RGBA_ARRAY:{read:function(a){return a.length!=4?false:{space:"RGB",r:a[0],g:a[1],b:a[2],a:a[3]}},write:function(a){return[a.r,a.g,a.b,a.a]}}}},{litmus:a.isObject,conversions:{RGBA_OBJ:{read:function(b){return a.isNumber(b.r)&&a.isNumber(b.g)&&a.isNumber(b.b)&&a.isNumber(b.a)?{space:"RGB",r:b.r,g:b.g,b:b.b,a:b.a}:false},write:function(a){return{r:a.r,g:a.g,b:a.b,a:a.a}}},RGB_OBJ:{read:function(b){return a.isNumber(b.r)&&
a.isNumber(b.g)&&a.isNumber(b.b)?{space:"RGB",r:b.r,g:b.g,b:b.b}:false},write:function(a){return{r:a.r,g:a.g,b:a.b}}},HSVA_OBJ:{read:function(b){return a.isNumber(b.h)&&a.isNumber(b.s)&&a.isNumber(b.v)&&a.isNumber(b.a)?{space:"HSV",h:b.h,s:b.s,v:b.v,a:b.a}:false},write:function(a){return{h:a.h,s:a.s,v:a.v,a:a.a}}},HSV_OBJ:{read:function(b){return a.isNumber(b.h)&&a.isNumber(b.s)&&a.isNumber(b.v)?{space:"HSV",h:b.h,s:b.s,v:b.v}:false},write:function(a){return{h:a.h,s:a.s,v:a.v}}}}}];return function(){d=
false;var b=arguments.length>1?a.toArray(arguments):arguments[0];a.each(f,function(e){if(e.litmus(b))return a.each(e.conversions,function(e,f){c=e.read(b);if(d===false&&c!==false)return d=c,c.conversionName=f,c.conversion=e,a.BREAK}),a.BREAK});return d}}(dat.color.toString,dat.utils.common);
dat.GUI=dat.gui.GUI=function(e,a,c,d,f,b,n,h,j,m,l,o,y,g,i){function q(a,b,r,c){if(b[r]===void 0)throw Error("Object "+b+' has no property "'+r+'"');c.color?b=new l(b,r):(b=[b,r].concat(c.factoryArgs),b=d.apply(a,b));if(c.before instanceof f)c.before=c.before.__li;t(a,b);g.addClass(b.domElement,"c");r=document.createElement("span");g.addClass(r,"property-name");r.innerHTML=b.property;var e=document.createElement("div");e.appendChild(r);e.appendChild(b.domElement);c=s(a,e,c.before);g.addClass(c,k.CLASS_CONTROLLER_ROW);
g.addClass(c,typeof b.getValue());p(a,c,b);a.__controllers.push(b);return b}function s(a,b,d){var c=document.createElement("li");b&&c.appendChild(b);d?a.__ul.insertBefore(c,params.before):a.__ul.appendChild(c);a.onResize();return c}function p(a,d,c){c.__li=d;c.__gui=a;i.extend(c,{options:function(b){if(arguments.length>1)return c.remove(),q(a,c.object,c.property,{before:c.__li.nextElementSibling,factoryArgs:[i.toArray(arguments)]});if(i.isArray(b)||i.isObject(b))return c.remove(),q(a,c.object,c.property,
{before:c.__li.nextElementSibling,factoryArgs:[b]})},name:function(a){c.__li.firstElementChild.firstElementChild.innerHTML=a;return c},listen:function(){c.__gui.listen(c);return c},remove:function(){c.__gui.remove(c);return c}});if(c instanceof j){var e=new h(c.object,c.property,{min:c.__min,max:c.__max,step:c.__step});i.each(["updateDisplay","onChange","onFinishChange"],function(a){var b=c[a],H=e[a];c[a]=e[a]=function(){var a=Array.prototype.slice.call(arguments);b.apply(c,a);return H.apply(e,a)}});
g.addClass(d,"has-slider");c.domElement.insertBefore(e.domElement,c.domElement.firstElementChild)}else if(c instanceof h){var f=function(b){return i.isNumber(c.__min)&&i.isNumber(c.__max)?(c.remove(),q(a,c.object,c.property,{before:c.__li.nextElementSibling,factoryArgs:[c.__min,c.__max,c.__step]})):b};c.min=i.compose(f,c.min);c.max=i.compose(f,c.max)}else if(c instanceof b)g.bind(d,"click",function(){g.fakeEvent(c.__checkbox,"click")}),g.bind(c.__checkbox,"click",function(a){a.stopPropagation()});
else if(c instanceof n)g.bind(d,"click",function(){g.fakeEvent(c.__button,"click")}),g.bind(d,"mouseover",function(){g.addClass(c.__button,"hover")}),g.bind(d,"mouseout",function(){g.removeClass(c.__button,"hover")});else if(c instanceof l)g.addClass(d,"color"),c.updateDisplay=i.compose(function(a){d.style.borderLeftColor=c.__color.toString();return a},c.updateDisplay),c.updateDisplay();c.setValue=i.compose(function(b){a.getRoot().__preset_select&&c.isModified()&&B(a.getRoot(),true);return b},c.setValue)}
function t(a,b){var c=a.getRoot(),d=c.__rememberedObjects.indexOf(b.object);if(d!=-1){var e=c.__rememberedObjectIndecesToControllers[d];e===void 0&&(e={},c.__rememberedObjectIndecesToControllers[d]=e);e[b.property]=b;if(c.load&&c.load.remembered){c=c.load.remembered;if(c[a.preset])c=c[a.preset];else if(c[w])c=c[w];else return;if(c[d]&&c[d][b.property]!==void 0)d=c[d][b.property],b.initialValue=d,b.setValue(d)}}}function I(a){var b=a.__save_row=document.createElement("li");g.addClass(a.domElement,
"has-save");a.__ul.insertBefore(b,a.__ul.firstChild);g.addClass(b,"save-row");var c=document.createElement("span");c.innerHTML="&nbsp;";g.addClass(c,"button gears");var d=document.createElement("span");d.innerHTML="Save";g.addClass(d,"button");g.addClass(d,"save");var e=document.createElement("span");e.innerHTML="New";g.addClass(e,"button");g.addClass(e,"save-as");var f=document.createElement("span");f.innerHTML="Revert";g.addClass(f,"button");g.addClass(f,"revert");var m=a.__preset_select=document.createElement("select");
a.load&&a.load.remembered?i.each(a.load.remembered,function(b,c){C(a,c,c==a.preset)}):C(a,w,false);g.bind(m,"change",function(){for(var b=0;b<a.__preset_select.length;b++)a.__preset_select[b].innerHTML=a.__preset_select[b].value;a.preset=this.value});b.appendChild(m);b.appendChild(c);b.appendChild(d);b.appendChild(e);b.appendChild(f);if(u){var b=document.getElementById("dg-save-locally"),l=document.getElementById("dg-local-explain");b.style.display="block";b=document.getElementById("dg-local-storage");
localStorage.getItem(document.location.href+".isLocal")==="true"&&b.setAttribute("checked","checked");var o=function(){l.style.display=a.useLocalStorage?"block":"none"};o();g.bind(b,"change",function(){a.useLocalStorage=!a.useLocalStorage;o()})}var h=document.getElementById("dg-new-constructor");g.bind(h,"keydown",function(a){a.metaKey&&(a.which===67||a.keyCode==67)&&x.hide()});g.bind(c,"click",function(){h.innerHTML=JSON.stringify(a.getSaveObject(),void 0,2);x.show();h.focus();h.select()});g.bind(d,
"click",function(){a.save()});g.bind(e,"click",function(){var b=prompt("Enter a new preset name.");b&&a.saveAs(b)});g.bind(f,"click",function(){a.revert()})}function J(a){function b(f){f.preventDefault();e=f.clientX;g.addClass(a.__closeButton,k.CLASS_DRAG);g.bind(window,"mousemove",c);g.bind(window,"mouseup",d);return false}function c(b){b.preventDefault();a.width+=e-b.clientX;a.onResize();e=b.clientX;return false}function d(){g.removeClass(a.__closeButton,k.CLASS_DRAG);g.unbind(window,"mousemove",
c);g.unbind(window,"mouseup",d)}a.__resize_handle=document.createElement("div");i.extend(a.__resize_handle.style,{width:"6px",marginLeft:"-3px",height:"200px",cursor:"ew-resize",position:"absolute"});var e;g.bind(a.__resize_handle,"mousedown",b);g.bind(a.__closeButton,"mousedown",b);a.domElement.insertBefore(a.__resize_handle,a.domElement.firstElementChild)}function D(a,b){a.domElement.style.width=b+"px";if(a.__save_row&&a.autoPlace)a.__save_row.style.width=b+"px";if(a.__closeButton)a.__closeButton.style.width=
b+"px"}function z(a,b){var c={};i.each(a.__rememberedObjects,function(d,e){var f={};i.each(a.__rememberedObjectIndecesToControllers[e],function(a,c){f[c]=b?a.initialValue:a.getValue()});c[e]=f});return c}function C(a,b,c){var d=document.createElement("option");d.innerHTML=b;d.value=b;a.__preset_select.appendChild(d);if(c)a.__preset_select.selectedIndex=a.__preset_select.length-1}function B(a,b){var c=a.__preset_select[a.__preset_select.selectedIndex];c.innerHTML=b?c.value+"*":c.value}function E(a){a.length!=
0&&o(function(){E(a)});i.each(a,function(a){a.updateDisplay()})}e.inject(c);var w="Default",u;try{u="localStorage"in window&&window.localStorage!==null}catch(K){u=false}var x,F=true,v,A=false,G=[],k=function(a){function b(){localStorage.setItem(document.location.href+".gui",JSON.stringify(d.getSaveObject()))}function c(){var a=d.getRoot();a.width+=1;i.defer(function(){a.width-=1})}var d=this;this.domElement=document.createElement("div");this.__ul=document.createElement("ul");this.domElement.appendChild(this.__ul);
g.addClass(this.domElement,"dg");this.__folders={};this.__controllers=[];this.__rememberedObjects=[];this.__rememberedObjectIndecesToControllers=[];this.__listening=[];a=a||{};a=i.defaults(a,{autoPlace:true,width:k.DEFAULT_WIDTH});a=i.defaults(a,{resizable:a.autoPlace,hideable:a.autoPlace});if(i.isUndefined(a.load))a.load={preset:w};else if(a.preset)a.load.preset=a.preset;i.isUndefined(a.parent)&&a.hideable&&G.push(this);a.resizable=i.isUndefined(a.parent)&&a.resizable;if(a.autoPlace&&i.isUndefined(a.scrollable))a.scrollable=
true;var e=u&&localStorage.getItem(document.location.href+".isLocal")==="true";Object.defineProperties(this,{parent:{get:function(){return a.parent}},scrollable:{get:function(){return a.scrollable}},autoPlace:{get:function(){return a.autoPlace}},preset:{get:function(){return d.parent?d.getRoot().preset:a.load.preset},set:function(b){d.parent?d.getRoot().preset=b:a.load.preset=b;for(b=0;b<this.__preset_select.length;b++)if(this.__preset_select[b].value==this.preset)this.__preset_select.selectedIndex=
b;d.revert()}},width:{get:function(){return a.width},set:function(b){a.width=b;D(d,b)}},name:{get:function(){return a.name},set:function(b){a.name=b;if(m)m.innerHTML=a.name}},closed:{get:function(){return a.closed},set:function(b){a.closed=b;a.closed?g.addClass(d.__ul,k.CLASS_CLOSED):g.removeClass(d.__ul,k.CLASS_CLOSED);this.onResize();if(d.__closeButton)d.__closeButton.innerHTML=b?k.TEXT_OPEN:k.TEXT_CLOSED}},load:{get:function(){return a.load}},useLocalStorage:{get:function(){return e},set:function(a){u&&
((e=a)?g.bind(window,"unload",b):g.unbind(window,"unload",b),localStorage.setItem(document.location.href+".isLocal",a))}}});if(i.isUndefined(a.parent)){a.closed=false;g.addClass(this.domElement,k.CLASS_MAIN);g.makeSelectable(this.domElement,false);if(u&&e){d.useLocalStorage=true;var f=localStorage.getItem(document.location.href+".gui");if(f)a.load=JSON.parse(f)}this.__closeButton=document.createElement("div");this.__closeButton.innerHTML=k.TEXT_CLOSED;g.addClass(this.__closeButton,k.CLASS_CLOSE_BUTTON);
this.domElement.appendChild(this.__closeButton);g.bind(this.__closeButton,"click",function(){d.closed=!d.closed})}else{if(a.closed===void 0)a.closed=true;var m=document.createTextNode(a.name);g.addClass(m,"controller-name");f=s(d,m);g.addClass(this.__ul,k.CLASS_CLOSED);g.addClass(f,"title");g.bind(f,"click",function(a){a.preventDefault();d.closed=!d.closed;return false});if(!a.closed)this.closed=false}a.autoPlace&&(i.isUndefined(a.parent)&&(F&&(v=document.createElement("div"),g.addClass(v,"dg"),g.addClass(v,
k.CLASS_AUTO_PLACE_CONTAINER),document.body.appendChild(v),F=false),v.appendChild(this.domElement),g.addClass(this.domElement,k.CLASS_AUTO_PLACE)),this.parent||D(d,a.width));g.bind(window,"resize",function(){d.onResize()});g.bind(this.__ul,"webkitTransitionEnd",function(){d.onResize()});g.bind(this.__ul,"transitionend",function(){d.onResize()});g.bind(this.__ul,"oTransitionEnd",function(){d.onResize()});this.onResize();a.resizable&&J(this);d.getRoot();a.parent||c()};k.toggleHide=function(){A=!A;i.each(G,
function(a){a.domElement.style.zIndex=A?-999:999;a.domElement.style.opacity=A?0:1})};k.CLASS_AUTO_PLACE="a";k.CLASS_AUTO_PLACE_CONTAINER="ac";k.CLASS_MAIN="main";k.CLASS_CONTROLLER_ROW="cr";k.CLASS_TOO_TALL="taller-than-window";k.CLASS_CLOSED="closed";k.CLASS_CLOSE_BUTTON="close-button";k.CLASS_DRAG="drag";k.DEFAULT_WIDTH=245;k.TEXT_CLOSED="Close Controls";k.TEXT_OPEN="Open Controls";g.bind(window,"keydown",function(a){document.activeElement.type!=="text"&&(a.which===72||a.keyCode==72)&&k.toggleHide()},
false);i.extend(k.prototype,{add:function(a,b){return q(this,a,b,{factoryArgs:Array.prototype.slice.call(arguments,2)})},addColor:function(a,b){return q(this,a,b,{color:true})},remove:function(a){this.__ul.removeChild(a.__li);this.__controllers.slice(this.__controllers.indexOf(a),1);var b=this;i.defer(function(){b.onResize()})},destroy:function(){this.autoPlace&&v.removeChild(this.domElement)},addFolder:function(a){if(this.__folders[a]!==void 0)throw Error('You already have a folder in this GUI by the name "'+
a+'"');var b={name:a,parent:this};b.autoPlace=this.autoPlace;if(this.load&&this.load.folders&&this.load.folders[a])b.closed=this.load.folders[a].closed,b.load=this.load.folders[a];b=new k(b);this.__folders[a]=b;a=s(this,b.domElement);g.addClass(a,"folder");return b},open:function(){this.closed=false},close:function(){this.closed=true},onResize:function(){var a=this.getRoot();if(a.scrollable){var b=g.getOffset(a.__ul).top,c=0;i.each(a.__ul.childNodes,function(b){a.autoPlace&&b===a.__save_row||(c+=
g.getHeight(b))});window.innerHeight-b-20<c?(g.addClass(a.domElement,k.CLASS_TOO_TALL),a.__ul.style.height=window.innerHeight-b-20+"px"):(g.removeClass(a.domElement,k.CLASS_TOO_TALL),a.__ul.style.height="auto")}a.__resize_handle&&i.defer(function(){a.__resize_handle.style.height=a.__ul.offsetHeight+"px"});if(a.__closeButton)a.__closeButton.style.width=a.width+"px"},remember:function(){if(i.isUndefined(x))x=new y,x.domElement.innerHTML=a;if(this.parent)throw Error("You can only call remember on a top level GUI.");
var b=this;i.each(Array.prototype.slice.call(arguments),function(a){b.__rememberedObjects.length==0&&I(b);b.__rememberedObjects.indexOf(a)==-1&&b.__rememberedObjects.push(a)});this.autoPlace&&D(this,this.width)},getRoot:function(){for(var a=this;a.parent;)a=a.parent;return a},getSaveObject:function(){var a=this.load;a.closed=this.closed;if(this.__rememberedObjects.length>0){a.preset=this.preset;if(!a.remembered)a.remembered={};a.remembered[this.preset]=z(this)}a.folders={};i.each(this.__folders,function(b,
c){a.folders[c]=b.getSaveObject()});return a},save:function(){if(!this.load.remembered)this.load.remembered={};this.load.remembered[this.preset]=z(this);B(this,false)},saveAs:function(a){if(!this.load.remembered)this.load.remembered={},this.load.remembered[w]=z(this,true);this.load.remembered[a]=z(this);this.preset=a;C(this,a,true)},revert:function(a){i.each(this.__controllers,function(b){this.getRoot().load.remembered?t(a||this.getRoot(),b):b.setValue(b.initialValue)},this);i.each(this.__folders,
function(a){a.revert(a)});a||B(this.getRoot(),false)},listen:function(a){var b=this.__listening.length==0;this.__listening.push(a);b&&E(this.__listening)}});return k}(dat.utils.css,'<div id="dg-save" class="dg dialogue">\n\n  Here\'s the new load parameter for your <code>GUI</code>\'s constructor:\n\n  <textarea id="dg-new-constructor"></textarea>\n\n  <div id="dg-save-locally">\n\n    <input id="dg-local-storage" type="checkbox"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id="dg-local-explain">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>\'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>',
".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
dat.controllers.factory=function(e,a,c,d,f,b,n){return function(h,j,m,l){var o=h[j];if(n.isArray(m)||n.isObject(m))return new e(h,j,m);if(n.isNumber(o))return n.isNumber(m)&&n.isNumber(l)?new c(h,j,m,l):new a(h,j,{min:m,max:l});if(n.isString(o))return new d(h,j);if(n.isFunction(o))return new f(h,j,"");if(n.isBoolean(o))return new b(h,j)}}(dat.controllers.OptionController,dat.controllers.NumberControllerBox,dat.controllers.NumberControllerSlider,dat.controllers.StringController=function(e,a,c){var d=
function(c,b){function e(){h.setValue(h.__input.value)}d.superclass.call(this,c,b);var h=this;this.__input=document.createElement("input");this.__input.setAttribute("type","text");a.bind(this.__input,"keyup",e);a.bind(this.__input,"change",e);a.bind(this.__input,"blur",function(){h.__onFinishChange&&h.__onFinishChange.call(h,h.getValue())});a.bind(this.__input,"keydown",function(a){a.keyCode===13&&this.blur()});this.updateDisplay();this.domElement.appendChild(this.__input)};d.superclass=e;c.extend(d.prototype,
e.prototype,{updateDisplay:function(){if(!a.isActive(this.__input))this.__input.value=this.getValue();return d.superclass.prototype.updateDisplay.call(this)}});return d}(dat.controllers.Controller,dat.dom.dom,dat.utils.common),dat.controllers.FunctionController,dat.controllers.BooleanController,dat.utils.common),dat.controllers.Controller,dat.controllers.BooleanController,dat.controllers.FunctionController,dat.controllers.NumberControllerBox,dat.controllers.NumberControllerSlider,dat.controllers.OptionController,
dat.controllers.ColorController=function(e,a,c,d,f){function b(a,b,c,d){a.style.background="";f.each(j,function(e){a.style.cssText+="background: "+e+"linear-gradient("+b+", "+c+" 0%, "+d+" 100%); "})}function n(a){a.style.background="";a.style.cssText+="background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);";a.style.cssText+="background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";
a.style.cssText+="background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";a.style.cssText+="background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);";a.style.cssText+="background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);"}var h=function(e,l){function o(b){q(b);a.bind(window,"mousemove",q);a.bind(window,
"mouseup",j)}function j(){a.unbind(window,"mousemove",q);a.unbind(window,"mouseup",j)}function g(){var a=d(this.value);a!==false?(p.__color.__state=a,p.setValue(p.__color.toOriginal())):this.value=p.__color.toString()}function i(){a.unbind(window,"mousemove",s);a.unbind(window,"mouseup",i)}function q(b){b.preventDefault();var c=a.getWidth(p.__saturation_field),d=a.getOffset(p.__saturation_field),e=(b.clientX-d.left+document.body.scrollLeft)/c,b=1-(b.clientY-d.top+document.body.scrollTop)/c;b>1?b=
1:b<0&&(b=0);e>1?e=1:e<0&&(e=0);p.__color.v=b;p.__color.s=e;p.setValue(p.__color.toOriginal());return false}function s(b){b.preventDefault();var c=a.getHeight(p.__hue_field),d=a.getOffset(p.__hue_field),b=1-(b.clientY-d.top+document.body.scrollTop)/c;b>1?b=1:b<0&&(b=0);p.__color.h=b*360;p.setValue(p.__color.toOriginal());return false}h.superclass.call(this,e,l);this.__color=new c(this.getValue());this.__temp=new c(0);var p=this;this.domElement=document.createElement("div");a.makeSelectable(this.domElement,
false);this.__selector=document.createElement("div");this.__selector.className="selector";this.__saturation_field=document.createElement("div");this.__saturation_field.className="saturation-field";this.__field_knob=document.createElement("div");this.__field_knob.className="field-knob";this.__field_knob_border="2px solid ";this.__hue_knob=document.createElement("div");this.__hue_knob.className="hue-knob";this.__hue_field=document.createElement("div");this.__hue_field.className="hue-field";this.__input=
document.createElement("input");this.__input.type="text";this.__input_textShadow="0 1px 1px ";a.bind(this.__input,"keydown",function(a){a.keyCode===13&&g.call(this)});a.bind(this.__input,"blur",g);a.bind(this.__selector,"mousedown",function(){a.addClass(this,"drag").bind(window,"mouseup",function(){a.removeClass(p.__selector,"drag")})});var t=document.createElement("div");f.extend(this.__selector.style,{width:"122px",height:"102px",padding:"3px",backgroundColor:"#222",boxShadow:"0px 1px 3px rgba(0,0,0,0.3)"});
f.extend(this.__field_knob.style,{position:"absolute",width:"12px",height:"12px",border:this.__field_knob_border+(this.__color.v<0.5?"#fff":"#000"),boxShadow:"0px 1px 3px rgba(0,0,0,0.5)",borderRadius:"12px",zIndex:1});f.extend(this.__hue_knob.style,{position:"absolute",width:"15px",height:"2px",borderRight:"4px solid #fff",zIndex:1});f.extend(this.__saturation_field.style,{width:"100px",height:"100px",border:"1px solid #555",marginRight:"3px",display:"inline-block",cursor:"pointer"});f.extend(t.style,
{width:"100%",height:"100%",background:"none"});b(t,"top","rgba(0,0,0,0)","#000");f.extend(this.__hue_field.style,{width:"15px",height:"100px",display:"inline-block",border:"1px solid #555",cursor:"ns-resize"});n(this.__hue_field);f.extend(this.__input.style,{outline:"none",textAlign:"center",color:"#fff",border:0,fontWeight:"bold",textShadow:this.__input_textShadow+"rgba(0,0,0,0.7)"});a.bind(this.__saturation_field,"mousedown",o);a.bind(this.__field_knob,"mousedown",o);a.bind(this.__hue_field,"mousedown",
function(b){s(b);a.bind(window,"mousemove",s);a.bind(window,"mouseup",i)});this.__saturation_field.appendChild(t);this.__selector.appendChild(this.__field_knob);this.__selector.appendChild(this.__saturation_field);this.__selector.appendChild(this.__hue_field);this.__hue_field.appendChild(this.__hue_knob);this.domElement.appendChild(this.__input);this.domElement.appendChild(this.__selector);this.updateDisplay()};h.superclass=e;f.extend(h.prototype,e.prototype,{updateDisplay:function(){var a=d(this.getValue());
if(a!==false){var e=false;f.each(c.COMPONENTS,function(b){if(!f.isUndefined(a[b])&&!f.isUndefined(this.__color.__state[b])&&a[b]!==this.__color.__state[b])return e=true,{}},this);e&&f.extend(this.__color.__state,a)}f.extend(this.__temp.__state,this.__color.__state);this.__temp.a=1;var h=this.__color.v<0.5||this.__color.s>0.5?255:0,j=255-h;f.extend(this.__field_knob.style,{marginLeft:100*this.__color.s-7+"px",marginTop:100*(1-this.__color.v)-7+"px",backgroundColor:this.__temp.toString(),border:this.__field_knob_border+
"rgb("+h+","+h+","+h+")"});this.__hue_knob.style.marginTop=(1-this.__color.h/360)*100+"px";this.__temp.s=1;this.__temp.v=1;b(this.__saturation_field,"left","#fff",this.__temp.toString());f.extend(this.__input.style,{backgroundColor:this.__input.value=this.__color.toString(),color:"rgb("+h+","+h+","+h+")",textShadow:this.__input_textShadow+"rgba("+j+","+j+","+j+",.7)"})}});var j=["-moz-","-o-","-webkit-","-ms-",""];return h}(dat.controllers.Controller,dat.dom.dom,dat.color.Color=function(e,a,c,d){function f(a,
b,c){Object.defineProperty(a,b,{get:function(){if(this.__state.space==="RGB")return this.__state[b];n(this,b,c);return this.__state[b]},set:function(a){if(this.__state.space!=="RGB")n(this,b,c),this.__state.space="RGB";this.__state[b]=a}})}function b(a,b){Object.defineProperty(a,b,{get:function(){if(this.__state.space==="HSV")return this.__state[b];h(this);return this.__state[b]},set:function(a){if(this.__state.space!=="HSV")h(this),this.__state.space="HSV";this.__state[b]=a}})}function n(b,c,e){if(b.__state.space===
"HEX")b.__state[c]=a.component_from_hex(b.__state.hex,e);else if(b.__state.space==="HSV")d.extend(b.__state,a.hsv_to_rgb(b.__state.h,b.__state.s,b.__state.v));else throw"Corrupted color state";}function h(b){var c=a.rgb_to_hsv(b.r,b.g,b.b);d.extend(b.__state,{s:c.s,v:c.v});if(d.isNaN(c.h)){if(d.isUndefined(b.__state.h))b.__state.h=0}else b.__state.h=c.h}var j=function(){this.__state=e.apply(this,arguments);if(this.__state===false)throw"Failed to interpret color arguments";this.__state.a=this.__state.a||
1};j.COMPONENTS="r,g,b,h,s,v,hex,a".split(",");d.extend(j.prototype,{toString:function(){return c(this)},toOriginal:function(){return this.__state.conversion.write(this)}});f(j.prototype,"r",2);f(j.prototype,"g",1);f(j.prototype,"b",0);b(j.prototype,"h");b(j.prototype,"s");b(j.prototype,"v");Object.defineProperty(j.prototype,"a",{get:function(){return this.__state.a},set:function(a){this.__state.a=a}});Object.defineProperty(j.prototype,"hex",{get:function(){if(!this.__state.space!=="HEX")this.__state.hex=
a.rgb_to_hex(this.r,this.g,this.b);return this.__state.hex},set:function(a){this.__state.space="HEX";this.__state.hex=a}});return j}(dat.color.interpret,dat.color.math=function(){var e;return{hsv_to_rgb:function(a,c,d){var e=a/60-Math.floor(a/60),b=d*(1-c),n=d*(1-e*c),c=d*(1-(1-e)*c),a=[[d,c,b],[n,d,b],[b,d,c],[b,n,d],[c,b,d],[d,b,n]][Math.floor(a/60)%6];return{r:a[0]*255,g:a[1]*255,b:a[2]*255}},rgb_to_hsv:function(a,c,d){var e=Math.min(a,c,d),b=Math.max(a,c,d),e=b-e;if(b==0)return{h:NaN,s:0,v:0};
a=a==b?(c-d)/e:c==b?2+(d-a)/e:4+(a-c)/e;a/=6;a<0&&(a+=1);return{h:a*360,s:e/b,v:b/255}},rgb_to_hex:function(a,c,d){a=this.hex_with_component(0,2,a);a=this.hex_with_component(a,1,c);return a=this.hex_with_component(a,0,d)},component_from_hex:function(a,c){return a>>c*8&255},hex_with_component:function(a,c,d){return d<<(e=c*8)|a&~(255<<e)}}}(),dat.color.toString,dat.utils.common),dat.color.interpret,dat.utils.common),dat.utils.requestAnimationFrame=function(){return window.webkitRequestAnimationFrame||
window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){window.setTimeout(e,1E3/60)}}(),dat.dom.CenteredDiv=function(e,a){var c=function(){this.backgroundElement=document.createElement("div");a.extend(this.backgroundElement.style,{backgroundColor:"rgba(0,0,0,0.8)",top:0,left:0,display:"none",zIndex:"1000",opacity:0,WebkitTransition:"opacity 0.2s linear"});e.makeFullscreen(this.backgroundElement);this.backgroundElement.style.position="fixed";this.domElement=
document.createElement("div");a.extend(this.domElement.style,{position:"fixed",display:"none",zIndex:"1001",opacity:0,WebkitTransition:"-webkit-transform 0.2s ease-out, opacity 0.2s linear"});document.body.appendChild(this.backgroundElement);document.body.appendChild(this.domElement);var c=this;e.bind(this.backgroundElement,"click",function(){c.hide()})};c.prototype.show=function(){var c=this;this.backgroundElement.style.display="block";this.domElement.style.display="block";this.domElement.style.opacity=
0;this.domElement.style.webkitTransform="scale(1.1)";this.layout();a.defer(function(){c.backgroundElement.style.opacity=1;c.domElement.style.opacity=1;c.domElement.style.webkitTransform="scale(1)"})};c.prototype.hide=function(){var a=this,c=function(){a.domElement.style.display="none";a.backgroundElement.style.display="none";e.unbind(a.domElement,"webkitTransitionEnd",c);e.unbind(a.domElement,"transitionend",c);e.unbind(a.domElement,"oTransitionEnd",c)};e.bind(this.domElement,"webkitTransitionEnd",
c);e.bind(this.domElement,"transitionend",c);e.bind(this.domElement,"oTransitionEnd",c);this.backgroundElement.style.opacity=0;this.domElement.style.opacity=0;this.domElement.style.webkitTransform="scale(1.1)"};c.prototype.layout=function(){this.domElement.style.left=window.innerWidth/2-e.getWidth(this.domElement)/2+"px";this.domElement.style.top=window.innerHeight/2-e.getHeight(this.domElement)/2+"px"};return c}(dat.dom.dom,dat.utils.common),dat.dom.dom,dat.utils.common);
//
// showdown.js -- A javascript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
// See license.txt for more information.
//
// The full source distribution is at:
//
//				A A L
//				T C A
//				T K B
//
//   <http://www.attacklab.net/>
//
//
// Wherever possible, Showdown is a straight, line-by-line port
// of the Perl version of Markdown.
//
// This is not a normal parser design; it's basically just a
// series of string substitutions.  It's hard to read and
// maintain this way,  but keeping Showdown close to the original
// design makes it easier to port new features.
//
// More importantly, Showdown behaves like markdown.pl in most
// edge cases.  So web applications can do client-side preview
// in Javascript, and then build identical HTML on the server.
//
// This port needs the new RegExp functionality of ECMA 262,
// 3rd Edition (i.e. Javascript 1.5).  Most modern web browsers
// should do fine.  Even with the new regular expression features,
// We do a lot of work to emulate Perl's regex functionality.
// The tricky changes in this file mostly have the "attacklab:"
// label.  Major or self-explanatory changes don't.
//
// Smart diff tools like Araxis Merge will be able to match up
// this file with markdown.pl in a useful way.  A little tweaking
// helps: in a copy of markdown.pl, replace "#" with "//" and
// replace "$text" with "text".  Be sure to ignore whitespace
// and line endings.
//
//
// Showdown usage:
//
//   var text = "Markdown *rocks*.";
//
//   var converter = new Showdown.converter();
//   var html = converter.makeHtml(text);
//
//   alert(html);
//
// Note: move the sample code to the bottom of this
// file before uncommenting it.
//
//
// Showdown namespace
//
var Showdown={extensions:{}},forEach=Showdown.forEach=function(a,b){if(typeof a.forEach=="function")a.forEach(b);else{var c,d=a.length;for(c=0;c<d;c++)b(a[c],c,a)}},stdExtName=function(a){return a.replace(/[_-]||\s/g,"").toLowerCase()};Showdown.converter=function(a){var b,c,d,e=0,f=[],g=[];if(typeof module!="undefind"&&typeof exports!="undefined"&&typeof require!="undefind"){var h=require("fs");if(h){var i=h.readdirSync((__dirname||".")+"/extensions").filter(function(a){return~a.indexOf(".js")}).map(function(a){return a.replace(/\.js$/,"")});Showdown.forEach(i,function(a){var b=stdExtName(a);Showdown.extensions[b]=require("./extensions/"+a)})}}a&&a.extensions&&Showdown.forEach(a.extensions,function(a){typeof a=="string"&&(a=Showdown.extensions[stdExtName(a)]);if(typeof a!="function")throw"Extension '"+a+"' could not be loaded.  It was either not found or is not a valid extension.";Showdown.forEach(a(this),function(a){a.type?a.type==="language"||a.type==="lang"?f.push(a):(a.type==="output"||a.type==="html")&&g.push(a):g.push(a)})}),this.makeHtml=function(a){return b={},c={},d=[],a=a.replace(/~/g,"~T"),a=a.replace(/\$/g,"~D"),a=a.replace(/\r\n/g,"\n"),a=a.replace(/\r/g,"\n"),a="\n\n"+a+"\n\n",a=L(a),a=a.replace(/^[ \t]+$/mg,""),Showdown.forEach(f,function(b){a=j(b,a)}),a=y(a),a=l(a),a=k(a),a=n(a),a=J(a),a=a.replace(/~D/g,"$$"),a=a.replace(/~T/g,"~"),Showdown.forEach(g,function(b){a=j(b,a)}),a};var j=function(a,b){if(a.regex){var c=new RegExp(a.regex,"g");return b.replace(c,a.replace)}if(a.filter)return a.filter(b)},k=function(a){return a+="~0",a=a.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|(?=~0))/gm,function(a,d,e,f,g){return d=d.toLowerCase(),b[d]=F(e),f?f+g:(g&&(c[d]=g.replace(/"/g,"&quot;")),"")}),a=a.replace(/~0/,""),a},l=function(a){a=a.replace(/\n/g,"\n\n");var b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del|style|section|header|footer|nav|article|aside",c="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside";return a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,m),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|style|section|header|footer|nav|article|aside)\b[^\r]*?<\/\2>[ \t]*(?=\n+)\n)/gm,m),a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,m),a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,m),a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,m),a=a.replace(/\n\n/g,"\n"),a},m=function(a,b){var c=b;return c=c.replace(/\n\n/g,"\n"),c=c.replace(/^\n/,""),c=c.replace(/\n+$/g,""),c="\n\n~K"+(d.push(c)-1)+"K\n\n",c},n=function(a){a=u(a);var b=z("<hr />");return a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,b),a=w(a),a=x(a),a=D(a),a=l(a),a=E(a),a},o=function(a){return a=A(a),a=p(a),a=G(a),a=s(a),a=q(a),a=H(a),a=F(a),a=C(a),a=a.replace(/  +\n/g," <br />\n"),a},p=function(a){var b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;return a=a.replace(b,function(a){var b=a.replace(/(.)<\/?code>(?=.)/g,"$1`");return b=M(b,"\\`*_"),b}),a},q=function(a){return a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,r),a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,r),a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,r),a},r=function(a,d,e,f,g,h,i,j){j==undefined&&(j="");var k=d,l=e,m=f.toLowerCase(),n=g,o=j;if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(b[m]!=undefined)n=b[m],c[m]!=undefined&&(o=c[m]);else{if(!(k.search(/\(\s*\)$/m)>-1))return k;n=""}}n=M(n,"*_");var p='<a href="'+n+'"';return o!=""&&(o=o.replace(/"/g,"&quot;"),o=M(o,"*_"),p+=' title="'+o+'"'),p+=">"+l+"</a>",p},s=function(a){return a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,t),a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,t),a},t=function(a,d,e,f,g,h,i,j){var k=d,l=e,m=f.toLowerCase(),n=g,o=j;o||(o="");if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(b[m]==undefined)return k;n=b[m],c[m]!=undefined&&(o=c[m])}l=l.replace(/"/g,"&quot;"),n=M(n,"*_");var p='<img src="'+n+'" alt="'+l+'"';return o=o.replace(/"/g,"&quot;"),o=M(o,"*_"),p+=' title="'+o+'"',p+=" />",p},u=function(a){function b(a){return a.replace(/[^\w]/g,"").toLowerCase()}return a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,c){return z('<h1 id="'+b(c)+'">'+o(c)+"</h1>")}),a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,c){return z('<h2 id="'+b(c)+'">'+o(c)+"</h2>")}),a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,c,d){var e=c.length;return z("<h"+e+' id="'+b(d)+'">'+o(d)+"</h"+e+">")}),a},v,w=function(a){a+="~0";var b=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;return e?a=a.replace(b,function(a,b,c){var d=b,e=c.search(/[*+-]/g)>-1?"ul":"ol";d=d.replace(/\n{2,}/g,"\n\n\n");var f=v(d);return f=f.replace(/\s+$/,""),f="<"+e+">"+f+"</"+e+">\n",f}):(b=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(b,function(a,b,c,d){var e=b,f=c,g=d.search(/[*+-]/g)>-1?"ul":"ol",f=f.replace(/\n{2,}/g,"\n\n\n"),h=v(f);return h=e+"<"+g+">\n"+h+"</"+g+">\n",h})),a=a.replace(/~0/,""),a};v=function(a){return e++,a=a.replace(/\n{2,}$/,"\n"),a+="~0",a=a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(a,b,c,d,e){var f=e,g=b,h=c;return g||f.search(/\n{2,}/)>-1?f=n(K(f)):(f=w(K(f)),f=f.replace(/\n$/,""),f=o(f)),"<li>"+f+"</li>\n"}),a=a.replace(/~0/g,""),e--,a};var x=function(a){return a+="~0",a=a.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,c){var d=b,e=c;return d=B(K(d)),d=L(d),d=d.replace(/^\n+/g,""),d=d.replace(/\n+$/g,""),d="<pre><code>"+d+"\n</code></pre>",z(d)+e}),a=a.replace(/~0/,""),a},y=function(a){return a+="~0",a=a.replace(/(?:^|\n)```(.*)\n([\s\S]*?)\n```/g,function(a,b,c){var d=b,e=c;return e=B(e),e=L(e),e=e.replace(/^\n+/g,""),e=e.replace(/\n+$/g,""),e="<pre><code"+(d?' class="'+d+'"':"")+">"+e+"\n</code></pre>",z(e)}),a=a.replace(/~0/,""),a},z=function(a){return a=a.replace(/(^\n+|\n+$)/g,""),"\n\n~K"+(d.push(a)-1)+"K\n\n"},A=function(a){return a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,c,d,e){var f=d;return f=f.replace(/^([ \t]*)/g,""),f=f.replace(/[ \t]*$/g,""),f=B(f),b+"<code>"+f+"</code>"}),a},B=function(a){return a=a.replace(/&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=M(a,"*_{}[]\\",!1),a},C=function(a){return a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>"),a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>"),a},D=function(a){return a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,b){var c=b;return c=c.replace(/^[ \t]*>[ \t]?/gm,"~0"),c=c.replace(/~0/g,""),c=c.replace(/^[ \t]+$/gm,""),c=n(c),c=c.replace(/(^|\n)/g,"$1  "),c=c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c=b;return c=c.replace(/^  /mg,"~0"),c=c.replace(/~0/g,""),c}),z("<blockquote>\n"+c+"\n</blockquote>")}),a},E=function(a){a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,"");var b=a.split(/\n{2,}/g),c=[],e=b.length;for(var f=0;f<e;f++){var g=b[f];g.search(/~K(\d+)K/g)>=0?c.push(g):g.search(/\S/)>=0&&(g=o(g),g=g.replace(/^([ \t]*)/g,"<p>"),g+="</p>",c.push(g))}e=c.length;for(var f=0;f<e;f++)while(c[f].search(/~K(\d+)K/)>=0){var h=d[RegExp.$1];h=h.replace(/\$/g,"$$$$"),c[f]=c[f].replace(/~K\d+K/,h)}return c.join("\n\n")},F=function(a){return a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;"),a},G=function(a){return a=a.replace(/\\(\\)/g,N),a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,N),a},H=function(a){return a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,'<a href="$1">$1</a>'),a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return I(J(b))}),a},I=function(a){var b=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){return"&#x"+a.charCodeAt(0).toString(16)+";"},function(a){return a}];return a="mailto:"+a,a=a.replace(/./g,function(a){if(a=="@")a=b[Math.floor(Math.random()*2)](a);else if(a!=":"){var c=Math.random();a=c>.9?b[2](a):c>.45?b[1](a):b[0](a)}return a}),a='<a href="'+a+'">'+a+"</a>",a=a.replace(/">.+:/g,'">'),a},J=function(a){return a=a.replace(/~E(\d+)E/g,function(a,b){var c=parseInt(b);return String.fromCharCode(c)}),a},K=function(a){return a=a.replace(/^(\t|[ ]{1,4})/gm,"~0"),a=a.replace(/~0/g,""),a},L=function(a){return a=a.replace(/\t(?=\t)/g,"    "),a=a.replace(/\t/g,"~A~B"),a=a.replace(/~B(.+?)~A/g,function(a,b,c){var d=b,e=4-d.length%4;for(var f=0;f<e;f++)d+=" ";return d}),a=a.replace(/~A/g,"    "),a=a.replace(/~B/g,""),a},M=function(a,b,c){var d="(["+b.replace(/([\[\]\\])/g,"\\$1")+"])";c&&(d="\\\\"+d);var e=new RegExp(d,"g");return a=a.replace(e,N),a},N=function(a,b){var c=b.charCodeAt(0);return"~E"+c+"E"}},typeof module!="undefined"&&(module.exports=Showdown),typeof define=="function"&&define.amd&&define("showdown",function(){return Showdown});
//
//  Twitter Extension
//  @username   ->  <a href="http://twitter.com/username">@username</a>
//  #hashtag    ->  <a href="http://twitter.com/search/%23hashtag">#hashtag</a>
//
(function(){var a=function(a){return[{type:"lang",regex:"\\B(\\\\)?@([\\S]+)\\b",replace:function(a,b,c){return b==="\\"?a:'<a href="http://twitter.com/'+c+'">@'+c+"</a>"}},{type:"lang",regex:"\\B(\\\\)?#([\\S]+)\\b",replace:function(a,b,c){return b==="\\"?a:'<a href="http://twitter.com/search/%23'+c+'">#'+c+"</a>"}},{type:"lang",regex:"\\\\@",replace:"@"}]};typeof window!="undefined"&&window.Showdown&&window.Showdown.extensions&&(window.Showdown.extensions.twitter=a),typeof module!="undefined"&&(module.exports=a)})();
//
//  Google Prettify
//  A showdown extension to add Google Prettify (http://code.google.com/p/google-code-prettify/)
//  hints to showdown's HTML output.
//
(function(){var a=function(a){return[{type:"output",filter:function(a){return a.replace(/(<pre>)?<code>/gi,function(a,b){return b?'<pre class="prettyprint linenums" tabIndex="0"><code data-inner="1">':'<code class="prettyprint">'})}}]};typeof window!="undefined"&&window.Showdown&&window.Showdown.extensions&&(window.Showdown.extensions.googlePrettify=a),typeof module!="undefined"&&(module.exports=a)})();
//
//  Github Extension (WIP)
//  ~~strike-through~~   ->  <del>strike-through</del>
//
(function(){var a=function(a){return[{type:"lang",regex:"(~T){2}([^~]+)(~T){2}",replace:function(a,b,c,d){return"<del>"+c+"</del>"}}]};typeof window!="undefined"&&window.Showdown&&window.Showdown.extensions&&(window.Showdown.extensions.github=a),typeof module!="undefined"&&(module.exports=a)})();
'use strict';

/**
 * This module defines a singleton that helps coordinate the various components of the hex-grid
 * package.
 *
 * The controller singleton handles provides convenient helper functions for creating and running
 * grids and animations. It stores these objects and updates them in response to various system
 * events--e.g., window resize.
 *
 * @module controller
 */
(function () {

  var controller = {},
      config = {},
      internal = {};

  controller.persistentJobs = {
    colorShift: {
      constructorName: 'ColorShiftJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorShift'),
      start: restartPersistentJob.bind(controller, 'colorShift')
    },
    colorWave: {
      constructorName: 'ColorWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorWave'),
      start: restartPersistentJob.bind(controller, 'colorWave')
    },
    displacementWave: {
      constructorName: 'DisplacementWaveJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'displacementWave'),
      start: restartPersistentJob.bind(controller, 'displacementWave')
    },

    // --- For internal use --- //

    colorReset: {
      constructorName: 'ColorResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'colorReset'),
      start: restartPersistentJob.bind(controller, 'colorReset')
    },
    displacementReset: {
      constructorName: 'DisplacementResetJob',
      jobs: [],
      create: createPersistentJob.bind(controller, 'displacementReset'),
      start: restartPersistentJob.bind(controller, 'displacementReset')
    }
  };

  controller.transientJobs = {
    openPost: {
      constructorName: 'OpenPostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'openPost'),
      createRandom: openRandomPost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'openPost'),
      canRunWithOpenGrid: false
    },
    closePost: {
      constructorName: 'ClosePostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'closePost'),
      createRandom: closePost,
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'closePost'),
      canRunWithOpenGrid: true
    },
    carouselImageSlide: {
      constructorName: 'CarouselImageSlideJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'carouselImageSlide'),
      createRandom: null,
      toggleRecurrence: null,
      canRunWithOpenGrid: true
    },
    dilateSectors: {
      constructorName: 'DilateSectorsJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'dilateSectors'),
      createRandom: null,
      toggleRecurrence: null,
      canRunWithOpenGrid: true
    },
    fadePost: {
      constructorName: 'FadePostJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'fadePost'),
      createRandom: null,
      toggleRecurrence: null,
      canRunWithOpenGrid: true
    },
    displacementRadiate: {
      constructorName: 'DisplacementRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'displacementRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'displacementRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'displacementRadiate'),
      canRunWithOpenGrid: true
    },
    highlightHover: {
      constructorName: 'HighlightHoverJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'highlightHover'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'highlightHover'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightHover'),
      canRunWithOpenGrid: true
    },
    highlightRadiate: {
      constructorName: 'HighlightRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'highlightRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'highlightRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'highlightRadiate'),
      canRunWithOpenGrid: true
    },
    intraTileRadiate: {
      constructorName: 'IntraTileRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'intraTileRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'intraTileRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'intraTileRadiate'),
      canRunWithOpenGrid: true
    },
    line: {
      constructorName: 'LineJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, randomLineCreator, 'line'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'line'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'line'),
      canRunWithOpenGrid: false
    },
    linesRadiate: {
      constructorName: 'LinesRadiateJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, linesRadiateCreator, 'linesRadiate'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'linesRadiate'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'linesRadiate'),
      canRunWithOpenGrid: false
    },
    pan: {
      constructorName: 'PanJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'pan'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'pan'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'pan'),
      canRunWithOpenGrid: true
    },
    spread: {
      constructorName: 'SpreadJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'spread'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'spread'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'spread'),
      canRunWithOpenGrid: true
    },
    tileBorder: {
      constructorName: 'TileBorderJob',
      jobs: [],
      timeouts: [],
      create: createTransientJob.bind(controller, null, 'tileBorder'),
      createRandom: createTransientJobWithARandomTile.bind(controller, 'tileBorder'),
      toggleRecurrence: toggleJobRecurrence.bind(controller, 'tileBorder'),
      canRunWithOpenGrid: true
    }
  };

  internal.grids = [];
  internal.inputs = [];
  internal.annotations = [];

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Starts repeating any AnimationJobs that are configured to recur.
   *
   * @param {Window.hg.Grid} grid
   */
  function startRecurringAnimations(grid) {
    Object.keys(controller.transientJobs).forEach(function (key) {
      var config = window.hg[controller.transientJobs[key].constructorName].config;

      if (config.isRecurring) {
        controller.transientJobs[key].toggleRecurrence(grid, true, config.avgDelay,
            config.delayDeviationRange);
      }
    });
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @param {*} [extraArg]
   * @returns {AnimationJob}
   */
  function generalTransientJobCreator(jobId, grid, tile, onComplete, extraArg) {
    return new window.hg[controller.transientJobs[jobId].constructorName](grid, tile, onComplete,
        extraArg);
  }

  /**
   * @param {?Function} creator
   * @param {Array.<AnimationJob>} jobId
   * @param {Grid} grid
   * @param {?Tile} tile
   * @param {*} [extraArg]
   * @returns {?AnimationJob}
   */
  function createTransientJob(creator, jobId, grid, tile, extraArg) {
    var job;

    if (!grid.isPostOpen || controller.transientJobs[jobId].canRunWithOpenGrid) {
      creator = creator || generalTransientJobCreator.bind(controller, jobId);

      // Create the job with whatever custom logic is needed for this particular type of job
      job = creator(grid, tile, onComplete, extraArg);

      // Store a reference to this job within the controller
      controller.transientJobs[jobId].jobs[grid.index].push(job);
      window.hg.animator.startJob(job);

      return job;
    } else {
      console.log('Cannot create a ' + controller.transientJobs[jobId].constructorName +
          ' while the Grid is expanded');

      return null;
    }

    // ---  --- //

    function onComplete() {
      // Destroy both references to this now-complete job
      controller.transientJobs[jobId].jobs[grid.index].splice(
          controller.transientJobs[jobId].jobs[grid.index].indexOf(job), 1);
    }
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   * @returns {?AnimationJob}
   */
  function createTransientJobWithARandomTile(jobId, grid) {
    return controller.transientJobs[jobId].create(grid, getRandomOriginalTile(grid));
  }

  /**
   * Toggles whether an AnimationJob is automatically repeated.
   *
   * @param {String} jobId
   * @param {Grid} grid
   * @param {Boolean} isRecurring
   * @param {Number} avgDelay
   * @param {Number} delayDeviationRange
   */
  function toggleJobRecurrence(jobId, grid, isRecurring, avgDelay, delayDeviationRange) {
    var minDelay, maxDelay, actualDelayRange, jobTimeouts;

    jobTimeouts = controller.transientJobs[jobId].timeouts;

    // Compute the delay deviation range
    minDelay = avgDelay - delayDeviationRange * 0.5;
    minDelay = minDelay > 0 ? minDelay : 1;
    maxDelay = avgDelay + delayDeviationRange * 0.5;
    actualDelayRange = maxDelay - minDelay;

    // Stop any pre-existing recurrence
    if (jobTimeouts[grid.index]) {
      clearTimeout(jobTimeouts[grid.index]);
      jobTimeouts[grid.index] = null;
    }

    // Should we start the recurrence?
    if (isRecurring) {
      jobTimeouts[grid.index] = setTimeout(recur, avgDelay);
    }

    // ---  --- //

    /**
     * Creates a new occurrence of the AnimationJob and starts a new timeout to repeat this.
     */
    function recur() {
      var delay = Math.random() * actualDelayRange + minDelay;
      controller.transientJobs[jobId].createRandom(grid);
      jobTimeouts[grid.index] = setTimeout(recur, delay);
    }
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   */
  function createPersistentJob(jobId, grid) {
    var jobDefinition, job;

    jobDefinition = controller.persistentJobs[jobId];

    job = new window.hg[jobDefinition.constructorName](grid);
    jobDefinition.jobs[grid.index].push(job);
    jobDefinition.start(grid, jobDefinition.jobs[grid.index].length - 1);
  }

  /**
   * @param {String} jobId
   * @param {Grid} grid
   * @param {Number} [jobIndex] If not given, ALL persistent jobs (of this bound type) will be
   * restarted for the given grid.
   */
  function restartPersistentJob(jobId, grid, jobIndex) {
    if (typeof jobIndex !== 'undefined') {
      window.hg.animator.startJob(controller.persistentJobs[jobId].jobs[grid.index][jobIndex]);
    } else {
      controller.persistentJobs[jobId].jobs[grid.index].forEach(window.hg.animator.startJob);
    }
  }

  /**
   * Resizes all of the hex-grid components.
   */
  function resize() {
    internal.grids.forEach(resetGrid);
  }

  /**
   * @param {Grid} grid
   * @returns {Tile}
   */
  function getRandomOriginalTile(grid) {
    var tileIndex = parseInt(Math.random() * grid.originalTiles.length);
    return grid.originalTiles[tileIndex];
  }

  /**
   * @param {Grid} grid
   * @returns {Tile}
   */
  function getRandomContentTile(grid) {
    var contentIndex = parseInt(Math.random() * grid.contentTiles.length);
    return grid.contentTiles[contentIndex];
  }

  // --- One-time-job creation functions --- //

  /**
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @returns {Window.hg.LineJob}
   */
  function randomLineCreator(grid, tile, onComplete) {
    return window.hg.LineJob.createRandomLineJob(grid, onComplete);
  }

  /**
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @returns {Window.hg.LinesRadiateJob}
   */
  function linesRadiateCreator(grid, tile, onComplete) {
    var job = new window.hg.LinesRadiateJob(grid, tile, onAllLinesComplete);

    // Also store references to each of the individual child lines
    job.lineJobs.forEach(function (lineJob) {
      controller.transientJobs.line.jobs[grid.index].push(lineJob);
    });

    return job;

    // ---  --- //

    function onAllLinesComplete() {
      // Destroy the references to the individual child lines
      job.lineJobs.forEach(function (lineJob) {
        controller.transientJobs.line.jobs[grid.index].splice(
            controller.transientJobs.line.jobs[grid.index].indexOf(lineJob), 1);
      });

      onComplete();
    }
  }

  // --- One-time-job random creation functions --- //

  /**
   * @param {Grid} grid
   * @returns {?Window.hg.OpenPostJob}
   */
  function openRandomPost(grid) {
    // If no post is open, pick a random content tile, and open the post; otherwise, do nothing
    if (!grid.isPostOpen) {
      return controller.transientJobs.openPost.create(grid, getRandomContentTile(grid));
    } else {
      return null;
    }
  }

  /**
   * @param {Grid} grid
   * @returns {?Window.hg.ClosePostJob}
   */
  function closePost(grid) {
    // If a post is open, close it; otherwise, do nothing
    if (grid.isPostOpen) {
      return controller.transientJobs.closePost.create(grid, grid.expandedTile);
    } else {
      return null;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Creates a Grid object and registers it with the animator.
   *
   * @param {HTMLElement} parent
   * @param {Array.<Object>} tileData
   * @param {Boolean} isVertical
   * @returns {Window.hg.Grid}
   */
  function createNewHexGrid(parent, tileData, isVertical) {
    var grid, index, annotations, input;

    index = internal.grids.length;

    initializeJobArraysForGrid(index);

    grid = new window.hg.Grid(index, parent, tileData, isVertical);
    internal.grids.push(grid);

    annotations = grid.annotations;
    internal.annotations.push(annotations);

    input = new window.hg.Input(grid);
    internal.inputs.push(input);

    window.hg.animator.startJob(grid);

    controller.persistentJobs.colorReset.create(grid);
    controller.persistentJobs.displacementReset.create(grid);

    window.hg.animator.startJob(annotations);

    controller.persistentJobs.colorShift.create(grid);
    controller.persistentJobs.colorWave.create(grid);
    controller.persistentJobs.displacementWave.create(grid);

    startRecurringAnimations(grid);

    return grid;

    // ---  --- //

    function initializeJobArraysForGrid(index) {
      Object.keys(controller.persistentJobs).forEach(function (key) {
        controller.persistentJobs[key].jobs[index] = [];
      });

      Object.keys(controller.transientJobs).forEach(function (key) {
        controller.transientJobs[key].jobs[index] = [];
      });
    }
  }

  /**
   * @param {Grid} grid
   */
  function resetGrid(grid) {
    var expandedTile;
    var expandedPostId = grid.isPostOpen ? grid.expandedTile.postData.id : null;

    window.hg.animator.cancelAll();

    grid.resize();

    resetPersistentJobs(grid);

    if (expandedPostId) {
      expandedTile = getTileFromPostId(grid, expandedPostId);
      controller.transientJobs.openPost.create(grid, expandedTile);
    }

    // ---  --- //

    function getTileFromPostId(grid, postId) {
      var i, count;

      for (i = 0, count = grid.originalTiles.length; i < count; i += 1) {
        if (grid.originalTiles[i].holdsContent && grid.originalTiles[i].postData.id === postId) {
          return grid.originalTiles[i];
        }
      }

      return null;
    }
  }

  /**
   * @param {Grid} grid
   */
  function resetPersistentJobs(grid) {
    window.hg.animator.startJob(grid);

    controller.persistentJobs.colorReset.start(grid);
    controller.persistentJobs.displacementReset.start(grid);

    window.hg.animator.startJob(internal.annotations[grid.index]);

    controller.persistentJobs.colorShift.start(grid);
    controller.persistentJobs.colorWave.start(grid);
    controller.persistentJobs.displacementWave.start(grid);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  controller.config = config;

  controller.createNewHexGrid = createNewHexGrid;
  controller.resetGrid = resetGrid;
  controller.resetPersistentJobs = resetPersistentJobs;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.controller = controller;

  window.addEventListener('resize', resize, false);

  console.log('controller module loaded');
})();

/**
 * This module defines a collection of static general utility functions.
 *
 * @module util
 */
(function () {
  /**
   * Adds an event listener for each of the given events to each of the given elements.
   *
   * @param {Array.<HTMLElement>} elements The elements to add event listeners to.
   * @param {Array.<String>} events The event listeners to add to the elements.
   * @param {Function} callback The single callback for handling the events.
   */
  function listenToMultipleForMultiple(elements, events, callback) {
    elements.forEach(function (element) {
      events.forEach(function (event) {
        util.listen(element, event, callback);
      });
    });
  }

  /**
   * Creates a DOM element with the given tag name, appends it to the given parent element, and
   * gives it the given id and classes.
   *
   * @param {String} tagName The tag name to give the new element.
   * @param {HTMLElement} [parent] The parent element to append the new element to.
   * @param {String} [id] The id to give the new element.
   * @param {Array.<String>} [classes] The classes to give the new element.
   * @returns {HTMLElement} The new element.
   */
  function createElement(tagName, parent, id, classes) {
    var element = document.createElement(tagName);
    if (parent) {
      parent.appendChild(element);
    }
    if (id) {
      element.id = id;
    }
    if (classes) {
      classes.forEach(function (className) {
        addClass(element, className)
      });
    }
    return element;
  }

  /**
   * Determines whether the given element contains the given class.
   *
   * @param {HTMLElement} element The element to check.
   * @param {String} className The class to check for.
   * @returns {Boolean} True if the element does contain the class.
   */
  function containsClass(element, className) {
    var startIndex, indexAfterEnd;
    startIndex = element.className.indexOf(className);
    if (startIndex >= 0) {
      if (startIndex === 0 || element.className[startIndex - 1] === ' ') {
        indexAfterEnd = startIndex + className.length;
        if (indexAfterEnd === element.className.length ||
            element.className[indexAfterEnd] === ' ') {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Toggles whether the given element has the given class. If the enabled argument is given, then
   * the inclusion of the class will be forced. That is, if enabled=true, then this will ensure the
   * element has the class; if enabled=false, then this will ensure the element does NOT have the
   * class; if enabled=undefined, then this will simply toggle whether the element has the class.
   *
   * @param {HTMLElement} element The element to add the class to or remove the class from.
   * @param {String} className The class to add or remove.
   * @param {Boolean} [enabled] If given, then the inclusion of the class will be forced.
   */
  function toggleClass(element, className, enabled) {
    if (typeof enabled === 'undefined') {
      if (containsClass(element, className)) {
        removeClass(element, className);
      } else {
        addClass(element, className);
      }
    } else if (enabled) {
      addClass(element, className);
    } else {
      removeClass(element, className);
    }
  }

  /**
   * Gets the coordinates of the element relative to the top-left corner of the page.
   *
   * @param {HTMLElement} element The element to get the coordinates of.
   * @returns {{x: Number, y: Number}} The coordinates of the element relative to the top-left
   * corner of the page.
   */
  function getPageOffset(element) {
    var x = 0, y = 0;
    while (element) {
      x += element.offsetLeft;
      y += element.offsetTop;
      element = element.offsetParent;
    }
    x -= util.getScrollLeft();
    y -= util.getScrollTop();
    return { x: x, y: y };
  }

  /**
   * Gets the dimensions of the viewport.
   *
   * @returns {{w: Number, h: Number}} The dimensions of the viewport.
   */
  function getViewportSize() {
    var w, h;
    if (typeof window.innerWidth !== 'undefined') {
      // Good browsers
      w = window.innerWidth;
      h = window.innerHeight;
    } else if (typeof document.documentElement !== 'undefined' &&
        typeof document.documentElement.clientWidth !== 'undefined' &&
        document.documentElement.clientWidth !== 0) {
      // IE6 in standards compliant mode
      w = document.documentElement.clientWidth;
      h = document.documentElement.clientHeight;
    } else {
      // Older versions of IE
      w = document.getElementsByTagName('body')[0].clientWidth;
      h = document.getElementsByTagName('body')[0].clientHeight;
    }
    return { w: w, h: h };
  }

  /**
   * Removes the given child element from the given parent element if the child does indeed belong
   * to the parent.
   *
   * @param {HTMLElement} parent The parent to remove the child from.
   * @param {HTMLElement} child The child to remove.
   * @returns {Boolean} True if the child did indeed belong to the parent.
   */
  function removeChildIfPresent(parent, child) {
    if (child && child.parentNode === parent) {
      parent.removeChild(child);
      return true;
    }
    return false
  }

  /**
   * Adds the given class to the given element.
   *
   * @param {HTMLElement} element The element to add the class to.
   * @param {String} className The class to add.
   */
  function addClass(element, className) {
    element.setAttribute('class', element.className + ' ' + className);
  }

  /**
   * Removes the given class from the given element.
   *
   * @param {HTMLElement} element The element to remove the class from.
   * @param {String} className The class to remove.
   */
  function removeClass(element, className) {
    element.setAttribute('class', element.className.split(' ').filter(function (value) {
      return value !== className;
    }).join(' '));
  }

  /**
   * Removes all classes from the given element.
   *
   * @param {HTMLElement} element The element to remove all classes from.
   */
  function clearClasses(element) {
    element.className = '';
  }

  /**
   * Calculates the width that the DOM would give to a div with the given text. The given tag
   * name, parent, id, and classes allow the width to be affected by various CSS rules.
   *
   * @param {String} text The text to determine the width of.
   * @param {String} tagName The tag name this text would supposedly have.
   * @param {HTMLElement} [parent] The parent this text would supposedly be a child of; defaults
   * to the document body.
   * @param {String} [id] The id this text would supposedly have.
   * @param {Array.<String>} [classes] The classes this text would supposedly have.
   * @returns {Number} The width of the text under these conditions.
   */
  function getTextWidth(text, tagName, parent, id, classes) {
    var tmpElement, width;
    parent = parent || document.getElementsByTagName('body')[0];
    tmpElement = util.createElement(tagName, null, id, classes);
    tmpElement.style.position = 'absolute';
    tmpElement.style.visibility = 'hidden';
    tmpElement.style.whiteSpace = 'nowrap';
    parent.appendChild(tmpElement);
    tmpElement.innerHTML = text;
    width = tmpElement.clientWidth;
    parent.removeChild(tmpElement);
    return width;
  }

  /**
   * Encodes and concatenates the given URL parameters into a single query string.
   *
   * @param {Object} rawParams An object whose properties represent the URL query string
   * parameters.
   * @return {String} The query string.
   */
  function encodeQueryString(rawParams) {
    var parameter, encodedParams;
    encodedParams = [];
    for (parameter in rawParams) {
      if (rawParams.hasOwnProperty(parameter)) {
        encodedParams.push(encodeURIComponent(parameter) + '=' +
            encodeURIComponent(rawParams[parameter]));
      }
    }
    return '?' + encodedParams.join('&');
  }

  /**
   * Retrieves the value corresponding to the given name from the given query string.
   *
   * (borrowed from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript)
   *
   * @param {String} queryString The query string containing the parameter.
   * @param {String} name The (non-encoded) name of the parameter value to retrieve.
   * @returns {String} The query string parameter value, or null if the parameter was not found.
   */
  function getQueryStringParameterValue(queryString, name) {
    var regex, results;
    name = encodeURIComponent(name);
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    regex = new RegExp('[\\?&]' + name + '=([^&#]*)', 'i');
    results = regex.exec(queryString);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }

  /**
   * Sets the CSS transition duration style of the given element.
   *
   * @param {HTMLElement} element The element.
   * @param {Number} value The duration.
   */
  function setTransitionDurationSeconds(element, value) {
    element.style.transitionDuration = value + 's';
    element.style.WebkitTransitionDuration = value + 's';
    element.style.MozTransitionDuration = value + 's';
    element.style.msTransitionDuration = value + 's';
    element.style.OTransitionDuration = value + 's';
  }

  /**
   * Sets the CSS transition delay style of the given element.
   *
   * @param {HTMLElement} element The element.
   * @param {Number} value The delay.
   */
  function setTransitionDelaySeconds(element, value) {
    element.style.transitionDelay = value + 's';
    element.style.WebkitTransitionDelay = value + 's';
    element.style.MozTransitionDelay = value + 's';
    element.style.msTransitionDelay = value + 's';
    element.style.OTransitionDelay = value + 's';
  }

  /**
   * Sets the userSelect style of the given element to 'none'.
   *
   * @param {HTMLElement} element
   */
  function setUserSelectNone(element) {
    element.style.userSelect = 'none';
    element.style.webkitUserSelect = 'none';
    element.style.MozUserSelect = 'none';
    element.style.msUserSelect = 'none';
  }

  /**
   * Removes any children elements from the given parent that have the given class.
   *
   * @param {HTMLElement} parent The parent to remove children from.
   * @param {String} className The class to match.
   */
  function removeChildrenWithClass(parent, className) {
    var matchingChildren, i, count;

    matchingChildren = parent.querySelectorAll('.' + className);

    for (i = 0, count = matchingChildren.length; i < count; i++) {
      parent.removeChild(matchingChildren[i]);
    }
  }

  /**
   * Sets the CSS transition-timing-function style of the given element with the given cubic-
   * bezier points.
   *
   * @param {HTMLElement} element The element.
   * @param {{p1x: Number, p1y: Number, p2x: Number, p2y: Number}} bezierPts The cubic-bezier
   * points to use for this timing function.
   */
  function setTransitionCubicBezierTimingFunction(element, bezierPts) {
    var value = 'cubic-bezier(' + bezierPts.p1x + ',' + bezierPts.p1y + ',' + bezierPts.p2x + ',' +
        bezierPts.p2y + ')';
    element.style.transitionTimingFunction = value;
    element.style.WebkitTransitionTimingFunction = value;
    element.style.MozTransitionTimingFunction = value;
    element.style.msTransitionTimingFunction = value;
    element.style.OTransitionTimingFunction = value;
  }

  // A collection of different types of easing functions.
  var easingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return t * t;
    },
    easeOutQuad: function (t) {
      return t * (2 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    easeInCubic: function (t) {
      return t * t * t;
    },
    easeOutCubic: function (t) {
      return 1 + --t * t * t;
    },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeInQuart: function (t) {
      return t * t * t * t;
    },
    easeOutQuart: function (t) {
      return 1 - --t * t * t * t;
    },
    easeInOutQuart: function (t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    easeInQuint: function (t) {
      return t * t * t * t * t;
    },
    easeOutQuint: function (t) {
      return 1 + --t * t * t * t * t;
    },
    easeInOutQuint: function (t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  // A collection of the inverses of different types of easing functions.
  var inverseEasingFunctions = {
    linear: function (t) {
      return t;
    },
    easeInQuad: function (t) {
      return Math.sqrt(t);
    },
    easeOutQuad: function (t) {
      return 1 - Math.sqrt(1 - t);
    },
    easeInOutQuad: function (t) {
      return t < 0.5 ? Math.sqrt(t * 0.5) : 1 - 0.70710678 * Math.sqrt(1 - t);
    }
  };

  /**
   * A cross-browser compatible requestAnimationFrame. From
   * https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
   *
   * @type {Function}
   */
  var requestAnimationFrame =
      (window.requestAnimationFrame || // the standard
      window.webkitRequestAnimationFrame || // chrome/safari
      window.mozRequestAnimationFrame || // firefox
      window.oRequestAnimationFrame || // opera
      window.msRequestAnimationFrame || // ie
      function (callback) { // default
        window.setTimeout(callback, 16); // 60fps
      }).bind(window);

  /**
   * Calculates the x and y coordinates represented by the given Bezier curve at the given
   * percentage.
   *
   * @param {Number} percent Expressed as a number between 0 and 1.
   * @param {Array.<{x:Number,y:Number}>} controlPoints
   * @returns {{x:Number,y:Number}}
   */
  function getXYFromPercentWithBezier(percent, controlPoints) {
    var x, y, oneMinusPercent, tmp1, tmp2, tmp3, tmp4;

    oneMinusPercent = 1 - percent;
    tmp1 = oneMinusPercent * oneMinusPercent * oneMinusPercent;
    tmp2 = 3 * percent * oneMinusPercent * oneMinusPercent;
    tmp3 = 3 * percent * percent * oneMinusPercent;
    tmp4 = percent * percent * percent;

    x = controlPoints[0].x * tmp1 +
        controlPoints[1].x * tmp2 +
        controlPoints[2].x * tmp3 +
        controlPoints[3].x * tmp4;
    y = controlPoints[0].y * tmp1 +
        controlPoints[1].y * tmp2 +
        controlPoints[2].y * tmp3 +
        controlPoints[3].y * tmp4;

    return {x: x, y: y};
  }

  /**
   * Applies the given transform to the given element as a CSS style in a cross-browser compatible
   * manner.
   *
   * @param {HTMLElement} element
   * @param {String} transform
   */
  function applyTransform(element, transform) {
    element.style.webkitTransform = transform;
    element.style.MozTransform = transform;
    element.style.msTransform = transform;
    element.style.OTransform = transform;
    element.style.transform = transform;
  }

  /**
   * Returns a copy of the given array with its contents re-arranged in a random order.
   *
   * The original array is left in its original order.
   *
   * @param {Array} array
   * @returns {Array}
   */
  function shuffle(array) {
    var i, j, count, temp;

    for (i = 0, count = array.length; i < count; i += 1) {
      j = parseInt(Math.random() * count);
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }

    return array;
  }

  /**
   * Return true if the given point would be located within the given polyline if its two ends
   * were connected.
   *
   * If the given boolean is true, then the given polyline is interpreted as being a polygon--i.e.
   * the first and last points are equivalent.
   *
   * This is an implementation of the even-odd rule algorithm.
   *
   * @param {Number} pointX
   * @param {Number} pointY
   * @param {Array.<Number>} coordinates
   * @param {Boolean} isClosed
   */
  function isPointInsidePolyline(pointX, pointY, coordinates, isClosed) {
    var pointIsInside, i, count, p1X, p1Y, p2X, p2Y, previousX, previousY, currentX, currentY;

    pointIsInside = false;

    if (isClosed) {
      // There is no area within a straight line
      if (coordinates.length < 6) {
        return pointIsInside;
      }

      previousX = coordinates[coordinates.length - 4];
      previousY = coordinates[coordinates.length - 3];
    } else {
      // There is no area within a straight line
      if (coordinates.length < 4) {
        return pointIsInside;
      }

      previousX = coordinates[coordinates.length - 2];
      previousY = coordinates[coordinates.length - 1];
    }

    for (i = 0, count = coordinates.length - 2; i < count; i += 2) {
      currentX = coordinates[i];
      currentY = coordinates[i + 1];

      if (currentX > previousX) {
        p1X = previousX;
        p1Y = previousY;
        p2X = currentX;
        p2Y = currentY;
      } else {
        p1X = currentX;
        p1Y = currentY;
        p2X = previousX;
        p2Y = previousY;
      }

      if ((currentX < pointX) === (pointX <= previousX) &&
          (pointY - p1Y) * (p2X - p1X) < (p2Y - p1Y) * (pointX - p1X)) {
        pointIsInside = !pointIsInside;
      }

      previousX = currentX;
      previousY = currentY;
    }

    return pointIsInside;
  }

  /**
   * Performs a shallow copy of the given object.
   *
   * @param {Object} object
   * @returns {Object}
   */
  function shallowCopy(object) {
    var key, cloneObject;

    cloneObject = {};

    for (key in object) {
      cloneObject[key] = object[key];
    }

    return cloneObject;
  }

  /**
   * Converts the given HSL color values to HSV color values.
   *
   * @param {{h:Number,s:Number,l:Number}} hsl
   * @returns {{h:Number,s:Number,v:Number}}
   */
  function hslToHsv(hsl) {
    var temp = hsl.s * (hsl.l < 0.5 ? hsl.l : 1 - hsl.l);
    return {
      h: hsl.h,
      s: 2 * temp / (hsl.l + temp),
      v: hsl.l + temp
    };
  }

  /**
   * Converts the given HSV color values to HSL color values.
   *
   * @param {{h:Number,s:Number,v:Number}} hsv
   * @returns {{h:Number,s:Number,l:Number}}
   */
  function hsvToHsl(hsv) {
    var temp = (2 - hsv.s) * hsv.v;
    return {
      h: hsv.h,
      s: hsv.s * hsv.v / (temp < 1 ? temp : 2.00000001 - temp),
      l: temp * 0.5
    };
  }

  /**
   * Checks the given element and all of its ancestors, and returns the first that contains the
   * given class.
   *
   * @param {?HTMLElement} element
   * @param {String} className
   * @returns {?HTMLElement}
   */
  function findClassInSelfOrAncestors(element, className) {
    while (element) {
      if (window.hg.util.containsClass(element, className)) {
        return element;
      }
    }

    return null;
  }

  var utilStyleSheet;

  /**
   * Adds the given style rule to a style sheet for the current document.
   *
   * @param {String} styleRule
   */
  function addRuleToStyleSheet(styleRule) {
    // Create the custom style sheet if it doesn't already exist
    if (!utilStyleSheet) {
      utilStyleSheet = document.createElement('style');
      document.getElementsByTagName('head')[0].appendChild(utilStyleSheet);
    }

    // Add the given rule to the custom style sheet
    if (utilStyleSheet.styleSheet) {
      utilStyleSheet.styleSheet.cssText = styleRule;
    } else {
      utilStyleSheet.appendChild(document.createTextNode(styleRule));
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module

  /**
   * Exposes the static util functions.
   *
   * @global
   */
  var util = {
    listenToMultipleForMultiple: listenToMultipleForMultiple,
    createElement: createElement,
    containsClass: containsClass,
    toggleClass: toggleClass,
    getPageOffset: getPageOffset,
    getViewportSize: getViewportSize,
    removeChildIfPresent: removeChildIfPresent,
    addClass: addClass,
    removeClass: removeClass,
    clearClasses: clearClasses,
    getTextWidth: getTextWidth,
    encodeQueryString: encodeQueryString,
    getQueryStringParameterValue: getQueryStringParameterValue,
    setTransitionDurationSeconds: setTransitionDurationSeconds,
    setTransitionDelaySeconds: setTransitionDelaySeconds,
    setUserSelectNone: setUserSelectNone,
    removeChildrenWithClass: removeChildrenWithClass,
    setTransitionCubicBezierTimingFunction: setTransitionCubicBezierTimingFunction,
    easingFunctions: easingFunctions,
    inverseEasingFunctions: inverseEasingFunctions,
    requestAnimationFrame: requestAnimationFrame,
    getXYFromPercentWithBezier: getXYFromPercentWithBezier,
    applyTransform: applyTransform,
    shuffle: shuffle,
    isPointInsidePolyline: isPointInsidePolyline,
    shallowCopy: shallowCopy,
    hsvToHsl: hsvToHsl,
    hslToHsv: hslToHsv,
    findClassInSelfOrAncestors: findClassInSelfOrAncestors,
    addRuleToStyleSheet: addRuleToStyleSheet,
    svgNamespace: 'http://www.w3.org/2000/svg',
    xlinkNamespace: 'http://www.w3.org/1999/xlink'
  };

  // Expose this module
  window.hg = window.hg || {};
  window.hg.util = util;

  console.log('util module loaded');
})();

/**
 * This module defines a singleton for animating things.
 *
 * The animator singleton handles the animation loop for the application and updates all
 * registered AnimationJobs during each animation frame.
 *
 * @module animator
 */
(function () {
  /**
   * @typedef {{start: Function, update: Function(Number, Number), draw: Function, cancel: Function, init: Function, isComplete: Boolean}} AnimationJob
   */

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var animator = {};
  var config = {};

  config.deltaTimeUpperThreshold = 200;

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * This is the animation loop that drives all of the animation.
   */
  function animationLoop() {
    var currentTime, deltaTime;

    currentTime = Date.now();
    deltaTime = currentTime - animator.previousTime;
    deltaTime = deltaTime > config.deltaTimeUpperThreshold ?
        config.deltaTimeUpperThreshold : deltaTime;
    animator.isLooping = true;

    if (!animator.isPaused) {
      updateJobs(currentTime, deltaTime);
      drawJobs();
      window.hg.util.requestAnimationFrame(animationLoop);
    } else {
      animator.isLooping = false;
    }

    animator.previousTime = currentTime;
  }

  /**
   * Updates all of the active AnimationJobs.
   *
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function updateJobs(currentTime, deltaTime) {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].update(currentTime, deltaTime);

      // Remove jobs from the list after they are complete
      if (animator.jobs[i].isComplete) {
        removeJob(animator.jobs[i], i);
        i--;
        count--;
      }
    }
  }

  /**
   * Removes the given job from the collection of active, animating jobs.
   *
   * @param {AnimationJob} job
   * @param {Number} [index]
   */
  function removeJob(job, index) {
    var count;

    if (typeof index === 'number') {
      animator.jobs.splice(index, 1);
    } else {
      for (index = 0, count = animator.jobs.length; index < count; index += 1) {
        if (animator.jobs[index] === job) {
          animator.jobs.splice(index, 1);
          break;
        }
      }
    }

    // Stop the animation loop when there are no more jobs to animate
    if (animator.jobs.length === 0) {
      animator.isPaused = true;
    }
  }

  /**
   * Draws all of the active AnimationJobs.
   */
  function drawJobs() {
    var i, count;

    for (i = 0, count = animator.jobs.length; i < count; i += 1) {
      animator.jobs[i].draw();
    }
  }

  /**
   * Starts the animation loop if it is not already running
   */
  function startAnimationLoop() {
    animator.isPaused = false;
    if (!animator.isLooping) {
      animator.previousTime = Date.now();
      animationLoop();
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Starts the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function startJob(job) {
    // Is this a restart?
    if (!job.isComplete) {
      console.log('Job restarting: ' + job.constructor.name);
      job.cancel();

      job.init();// TODO: get rid of this init function
      job.start();
    } else {
      console.log('Job starting: ' + job.constructor.name);

      job.init();// TODO: get rid of this init function
      job.start();
      animator.jobs.push(job);
    }

    startAnimationLoop();
  }

  /**
   * Cancels the given AnimationJob.
   *
   * @param {AnimationJob} job
   */
  function cancelJob(job) {
    console.log('Job cancelling: ' + job.constructor.name);

    job.cancel();
    removeJob(job);
  }

  /**
   * Cancels all running AnimationJobs.
   */
  function cancelAll() {
    while (animator.jobs.length) {
      cancelJob(animator.jobs[0]);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this singleton

  animator.jobs = [];
  animator.previousTime = Date.now();
  animator.isLooping = false;
  animator.isPaused = true;
  animator.startJob = startJob;
  animator.cancelJob = cancelJob;
  animator.cancelAll = cancelAll;

  animator.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.animator = animator;

  console.log('animator module loaded');
})();

/**
 * @typedef {AnimationJob} Annotations
 */

/**
 * This module defines a constructor for Annotations objects.
 *
 * Annotations objects creates and modifies visual representations of various aspects of a
 * Grid. This can be very useful for testing purposes.
 *
 * @module Annotations
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.forceLineLengthMultiplier = 4000;
  config.velocityLineLengthMultiplier = 300;

  config.contentTileHue = 187;
  config.contentTileSaturation = 50;
  config.contentTileLightness = 30;

  config.borderTileHue = 267;
  config.borderTileSaturation = 0;
  config.borderTileLightness = 30;

  config.cornerTileHue = 267;
  config.cornerTileSaturation = 50;
  config.cornerTileLightness = 30;

  config.annotations = {
    'tileNeighborConnections': {
      enabled: false,
      create: createTileNeighborConnections,
      destroy: destroyTileNeighborConnections,
      update: updateTileNeighborConnections,
      priority: 1300
    },
    'tileAnchorCenters': {
      enabled: false,
      create: createTileAnchorCenters,
      destroy: destroyTileAnchorCenters,
      update: updateTileAnchorCenters,
      priority: 500
    },
    'transparentTiles': {
      enabled: false,
      create: makeTilesTransparent,
      destroy: makeTilesVisible,
      update: function () {},
      priority: 400
    },
    'tileIndices': {
      enabled: false,
      create: createTileIndices,
      destroy: destroyTileIndices,
      update: updateTileIndices,
      priority: 1000
    },
    'tileForces': {
      enabled: false,
      create: createTileForces,
      destroy: destroyTileForces,
      update: updateTileForces,
      priority: 1100
    },
    'tileVelocities': {
      enabled: false,
      create: createTileVelocities,
      destroy: destroyTileVelocities,
      update: updateTileVelocities,
      priority: 1200
    },
    'sectorColors': {
      enabled: false,
      create: fillSectorColors,
      destroy: function () {},
      update: fillSectorColors,
      priority: 0
    },
    'borderTiles': {
      enabled: false,
      create: fillBorderTiles,
      destroy: function () {},
      update: fillBorderTiles,
      priority: 200
    },
    'contentTiles': {
      enabled: false,
      create: fillContentTiles,
      destroy: function () {},
      update: fillContentTiles,
      priority: 100
    },
    'cornerTiles': {
      enabled: false,
      create: fillCornerTiles,
      destroy: function () {},
      update: fillCornerTiles,
      priority: 300
    },
    'tileParticleCenters': {
      enabled: false,
      create: createTileParticleCenters,
      destroy: destroyTileParticleCenters,
      update: updateTileParticleCenters,
      priority: 600
    },
    'tileDisplacementColors': {
      enabled: false,
      create: createTileDisplacementColors,
      destroy: destroyTileDisplacementColors,
      update: updateTileDisplacementColors,
      priority: 700
    },
    'tileInnerRadii': {
      enabled: false,
      create: createTileInnerRadii,
      destroy: destroyTileInnerRadii,
      update: updateTileInnerRadii,
      priority: 800
    },
    'tileOuterRadii': {
      enabled: false,
      create: createTileOuterRadii,
      destroy: destroyTileOuterRadii,
      update: updateTileOuterRadii,
      priority: 900
    },
    'contentAreaGuidelines': {
      enabled: false,
      create: drawContentAreaGuideLines,
      destroy: removeContentAreaGuideLines,
      update:  function () {},
      priority: 1400
    },
    'lineAnimationGapPoints': {
      enabled: false,
      create: function () {},
      destroy: destroyLineAnimationGapPoints,
      update:  updateLineAnimationGapPoints,
      priority: 1500
    },
    'lineAnimationCornerData': {
      enabled: false,
      create: function () {},
      destroy: destroyLineAnimationCornerConfigurations,
      update:  updateLineAnimationCornerConfigurations,
      priority: 1600
    },
    'panCenterPoints': {
      enabled: false,
      create: createPanCenterPoints,
      destroy: destroyPanCenterPoints,
      update: updatePanCenterPoints,
      priority: 1700
    },
    'sectorAnchorCenters': {
      enabled: false,
      create: createSectorAnchorCenters,
      destroy: destroySectorAnchorCenters,
      update: updateSectorAnchorCenters,
      priority: 1800
    }
  };

  config.annotationsArray = [];

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.annotationsArray = Object.keys(config.annotations).map(function (key) {
      return config.annotations[key];
    });

    config.annotationsArray.sort(function comparator(a, b) {
      return a.priority - b.priority;
    });
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // --------------------------------------------------- //
  // Annotation creation functions

  /**
   * Draws content tiles with a different color.
   *
   * @this Annotations
   */
  function fillContentTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.originalTiles.length; i < count; i += 1) {
      if (annotations.grid.originalTiles[i].holdsContent) {
        annotations.grid.originalTiles[i].currentColor.h = config.contentTileHue;
        annotations.grid.originalTiles[i].currentColor.s = config.contentTileSaturation;
        annotations.grid.originalTiles[i].currentColor.l = config.contentTileLightness;
      }
    }
  }

  /**
   * Draws border tiles with a different color.
   *
   * @this Annotations
   */
  function fillBorderTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      if (annotations.grid.allTiles[i].getIsBorderTile()) {
        annotations.grid.allTiles[i].currentColor.h = config.borderTileHue;
        annotations.grid.allTiles[i].currentColor.s = config.borderTileSaturation;
        annotations.grid.allTiles[i].currentColor.l = config.borderTileLightness;
      }
    }
  }

  /**
   * Draws corner tiles with a different color.
   *
   * @this Annotations
   */
  function fillCornerTiles() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.originalBorderTiles.length; i < count; i += 1) {
      if (annotations.grid.originalBorderTiles[i].isCornerTile) {
        annotations.grid.originalTiles[i].currentColor.h = config.cornerTileHue;
        annotations.grid.originalTiles[i].currentColor.s = config.cornerTileSaturation;
        annotations.grid.originalTiles[i].currentColor.l = config.cornerTileLightness;
      }
    }
  }

  /**
   * Draws all of the tiles as transparent.
   *
   * @this Annotations
   */
  function makeTilesTransparent() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.grid.allTiles[i].element.setAttribute('opacity', '0');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this Annotations
   */
  function drawContentAreaGuideLines() {
    var annotations, line;

    annotations = this;
    annotations.contentAreaGuideLines = [];

    line = document.createElementNS(window.hg.util.svgNamespace, 'line');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[0] = line;

    line.setAttribute('x1', annotations.grid.contentAreaLeft);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaLeft);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');

    line = document.createElementNS(window.hg.util.svgNamespace, 'line');
    annotations.grid.svg.appendChild(line);
    annotations.contentAreaGuideLines[1] = line;

    line.setAttribute('x1', annotations.grid.contentAreaRight);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', annotations.grid.contentAreaRight);
    line.setAttribute('y2', annotations.grid.height);
    line.setAttribute('stroke', 'red');
    line.setAttribute('stroke-width', '2');
  }

  /**
   * Creates a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function createTileParticleCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileParticleCenters = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileParticleCenters[i]);

      annotations.tileParticleCenters[i].setAttribute('r', '4');
      annotations.tileParticleCenters[i].setAttribute('fill', 'gray');
    }
  }

  /**
   * Creates a dot at the center of each tile at its currentAnchor position.
   *
   * @this Annotations
   */
  function createTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;
    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.tileAnchorLines[i]);

      annotations.tileAnchorLines[i].setAttribute('stroke', '#666666');
      annotations.tileAnchorLines[i].setAttribute('stroke-width', '2');

      annotations.tileAnchorCenters[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileAnchorCenters[i]);

      annotations.tileAnchorCenters[i].setAttribute('r', '4');
      annotations.tileAnchorCenters[i].setAttribute('fill', '#888888');
    }
  }

  /**
   * Creates a circle over each tile at its currentAnchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this Annotations
   */
  function createTileDisplacementColors() {
    var annotations, i, count;

    annotations = this;
    annotations.tileDisplacementCircles = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileDisplacementCircles[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileDisplacementCircles[i]);

      annotations.tileDisplacementCircles[i].setAttribute('r', '80');
      annotations.tileDisplacementCircles[i].setAttribute('opacity', '0.4');
      annotations.tileDisplacementCircles[i].setAttribute('fill', 'white');
    }
  }

  /**
   * Creates the inner radius of each tile.
   *
   * @this Annotations
   */
  function createTileInnerRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileInnerRadii = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileInnerRadii[i]);

      annotations.tileInnerRadii[i].setAttribute('stroke', 'blue');
      annotations.tileInnerRadii[i].setAttribute('stroke-width', '1');
      annotations.tileInnerRadii[i].setAttribute('fill', 'transparent');
    }
  }

  /**
   * Creates the outer radius of each tile.
   *
   * @this Annotations
   */
  function createTileOuterRadii() {
    var annotations, i, count;

    annotations = this;
    annotations.tileOuterRadii = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.tileOuterRadii[i]);

      annotations.tileOuterRadii[i].setAttribute('stroke', 'green');
      annotations.tileOuterRadii[i].setAttribute('stroke-width', '1');
      annotations.tileOuterRadii[i].setAttribute('fill', 'transparent');
    }
  }

  /**
   * Creates lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function createTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighborStates, neighbor;

    annotations = this;
    annotations.neighborLines = [];

    for (i = 0, iCount = annotations.grid.allTiles.length; i < iCount; i += 1) {
      tile = annotations.grid.allTiles[i];
      neighborStates = tile.getNeighborStates();
      annotations.neighborLines[i] = [];

      for (j = 0, jCount = neighborStates.length; j < jCount; j += 1) {
        neighbor = neighborStates[j];

        if (neighbor) {
          annotations.neighborLines[i][j] =
              document.createElementNS(window.hg.util.svgNamespace, 'line');
          annotations.grid.svg.appendChild(annotations.neighborLines[i][j]);

          annotations.neighborLines[i][j].setAttribute('stroke', 'purple');
          annotations.neighborLines[i][j].setAttribute('stroke-width', '1');
        }
      }
    }
  }

  /**
   * Creates lines representing the cumulative force acting on each tile.
   *
   * @this Annotations
   */
  function createTileForces() {
    var annotations, i, count;

    annotations = this;
    annotations.forceLines = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.forceLines[i] = document.createElementNS(window.hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.forceLines[i]);

      annotations.forceLines[i].setAttribute('stroke', 'orange');
      annotations.forceLines[i].setAttribute('stroke-width', '2');
    }
  }

  /**
   * Creates lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function createTileVelocities() {
    var annotations, i, count;

    annotations = this;
    annotations.velocityLines = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.velocityLines[i] = document.createElementNS(window.hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.velocityLines[i]);

      annotations.velocityLines[i].setAttribute('stroke', 'red');
      annotations.velocityLines[i].setAttribute('stroke-width', '2');
    }
  }

  /**
   * Creates the index of each tile.
   *
   * @this Annotations
   */
  function createTileIndices() {
    var annotations, i, count;

    annotations = this;
    annotations.indexTexts = [];

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.indexTexts[i] = document.createElementNS(window.hg.util.svgNamespace, 'text');
      annotations.indexTexts[i].innerHTML =
          !isNaN(annotations.grid.allTiles[i].originalIndex) ? annotations.grid.allTiles[i].originalIndex : '?';
      annotations.grid.svg.appendChild(annotations.indexTexts[i]);

      annotations.indexTexts[i].setAttribute('font-size', '16');
      annotations.indexTexts[i].setAttribute('fill', 'black');
      annotations.indexTexts[i].setAttribute('pointer-events', 'none');
    }
  }

  /**
   * Draws the tiles of each Sector with a different color.
   *
   * @this Annotations
   */
  function fillSectorColors() {
    var annotations, i, iCount, j, jCount, sector, sectorHue;

    annotations = this;

    for (i = 0, iCount = annotations.grid.sectors.length; i < iCount; i += 1) {
      sector = annotations.grid.sectors[i];
      sectorHue = 60 * i + 20;

      for (j = 0, jCount = sector.tiles.length; j < jCount; j += 1) {
        sector.tiles[j].currentColor.h = sectorHue;
        sector.tiles[j].currentColor.s = window.hg.Grid.config.tileSaturation;
        sector.tiles[j].currentColor.l = window.hg.Grid.config.tileLightness;
      }
    }
  }

  /**
   * Creates a dot at the center of the grid, the center of the viewport, and highlights the base tile for the current
   * pan.
   *
   * @this Annotations
   */
  function createPanCenterPoints() {
    var annotations;

    annotations = this;

    // Current grid center dot
    annotations.currentGridCenterDot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
    annotations.grid.svg.appendChild(annotations.currentGridCenterDot);

    annotations.currentGridCenterDot.setAttribute('r', '8');
    annotations.currentGridCenterDot.setAttribute('fill', 'chartreuse');

    // Current pan center dot
    annotations.panCenterDot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
    annotations.grid.svg.appendChild(annotations.panCenterDot);

    annotations.panCenterDot.setAttribute('r', '5');
    annotations.panCenterDot.setAttribute('fill', 'red');

    // Original grid center dot
    annotations.originalGridCenterDot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
    annotations.grid.svg.appendChild(annotations.originalGridCenterDot);

    annotations.originalGridCenterDot.setAttribute('r', '2');
    annotations.originalGridCenterDot.setAttribute('fill', 'yellow');
  }

  /**
   * Creates a dot at the anchor position of each sector.
   *
   * @this Annotations
   */
  function createSectorAnchorCenters() {
    var annotations, i;

    annotations = this;
    annotations.sectorAnchorLines = [];
    annotations.sectorAnchorCenters = [];

    for (i = 0; i < annotations.grid.sectors.length; i += 1) {
      annotations.sectorAnchorLines[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'line');
      annotations.grid.svg.appendChild(annotations.sectorAnchorLines[i]);

      annotations.sectorAnchorLines[i].setAttribute('stroke', '#999999');
      annotations.sectorAnchorLines[i].setAttribute('stroke-width', '2');

      annotations.sectorAnchorCenters[i] =
          document.createElementNS(window.hg.util.svgNamespace, 'circle');
      annotations.grid.svg.appendChild(annotations.sectorAnchorCenters[i]);

      annotations.sectorAnchorCenters[i].setAttribute('r', '5');
      annotations.sectorAnchorCenters[i].setAttribute('fill', '#BBBBBB');
    }
  }

  // --------------------------------------------------- //
  // Annotation destruction functions

  /**
   * Draws all of the tiles as transparent.
   *
   * @this Annotations
   */
  function makeTilesVisible() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.originalTiles.length; i < count; i += 1) {
      annotations.grid.originalTiles[i].element.setAttribute('opacity', '1');
    }
  }

  /**
   * Draws vertical guidelines along the left and right sides of the main content area.
   *
   * @this Annotations
   */
  function removeContentAreaGuideLines() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.contentAreaGuideLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.contentAreaGuideLines[i]);
    }

    annotations.contentAreaGuideLines = [];
  }

  /**
   * Destroys a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function destroyTileParticleCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileParticleCenters.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileParticleCenters[i]);
    }

    annotations.tileParticleCenters = [];
  }

  /**
   * Destroys a dot at the center of each tile at its currentAnchor position.
   *
   * @this Annotations
   */
  function destroyTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileAnchorLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileAnchorLines[i]);
      annotations.grid.svg.removeChild(annotations.tileAnchorCenters[i]);
    }

    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];
  }

  /**
   * Destroys a circle over each tile at its currentAnchor position, which will be used to show colors
   * that indicate its displacement from its original position.
   *
   * @this Annotations
   */
  function destroyTileDisplacementColors() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileDisplacementCircles.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileDisplacementCircles[i]);
    }

    annotations.tileDisplacementCircles = [];
  }

  /**
   * Destroys the inner radius of each tile.
   *
   * @this Annotations
   */
  function destroyTileInnerRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileInnerRadii.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileInnerRadii[i]);
    }

    annotations.tileInnerRadii = [];
  }

  /**
   * Destroys the outer radius of each tile.
   *
   * @this Annotations
   */
  function destroyTileOuterRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.tileOuterRadii.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.tileOuterRadii[i]);
    }

    annotations.tileOuterRadii = [];
  }

  /**
   * Destroys lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function destroyTileNeighborConnections() {
    var annotations, i, j, iCount, jCount;

    annotations = this;

    for (i = 0, iCount = annotations.neighborLines.length; i < iCount; i += 1) {
      for (j = 0, jCount = annotations.neighborLines[i].length; j < jCount; j += 1) {
        if (annotations.neighborLines[i][j]) {
          annotations.grid.svg.removeChild(annotations.neighborLines[i][j]);
        }
      }
    }

    annotations.neighborLines = [];
  }

  /**
   * Destroys lines representing the cumulative force acting on each tile.
   *
   * @this Annotations
   */
  function destroyTileForces() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.forceLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.forceLines[i]);
    }

    annotations.forceLines = [];
  }

  /**
   * Destroys lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function destroyTileVelocities() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.velocityLines.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.velocityLines[i]);
    }

    annotations.velocityLines = [];
  }

  /**
   * Destroys the index of each tile.
   *
   * @this Annotations
   */
  function destroyTileIndices() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.indexTexts.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.indexTexts[i]);
    }

    annotations.indexTexts = [];
  }

  /**
   * Destroys the dots at the positions of each corner gap point of each line animation.
   *
   * @this Annotations
   */
  function destroyLineAnimationGapPoints() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.lineAnimationGapDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationGapDots[i]);
    }

    annotations.lineAnimationGapDots = [];
  }

  /**
   * Destroys annotations describing the corner configurations of each line animation.
   *
   * @this Annotations
   */
  function destroyLineAnimationCornerConfigurations() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.lineAnimationSelfCornerDots.length; i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationSelfCornerDots[i]);
    }

    for (i = 0, count = annotations.lineAnimationLowerNeighborCornerDots.length;
         i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationLowerNeighborCornerDots[i]);
    }

    for (i = 0, count = annotations.lineAnimationUpperNeighborCornerDots.length;
         i < count; i += 1) {
      annotations.grid.svg.removeChild(annotations.lineAnimationUpperNeighborCornerDots[i]);
    }

    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];
  }

  /**
   * Destroys the dots at the center of the grid and the center of the viewport and stops highlighting the base tile
   * for the current pan.
   *
   * @this Annotations
   */
  function destroyPanCenterPoints() {
    var annotations;

    annotations = this;

    if (annotations.originalGridCenterDot) {
      annotations.grid.svg.removeChild(annotations.originalGridCenterDot);
      annotations.grid.svg.removeChild(annotations.currentGridCenterDot);
      annotations.grid.svg.removeChild(annotations.panCenterDot);

      annotations.originalGridCenterDot = null;
      annotations.currentGridCenterDot = null;
      annotations.panCenterDot = null;
    }
  }

  /**
   * Destroys a dot at the anchor position of each sector.
   *
   * @this Annotations
   */
  function destroySectorAnchorCenters() {
    var annotations, i;

    annotations = this;

    for (i = 0; i < annotations.sectorAnchorLines.length; i += 1) {
      annotations.grid.svg.removeChild(annotations.sectorAnchorLines[i]);
      annotations.grid.svg.removeChild(annotations.sectorAnchorCenters[i]);
    }

    annotations.sectorAnchorLines = [];
    annotations.sectorAnchorCenters = [];
  }

  // --------------------------------------------------- //
  // Annotation updating functions

  /**
   * Updates a dot at the center of each tile at its current position.
   *
   * @this Annotations
   */
  function updateTileParticleCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileParticleCenters[i].setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileParticleCenters[i].setAttribute('cy', annotations.grid.allTiles[i].particle.py);
    }
  }

  /**
   * Updates a dot at the center of each tile at its currentAnchor position.
   *
   * @this Annotations
   */
  function updateTileAnchorCenters() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileAnchorLines[i].setAttribute('x1', annotations.grid.allTiles[i].particle.px);
      annotations.tileAnchorLines[i].setAttribute('y1', annotations.grid.allTiles[i].particle.py);
      annotations.tileAnchorLines[i].setAttribute('x2', annotations.grid.allTiles[i].currentAnchor.x);
      annotations.tileAnchorLines[i].setAttribute('y2', annotations.grid.allTiles[i].currentAnchor.y);
      annotations.tileAnchorCenters[i].setAttribute('cx', annotations.grid.allTiles[i].currentAnchor.x);
      annotations.tileAnchorCenters[i].setAttribute('cy', annotations.grid.allTiles[i].currentAnchor.y);
    }
  }

  /**
   * Updates the color of a circle over each tile at its currentAnchor position according to its
   * displacement from its original position.
   *
   * @this Annotations
   */
  function updateTileDisplacementColors() {
    var annotations, i, count, deltaX, deltaY, angle, distance, colorString;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      deltaX = annotations.grid.allTiles[i].particle.px - annotations.grid.allTiles[i].originalAnchor.x;
      deltaY = annotations.grid.allTiles[i].particle.py - annotations.grid.allTiles[i].originalAnchor.y;

      angle = Math.atan2(deltaX, deltaY) * 180 / Math.PI;
      distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      colorString = 'hsl(' + angle + ',' +
          distance / window.hg.DisplacementWaveJob.config.displacementAmplitude * 100 + '%,80%)';

      annotations.tileDisplacementCircles[i].setAttribute('fill', colorString);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileDisplacementCircles[i]
          .setAttribute('cy', annotations.grid.allTiles[i].particle.py);
    }
  }

  /**
   * Updates the inner radius of each tile.
   *
   * @this Annotations
   */
  function updateTileInnerRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileInnerRadii[i].setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileInnerRadii[i].setAttribute('cy', annotations.grid.allTiles[i].particle.py);
      annotations.tileInnerRadii[i].setAttribute('r',
              annotations.grid.allTiles[i].outerRadius * window.hg.Grid.config.sqrtThreeOverTwo);
    }
  }

  /**
   * Updates the outer radius of each tile.
   *
   * @this Annotations
   */
  function updateTileOuterRadii() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.tileOuterRadii[i].setAttribute('cx', annotations.grid.allTiles[i].particle.px);
      annotations.tileOuterRadii[i].setAttribute('cy', annotations.grid.allTiles[i].particle.py);
      annotations.tileOuterRadii[i].setAttribute('r', annotations.grid.allTiles[i].outerRadius);
    }
  }

  /**
   * Updates lines connecting each tile to each of its neighborStates.
   *
   * @this Annotations
   */
  function updateTileNeighborConnections() {
    var annotations, i, j, iCount, jCount, tile, neighborStates, neighbor;

    annotations = this;

    for (i = 0, iCount = annotations.grid.allTiles.length; i < iCount; i += 1) {
      tile = annotations.grid.allTiles[i];
      neighborStates = tile.getNeighborStates();

      for (j = 0, jCount = neighborStates.length; j < jCount; j += 1) {
        neighbor = neighborStates[j];

        if (neighbor) {
          annotations.neighborLines[i][j].setAttribute('x1', tile.particle.px);
          annotations.neighborLines[i][j].setAttribute('y1', tile.particle.py);
          annotations.neighborLines[i][j].setAttribute('x2', neighbor.tile.particle.px);
          annotations.neighborLines[i][j].setAttribute('y2', neighbor.tile.particle.py);
        }
      }
    }
  }

  /**
   * Updates lines representing the cumulative force acting on each tile.
   *
   * @this Annotations
   */
  function updateTileForces() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.forceLines[i].setAttribute('x1', annotations.grid.allTiles[i].particle.px);
      annotations.forceLines[i].setAttribute('y1', annotations.grid.allTiles[i].particle.py);
      annotations.forceLines[i].setAttribute('x2', annotations.grid.allTiles[i].particle.px +
          annotations.grid.allTiles[i].particle.fx * config.forceLineLengthMultiplier);
      annotations.forceLines[i].setAttribute('y2', annotations.grid.allTiles[i].particle.py +
          annotations.grid.allTiles[i].particle.fy * config.forceLineLengthMultiplier);
    }
  }

  /**
   * Updates lines representing the velocity of each tile.
   *
   * @this Annotations
   */
  function updateTileVelocities() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.velocityLines[i].setAttribute('x1', annotations.grid.allTiles[i].particle.px);
      annotations.velocityLines[i].setAttribute('y1', annotations.grid.allTiles[i].particle.py);
      annotations.velocityLines[i].setAttribute('x2', annotations.grid.allTiles[i].particle.px +
          annotations.grid.allTiles[i].particle.vx * config.velocityLineLengthMultiplier);
      annotations.velocityLines[i].setAttribute('y2', annotations.grid.allTiles[i].particle.py +
          annotations.grid.allTiles[i].particle.vy * config.velocityLineLengthMultiplier);
    }
  }

  /**
   * Updates the index of each tile.
   *
   * @this Annotations
   */
  function updateTileIndices() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = annotations.grid.allTiles.length; i < count; i += 1) {
      annotations.indexTexts[i].setAttribute('x', annotations.grid.allTiles[i].particle.px - 10);
      annotations.indexTexts[i].setAttribute('y', annotations.grid.allTiles[i].particle.py + 6);
    }
  }

  /**
   * Draws a dot at the position of each corner gap point of each line animation.
   *
   * @this Annotations
   */
  function updateLineAnimationGapPoints() {
    var annotations, i, iCount, j, jCount, k, line;

    annotations = this;

    destroyLineAnimationGapPoints.call(annotations);
    annotations.lineAnimationGapDots = [];

    for (k = 0, i = 0,
             iCount = window.hg.controller.transientJobs.line.jobs[annotations.grid.index].length;
         i < iCount;
         i += 1) {
      line = window.hg.controller.transientJobs.line.jobs[annotations.grid.index][i];

      for (j = 0, jCount = line.gapPoints.length; j < jCount; j += 1, k += 1) {
        annotations.lineAnimationGapDots[k] =
            document.createElementNS(window.hg.util.svgNamespace, 'circle');
        annotations.lineAnimationGapDots[k].setAttribute('cx', line.gapPoints[j].x);
        annotations.lineAnimationGapDots[k].setAttribute('cy', line.gapPoints[j].y);
        annotations.lineAnimationGapDots[k].setAttribute('r', '4');
        annotations.lineAnimationGapDots[k].setAttribute('fill', 'white');
        annotations.grid.svg.appendChild(annotations.lineAnimationGapDots[k]);
      }
    }
  }

  /**
   * Draws some annotations describing the corner configurations of each line animation.
   *
   * @this Annotations
   */
  function updateLineAnimationCornerConfigurations() {
    var annotations, i, iCount, j, jCount, line, pos, dot;

    annotations = this;

    destroyLineAnimationCornerConfigurations.call(annotations);
    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];

    for (i = 0, iCount = window.hg.controller.transientJobs.line.jobs[annotations.grid.index].length;
         i < iCount; i += 1) {
      line = window.hg.controller.transientJobs.line.jobs[annotations.grid.index][i];

      for (j = 0, jCount = line.corners.length; j < jCount; j += 1) {
        // Self corner: red dot
        pos = getCornerPosition(line.tiles[j], line.corners[j]);
        dot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
        dot.setAttribute('cx', pos.x);
        dot.setAttribute('cy', pos.y);
        dot.setAttribute('r', '3');
        dot.setAttribute('fill', '#ffaaaa');
        annotations.grid.svg.appendChild(dot);
        annotations.lineAnimationSelfCornerDots.push(dot);

        // Lower neighbor corner: green dot
        if (line.lowerNeighbors[j]) {
          pos = getCornerPosition(line.lowerNeighbors[j].tile, line.lowerNeighborCorners[j]);
          dot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
          dot.setAttribute('cx', pos.x);
          dot.setAttribute('cy', pos.y);
          dot.setAttribute('r', '3');
          dot.setAttribute('fill', '#aaffaa');
          annotations.grid.svg.appendChild(dot);
          annotations.lineAnimationLowerNeighborCornerDots.push(dot);
        }

        // Upper neighbor corner: blue dot
        if (line.upperNeighbors[j]) {
          pos = getCornerPosition(line.upperNeighbors[j].tile, line.upperNeighborCorners[j]);
          dot = document.createElementNS(window.hg.util.svgNamespace, 'circle');
          dot.setAttribute('cx', pos.x);
          dot.setAttribute('cy', pos.y);
          dot.setAttribute('r', '3');
          dot.setAttribute('fill', '#aaaaff');
          annotations.grid.svg.appendChild(dot);
          annotations.lineAnimationUpperNeighborCornerDots.push(dot);
        }
      }
    }

    function getCornerPosition(tile, corner) {
      return {
        x: tile.vertices[corner * 2],
        y: tile.vertices[corner * 2 + 1]
      };
    }
  }

  /**
   * Updates the dots at the center of the grid and the center of the viewport and highlights the base tile for the
   * current pan.
   *
   * @this Annotations
   */
  function updatePanCenterPoints() {
    var annotations, panJob;

    annotations = this;

    if (annotations.originalGridCenterDot) {
      annotations.originalGridCenterDot.setAttribute('cx', annotations.grid.originalCenter.x);
      annotations.originalGridCenterDot.setAttribute('cy', annotations.grid.originalCenter.y);

      annotations.currentGridCenterDot.setAttribute('cx', annotations.grid.currentCenter.x);
      annotations.currentGridCenterDot.setAttribute('cy', annotations.grid.currentCenter.y);

      annotations.panCenterDot.setAttribute('cx', annotations.grid.panCenter.x);
      annotations.panCenterDot.setAttribute('cy', annotations.grid.panCenter.y);

      panJob = window.hg.controller.transientJobs.pan.jobs[annotations.grid.index][0];
      if (panJob) {
        panJob.baseTile.currentColor.h = 0;
        panJob.baseTile.currentColor.s = 0;
        panJob.baseTile.currentColor.l = 90;
      }
    }
  }

  /**
   * Updates a dot at the anchor position of each sector.
   *
   * @this Annotations
   */
  function updateSectorAnchorCenters() {
    var annotations, i, expandedAnchorX, expandedAnchorY, collapsedAnchorX, collapsedAnchorY;

    annotations = this;

    for (i = 0; i < annotations.sectorAnchorLines.length; i += 1) {
      expandedAnchorX = annotations.grid.sectors[i].currentAnchor.x;
      expandedAnchorY = annotations.grid.sectors[i].currentAnchor.y;
      collapsedAnchorX = annotations.grid.sectors[i].originalAnchor.x -
          annotations.grid.sectors[i].expandedDisplacement.x;
      collapsedAnchorY = annotations.grid.sectors[i].originalAnchor.y -
          annotations.grid.sectors[i].expandedDisplacement.y;

      annotations.sectorAnchorLines[i].setAttribute('x1', expandedAnchorX);
      annotations.sectorAnchorLines[i].setAttribute('y1', expandedAnchorY);
      annotations.sectorAnchorLines[i].setAttribute('x2', collapsedAnchorX);
      annotations.sectorAnchorLines[i].setAttribute('y2', collapsedAnchorY);
      annotations.sectorAnchorCenters[i].setAttribute('cx', collapsedAnchorX);
      annotations.sectorAnchorCenters[i].setAttribute('cy', collapsedAnchorY);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Toggles whether the given annotation is enabled.
   *
   * @this Annotations
   * @param {String} annotation
   * @param {Boolean} enabled
   * @throws {Error}
   */
  function toggleAnnotationEnabled(annotation, enabled) {
    var annotations;

    annotations = this;

    annotations.annotations[annotation].enabled = enabled;

    if (enabled) {
      annotations.annotations[annotation].create.call(annotations);
    } else {
      annotations.annotations[annotation].destroy.call(annotations);
    }
  }

  /**
   * Computes spatial parameters of the tile annotations and creates SVG elements to represent
   * these annotations.
   *
   * @this Annotations
   */
  function createAnnotations() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = config.annotationsArray.length; i < count; i += 1) {
      if (config.annotationsArray[i].enabled) {
        config.annotationsArray[i].create.call(annotations);
      }
    }
  }

  /**
   * Destroys the SVG elements used to represent grid annotations.
   *
   * @this Annotations
   */
  function destroyAnnotations() {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = config.annotationsArray.length; i < count; i += 1) {
      config.annotationsArray[i].destroy.call(annotations);
    }
  }

  /**
   * Updates the annotation states to reflect whether the grid is currently expanded.
   *
   * @this Annotations
   * @param {Boolean} isExpanded
   */
  function setExpandedAnnotations(isExpanded) {
    var annotations;

    annotations = this;

    if (annotations.annotations.tileNeighborConnections.enabled) {
      destroyTileNeighborConnections.call(annotations);
      createTileNeighborConnections.call(annotations);
    }
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @this Annotations
   */
  function start() {
    var grid = this;

    grid.isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this Annotations
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var annotations, i, count;

    annotations = this;

    for (i = 0, count = config.annotationsArray.length; i < count; i += 1) {
      if (config.annotationsArray[i].enabled) {
        config.annotationsArray[i].update.call(annotations);
      }
    }
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * @this Annotations
   */
  function draw() {
    // TODO: is there any of the update logic that should instead be handled here?
  }

  /**
   * Stops this AnimationJob, and returns the element to its original form.
   *
   * @this Annotations
   */
  function cancel() {
    var grid = this;

    grid.isComplete = true;
  }

  /**
   * @this Annotations
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @param {Grid} grid
   */
  function Annotations(grid) {
    var annotations = this;

    annotations.grid = grid;
    annotations.startTime = 0;
    annotations.isComplete = true;
    annotations.annotations = window.hg.util.shallowCopy(config.annotations);

    annotations.contentAreaGuideLines = [];
    annotations.tileParticleCenters = [];
    annotations.tileAnchorLines = [];
    annotations.tileAnchorCenters = [];
    annotations.tileDisplacementCircles = [];
    annotations.tileInnerRadii = [];
    annotations.tileOuterRadii = [];
    annotations.neighborLines = [];
    annotations.forceLines = [];
    annotations.velocityLines = [];
    annotations.indexTexts = [];
    annotations.lineAnimationGapDots = [];
    annotations.lineAnimationSelfCornerDots = [];
    annotations.lineAnimationLowerNeighborCornerDots = [];
    annotations.lineAnimationUpperNeighborCornerDots = [];
    annotations.sectorAnchorLines = [];
    annotations.sectorAnchorCenters = [];

    annotations.originalGridCenterDot = null;
    annotations.currentGridCenterDot = null;
    annotations.panCenterDot = null;

    annotations.toggleAnnotationEnabled = toggleAnnotationEnabled;
    annotations.createAnnotations = createAnnotations;
    annotations.destroyAnnotations = destroyAnnotations;
    annotations.setExpandedAnnotations = setExpandedAnnotations;

    annotations.start = start;
    annotations.update = update;
    annotations.draw = draw;
    annotations.cancel = cancel;
    annotations.init = init;
  }

  Annotations.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Annotations = Annotations;

  console.log('Annotations module loaded');
})();

/**
* This module defines a constructor for Carousel objects.
*
* Carousel objects display the images and videos for a post.
*
* @module Carousel
*/
(function () {

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  config.thumbnailHeight = 80;
  config.thumbnailRibbonPadding = 3;
  config.prevNextButtonPadding = 10;

  // ---  --- //

  config.aspectRatio = 16 / 9;

  config.vimeoMetadataBaseUrl = 'http://vimeo.com/api/v2/video';

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.thumbnailWidth = config.thumbnailHeight * config.aspectRatio;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this Carousel
   * @param {Array.<String>} images
   * @param {Array.<String>} videos
   */
  function createMediaMetadataArray(images, videos) {
    var carousel = this;

    carousel.mediaMetadata = videos.concat(images).map(function (medium) {
      medium.isVideo = !!medium.videoHost;
      return medium;
    });
  }

  /**
   * @this Carousel
   * @param {Boolean} [waitToLoadMedia=false]
   */
  function createElements(waitToLoadMedia) {
    var carousel = this;

    var container = document.createElement('div');
    var slidersContainer = document.createElement('div');
    var mainMediaRibbon = document.createElement('div');
    var thumbnailsRibbon = document.createElement('div');
    var buttonsContainer = document.createElement('div');
    var captionsPanel = document.createElement('div');
    var captionsText = document.createElement('p');
    var previousButtonPanel = document.createElement('div');
    var previousButtonText = document.createElement('div');
    var nextButtonPanel = document.createElement('div');
    var nextButtonText = document.createElement('div');

    carousel.parent.appendChild(container);
    container.appendChild(slidersContainer);
    slidersContainer.appendChild(mainMediaRibbon);
    slidersContainer.appendChild(thumbnailsRibbon);
    slidersContainer.appendChild(buttonsContainer);
    buttonsContainer.appendChild(previousButtonPanel);
    previousButtonPanel.appendChild(previousButtonText);
    buttonsContainer.appendChild(nextButtonPanel);
    nextButtonPanel.appendChild(nextButtonText);
    container.appendChild(captionsPanel);
    captionsPanel.appendChild(captionsText);

    carousel.elements = {};
    carousel.elements.container = container;
    carousel.elements.slidersContainer = slidersContainer;
    carousel.elements.mainMediaRibbon = mainMediaRibbon;
    carousel.elements.thumbnailsRibbon = thumbnailsRibbon;
    carousel.elements.buttonsContainer = buttonsContainer;
    carousel.elements.captionsPanel = captionsPanel;
    carousel.elements.captionsText = captionsText;
    carousel.elements.previousButtonPanel = previousButtonPanel;
    carousel.elements.previousButtonText = previousButtonText;
    carousel.elements.nextButtonPanel = nextButtonPanel;
    carousel.elements.nextButtonText = nextButtonText;
    carousel.elements.mainMedia = [];
    carousel.elements.thumbnails = [];
    carousel.elements.thumbnailScreens = [];

    container.setAttribute('data-hg-carousel-container', 'data-hg-carousel-container');

    slidersContainer.setAttribute('data-hg-carousel-sliders-container',
      'data-hg-carousel-sliders-container');
    slidersContainer.style.position = 'relative';
    slidersContainer.style.overflow = 'hidden';
    slidersContainer.style.width = '100%';
    window.hg.util.setUserSelectNone(container);

    mainMediaRibbon.style.position = 'relative';
    mainMediaRibbon.style.width = '100%';
    mainMediaRibbon.style.height = '0';
    mainMediaRibbon.style.padding = '56.25% 0 0 0';

    thumbnailsRibbon.style.position = 'relative';
    thumbnailsRibbon.style.width = config.thumbnailWidth * carousel.mediaMetadata.length + 'px';
    thumbnailsRibbon.style.height = config.thumbnailHeight + 'px';
    thumbnailsRibbon.style.left = 'calc(50% - ' + config.thumbnailWidth / 2 + 'px)';
    thumbnailsRibbon.style.paddingTop = config.thumbnailRibbonPadding + 'px';

    buttonsContainer.style.position = 'absolute';
    buttonsContainer.style.top = '0';
    buttonsContainer.style.width = '100%';
    buttonsContainer.style.height = '0';
    buttonsContainer.style.padding = '56.25% 0 0 0';

    previousButtonPanel.setAttribute('data-hg-carousel-button', 'data-hg-carousel-button');
    previousButtonPanel.style.position = 'absolute';
    previousButtonPanel.style.top = '0';
    previousButtonPanel.style.left = '0';
    previousButtonPanel.style.width = 'calc(33.33% - ' + config.prevNextButtonPadding + 'px)';
    previousButtonPanel.style.height = '100%';
    previousButtonPanel.style.cursor = 'pointer';
    previousButtonPanel.addEventListener('click', goToPrevious.bind(carousel), false);

    previousButtonText.style.position = 'absolute';
    previousButtonText.style.top = '0';
    previousButtonText.style.bottom = '0';
    previousButtonText.style.left = '0';
    previousButtonText.style.margin = 'auto';
    previousButtonText.style.height = '100px';
    previousButtonText.style.lineHeight = '100px';
    previousButtonText.style.fontSize = '40px';
    previousButtonText.style.verticalAlign = 'middle';
    previousButtonText.style.textAlign = 'left';
    previousButtonText.style.paddingLeft = config.prevNextButtonPadding + 'px';
    previousButtonText.innerHTML = '&#10094;';

    nextButtonPanel.setAttribute('data-hg-carousel-button', 'data-hg-carousel-button');
    nextButtonPanel.style.position = 'absolute';
    nextButtonPanel.style.top = '0';
    nextButtonPanel.style.right = '0';
    nextButtonPanel.style.width = 'calc(66.67% - ' + config.prevNextButtonPadding + 'px)';
    nextButtonPanel.style.height = '100%';
    nextButtonPanel.style.cursor = 'pointer';
    nextButtonPanel.addEventListener('click', goToNext.bind(carousel), false);

    nextButtonText.style.position = 'absolute';
    nextButtonText.style.top = '0';
    nextButtonText.style.bottom = '0';
    nextButtonText.style.right = '0';
    nextButtonText.style.margin = 'auto';
    nextButtonText.style.height = '100px';
    nextButtonText.style.lineHeight = '100px';
    nextButtonText.style.fontSize = '40px';
    nextButtonText.style.verticalAlign = 'middle';
    nextButtonText.style.textAlign = 'right';
    nextButtonText.style.paddingRight = config.prevNextButtonPadding + 'px';
    nextButtonText.innerHTML = '&#10095;';

    captionsPanel.setAttribute('data-hg-captions-panel', 'data-hg-captions-panel');

    captionsText.style.margin = '0';
    captionsText.style.padding = '0';
    carousel.elements.captionsPanel.setAttribute('data-hg-selected', 'data-hg-selected');

    if (!waitToLoadMedia) {
      loadMedia.call(carousel);
    }

    // The Carousel should display differently when it contains zero or one item
    if (carousel.mediaMetadata.length === 0) {
      container.style.display = 'none';
      captionsPanel.style.display = 'none';
    } else {
      // Show the caption for the first media item
      captionsText.innerHTML = carousel.mediaMetadata[0].description;

      if (carousel.mediaMetadata.length === 1) {
        thumbnailsRibbon.style.display = 'none';
      }
    }

    setPrevNextButtonVisibility.call(carousel);
  }

  /**
   * @this Carousel
   */
  function setPrevNextButtonVisibility() {
    var prevVisibility, nextVisibility, panelVisibility;
    var carousel = this;

    // We don't want the prev/next buttons blocking any video controls
    if (!carousel.mediaMetadata.length ||
        carousel.mediaMetadata[carousel.currentIndex].isVideo) {
      prevVisibility = 'hidden';
      nextVisibility = 'hidden';
      panelVisibility = 'hidden';
    } else {
      prevVisibility = carousel.currentIndex > 0 ? 'visible' : 'hidden';
      nextVisibility = carousel.currentIndex < carousel.mediaMetadata.length - 1 ?
        'visible' : 'hidden';
      panelVisibility = 'visible';
    }

    carousel.elements.previousButtonPanel.style.visibility = prevVisibility;
    carousel.elements.nextButtonPanel.style.visibility = nextVisibility;
    carousel.elements.buttonsContainer.style.visibility = panelVisibility;
  }

  /**
   * @this Carousel
   */
  function goToPrevious() {
    var nextIndex;
    var carousel = this;

    if (carousel.currentIndex > 0) {
      nextIndex = (carousel.currentIndex + carousel.mediaMetadata.length - 1) %
        carousel.mediaMetadata.length;
      goToIndex.call(carousel, nextIndex);
    } else {
      console.warn('Carousel cannot go to previous. Already at first medium.');
    }
  }

  /**
   * @this Carousel
   */
  function goToNext() {
    var nextIndex;
    var carousel = this;

    if (carousel.currentIndex < carousel.mediaMetadata.length - 1) {
      nextIndex = (carousel.currentIndex + 1) % carousel.mediaMetadata.length;
      goToIndex.call(carousel, nextIndex);
    } else {
      console.warn('Carousel cannot go to next. Already at last medium.');
    }
  }

  /**
   * @this Carousel
   * @param {Number} nextIndex
   */
  function goToIndex(nextIndex) {
    var carousel = this;

    carousel.previousIndex = carousel.currentIndex;
    carousel.currentIndex = nextIndex;

    window.hg.controller.transientJobs.carouselImageSlide.create(carousel.grid, null, carousel);

    // Pause any playing video
    if (carousel.mediaMetadata[carousel.previousIndex].isVideo) {
      switch (carousel.mediaMetadata[carousel.previousIndex].videoHost) {
        case 'youtube':
          carousel.elements.mainMedia[carousel.previousIndex].querySelector('iframe').contentWindow
            .postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
          break;
        case 'vimeo':
          carousel.elements.mainMedia[carousel.previousIndex].querySelector('iframe').contentWindow
            .postMessage('{"method": "pause", "value": ""}', '*');
          break;
        default:
          throw new Error('Invalid video host: ' +
            carousel.mediaMetadata[carousel.previousIndex].videoHost);
      }
    }

    // Hide the caption text
    carousel.elements.captionsPanel.removeAttribute('data-hg-selected');

    // Mark the old thumbnail as un-selected
    carousel.elements.thumbnails[carousel.previousIndex].removeAttribute('data-hg-selected');

    // Mark the current thumbnail as selected
    carousel.elements.thumbnails[carousel.currentIndex].setAttribute('data-hg-selected',
      'data-hg-selected');

    setPrevNextButtonVisibility.call(carousel);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * @this Carousel
   */
  function loadMedia() {
    var carousel = this;

    if (carousel.elements.mainMedia.length === 0) {
      carousel.mediaMetadata.forEach(addMedium);
    }

    if (carousel.mediaMetadata.length > 0) {
      // Mark the first thumbnail as selected
      carousel.elements.thumbnails[0].setAttribute('data-hg-selected', 'data-hg-selected');
    }

    // ---  --- //

    function addMedium(mediumMetadatum, index) {
      var mainMediaElement, iframeElement, thumbnailElement, thumbnailScreenElement, thumbnailSrc;

      if (mediumMetadatum.isVideo) {
        iframeElement = document.createElement('iframe');
        iframeElement.setAttribute('src', mediumMetadatum.videoSrc);
        iframeElement.setAttribute('allowfullscreen', 'allowfullscreen');
        iframeElement.setAttribute('frameborder', '0');
        iframeElement.style.position = 'absolute';
        iframeElement.style.top = '0';
        iframeElement.style.width = '100%';
        iframeElement.style.height = '100%';

        mainMediaElement = document.createElement('div');
        mainMediaElement.appendChild(iframeElement);

        switch (mediumMetadatum.videoHost) {
          case 'youtube':
            thumbnailSrc = mediumMetadatum.thumbnailSrc;
            break;
          case 'vimeo':
            thumbnailSrc = '';
            fetchVimeoThumbnail(mediumMetadatum, index);
            break;
          default:
            throw new Error('Invalid video host: ' + mediumMetadatum.videoHost);
        }
      } else {
        mainMediaElement = document.createElement('div');
        mainMediaElement.style.backgroundImage = 'url(' + mediumMetadatum.src + ')';
        mainMediaElement.style.backgroundSize = 'contain';
        mainMediaElement.style.backgroundRepeat = 'no-repeat';
        mainMediaElement.style.backgroundPosition = '50% 50%';

        thumbnailSrc = mediumMetadatum.src;
      }

      mainMediaElement.setAttribute('data-hg-carousel-main-media',
        'data-hg-carousel-main-media');
      mainMediaElement.style.position = 'absolute';
      mainMediaElement.style.top = '0';
      mainMediaElement.style.left = index * 100 + '%';
      mainMediaElement.style.width = '100%';
      mainMediaElement.style.height = '0';
      mainMediaElement.style.padding = '56.25% 0 0 0';

      thumbnailElement = document.createElement('div');
      thumbnailElement.setAttribute('data-hg-carousel-thumbnail',
        'data-hg-carousel-thumbnail');
      thumbnailElement.style.backgroundImage = 'url(' + thumbnailSrc + ')';
      thumbnailElement.style.backgroundSize = 'contain';
      thumbnailElement.style.backgroundRepeat = 'no-repeat';
      thumbnailElement.style.backgroundPosition = '50% 50%';
      thumbnailElement.style.width = config.thumbnailWidth + 'px';
      thumbnailElement.style.height = config.thumbnailHeight + 'px';
      thumbnailElement.style.float = 'left';

      thumbnailScreenElement = document.createElement('div');
      thumbnailScreenElement.setAttribute('data-hg-carousel-thumbnail-screen',
        'data-hg-carousel-thumbnail-screen');
      thumbnailScreenElement.style.width = '100%';
      thumbnailScreenElement.style.height = '100%';
      thumbnailScreenElement.style.cursor = 'pointer';
      thumbnailScreenElement.addEventListener('click', goToIndex.bind(carousel, index), false);

      carousel.elements.mainMedia.push(mainMediaElement);
      carousel.elements.thumbnails.push(thumbnailElement);
      carousel.elements.thumbnailScreens.push(thumbnailScreenElement);

      carousel.elements.mainMediaRibbon.appendChild(mainMediaElement);
      carousel.elements.thumbnailsRibbon.appendChild(thumbnailElement);
      thumbnailElement.appendChild(thumbnailScreenElement);

      // ---  --- //

      function fetchVimeoThumbnail(mediumMetadatum, index) {
        var url = config.vimeoMetadataBaseUrl + '/' + mediumMetadatum.id + '.json';
        var xhr = new XMLHttpRequest();

        xhr.addEventListener('load', onLoad, false);
        xhr.addEventListener('error', onError, false);
        xhr.addEventListener('abort', onAbort, false);

        console.log('Sending request for Vimeo metadata to ' + url);

        xhr.open('GET', url, true);
        xhr.send();

        // ---  --- //

        function onLoad() {
          var responseData;

          console.log('Vimeo metadata response status=' + xhr.status +
            ' (' + xhr.statusText + ')');

          try {
            responseData = JSON.parse(xhr.response);
          } catch (error) {
            console.error('Unable to parse Vimeo metadata response body as JSON: ' + xhr.response);
            return;
          }

          mediumMetadatum.thumbnailSrc = responseData[0].thumbnail_large;

          carousel.elements.thumbnails[index].style.backgroundImage =
            'url(' + mediumMetadatum.thumbnailSrc + ')';
        }

        function onError() {
          console.error('An error occurred while loading the Vimeo thumbnail');
        }

        function onAbort() {
          console.error('The Vimeo thumbnail load has been cancelled by the user');
        }
      }
    }
  }

  /**
   * @this Carousel
   */
  function onSlideFinished() {
    var carousel = this;

    // Show the caption for the current media item
    carousel.elements.captionsText.innerHTML =
      carousel.mediaMetadata[carousel.currentIndex].description;
    carousel.elements.captionsPanel.setAttribute('data-hg-selected', 'data-hg-selected');
  }

  /**
   * @this Carousel
   */
  function draw() {
    var carousel = this;

    carousel.elements.mainMediaRibbon.style.left = -carousel.currentIndexPositionRatio * 100 + '%';
    carousel.elements.thumbnailsRibbon.style.left = 'calc(50% - ' + (config.thumbnailWidth / 2 +
      carousel.currentIndexPositionRatio * config.thumbnailWidth) + 'px';
  }

  /**
   * @this Carousel
   */
  function destroy() {
    var carousel = this;

    carousel.parent.removeChild(carousel.elements.container);
    carousel.elements.container = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {PagePost} pagePost
   * @param {HTMLElement} parent
   * @param {Array.<String>} images
   * @param {Array.<String>} videos
   * @param {Boolean} [waitToLoadMedia=false]
   */
  function Carousel(grid, pagePost, parent, images, videos, waitToLoadMedia) {
    var carousel = this;

    carousel.grid = grid;
    carousel.pagePost = pagePost;
    carousel.parent = parent;
    carousel.elements = null;
    carousel.currentIndex = 0;
    carousel.previousIndex = 0;
    carousel.mediaMetadata = null;
    carousel.currentIndexPositionRatio = 0;

    carousel.loadMedia = loadMedia;
    carousel.onSlideFinished = onSlideFinished;
    carousel.draw = draw;
    carousel.destroy = destroy;

    createMediaMetadataArray.call(carousel, images, videos);
    createElements.call(carousel, waitToLoadMedia);

    console.log('Carousel created');
  }

  Carousel.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Carousel = Carousel;

  console.log('Carousel module loaded');
})();

/**
 * @typedef {AnimationJob} Grid
 */

/**
 * This module defines a constructor for Grid objects.
 *
 * Grid objects define a collection of hexagonal tiles that animate and display dynamic,
 * textual content.
 *
 * @module Grid
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // TODO:
  // - update the tile radius and the targetContentAreaWidth with the screen width?
  //   - what is my plan for mobile devices?

  var config = {};

  config.targetContentAreaWidth = 800;
  config.backgroundHue = 230;
  config.backgroundSaturation = 1;
  config.backgroundLightness = 4;
  config.tileHue = 230;//147;
  config.tileSaturation = 50;
  config.tileLightness = 30;
  config.tileOuterRadius = 80;
  config.tileGap = 12;
  config.contentStartingRowIndex = 2;
  config.firstRowYOffset = config.tileOuterRadius * -0.8;
  config.contentDensity = 0.6;
  config.tileMass = 1;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.sqrtThreeOverTwo = Math.sqrt(3) / 2;
    config.twoOverSqrtThree = 2 / Math.sqrt(3);

    config.tileInnerRadius = config.tileOuterRadius * config.sqrtThreeOverTwo;

    config.longGap = config.tileGap * config.twoOverSqrtThree;

    config.tileShortLengthWithGap = config.tileInnerRadius * 2 + config.tileGap;
    config.tileLongLengthWithGap = config.tileOuterRadius * 2 + config.longGap;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Computes various parameters of the grid. These include:
   *
   * - row count
   * - number of tiles in even and odd rows
   * - the vertical and horizontal displacement between neighbor tiles
   * - the horizontal positions of the first tiles in even and odd rows
   *
   * @this Grid
   */
  function computeGridParameters() {
    var grid, parentHalfWidth, parentHeight, innerContentCount, rowIndex, i, count,
        emptyRowsContentTileCount, minInnerTileCount;

    grid = this;

    parentHalfWidth = grid.parent.clientWidth * 0.5;
    parentHeight = grid.parent.clientHeight;

    grid.originalCenter.x = parentHalfWidth;
    grid.originalCenter.y = parentHeight * 0.5;
    grid.currentCenter.x = grid.originalCenter.x;
    grid.currentCenter.y = grid.originalCenter.y;
    grid.panCenter.x = grid.originalCenter.x;
    grid.panCenter.y = grid.originalCenter.y;

    grid.actualContentAreaWidth = grid.parent.clientWidth < config.targetContentAreaWidth ?
        grid.parent.clientWidth : config.targetContentAreaWidth;

    if (grid.isVertical) {
      grid.rowDeltaY = config.tileOuterRadius * 1.5 + config.tileGap * config.sqrtThreeOverTwo;
      grid.tileDeltaX = config.tileShortLengthWithGap;

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (config.tileInnerRadius + config.tileGap)) / config.tileShortLengthWithGap) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (config.tileShortLengthWithGap + config.tileGap * 0.5)) / config.tileShortLengthWithGap) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - config.tileShortLengthWithGap * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (config.firstRowYOffset + config.tileOuterRadius * 2 + config.tileGap * Math.sqrt(3))) / grid.rowDeltaY) + 2;
    } else {
      grid.rowDeltaY = config.tileInnerRadius + config.tileGap * 0.5;
      grid.tileDeltaX = config.tileOuterRadius * 3 + config.tileGap * Math.sqrt(3);

      grid.oddRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX - config.tileOuterRadius)) / grid.tileDeltaX) * 2 + 1;
      grid.evenRowTileCount = Math.ceil((parentHalfWidth - (grid.tileDeltaX + (config.tileGap * config.sqrtThreeOverTwo) + config.tileOuterRadius * 0.5)) / grid.tileDeltaX) * 2 + 2;

      grid.oddRowXOffset = parentHalfWidth - grid.tileDeltaX * (grid.oddRowTileCount - 1) / 2;

      grid.rowCount = Math.ceil((parentHeight - (config.firstRowYOffset + config.tileInnerRadius * 3 + config.tileGap * 2)) / grid.rowDeltaY) + 4;
    }

    grid.evenRowXOffset = grid.oddRowXOffset +
        (grid.evenRowTileCount > grid.oddRowTileCount ? -1 : 1) * grid.tileDeltaX * 0.5;

    // --- Row inner content information --- //

    grid.contentAreaLeft = parentHalfWidth - grid.actualContentAreaWidth * 0.5;
    grid.contentAreaRight = grid.contentAreaLeft + grid.actualContentAreaWidth;

    if (grid.isVertical) {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileInnerRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileInnerRadius)) / grid.tileDeltaX);
    } else {
      grid.oddRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.oddRowXOffset - config.tileOuterRadius)) / grid.tileDeltaX);
      grid.evenRowContentStartIndex = Math.ceil((grid.contentAreaLeft - (grid.evenRowXOffset - config.tileOuterRadius)) / grid.tileDeltaX);
    }

    grid.oddRowContentTileCount = grid.oddRowTileCount - grid.oddRowContentStartIndex * 2;
    grid.evenRowContentTileCount = grid.evenRowTileCount - grid.evenRowContentStartIndex * 2;

    grid.oddRowContentEndIndex = grid.oddRowContentStartIndex + grid.oddRowContentTileCount - 1;
    grid.evenRowContentEndIndex = grid.evenRowContentStartIndex + grid.evenRowContentTileCount - 1;

    // Update the content inner indices to account for empty rows at the start of the grid
    grid.actualContentInnerIndices = [];
    emptyRowsContentTileCount = Math.ceil(config.contentStartingRowIndex / 2) * grid.oddRowContentTileCount +
        Math.floor(config.contentStartingRowIndex / 2) * grid.evenRowContentTileCount;
    for (i = 0, count = grid.originalContentInnerIndices.length; i < count; i += 1) {
      grid.actualContentInnerIndices[i] = grid.originalContentInnerIndices[i] + emptyRowsContentTileCount;
    }

    grid.innerIndexOfLastContentTile = grid.actualContentInnerIndices[grid.actualContentInnerIndices.length - 1];

    // Add empty rows at the end of the grid
    minInnerTileCount = emptyRowsContentTileCount + grid.innerIndexOfLastContentTile + 1;
    innerContentCount = 0;
    rowIndex = 0;

    while (minInnerTileCount > innerContentCount) {
      innerContentCount += rowIndex % 2 === 0 ?
          grid.oddRowContentTileCount : grid.evenRowContentTileCount;
      rowIndex += 1;
    }

    // Make sure the grid element is tall enough to contain the needed number of rows
    if (rowIndex > grid.rowCount) {
      grid.rowCount = rowIndex + (grid.isVertical ? 0 : 1);
      grid.height = (grid.rowCount - 2) * grid.rowDeltaY;
    } else {
      grid.height = parentHeight;
    }
  }

  /**
   * Calculates the tile indices within the content area column that will represent tiles with
   * content.
   *
   * @this Grid
   */
  function computeContentIndices() {
    var grid, i, j, count, tilesRepresentation;

    grid = this;

    // Use 1s to represent the tiles that hold data
    tilesRepresentation = [];
    count = grid.postData.length;
    for (i = 0; i < count; i += 1) {
      tilesRepresentation[i] = 1;
    }

    // Use 0s to represent the empty tiles
    count = (1 / config.contentDensity) * grid.postData.length;
    for (i = grid.postData.length; i < count; i += 1) {
      tilesRepresentation[i] = 0;
    }

    tilesRepresentation = window.hg.util.shuffle(tilesRepresentation);

    // Record the resulting indices of the elements representing tile content
    grid.originalContentInnerIndices = [];
    for (i = 0, j = 0, count = tilesRepresentation.length; i < count; i += 1) {
      if (tilesRepresentation[i]) {
        grid.originalContentInnerIndices[j++] = i;
      }
    }
  }

  /**
   * Creates the SVG element for the grid.
   *
   * @this Grid
   */
  function createSvg() {
    var grid;

    grid = this;

    grid.svg = document.createElementNS(window.hg.util.svgNamespace, 'svg');
    grid.parent.appendChild(grid.svg);

    grid.svg.style.display = 'block';
    grid.svg.style.position = 'relative';
    grid.svg.style.width = '1px';
    grid.svg.style.height = '1px';
    grid.svg.style.zIndex = '1000';
    grid.svg.style.overflow = 'visible';
    grid.svg.setAttribute('data-hg-svg', 'data-hg-svg');

    grid.svgDefs = document.createElementNS(window.hg.util.svgNamespace, 'defs');
    grid.svg.appendChild(grid.svgDefs);
  }

  /**
   * Creates the tile elements for the grid.
   *
   * @this Grid
   */
  function createTiles() {
    var grid, tileIndex, rowIndex, rowCount, columnIndex, columnCount, anchorX, anchorY,
        isMarginTile, isBorderTile, isCornerTile, isOddRow, contentAreaIndex, postDataIndex,
        defaultNeighborDeltaIndices, tilesNeighborDeltaIndices, oddRowIsLarger, isLargerRow;

    grid = this;

    grid.originalTiles = [];
    grid.originalBorderTiles = [];
    tileIndex = 0;
    contentAreaIndex = 0;
    postDataIndex = 0;
    anchorY = config.firstRowYOffset;
    rowCount = grid.rowCount;
    tilesNeighborDeltaIndices = [];

    defaultNeighborDeltaIndices = getDefaultNeighborDeltaIndices.call(grid);
    oddRowIsLarger = grid.oddRowTileCount > grid.evenRowTileCount;

    for (rowIndex = 0; rowIndex < rowCount; rowIndex += 1, anchorY += grid.rowDeltaY) {
      isOddRow = rowIndex % 2 === 0;
      isLargerRow = oddRowIsLarger && isOddRow || !oddRowIsLarger && !isOddRow;

      if (isOddRow) {
        anchorX = grid.oddRowXOffset;
        columnCount = grid.oddRowTileCount;
      } else {
        anchorX = grid.evenRowXOffset;
        columnCount = grid.evenRowTileCount;
      }

      for (columnIndex = 0; columnIndex < columnCount;
           tileIndex += 1, columnIndex += 1, anchorX += grid.tileDeltaX) {
        isMarginTile = isOddRow ?
            columnIndex < grid.oddRowContentStartIndex ||
                columnIndex > grid.oddRowContentEndIndex :
            columnIndex < grid.evenRowContentStartIndex ||
                columnIndex > grid.evenRowContentEndIndex;

        isBorderTile = grid.isVertical ?
            (columnIndex === 0 || columnIndex === columnCount - 1 ||
              rowIndex === 0 || rowIndex === rowCount - 1) :
            (rowIndex <= 1 || rowIndex >= rowCount - 2 ||
                isLargerRow && (columnIndex === 0 || columnIndex === columnCount - 1));

        isCornerTile = isBorderTile && (grid.isVertical ?
            ((columnIndex === 0 || columnIndex === columnCount - 1) &&
                (rowIndex === 0 || rowIndex === rowCount - 1)) :
            ((rowIndex <= 1 || rowIndex >= rowCount - 2) &&
                (isLargerRow && (columnIndex === 0 || columnIndex === columnCount - 1))));

        grid.originalTiles[tileIndex] = new window.hg.Tile(grid.svg, grid, anchorX, anchorY,
            config.tileOuterRadius, grid.isVertical, config.tileHue, config.tileSaturation,
            config.tileLightness, null, tileIndex, rowIndex, columnIndex, isMarginTile,
            isBorderTile, isCornerTile, isLargerRow, config.tileMass);

        if (isBorderTile) {
          grid.originalBorderTiles.push(grid.originalTiles[tileIndex]);
        }

        // Is the current tile within the content column?
        if (!isMarginTile) {
          // Does the current tile get to hold content?
          if (contentAreaIndex === grid.actualContentInnerIndices[postDataIndex]) {
            grid.originalTiles[tileIndex].setContent(grid.postData[postDataIndex]);
            grid.contentTiles[postDataIndex] = grid.originalTiles[tileIndex];
            postDataIndex += 1;
          }
          contentAreaIndex += 1;
        }

        // Determine the neighbor index offsets for the current tile
        tilesNeighborDeltaIndices[tileIndex] = getNeighborDeltaIndices.call(grid, rowIndex, rowCount,
            columnIndex, columnCount, isLargerRow, defaultNeighborDeltaIndices);
      }
    }

    setNeighborTiles.call(grid, tilesNeighborDeltaIndices);

    updateAllTilesCollection.call(grid, grid.originalTiles);
  }

  /**
   * Connects each tile with references to its neighborStates.
   *
   * @this Grid
   * @param {Array.<Array.<Number>>} tilesNeighborDeltaIndices
   */
  function setNeighborTiles(tilesNeighborDeltaIndices) {
    var grid, i, j, iCount, jCount, neighborTiles;

    grid = this;

    neighborTiles = [];

    // Give each tile references to each of its neighborStates
    for (i = 0, iCount = grid.originalTiles.length; i < iCount; i += 1) {
      // Get the neighborStates around the current tile
      for (j = 0, jCount = 6; j < jCount; j += 1) {
        neighborTiles[j] = !isNaN(tilesNeighborDeltaIndices[i][j]) ?
            grid.originalTiles[i + tilesNeighborDeltaIndices[i][j]] : null;
      }

      grid.originalTiles[i].setNeighborTiles(neighborTiles);
    }
  }

  /**
   * Get the actual neighbor index offsets for the tile described by the given parameters.
   *
   * NaN is used to represent the tile not having a neighbor on that side.
   *
   * @this Grid
   * @param {Number} rowIndex
   * @param {Number} rowCount
   * @param {Number} columnIndex
   * @param {Number} columnCount
   * @param {Boolean} isLargerRow
   * @param {Array.<Number>} defaultNeighborDeltaIndices
   * @returns {Array.<Number>}
   */
  function getNeighborDeltaIndices(rowIndex, rowCount, columnIndex, columnCount, isLargerRow,
                                   defaultNeighborDeltaIndices) {
    var grid, neighborDeltaIndices;

    grid = this;

    neighborDeltaIndices = defaultNeighborDeltaIndices.slice(0);

    // Remove neighbor indices according to the tile's position in the grid
    if (grid.isVertical) {
      // Is this the row with more or fewer tiles?
      if (isLargerRow) {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[3] = Number.NaN;
          neighborDeltaIndices[4] = Number.NaN;
          neighborDeltaIndices[5] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[0] = Number.NaN;
          neighborDeltaIndices[1] = Number.NaN;
          neighborDeltaIndices[2] = Number.NaN;
        }
      } else {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[4] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[1] = Number.NaN;
        }
      }

      // Is this the first row?
      if (rowIndex === 0) {
        neighborDeltaIndices[0] = Number.NaN;
        neighborDeltaIndices[5] = Number.NaN;
      }

      // Is this the last row?
      if (rowIndex === rowCount - 1) {
        neighborDeltaIndices[2] = Number.NaN;
        neighborDeltaIndices[3] = Number.NaN;
      }
    } else {
      if (isLargerRow) {
        // Is this the first column?
        if (columnIndex === 0) {
          neighborDeltaIndices[4] = Number.NaN;
          neighborDeltaIndices[5] = Number.NaN;
        }

        // Is this the last column?
        if (columnIndex === columnCount - 1) {
          neighborDeltaIndices[1] = Number.NaN;
          neighborDeltaIndices[2] = Number.NaN;
        }
      }

      // Is this the first or second row?
      if (rowIndex ===0) {
        neighborDeltaIndices[0] = Number.NaN;
        neighborDeltaIndices[1] = Number.NaN;
        neighborDeltaIndices[5] = Number.NaN;
      } else if (rowIndex === 1) {
        neighborDeltaIndices[0] = Number.NaN;
      }

      // Is this the last or second-to-last row?
      if (rowIndex === rowCount - 1) {
        neighborDeltaIndices[2] = Number.NaN;
        neighborDeltaIndices[3] = Number.NaN;
        neighborDeltaIndices[4] = Number.NaN;
      } else if (rowIndex === rowCount - 2) {
        neighborDeltaIndices[3] = Number.NaN;
      }
    }

    return neighborDeltaIndices;
  }

  /**
   * Calculates the index offsets of the neighborStates of a tile.
   *
   * @this Grid
   * @returns {Array.<Number>}
   */
  function getDefaultNeighborDeltaIndices() {
    var grid, maxColumnCount, neighborDeltaIndices;

    grid = this;
    neighborDeltaIndices = [];
    maxColumnCount = grid.oddRowTileCount > grid.evenRowTileCount ?
        grid.oddRowTileCount : grid.evenRowTileCount;

    // Neighbor delta indices are dependent on current screen dimensions
    if (grid.isVertical) {
      neighborDeltaIndices[0] = -maxColumnCount + 1; // top-right
      neighborDeltaIndices[1] = 1; // right
      neighborDeltaIndices[2] = maxColumnCount; // bottom-right
      neighborDeltaIndices[3] = maxColumnCount - 1; // bottom-left
      neighborDeltaIndices[4] = -1; // left
      neighborDeltaIndices[5] = -maxColumnCount; // top-left
    } else {
      neighborDeltaIndices[0] = -maxColumnCount * 2 + 1; // top
      neighborDeltaIndices[1] = -maxColumnCount + 1; // top-right
      neighborDeltaIndices[2] = maxColumnCount; // bottom-right
      neighborDeltaIndices[3] = maxColumnCount * 2 - 1; // bottom
      neighborDeltaIndices[4] = maxColumnCount - 1; // bottom-left
      neighborDeltaIndices[5] = -maxColumnCount; // top-left
    }

    return neighborDeltaIndices;
  }

  /**
   * Removes all content from the SVG.
   *
   * @this Grid
   */
  function clearSvg() {
    var grid, svg;

    grid = this;
    svg = grid.svg;

    grid.annotations.destroyAnnotations();

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    grid.svg.appendChild(grid.svgDefs);
  }

  /**
   * Sets an 'data-hg-index' attribute on each tile element to match that tile's current index in this
   * grid's allTiles array.
   *
   * @this Grid
   */
  function setTileIndexAttributes() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].element.setAttribute('data-hg-index', i);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Prints to the console some information about this grid.
   *
   * This is useful for testing purposes.
   */
  function logGridInfo() {
    var grid = this;

    console.log('// --- Grid Info: ------- //');
    console.log('// - Tile count=' + grid.originalTiles.length);
    console.log('// - Row count=' + grid.rowCount);
    console.log('// - Odd row tile count=' + grid.oddRowTileCount);
    console.log('// - Even row tile count=' + grid.evenRowTileCount);
    console.log('// ------------------------- //');
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Computes spatial parameters of the tiles in this grid.
   *
   * @this Grid
   */
  function resize() {
    var grid;

    grid = this;

    if (grid.allTiles) {
      grid.allTiles.forEach(function (tile) {
        tile.destroy();
      });
    }

    if (grid.isPostOpen) {
      grid.pagePost.destroy();
    }

    grid.originalCenter = {x: Number.NaN, y: Number.NaN};
    grid.currentCenter = {x: Number.NaN, y: Number.NaN};
    grid.panCenter = {x: Number.NaN, y: Number.NaN};
    grid.isPostOpen = false;
    grid.isTransitioning = false;
    grid.expandedTile = null;
    grid.sectors = [];
    grid.allTiles = null;
    grid.allNonContentTiles = null;
    grid.lastExpansionJob = null;
    grid.parent.style.overflowX = 'hidden';
    grid.parent.style.overflowY = 'auto';

    clearSvg.call(grid);
    computeGridParameters.call(grid);

    createTiles.call(grid);

    logGridInfo.call(grid);
  }

  /**
   * Sets the color of this grid's background.
   *
   * @this Grid
   */
  function setBackgroundColor() {
    var grid = this;

    grid.parent.style.backgroundColor = 'hsl(' + config.backgroundHue + ',' +
        config.backgroundSaturation + '%,' + config.backgroundLightness + '%)';
  }

  /**
   * Sets the color of this grid's tiles.
   *
   * @this Grid
   */
  function updateTileColor() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allNonContentTiles.length; i < count; i += 1) {
      grid.allNonContentTiles[i].setColor(config.tileHue, config.tileSaturation,
          config.tileLightness);
    }
  }

  /**
   * Sets the mass of this grid's tiles.
   *
   * @this Grid
   * @param {Number} mass
   */
  function updateTileMass(mass) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].particle.m = mass;
    }
  }

  /**
   * Sets this AnimationJob as started.
   *
   * @this Grid
   */
  function start() {
    var grid = this;

    grid.isComplete = false;
  }

  /**
   * Updates the animation progress of this AnimationJob to match the given time.
   *
   * @this Grid
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].update(currentTime, deltaTime);
    }
  }

  /**
   * Draws the current state of this AnimationJob.
   *
   * @this Grid
   */
  function draw() {
    var grid, i, count;

    grid = this;

    for (i = 0, count = grid.allTiles.length; i < count; i += 1) {
      grid.allTiles[i].draw();
    }

    if (grid.isPostOpen) {
      grid.pagePost.draw();
    }
  }

  /**
   * Stops this AnimationJob, and returns the element to its original form.
   *
   * @this Grid
   */
  function cancel() {
    var grid = this;

    grid.isComplete = true;
  }

  /**
   * Sets the tile that the pointer is currently hovering over.
   *
   * @this Grid
   * @param {Tile} hoveredTile
   */
  function setHoveredTile(hoveredTile) {
    var grid = this;

    if (grid.hoveredTile) {
      grid.hoveredTile.setIsHighlighted(false);
    }

    if (hoveredTile) {
      hoveredTile.setIsHighlighted(true);
    }

    grid.hoveredTile = hoveredTile;
  }

  /**
   * @this Grid
   * @param {Tile} tile
   * @param {{x:Number,y:Number}} startPosition
   * @returns {PagePost}
   */
  function createPagePost(tile, startPosition) {
    var grid = this;

    grid.pagePost = new window.hg.PagePost(tile, startPosition);

    return grid.pagePost;
  }

  /**
   * @this Grid
   */
  function destroyPagePost() {
    var grid = this;

    grid.pagePost.destroy();
    grid.pagePost = null;
  }

  /**
   * Sets the allTiles property to be the given array.
   *
   * @this Grid
   * @param {Array.<Tile>} newTiles
   */
  function updateAllTilesCollection(newTiles) {
    var grid = this;
    var i, count, j;

    grid.allTiles = newTiles;
    grid.allNonContentTiles = [];

    // Create a collection of all of the non-content tiles
    for (j = 0, i = 0, count = newTiles.length; i < count; i += 1) {
      if (!newTiles[i].holdsContent) {
        grid.allNonContentTiles[j++] = newTiles[i];
      }
    }

    // Reset the annotations for the new tile collection
    grid.annotations.destroyAnnotations();
    grid.annotations.createAnnotations();

    setTileIndexAttributes.call(grid);
  }

  /**
   * @this Grid
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {Number} index
   * @param {HTMLElement} parent
   * @param {Array.<Object>} postData
   * @param {Boolean} [isVertical]
   */
  function Grid(index, parent, postData, isVertical) {
    var grid = this;

    grid.index = index;
    grid.parent = parent;
    grid.postData = postData;
    grid.isVertical = isVertical;

    grid.actualContentAreaWidth = config.targetContentAreaWidth;

    grid.isComplete = true;

    grid.svg = null;
    grid.svgDefs = null;
    grid.originalTiles = [];
    grid.originalBorderTiles = [];
    grid.contentTiles = [];
    grid.originalContentInnerIndices = null;
    grid.innerIndexOfLastContentTile = null;
    grid.originalCenter = null;
    grid.currentCenter = null;
    grid.panCenter = null;
    grid.isPostOpen = false;
    grid.pagePost = null;
    grid.isTransitioning = false;
    grid.expandedTile = null;
    grid.sectors = null;
    grid.allTiles = null;
    grid.allNonContentTiles = null;
    grid.lastExpansionJob = null;
    grid.scrollTop = Number.NaN;

    grid.annotations = new window.hg.Annotations(grid);

    grid.actualContentAreaWidth = Number.NaN;
    grid.rowDeltaY = Number.NaN;
    grid.tileDeltaX = Number.NaN;
    grid.tileNeighborDistance = Number.NaN;
    grid.oddRowTileCount = Number.NaN;
    grid.evenRowTileCount = Number.NaN;
    grid.oddRowXOffset = Number.NaN;
    grid.rowCount = Number.NaN;
    grid.evenRowXOffset = Number.NaN;
    grid.contentAreaLeft = Number.NaN;
    grid.contentAreaRight = Number.NaN;
    grid.oddRowContentStartIndex = Number.NaN;
    grid.evenRowContentStartIndex = Number.NaN;
    grid.oddRowContentTileCount = Number.NaN;
    grid.evenRowContentTileCount = Number.NaN;
    grid.oddRowContentEndIndex = Number.NaN;
    grid.evenRowContentEndIndex = Number.NaN;
    grid.actualContentInnerIndices = Number.NaN;
    grid.innerIndexOfLastContentTile = Number.NaN;
    grid.rowCount = Number.NaN;
    grid.height = Number.NaN;

    grid.resize = resize;
    grid.start = start;
    grid.update = update;
    grid.draw = draw;
    grid.cancel = cancel;
    grid.init = init;

    grid.setBackgroundColor = setBackgroundColor;
    grid.updateTileColor = updateTileColor;
    grid.updateTileMass = updateTileMass;
    grid.setHoveredTile = setHoveredTile;
    grid.createPagePost = createPagePost;
    grid.destroyPagePost = destroyPagePost;
    grid.updateAllTilesCollection = updateAllTilesCollection;

    grid.parent.setAttribute('data-hg-grid-parent', 'data-hg-grid-parent');

    createSvg.call(grid);
    setBackgroundColor.call(grid);
    computeContentIndices.call(grid);
    resize.call(grid);
  }

  Grid.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Grid = Grid;

  console.log('Grid module loaded');
})();

/**
 * This module defines a constructor for Input objects.
 *
 * Input objects handle the user-input logic for a Grid.
 *
 * @module Input
 */
(function () {
  var config = {};

  config.contentTileClickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'
  config.emptyTileClickAnimation = 'Radiate Highlight'; // 'Radiate Highlight'|'Radiate Lines'|'Random Line'|'None'

  config.possibleClickAnimations = {
    'Radiate Highlight': window.hg.controller.transientJobs.highlightRadiate.create,
    'Radiate Lines': window.hg.controller.transientJobs.linesRadiate.create,
    'Random Line': window.hg.controller.transientJobs.line.create,
    'None': function () {}
  };

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Adds event listeners for mouse and touch events for the grid.
   *
   * @this Input
   */
  function addPointerEventListeners() {
    var input;

    input = this;

    document.addEventListener('mouseover', handlePointerOver, false);
    document.addEventListener('mouseout', handlePointerOut, false);
    document.addEventListener('mousemove', handlePointerMove, false);
    document.addEventListener('mousedown', handlePointerDown, false);
    document.addEventListener('mouseup', handlePointerUp, false);
    // TODO: add touch support

    function handlePointerOver(event) {
      var tile;

      if (tile = getTileFromEvent(event)) {

        if (tile.element.getAttribute('data-hg-post-tile')) {
          // TODO: reset the other tile parameters
        }

        input.grid.setHoveredTile(tile);
      }
    }

    function handlePointerOut(event) {
      var tile;

      if (!event.relatedTarget || event.relatedTarget.nodeName === 'HTML') {
        console.log('The mouse left the viewport');

        input.grid.setHoveredTile(null);
      } else if (tile = getTileFromEvent(event)) {

        if (tile.element.getAttribute('data-hg-post-tile')) {
          // TODO: reset the other tile parameters
        }

        input.grid.setHoveredTile(null);

        window.hg.controller.transientJobs.highlightHover.create(input.grid, tile);

        event.stopPropagation();
      }
    }

    function handlePointerMove(event) {
      if (event.target.getAttribute('data-hg-post-tile')) {
        // TODO:
      } else if (event.target.getAttribute('data-hg-tile')) {
        // TODO:
      }
    }

    function handlePointerDown(event) {
      if (event.target.getAttribute('data-hg-post-tile')) {
        // TODO:
      }
    }

    function handlePointerUp(event) {
      var tile;

      if (event.button === 0 && (tile = getTileFromEvent(event))) {

        if (tile.element.getAttribute('data-hg-post-tile')) {
          // TODO:
        }

        createClickAnimation(input.grid, tile);
      }
    }

    function getTileFromEvent(event) {
      var tileIndex;

      if (event.target.getAttribute('data-hg-tile')) {
        tileIndex = event.target.getAttribute('data-hg-index');
        return input.grid.allTiles[tileIndex];
      } else {
        return null;
      }
    }
  }

  /**
   * @param {Grid} grid
   * @param {Tile} tile
   */
  function createClickAnimation(grid, tile) {
    // Close any open post
    if (grid.isPostOpen) {
      window.hg.controller.transientJobs.closePost.create(grid, grid.expandedTile);
    }

    if (tile.holdsContent) {
      // Trigger an animation for the click
      config.possibleClickAnimations[config.contentTileClickAnimation](grid, tile);

      // Open the post for the given tile
      window.hg.controller.transientJobs.openPost.create(grid, tile);
    } else {
      // Trigger an animation for the click
      config.possibleClickAnimations[config.emptyTileClickAnimation](grid, tile);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function Input(grid) {
    var input = this;

    input.grid = grid;

    addPointerEventListeners.call(input);
  }

  Input.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Input = Input;

  console.log('Input module loaded');
})();

/**
 * This module defines a constructor for PagePost objects.
 *
 * PagePost objects handle the actual textual contents of the main, enlarged post area.
 *
 * @module PagePost
 */
(function () {

  // TODO: also update the tilepost drawing to utilize the reset job

  // TODO: refactor PagePost, TilePost, and Carousel code

  // TODO: sort post items by date

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this PagePost
   */
  function createElements() {
    var pagePost = this;

    var converter = new Showdown.converter({extensions: ['github']});

    var horizontalSideLength = window.hg.Grid.config.tileShortLengthWithGap *
        (window.hg.OpenPostJob.config.expandedDisplacementTileCount + 4.25);
    var verticalSideLength = window.hg.Grid.config.longGap *
        (window.hg.OpenPostJob.config.expandedDisplacementTileCount * 2) +
        window.hg.Grid.config.tileOuterRadius *
        (3 * window.hg.OpenPostJob.config.expandedDisplacementTileCount + 2);

    // Adjust post dimensions for smaller openings
    switch (window.hg.OpenPostJob.config.expandedDisplacementTileCount) {
      case 2:
        verticalSideLength += window.hg.Grid.config.tileOuterRadius;
        break;
      case 1:
        verticalSideLength += window.hg.Grid.config.tileOuterRadius * 3;
        horizontalSideLength -= window.hg.Grid.config.tileShortLengthWithGap;
        break;
      case 0:
        verticalSideLength += window.hg.Grid.config.tileOuterRadius * 4;
        horizontalSideLength -= window.hg.Grid.config.tileShortLengthWithGap;
        break;
      default:
        break;
    }

    var horizontalPadding = 1.15 * window.hg.Grid.config.tileShortLengthWithGap;
    var verticalPadding = 2.25 * window.hg.Grid.config.tileOuterRadius;

    var width, height, paddingX, paddingY, gradientColor1String,
      gradientColor2String, innerWrapperPaddingFromCss, innerWrapperVerticalPadding;

    if (pagePost.tile.grid.isVertical) {
      width = horizontalSideLength;
      height = verticalSideLength;
      paddingX = horizontalPadding;
      paddingY = verticalPadding;
    } else {
      width = verticalSideLength;
      height = horizontalSideLength;
      paddingX = verticalPadding;
      paddingY = horizontalPadding;
    }

    width -= paddingX * 2;
    height -= paddingY * 2;

    pagePost.paddingX = paddingX;
    pagePost.paddingY = paddingY;
    pagePost.halfWidth = width / 2;
    pagePost.halfHeight = height / 2;

    gradientColor1String = 'hsl(' +
      window.hg.Grid.config.backgroundHue + ',' +
      window.hg.Grid.config.backgroundSaturation + '%,' +
      window.hg.Grid.config.backgroundLightness + '%)';
    gradientColor2String = 'hsla(' +
      window.hg.Grid.config.backgroundHue + ',' +
      window.hg.Grid.config.backgroundSaturation + '%,' +
      window.hg.Grid.config.backgroundLightness + '%,0)';

    // ---  --- //

    var container = document.createElement('div');
    var outerWrapper = document.createElement('div');
    var innerWrapper = document.createElement('div');
    var title = document.createElement('h1');
    var content = document.createElement('div');
    var logo = document.createElement('div');
    var date = document.createElement('div');
    var urls = document.createElement('div');
    var categories = document.createElement('div');
    var topGradient = document.createElement('div');
    var bottomGradient = document.createElement('div');

    pagePost.tile.grid.parent.appendChild(container);
    container.appendChild(outerWrapper);
    outerWrapper.appendChild(innerWrapper);
    innerWrapper.appendChild(logo);
    innerWrapper.appendChild(date);
    innerWrapper.appendChild(title);
    innerWrapper.appendChild(urls);
    innerWrapper.appendChild(content);
    innerWrapper.appendChild(categories);
    container.appendChild(topGradient);
    container.appendChild(bottomGradient);

    pagePost.elements = [];
    pagePost.elements.container = container;
    pagePost.elements.title = title;
    pagePost.elements.content = content;
    pagePost.elements.logo = logo;
    pagePost.elements.date = date;
    pagePost.elements.urls = urls;
    pagePost.elements.categories = categories;

    container.setAttribute('data-hg-post-container', 'data-hg-post-container');
    container.style.position = 'absolute';
    container.style.width = width + paddingX + 'px';
    container.style.height = height + paddingY * 2 + 'px';
    container.style.margin = '0';
    container.style.padding = '0';
    container.style.overflow = 'hidden';
    container.style.zIndex = '500';

    outerWrapper.setAttribute('data-hg-post-outer-wrapper', 'data-hg-post-outer-wrapper');
    outerWrapper.style.width = width + 'px';
    outerWrapper.style.height = height + paddingY * 2 + 'px';
    outerWrapper.style.margin = '0';
    outerWrapper.style.padding = '0 0 0 ' + paddingX + 'px';
    outerWrapper.style.overflow = 'auto';

    innerWrapper.setAttribute('data-hg-post-inner-wrapper', 'data-hg-post-inner-wrapper');
    innerWrapperPaddingFromCss =
      parseInt(window.getComputedStyle(innerWrapper, null).getPropertyValue('padding-top'));
    innerWrapperVerticalPadding = innerWrapperPaddingFromCss + paddingY;
    innerWrapper.style.padding =
      innerWrapperVerticalPadding + 'px ' + innerWrapperPaddingFromCss + 'px ' +
      innerWrapperVerticalPadding + 'px ' + innerWrapperPaddingFromCss + 'px';
    innerWrapper.style.minHeight = height - innerWrapperPaddingFromCss * 2 + 'px';
    innerWrapper.style.overflowX = 'hidden';

    pagePost.innerWrapperPaddingFromCss = innerWrapperPaddingFromCss;

    title.setAttribute('data-hg-post-title', 'data-hg-post-title');
    title.innerHTML = pagePost.tile.postData.titleLong;

    topGradient.style.position = 'absolute';
    topGradient.style.top = '0';
    topGradient.style.left = paddingX + 'px';
    topGradient.style.height = paddingY + 'px';
    topGradient.style.width = width + 'px';
    topGradient.style.backgroundColor = '#000000';
    topGradient.style.background =
      'linear-gradient(0,' + gradientColor2String + ',' + gradientColor1String + ' 75%)';
    topGradient.style.pointerEvents = 'none';

    bottomGradient.style.position = 'absolute';
    bottomGradient.style.bottom = '0';
    bottomGradient.style.left = paddingX + 'px';
    bottomGradient.style.height = paddingY + 'px';
    bottomGradient.style.width = width + 'px';
    bottomGradient.style.backgroundColor = '#000000';
    bottomGradient.style.background =
      'linear-gradient(0,' + gradientColor1String + ' 25%,' + gradientColor2String + ')';
    bottomGradient.style.pointerEvents = 'none';

    content.setAttribute('data-hg-post-content', 'data-hg-post-content');
    content.innerHTML = converter.makeHtml(pagePost.tile.postData.content);

    logo.setAttribute('data-hg-post-logo', 'data-hg-post-logo');
    logo.style.backgroundImage = 'url(' + pagePost.tile.postData.logoSrc + ')';

    date.setAttribute('data-hg-post-date', 'data-hg-post-date');
    addDate.call(pagePost);

    urls.setAttribute('data-hg-post-urls', 'data-hg-post-urls');
    addUrls.call(pagePost);

    categories.setAttribute('data-hg-post-categories', 'data-hg-post-categories');
    addCategories.call(pagePost);

    // Create the Carousel and insert it before the post's main contents
    pagePost.carousel = new window.hg.Carousel(pagePost.tile.grid, pagePost, innerWrapper,
      pagePost.tile.postData.images, pagePost.tile.postData.videos, true);
    innerWrapper.removeChild(pagePost.carousel.elements.container);
    innerWrapper.insertBefore(pagePost.carousel.elements.container, urls);

    draw.call(pagePost);
  }

  /**
   * @this PagePost
   */
  function addDate() {
    var pagePost = this;
    var dateElement = pagePost.elements.date;
    var dateValue = pagePost.tile.postData.date;

    // Date values can be given as a single string or as an object with a start and end property
    if (typeof dateValue === 'object') {
      dateElement.innerHTML = dateValue.start + ' &ndash; ' + dateValue.end;
    } else {
      dateElement.innerHTML = dateValue;
    }

    // Hide the date panel if no date was given
    if (!pagePost.tile.postData.date) {
      dateElement.style.display = 'none';
    }
  }

  /**
   * @this PagePost
   */
  function addUrls() {
    var pagePost = this;
    var urlsElement = pagePost.elements.urls;
    var urlKeys = Object.keys(pagePost.tile.postData.urls);

    urlKeys.forEach(function (key) {
      addUrl(key, pagePost.tile.postData.urls[key]);
    });

    // Hide the URLs panel if no URLs were given
    if (!urlKeys.length) {
      urlsElement.style.display = 'none';
    }

    // ---  --- //

    function addUrl(key, url) {
      var label, cleanedUrl, paragraphElement, linkElement;

      // Remove the protocol from the URL to make it more human-readable
      cleanedUrl = url.replace(/^.*:\/\//, '');

      // Determine what label to use
      switch (key) {
        case 'homepage':
          label = 'Homepage';
          break;
        case 'published':
          label = 'Published at';
          break;
        case 'demo':
          label = 'Demo Site';
          break;
        case 'npm':
          label = 'NPM Registry';
          break;
        case 'bower':
          label = 'Bower Registry';
          break;
        case 'codepen':
          label = 'CodePen';
          break;
        case 'github':
          label = 'Repository';
          break;
        case 'googleCode':
          label = 'Repository';
          break;
        default:
          console.warn('Unknown URL type: ' + key);
          label = key;
          break;
      }

      // --- Create the elements --- //

      paragraphElement = document.createElement('p');
      linkElement = document.createElement('a');

      paragraphElement.innerHTML = label + ': ';
      paragraphElement.style.overflow = 'hidden';
      paragraphElement.style.whiteSpace = 'nowrap';
      paragraphElement.style.textOverflow = 'ellipsis';

      linkElement.innerHTML = cleanedUrl;
      linkElement.setAttribute('href', url);

      paragraphElement.appendChild(linkElement);
      urlsElement.appendChild(paragraphElement);
    }
  }

  /**
   * @this PagePost
   */
  function addCategories() {
    var pagePost = this;
    var categoriesElement = pagePost.elements.categories;

    pagePost.tile.postData.categories.forEach(addCategoryCard);

    // Hide the categories panel if no categories were given
    if (!pagePost.tile.postData.categories.length) {
      categoriesElement.style.display = 'none';
    }

    // ---  --- //

    function addCategoryCard(category) {
      var categoryCard = document.createElement('span');
      categoriesElement.appendChild(categoryCard);

      categoryCard.setAttribute('data-hg-post-category-card', 'data-hg-post-category-card');
      categoryCard.style.display = 'inline-block';
      categoryCard.innerHTML = category;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * @this PagePost
   */
  function loadCarouselMedia() {
    var pagePost = this;

    pagePost.carousel.loadMedia();
  }

  /**
   * @this PagePost
   */
  function draw() {
    var pagePost = this;

    pagePost.elements.container.style.left =
      pagePost.center.x - pagePost.halfWidth - pagePost.paddingX + 'px';
    pagePost.elements.container.style.top =
      pagePost.center.y - pagePost.halfHeight - pagePost.paddingY + 'px';

    pagePost.elements.container.style.opacity = pagePost.opacity;

    pagePost.carousel.draw();
  }

  /**
   * @this PagePost
   */
  function destroy() {
    var pagePost = this;

    pagePost.carousel.destroy();

    pagePost.tile.grid.parent.removeChild(pagePost.elements.container);
    pagePost.elements = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Tile} tile
   * @param {{x:Number,y:Number}} startCenter
   */
  function PagePost(tile, startCenter) {
    var pagePost = this;

    pagePost.tile = tile;
    pagePost.elements = null;
    pagePost.carousel = null;
    pagePost.opacity = 0;
    pagePost.paddingX = Number.NaN;
    pagePost.paddingY = Number.NaN;
    pagePost.halfWidth = Number.NaN;
    pagePost.halfHeight = Number.NaN;
    pagePost.innerWrapperPaddingFromCss = Number.NaN;
    pagePost.center = {
      x: startCenter.x,
      y: startCenter.y
    };

    pagePost.loadCarouselMedia = loadCarouselMedia;
    pagePost.draw = draw;
    pagePost.destroy = destroy;

    createElements.call(pagePost);

    console.log('PagePost created: postId=' + tile.postData.id +
        ', tileIndex=' + tile.originalIndex);
  }

  PagePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.PagePost = PagePost;

  console.log('PagePost module loaded');
})();

/**
 * This module defines a constructor for Sector objects.
 *
 * Sector objects define a collection of hexagonal tiles that lie within a single sector of the
 * grid--outward from a given tile position.
 *
 * Sectors are one-sixth of the grid.
 *
 * Sectors are used to animate open and close a hole in the grid around a given tile, so that the
 * contents of that tile can be shown in an expanded form.
 *
 * @module Sector
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates major and minor neighbor values and displacement values for the expanded grid
   * configuration.
   *
   * @this Sector
   */
  function setUpExpandedDisplacementValues() {
    var sector, expansionDirectionNeighborIndex, expansionDirectionNeighborDeltaX,
        expansionDirectionNeighborDeltaY;

    sector = this;

    // Compute which directions to iterate through tiles for this sector

    sector.majorNeighborIndex = sector.index;
    sector.minorNeighborIndex = (sector.index + 1) % 6;

    // Compute the axially-aligned distances between adjacent tiles

    sector.majorNeighborDelta.x =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalAnchor.x -
        sector.baseTile.originalAnchor.x;
    sector.majorNeighborDelta.y =
        sector.baseTile.neighborStates[sector.majorNeighborIndex].tile.originalAnchor.y -
        sector.baseTile.originalAnchor.y;
    sector.minorNeighborDelta.x =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalAnchor.x -
        sector.baseTile.originalAnchor.x;
    sector.minorNeighborDelta.y =
        sector.baseTile.neighborStates[sector.minorNeighborIndex].tile.originalAnchor.y -
        sector.baseTile.originalAnchor.y;

    // Compute the axially-aligned displacement values of this sector when the grid is expanded

    expansionDirectionNeighborIndex = (sector.index + 5) % 6;

    expansionDirectionNeighborDeltaX =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalAnchor.x -
        sector.baseTile.originalAnchor.x;
    expansionDirectionNeighborDeltaY =
        sector.baseTile.neighborStates[expansionDirectionNeighborIndex].tile.originalAnchor.y -
        sector.baseTile.originalAnchor.y;

    sector.expandedDisplacement.x =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaX;
    sector.expandedDisplacement.y =
        sector.expandedDisplacementTileCount * expansionDirectionNeighborDeltaY;

    // Set up the base position values for this overall grid

    sector.originalAnchor.x = sector.baseTile.originalAnchor.x + sector.majorNeighborDelta.x;
    sector.originalAnchor.y = sector.baseTile.originalAnchor.y + sector.majorNeighborDelta.y;
    sector.currentAnchor.x = sector.originalAnchor.x;
    sector.currentAnchor.y = sector.originalAnchor.y;
  }

  /**
   * Populates the collection of tiles that lie within this sector. These include both the
   * pre-existing tiles and new tiles that are created.
   *
   * @this Sector
   */
  function setUpTiles() {
    var sector;

    sector = this;

    sector.tilesByIndex = [];
    sector.newTiles = [];
    sector.tiles = [];

    // Get the old and new tiles for this sector, and set up neighbor states for the expanded grid
    // configuration
    collectOldTilesInSector.call(sector);
    collectNewTilesInSector.call(sector);

    // Re-assign temporary neighbor states for tiles in this sector
    initializeExpandedStateInternalTileNeighbors.call(sector);

    // Convert the two-dimensional array to a flat array
    flattenTileCollection.call(sector);
  }

  /**
   * Collects references to the pre-existing tiles that lie within this sector.
   *
   * PRE-CONDITION: The baseTile is not a border tile (i.e., it has six neighbors).
   *
   * POST-CONDITION: This double-pass major-to-minor line-iteration algorithm is NOT guaranteed to
   * collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is
   * when the viewport's aspect ratio is very large or very small).
   *
   * @this Sector
   */
  function collectOldTilesInSector() {
    var sector;

    sector = this;

    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder();
    iterateOverTilesInSectorInMinorOrder();

    // ---  --- //

    function iterateOverTilesInSectorInMajorOrder() {
      var majorTile, currentTile, majorIndex, minorIndex;

      majorIndex = 0;
      majorTile = sector.baseTile.neighborStates[sector.majorNeighborIndex].tile;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        currentTile = majorTile;
        minorIndex = 0;

        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        do {
          // Store the current tile in the "row" if it hasn't already been stored
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            addOldTileToSector.call(sector, currentTile, majorIndex, minorIndex);
          }

          minorIndex++;

        } while (currentTile.neighborStates[sector.minorNeighborIndex] &&
            (currentTile = currentTile.neighborStates[sector.minorNeighborIndex].tile));

        majorIndex++;

      } while (majorTile.neighborStates[sector.majorNeighborIndex] &&
          (majorTile = majorTile.neighborStates[sector.majorNeighborIndex].tile));
    }

    function iterateOverTilesInSectorInMinorOrder() {
      var minorTile, currentTile, majorIndex, minorIndex;

      minorIndex = 0;
      minorTile = sector.baseTile.neighborStates[sector.majorNeighborIndex].tile;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        currentTile = minorTile;
        majorIndex = 0;

        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        do {
          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Store the current tile in the "column" if it hasn't already been stored
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            addOldTileToSector.call(sector, currentTile, majorIndex, minorIndex);
          }

          majorIndex++;

        } while (currentTile.neighborStates[sector.majorNeighborIndex] &&
            (currentTile = currentTile.neighborStates[sector.majorNeighborIndex].tile));

        minorIndex++;

      } while (minorTile.neighborStates[sector.minorNeighborIndex] &&
          (minorTile = minorTile.neighborStates[sector.minorNeighborIndex].tile));
    }
  }

  /**
   * Creates new tiles that will be shown within this sector.
   *
   * PRE-CONDITION: The baseTile is not a border tile (i.e., it has six neighbors).
   *
   * POST-CONDITION: this double-pass major-to-minor line-iteration algorithm is NOT guaranteed to
   * collect all of the tiles in the viewport (but it is likely to) (the breaking edge case is
   * when the viewport's aspect ratio is very large or very small).
   *
   * @this Sector
   */
  function collectNewTilesInSector() {
    var sector, bounds;

    sector = this;

    bounds = computeBounds();

    // Collect all of the tiles for this sector into a two-dimensional array
    iterateOverTilesInSectorInMajorOrder(bounds);
    iterateOverTilesInSectorInMinorOrder(bounds);

    // ---  --- //

    /**
     * This calculates the min and max x and y coordinates for the furthest positions at which we may need to create
     * new tiles.
     *
     * This considers tile positions within the closed grid--i.e., before the sectors have expanded.
     *
     * These extremes are found by the following steps:
     *
     * 1. Calculate a viewport bounding box around the base tile
     * 2. Subtract or add an offset to the bounding box according to the displacement that the sector will undergo
     *
     * @returns {{minX: Number, maxX: Number, minY: Number, maxY: Number}}
     */
    function computeBounds() {
      var minX, maxX, minY, maxY, viewportHalfWidth, viewportHalfHeight;

      // Calculate the dimensions of the viewport with a little extra padding around the edges
      viewportHalfWidth = window.innerWidth / 2 + window.hg.Grid.config.tileLongLengthWithGap;
      viewportHalfHeight = window.innerHeight / 2 + window.hg.Grid.config.tileLongLengthWithGap;

      // Calculate the viewport bounding box around the base tile BEFORE sector expansion has been considered
      minX = sector.baseTile.originalAnchor.x - viewportHalfWidth;
      maxX = sector.baseTile.originalAnchor.x + viewportHalfWidth;
      minY = sector.baseTile.originalAnchor.y - viewportHalfHeight;
      maxY = sector.baseTile.originalAnchor.y + viewportHalfHeight;

      // Add the offset from sector expansion
      minX -= sector.expandedDisplacement.x;
      maxX -= sector.expandedDisplacement.x;
      minY -= sector.expandedDisplacement.y;
      maxY -= sector.expandedDisplacement.y;

      return {
        minX: minX,
        maxX: maxX,
        minY: minY,
        maxY: maxY
      };
    }

    function iterateOverTilesInSectorInMajorOrder(bounds) {
      var startX, startY, anchorX, anchorY, majorIndex, minorIndex;

      startX = sector.baseTile.originalAnchor.x + sector.majorNeighborDelta.x;
      startY = sector.baseTile.originalAnchor.y + sector.majorNeighborDelta.y;

      // Set up the first "column"
      majorIndex = 0;
      minorIndex = 0;
      anchorX = startX;
      anchorY = startY;

      // Iterate over the major indices of the sector (aka, the "rows" of the sector)
      do {
        // Set up the inner array for this "row" of the sector
        sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

        // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
        do {
          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, anchorX, anchorY);
          }

          // Set up the next "column"
          minorIndex++;
          anchorX += sector.minorNeighborDelta.x;
          anchorY += sector.minorNeighborDelta.y;

        } while (anchorX >= bounds.minX && anchorX <= bounds.maxX && anchorY >= bounds.minY && anchorY <= bounds.maxY);

        // Set up the next "row"
        majorIndex++;
        minorIndex = 0;
        anchorX = startX + majorIndex * sector.majorNeighborDelta.x;
        anchorY = startY + majorIndex * sector.majorNeighborDelta.y;

      } while (anchorX >= bounds.minX && anchorX <= bounds.maxX && anchorY >= bounds.minY && anchorY <= bounds.maxY);
    }

    function iterateOverTilesInSectorInMinorOrder(bounds) {
      var startX, startY, anchorX, anchorY, majorIndex, minorIndex;

      startX = sector.baseTile.originalAnchor.x + sector.majorNeighborDelta.x;
      startY = sector.baseTile.originalAnchor.y + sector.majorNeighborDelta.y;

      // Set up the first "column"
      majorIndex = 0;
      minorIndex = 0;
      anchorX = startX;
      anchorY = startY;

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      do {
        // Iterate over the major indices of the sector (aka, the "rows" of the sector)
        do {
          // Set up the inner array for this "row" of the sector
          sector.tilesByIndex[majorIndex] = sector.tilesByIndex[majorIndex] || [];

          // Create a new tile if one did not already exist for this position
          if (!sector.tilesByIndex[majorIndex][minorIndex]) {
            createNewTileInSector.call(sector, majorIndex, minorIndex, anchorX, anchorY);
          }

          // Set up the next "row"
          majorIndex++;
          anchorX += sector.majorNeighborDelta.x;
          anchorY += sector.majorNeighborDelta.y;

        } while (anchorX >= bounds.minX && anchorX <= bounds.maxX && anchorY >= bounds.minY && anchorY <= bounds.maxY);

        // Set up the next "column"
        majorIndex = 0;
        minorIndex++;
        anchorX = startX + minorIndex * sector.minorNeighborDelta.x;
        anchorY = startY + minorIndex * sector.minorNeighborDelta.y;

      } while (anchorX >= bounds.minX && anchorX <= bounds.maxX && anchorY >= bounds.minY && anchorY <= bounds.maxY);
    }
  }

  /**
   * Adds the given pre-existing tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the tile's expandedState configuration.
   *
   * @this Sector
   * @param {Tile} tile
   * @param {Number} majorIndex
   * @param {Number} minorIndex
   */
  function addOldTileToSector(tile, majorIndex, minorIndex) {
    var sector = this;

    sector.tilesByIndex[majorIndex][minorIndex] = tile;

    window.hg.Tile.initializeTileExpandedState(tile, sector, majorIndex, minorIndex);

    tile.sectorAnchorOffset.x = tile.originalAnchor.x - sector.originalAnchor.x;
    tile.sectorAnchorOffset.y = tile.originalAnchor.y - sector.originalAnchor.y;
  }

  /**
   * Adds a new tile to this Sector's two-dimensional tile collection.
   *
   * Initializes the new tile's expandedState configuration.
   *
   * @this Sector
   * @param {Number} majorIndex
   * @param {Number} minorIndex
   * @param {Number} anchorX
   * @param {Number} anchorY
   */
  function createNewTileInSector(majorIndex, minorIndex, anchorX, anchorY) {
    var sector = this;

    var tile = new window.hg.Tile(sector.grid.svg, sector.grid, anchorX, anchorY,
        window.hg.Grid.config.tileOuterRadius, sector.grid.isVertical, window.hg.Grid.config.tileHue,
        window.hg.Grid.config.tileSaturation, window.hg.Grid.config.tileLightness, null, Number.NaN, Number.NaN,
        Number.NaN, true, false, false, false, window.hg.Grid.config.tileMass);

    addOldTileToSector.call(sector, tile, majorIndex, minorIndex);
    sector.newTiles[sector.newTiles.length] = tile;

    return tile;
  }

  /**
   * Calculates and stores the internal neighbor states for the expanded grid configuration for
   * each tile in this Sector.
   *
   * POST-CONDITION: this does not address external neighbor relations for tiles that lie on the
   * outside edge of this sector.
   *
   * @this Sector
   */
  function initializeExpandedStateInternalTileNeighbors() {
    var sector, majorIndex, minorIndex;

    sector = this;

    // Iterate over the major indices of the sector (aka, the "rows" of the sector)
    for (majorIndex = 0; sector.tilesByIndex[majorIndex]; majorIndex += 1) {

      // Iterate over the minor indices of the sector (aka, the "columns" of the sector)
      for (minorIndex in sector.tilesByIndex[majorIndex]) {
        setTileNeighborStates(sector, majorIndex, parseInt(minorIndex));
      }
    }

    // ---  --- //

    function setTileNeighborStates(sector, majorIndex, minorIndex) {
      var tile, neighborRelationIndex, neighborMajorIndex, neighborMinorIndex;

      tile = sector.tilesByIndex[majorIndex][minorIndex];

      for (neighborRelationIndex = 0; neighborRelationIndex < 6; neighborRelationIndex += 1) {

        // Determine the major and minor indices of the current neighbor
        switch (neighborRelationIndex) {
          case sector.index:
            neighborMajorIndex = majorIndex + 1;
            neighborMinorIndex = minorIndex;
            break;
          case (sector.index + 1) % 6:// TODO: pre-compute these case values
            neighborMajorIndex = majorIndex;
            neighborMinorIndex = minorIndex + 1;
            break;
          case (sector.index + 2) % 6:
            neighborMajorIndex = majorIndex - 1;
            neighborMinorIndex = minorIndex + 1;
            break;
          case (sector.index + 3) % 6:
            neighborMajorIndex = majorIndex - 1;
            neighborMinorIndex = minorIndex;
            break;
          case (sector.index + 4) % 6:
            neighborMajorIndex = majorIndex;
            neighborMinorIndex = minorIndex - 1;
            break;
          case (sector.index + 5) % 6:
            neighborMajorIndex = majorIndex + 1;
            neighborMinorIndex = minorIndex - 1;
            break;
          default:
            throw new Error('Invalid neighborRelationIndex: ' + neighborRelationIndex);
        }

        // Has a tile been created for the neighbor position?
        if (sector.tilesByIndex[neighborMajorIndex] &&
            sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex]) {

          window.hg.Tile.setTileNeighborState(tile, neighborRelationIndex,
              sector.tilesByIndex[neighborMajorIndex][neighborMinorIndex]);
        }
      }
    }
  }

  /**
   * Converts the two-dimensional sector.tilesByIndex array into the flat sector.tiles array.
   *
   * @this Sector
   */
  function flattenTileCollection() {
    var sector, i, majorIndex, minorIndex;

    sector = this;

    i = 0;
    for (majorIndex in sector.tilesByIndex) {
      for (minorIndex in sector.tilesByIndex[majorIndex]) {
        sector.tiles[i++] = sector.tilesByIndex[majorIndex][minorIndex];
      }
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Calculates and stores the external neighbor states for the expanded grid configuration for
   * each tile in this Sector.
   *
   * @this Sector
   * @param {Array.<Sector>} sectors
   */
  function initializeExpandedStateExternalTileNeighbors(sectors) {
    var sector, innerEdgeTiles, neighborTileArrays, i, count, lowerNeighborIndex,
        upperNeighborIndex, innerEdgeNeighborSector, neighborMajorIndex;

    sector = this;

    lowerNeighborIndex = (sector.index + 2) % 6;
    upperNeighborIndex = (sector.index + 3) % 6;

    innerEdgeNeighborSector = sectors[(sector.index + 1) % 6];

    innerEdgeTiles = sector.tilesByIndex[0];
    neighborTileArrays = innerEdgeNeighborSector.tilesByIndex;

    i = sector.expandedDisplacementTileCount;
    neighborMajorIndex = 0;

    // --- Handle the first edge tile --- //

    if (innerEdgeTiles[i]) {
      // The first edge tile with an external neighbor will only have the lower neighbor
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], lowerNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);
    }

    // --- Handle the middle edge tiles --- //

    for (i += 1, count = innerEdgeTiles.length - 1; i < count; i += 1) {

      // The upper neighbor for the last tile
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], upperNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);

      neighborMajorIndex += 1;

      // The lower neighbor for the last tile
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], lowerNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);
    }

    // --- Handle the last edge tile --- //

    if (innerEdgeTiles[i]) {
      // The upper neighbor for the last tile
      window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], upperNeighborIndex,
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);

      neighborMajorIndex += 1;

      // The last edge tile with an external neighbor might not have the lower neighbor
      if (innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex] &&
          innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]) {
        window.hg.Tile.setTileNeighborState(innerEdgeTiles[i], lowerNeighborIndex,
            innerEdgeNeighborSector.tilesByIndex[neighborMajorIndex][0]);
      }
    }

    // --- Mark the inner edge tiles as border tiles --- //

    // If the dimensions of the expanded post area are larger than that of the viewport, then we cannot simply use the
    // number of tiles along a side of this area
    count = sector.expandedDisplacementTileCount + 1;
    count = innerEdgeTiles.length < count ? innerEdgeTiles.length : count;

    for (i = 0; i < count; i += 1) {
      innerEdgeTiles[i].expandedState.isBorderTile = true;
    }

    // --- Mark the outer edge tiles as border tiles --- //

    i = innerEdgeTiles.length - 1 - sector.expandedDisplacementTileCount;
    i = i < 0 ? 0 : i;

    for (count = neighborTileArrays.length; i < count; i += 1) {
      if (neighborTileArrays[i][0]) {
        neighborTileArrays[i][0].expandedState.isBorderTile = true;
      }
    }

    // --- Mark the outermost sector tiles as border tiles --- //
    for (i = 0, count = sector.tilesByIndex.length; i < count; i += 1) {
      if (sector.tilesByIndex[i].length) {
        sector.tilesByIndex[i][sector.tilesByIndex[i].length - 1].expandedState.isBorderTile = true;
      }
    }
  }

  /**
   * Frees up memory used by this Sector.
   *
   * @this Sector
   * @param {Boolean} alsoDestroyOriginalTileExpandedState
   */
  function destroy(alsoDestroyOriginalTileExpandedState) {
    var sector, i, count;

    sector = this;

    if (alsoDestroyOriginalTileExpandedState) {
      for (i = 0, count = sector.tiles.length; i < count; i += 1) {
        sector.tiles[i].expandedState = null;
      }
    }

    for (i = 0, count = sector.newTiles.length; i < count; i += 1) {
      sector.newTiles[i].neighborStates = null;
      sector.newTiles[i].destroy();
    }
  }

  /**
   * Updates the base position of this Sector and the positions of all of its Tiles.
   *
   * @this Sector
   * @param {Boolean} isExpanded
   */
  function setSectorOriginalPositionForExpansion(isExpanded) {
    var sector, i, count, dx, dy;

    sector = this;

    if (isExpanded) {
      dx = sector.expandedDisplacement.x;
      dy = sector.expandedDisplacement.y;
    } else {
      dx = -sector.expandedDisplacement.x;
      dy = -sector.expandedDisplacement.y;
    }

    sector.originalAnchor.x += dx;
    sector.originalAnchor.y += dy;

    for (i = 0, count = sector.tiles.length; i < count; i += 1) {
      sector.tiles[i].originalAnchor.x += dx;
      sector.tiles[i].originalAnchor.y += dy;
    }
  }

  /**
   * Updates the current position of this Sector and the positions of all of its Tiles.
   *
   * @this Sector
   * @param {Number} dx
   * @param {Number} dy
   */
  function updateSectorCurrentPosition(dx, dy) {
    var sector, i, count;

    sector = this;

    sector.currentAnchor.x = sector.originalAnchor.x + dx;
    sector.currentAnchor.y = sector.originalAnchor.y + dy;

    for (i = 0, count = sector.tiles.length; i < count; i += 1) {
      sector.tiles[i].currentAnchor.x += dx;
      sector.tiles[i].currentAnchor.y += dy;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @global
   * @constructor
   * @param {Grid} grid
   * @param {Tile} baseTile
   * @param {Number} sectorIndex
   * @param {Number} expandedDisplacementTileCount
   *
   * PRE-CONDITION: The given baseTile is not a border tile (i.e., it has six neighbors).
   * PRE-CONDITION: The grid is in a closed state.
   *
   * POST-CONDITION: This sector is NOT guaranteed to collect all of the pre-existing tiles in the
   * sector nor to create all of the needed new tiles in the sector (but it probably will).
   */
  function Sector(grid, baseTile, sectorIndex, expandedDisplacementTileCount) {
    var sector = this;

    sector.grid = grid;
    sector.baseTile = baseTile;
    sector.index = sectorIndex;
    sector.expandedDisplacementTileCount = expandedDisplacementTileCount;
    sector.originalAnchor = {x: Number.NaN, y: Number.NaN};
    sector.currentAnchor = {x: Number.NaN, y: Number.NaN};
    sector.majorNeighborDelta = {x: Number.NaN, y: Number.NaN};
    sector.minorNeighborDelta = {x: Number.NaN, y: Number.NaN};
    sector.expandedDisplacement = {x: Number.NaN, y: Number.NaN};
    sector.tiles = null;
    sector.tilesByIndex = null;
    sector.newTiles = null;

    sector.initializeExpandedStateExternalTileNeighbors =
        initializeExpandedStateExternalTileNeighbors;
    sector.destroy = destroy;
    sector.setOriginalPositionForExpansion = setSectorOriginalPositionForExpansion;
    sector.updateCurrentPosition = updateSectorCurrentPosition;

    setUpExpandedDisplacementValues.call(sector);
    setUpTiles.call(sector);
  }

  Sector.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Sector = Sector;

  console.log('Sector module loaded');
})();

/**
 * This module defines a constructor for Tile objects.
 *
 * Tile objects handle the particle logic and the hexagon SVG-shape logic for a single
 * hexagonal tile within a Grid.
 *
 * @module Tile
 */
(function () {
  /**
   * @typedef {Object} PostData
   * @property {String} id
   * @property {String} titleShort
   * @property {String} titleLong
   * @property {String} thumbnailSrc
   * @property {Array.<String>} mainImages
   * @property {String} content
   */

  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  // TODO: play with these
  config.dragCoeff = 0.01;

  config.neighborSpringCoeff = 0.00001;
  config.neighborDampingCoeff = 0.001;

  config.innerAnchorSpringCoeff = 0.00004;
  config.innerAnchorDampingCoeff = 0.001;

  config.borderAnchorSpringCoeff = 0.00004;
  config.borderAnchorDampingCoeff = 0.001;

  config.forceSuppressionLowerThreshold = 0.0005;
  config.velocitySuppressionLowerThreshold = 0.0005;
  // TODO: add similar, upper thresholds

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.forceSuppressionThresholdNegative = -config.forceSuppressionLowerThreshold;
    config.velocitySuppressionThresholdNegative = -config.velocitySuppressionLowerThreshold;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates the polygon element for this tile.
   *
   * @this Tile
   */
  function createElement() {
    var tile, id;

    tile = this;

    id = !isNaN(tile.originalIndex) ? tile.originalIndex : parseInt(Math.random() * 1000000 + 1000);

    tile.originalVertexDeltas = computeVertexDeltas(tile.outerRadius, tile.isVertical);
    tile.currentVertexDeltas = tile.originalVertexDeltas.slice(0);
    tile.vertices = [];
    updateVertices.call(tile, tile.currentAnchor.x, tile.currentAnchor.y);

    tile.element = document.createElementNS(window.hg.util.svgNamespace, 'polygon');
    tile.svg.appendChild(tile.element);

    tile.element.id = 'hg-' + id;
    tile.element.setAttribute('data-hg-tile', 'data-hg-tile');
    tile.element.style.cursor = 'pointer';

    // Set the color and vertices
    draw.call(tile);
  }

  /**
   * Creates the particle properties for this tile.
   *
   * @this Tile
   * @param {Number} mass
   */
  function createParticle(mass) {
    var tile;

    tile = this;

    tile.particle = {};
    tile.particle.px = tile.currentAnchor.x;
    tile.particle.py = tile.currentAnchor.y;
    tile.particle.vx = 0;
    tile.particle.vy = 0;
    tile.particle.fx = 0;
    tile.particle.fy = 0;
    tile.particle.m = mass;
    tile.particle.forceAccumulatorX = 0;
    tile.particle.forceAccumulatorY = 0;
  }

  /**
   * Computes and stores the locations of the vertices of the hexagon for this tile.
   *
   * @this Tile
   * @param {Number} anchorX
   * @param {Number} anchorY
   */
  function updateVertices(anchorX, anchorY) {
    var tile, trigIndex, coordIndex;

    tile = this;

    for (trigIndex = 0, coordIndex = 0; trigIndex < 6; trigIndex += 1) {
      tile.vertices[coordIndex] = anchorX + tile.currentVertexDeltas[coordIndex++];
      tile.vertices[coordIndex] = anchorY + tile.currentVertexDeltas[coordIndex++];
    }
  }

  /**
   * Creates a new TilePost object with this Tile's post data.
   *
   * @this Tile
   */
  function createTilePost() {
    var tile = this;

    tile.element.setAttribute('data-hg-post-tilePost', 'data-hg-post-tilePost');

    tile.tilePost = new window.hg.TilePost(tile);
  }

  /**
   * Destroys this Tile's TilePost object.
   *
   * @this Tile
   */
  function destroyTilePost() {
    var tile = this;

    tile.element.removeAttribute('data-hg-post-tilePost');

    tile.tilePost.destroy();
    tile.tilePost = null;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Initializes some static fields that can be pre-computed.
   */
  function initStaticFields() {
    var i, theta, deltaTheta, horizontalStartTheta, verticalStartTheta;

    deltaTheta = Math.PI / 3;
    horizontalStartTheta = -deltaTheta;
    verticalStartTheta = Math.PI / 6 - 2 * deltaTheta;

    config.horizontalSines = [];
    config.horizontalCosines = [];
    for (i = 0, theta = horizontalStartTheta; i < 6; i += 1, theta += deltaTheta) {
      config.horizontalSines[i] = Math.sin(theta);
      config.horizontalCosines[i] = Math.cos(theta);
    }

    config.verticalSines = [];
    config.verticalCosines = [];
    for (i = 0, theta = verticalStartTheta; i < 6; i += 1, theta += deltaTheta) {
      config.verticalSines[i] = Math.sin(theta);
      config.verticalCosines[i] = Math.cos(theta);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this tile's content.
   *
   * @this Tile
   * @param {?Object} postData
   */
  function setContent(postData) {
    var tile, usedToHoldContent;

    tile = this;

    usedToHoldContent = tile.holdsContent;

    tile.postData = postData;
    tile.holdsContent = !!postData;

    if (usedToHoldContent) {
      destroyTilePost.call(tile);
      createTilePost.call(tile);
    } else {
      createTilePost.call(tile);
    }
  }

  /**
   * Sets this tile's neighbor tiles.
   *
   * @this Tile
   * @param {Array.<Tile>} neighborTiles
   */
  function setNeighborTiles(neighborTiles) {
    var tile, i, neighborTile;

    tile = this;

    for (i = 0; i < 6; i += 1) {
      neighborTile = neighborTiles[i];

      setTileNeighborState(tile, i, neighborTile);
    }
  }

  /**
   * Sets this tile's color values.
   *
   * @this Tile
   * @param {Number} hue
   * @param {Number} saturation
   * @param {Number} lightness
   */
  function setColor(hue, saturation, lightness) {
    var tile = this;

    if (tile.isHighlighted) {
      hue = hue + window.hg.HighlightHoverJob.config.deltaHue;
      saturation = saturation + window.hg.HighlightHoverJob.config.deltaSaturation;
      lightness = lightness + window.hg.HighlightHoverJob.config.deltaLightness;
    }

    tile.originalColor.h = hue;
    tile.originalColor.s = saturation;
    tile.originalColor.l = lightness;
    
    tile.currentColor.h = hue;
    tile.currentColor.s = saturation;
    tile.currentColor.l = lightness;
  }

  /**
   * Sets whether this tile is highlighted.
   *
   * @this Tile
   * @param {Boolean} isHighlighted
   */
  function setIsHighlighted(isHighlighted) {
    var tile, hue, saturation, lightness, backgroundImageScreenOpacity;

    tile = this;

    if (isHighlighted) {
      if (tile.isHighlighted) {
        // Nothing is changing
        hue = tile.originalColor.h;
        saturation = tile.originalColor.s;
        lightness = tile.originalColor.l;
      } else {
        // Add the highlight
        hue = tile.originalColor.h + window.hg.HighlightHoverJob.config.deltaHue * window.hg.HighlightHoverJob.config.opacity;
        saturation = tile.originalColor.s + window.hg.HighlightHoverJob.config.deltaSaturation * window.hg.HighlightHoverJob.config.opacity;
        lightness = tile.originalColor.l + window.hg.HighlightHoverJob.config.deltaLightness * window.hg.HighlightHoverJob.config.opacity;
      }
    } else {
      if (tile.isHighlighted) {
        // Remove the highlight
        hue = tile.originalColor.h - window.hg.HighlightHoverJob.config.deltaHue * window.hg.HighlightHoverJob.config.opacity;
        saturation = tile.originalColor.s - window.hg.HighlightHoverJob.config.deltaSaturation * window.hg.HighlightHoverJob.config.opacity;
        lightness = tile.originalColor.l - window.hg.HighlightHoverJob.config.deltaLightness * window.hg.HighlightHoverJob.config.opacity;
      } else {
        // Nothing is changing
        hue = tile.originalColor.h;
        saturation = tile.originalColor.s;
        lightness = tile.originalColor.l;
      }
    }

    tile.originalColor.h = hue;
    tile.originalColor.s = saturation;
    tile.originalColor.l = lightness;

    tile.currentColor.h = hue;
    tile.currentColor.s = saturation;
    tile.currentColor.l = lightness;

    tile.isHighlighted = isHighlighted;
  }

  /**
   * Update the state of this tile particle for the current time step.
   *
   * @this Tile
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var tile, i, count, neighborStates, isBorderTile, neighborState, lx, ly, lDotX, lDotY,
        dotProd, length, temp, springForceX, springForceY;

    tile = this;

    if (!tile.particle.isFixed) {

      // Some different properties should be used when the grid is expanded
      neighborStates = tile.getNeighborStates();
      isBorderTile = tile.getIsBorderTile();

      // --- Accumulate forces --- //

      // --- Drag force --- //

      tile.particle.forceAccumulatorX += -config.dragCoeff * tile.particle.vx;
      tile.particle.forceAccumulatorY += -config.dragCoeff * tile.particle.vy;

      // --- Spring forces from neighbor tiles --- //

      for (i = 0, count = neighborStates.length; i < count; i += 1) {
        neighborState = neighborStates[i];

        if (neighborState) {
          if (neighborState.springForceX) {
            tile.particle.forceAccumulatorX += neighborState.springForceX;
            tile.particle.forceAccumulatorY += neighborState.springForceY;

            neighborState.springForceX = 0;
            neighborState.springForceY = 0;
          } else {
            lx = neighborState.tile.particle.px - tile.particle.px;
            ly = neighborState.tile.particle.py - tile.particle.py;
            lDotX = neighborState.tile.particle.vx - tile.particle.vx;
            lDotY = neighborState.tile.particle.vy - tile.particle.vy;
            dotProd = lx * lDotX + ly * lDotY;
            length = Math.sqrt(lx * lx + ly * ly);

            temp = (config.neighborSpringCoeff * (length - neighborState.restLength) +
                config.neighborDampingCoeff * dotProd / length) / length;
            springForceX = lx * temp;
            springForceY = ly * temp;

            tile.particle.forceAccumulatorX += springForceX;
            tile.particle.forceAccumulatorY += springForceY;

            neighborState.neighborsRelationshipObj.springForceX = -springForceX;
            neighborState.neighborsRelationshipObj.springForceY = -springForceY;
          }
        }
      }

      // --- Spring forces from currentAnchor point --- //

      lx = tile.currentAnchor.x - tile.particle.px;
      ly = tile.currentAnchor.y - tile.particle.py;
      length = Math.sqrt(lx * lx + ly * ly);

      if (length > 0) {
        lDotX = -tile.particle.vx;
        lDotY = -tile.particle.vy;
        dotProd = lx * lDotX + ly * lDotY;

        if (isBorderTile) {
          temp = (config.borderAnchorSpringCoeff * length + config.borderAnchorDampingCoeff *
              dotProd / length) / length;
        } else {
          temp = (config.innerAnchorSpringCoeff * length + config.innerAnchorDampingCoeff *
              dotProd / length) / length;
        }

        springForceX = lx * temp;
        springForceY = ly * temp;

        tile.particle.forceAccumulatorX += springForceX;
        tile.particle.forceAccumulatorY += springForceY;
      }

      // --- Update particle state --- //

      tile.particle.fx = tile.particle.forceAccumulatorX / tile.particle.m * deltaTime;
      tile.particle.fy = tile.particle.forceAccumulatorY / tile.particle.m * deltaTime;
      tile.particle.px += tile.particle.vx * deltaTime;
      tile.particle.py += tile.particle.vy * deltaTime;
      tile.particle.vx += tile.particle.fx;
      tile.particle.vy += tile.particle.fy;

      ////////////////////////////////////////////////////////////////////////////////////
      // TODO: remove me!
      var ap = tile.particle,
          apx = ap.px,
          apy = ap.py,
          avx = ap.vx,
          avy = ap.vy,
          afx = ap.fx,
          afy = ap.fy,
          afAccx = ap.forceAccumulatorX,
          afAccy = ap.forceAccumulatorY;
      if (tile.originalIndex === 0) {
        //console.log('tile 0!');
      }
      if (isNaN(tile.particle.px)) {
        console.log('tile.particle.px=' + tile.particle.px);
      }
      if (isNaN(tile.particle.py)) {
        console.log('tile.particle.py=' + tile.particle.py);
      }
      if (isNaN(tile.particle.vx)) {
        console.log('tile.particle.vx=' + tile.particle.vx);
      }
      if (isNaN(tile.particle.vy)) {
        console.log('tile.particle.vy=' + tile.particle.vy);
      }
      if (isNaN(tile.particle.fx)) {
        console.log('tile.particle.fx=' + tile.particle.fx);
      }
      if (isNaN(tile.particle.fy)) {
        console.log('tile.particle.fy=' + tile.particle.fy);
      }
      // TODO: remove me!
      ////////////////////////////////////////////////////////////////////////////////////

      // Kill all velocities and forces below a threshold
      tile.particle.fx = tile.particle.fx < config.forceSuppressionLowerThreshold &&
          tile.particle.fx > config.forceSuppressionThresholdNegative ?
          0 : tile.particle.fx;
      tile.particle.fy = tile.particle.fy < config.forceSuppressionLowerThreshold &&
          tile.particle.fy > config.forceSuppressionThresholdNegative ?
          0 : tile.particle.fy;
      tile.particle.vx = tile.particle.vx < config.velocitySuppressionLowerThreshold &&
          tile.particle.vx > config.velocitySuppressionThresholdNegative ?
          0 : tile.particle.vx;
      tile.particle.vy = tile.particle.vy < config.velocitySuppressionLowerThreshold &&
          tile.particle.vy > config.velocitySuppressionThresholdNegative ?
          0 : tile.particle.vy;

      // Reset force accumulator for next time step
      tile.particle.forceAccumulatorX = 0;
      tile.particle.forceAccumulatorY = 0;

      // Compute new vertex locations
      updateVertices.call(tile, tile.particle.px, tile.particle.py);
    }
  }

  /**
   * Update the SVG attributes for this tile to match its current particle state.
   *
   * @this Tile
   */
  function draw() {
    var tile, i, pointsString, colorString;

    tile = this;

    // Set the vertices
    for (i = 0, pointsString = ''; i < 12;) {
      pointsString += tile.vertices[i++] + ',' + tile.vertices[i++] + ' ';
    }
    tile.element.setAttribute('points', pointsString);

    if (!tile.holdsContent) {
      // Set the color
      colorString = 'hsl(' + tile.currentColor.h + ',' +
      tile.currentColor.s + '%,' +
      tile.currentColor.l + '%)';
      tile.element.setAttribute('fill', colorString);
    } else {
      // Set the position and opacity of the TilePost
      tile.tilePost.draw();
    }
  }

  /**
   * Adds the given force, which will take effect during the next call to update.
   *
   * @this Tile
   * @param {Number} fx
   * @param {Number} fy
   */
  function applyExternalForce(fx, fy) {
    var tile;

    tile = this;

    tile.particle.forceAccumulatorX += fx;
    tile.particle.forceAccumulatorY += fy;
  }

  /**
   * Fixes the position of this tile to the given coordinates.
   *
   * @this Tile
   * @param {Number} px
   * @param {Number} py
   */
  function fixPosition(px, py) {
    var tile;

    tile = this;

    tile.particle.isFixed = true;
    tile.particle.px = px;
    tile.particle.py = py;
  }

  /**
   * @returns {Object}
   */
  function getNeighborStates() {
    var tile = this;
    return tile.grid.isPostOpen ? tile.expandedState.neighborStates : tile.neighborStates;
  }

  /**
   * @returns {Boolean}
   */
  function getIsBorderTile() {
    var tile = this;
    return tile.grid.isPostOpen ? tile.expandedState.isBorderTile : tile.isBorderTile;
  }

  /**
   * @param {Boolean} isBorderTile
   */
  function setIsBorderTile(isBorderTile) {
    var tile = this;

    if (tile.grid.isPostOpen) {
      tile.expandedState.isBorderTile = isBorderTile;
    } else {
      tile.isBorderTile = isBorderTile;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public static functions

  /**
   * Computes the offsets of the vertices from the center of the hexagon.
   *
   * @param {Number} radius
   * @param {Boolean} isVertical
   * @returns {Array.<Number>}
   */
  function computeVertexDeltas(radius, isVertical) {
    var trigIndex, coordIndex, sines, cosines, currentVertexDeltas;

    // Grab the pre-computed sine and cosine values
    if (isVertical) {
      sines = config.verticalSines;
      cosines = config.verticalCosines;
    } else {
      sines = config.horizontalSines;
      cosines = config.horizontalCosines;
    }

    for (trigIndex = 0, coordIndex = 0, currentVertexDeltas = [];
         trigIndex < 6;
         trigIndex += 1) {
      currentVertexDeltas[coordIndex++] = radius * cosines[trigIndex];
      currentVertexDeltas[coordIndex++] = radius * sines[trigIndex];
    }

    return currentVertexDeltas;
  }

  /**
   * Creates the neighbor-tile state for the given tile according to the given neighbor tile. Also
   * sets the reciprocal state for the neighbor tile.
   *
   * @param {Tile} tile
   * @param {Number} neighborRelationIndex
   * @param {?Tile} neighborTile
   */
  function setTileNeighborState(tile, neighborRelationIndex, neighborTile) {
    var neighborStates, neighborNeighborStates,
        neighborNeighborRelationIndex;

    neighborStates = tile.getNeighborStates();

    if (neighborTile) {
      // Initialize the neighbor relation data from this tile to its neighbor
      initializeTileNeighborRelationData(neighborStates, neighborRelationIndex, neighborTile);

      // -- Give the neighbor tile a reference to this tile --- //

      neighborNeighborStates = neighborTile.getNeighborStates();

      neighborNeighborRelationIndex = (neighborRelationIndex + 3) % 6;

      // Initialize the neighbor relation data from the neighbor to this tile
      initializeTileNeighborRelationData(neighborNeighborStates, neighborNeighborRelationIndex,
          tile);

      // Share references to each other's neighbor relation objects
      neighborStates[neighborRelationIndex].neighborsRelationshipObj =
          neighborNeighborStates[neighborNeighborRelationIndex];
      neighborNeighborStates[neighborNeighborRelationIndex].neighborsRelationshipObj =
          neighborStates[neighborRelationIndex];
    } else {
      neighborStates[neighborRelationIndex] = null;
    }

    // ---  --- //

    function initializeTileNeighborRelationData(neighborStates, neighborRelationIndex,
                                                neighborTile) {
      neighborStates[neighborRelationIndex] = neighborStates[neighborRelationIndex] || {
        tile: neighborTile,
        restLength: window.hg.Grid.config.tileShortLengthWithGap,
        neighborsRelationshipObj: null,
        springForceX: 0,
        springForceY: 0
      };
    }
  }

  /**
   * @param {Tile} tile
   * @param {Sector} sector
   * @param {Number} majorIndex
   * @param {Number} minorIndex
   */
  function initializeTileExpandedState(tile, sector, majorIndex, minorIndex) {
    tile.expandedState = {
      sector: sector,
      sectorMajorIndex: majorIndex,
      sectorMinorIndex: minorIndex,
      neighborStates: [],
      isBorderTile: false
    };
  }

  /**
   * @this Tile
   */
  function destroy() {
    var tile = this;

    if (tile.holdsContent) {
      destroyTilePost.call(tile);
    }
    tile.svg.removeChild(tile.element);
  }

  /**
   * Sets this Tile and its TilePost to have a display of none.
   *
   * @this Tile
   */
  function hide() {
    var tile = this;

    tile.element.style.display = 'none';
    if (tile.holdsContent) {
      tile.tilePost.elements.title.style.display = 'none';
    }
  }

  /**
   * Sets this Tile and its TilePost to have a display of block.
   *
   * @this Tile
   */
  function show() {
    var tile = this;

    tile.element.style.display = 'block';
    if (tile.holdsContent) {
      tile.tilePost.elements.title.style.display = 'block';
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {HTMLElement} svg
   * @param {Grid} grid
   * @param {Number} anchorX
   * @param {Number} anchorY
   * @param {Number} outerRadius
   * @param {Boolean} isVertical
   * @param {Number} hue
   * @param {Number} saturation
   * @param {Number} lightness
   * @param {?PostData} postData
   * @param {Number} tileIndex
   * @param {Number} rowIndex
   * @param {Number} columnIndex
   * @param {Boolean} isMarginTile
   * @param {Boolean} isBorderTile
   * @param {Boolean} isCornerTile
   * @param {Boolean} isInLargerRow
   * @param {Number} mass
   */
  function Tile(svg, grid, anchorX, anchorY, outerRadius, isVertical, hue, saturation, lightness,
                   postData, tileIndex, rowIndex, columnIndex, isMarginTile, isBorderTile,
                   isCornerTile, isInLargerRow, mass) {
    var tile = this;

    tile.svg = svg;
    tile.grid = grid;
    tile.element = null;
    tile.currentAnchor = {x: anchorX, y: anchorY};
    tile.originalAnchor = {x: anchorX, y: anchorY};
    tile.sectorAnchorOffset = {x: Number.NaN, y: Number.NaN};
    tile.outerRadius = outerRadius;
    tile.isVertical = isVertical;

    tile.originalColor = {h: hue, s: saturation, l: lightness};
    tile.currentColor = {h: hue, s: saturation, l: lightness};

    tile.postData = postData;
    tile.holdsContent = !!postData;
    tile.tilePost = null;
    tile.originalIndex = tileIndex;
    tile.rowIndex = rowIndex;
    tile.columnIndex = columnIndex;
    tile.isMarginTile = isMarginTile;
    tile.isBorderTile = isBorderTile;
    tile.isCornerTile = isCornerTile;
    tile.isInLargerRow = isInLargerRow;

    tile.expandedState = null;

    tile.isHighlighted = false;

    tile.imageScreenOpacity = Number.NaN;

    tile.neighborStates = [];
    tile.vertices = null;
    tile.currentVertexDeltas = null;
    tile.originalVertexDeltas = null;
    tile.expandedVertexDeltas = null;
    tile.particle = null;

    tile.setContent = setContent;
    tile.setNeighborTiles = setNeighborTiles;
    tile.setColor = setColor;
    tile.setIsHighlighted = setIsHighlighted;
    tile.update = update;
    tile.draw = draw;
    tile.applyExternalForce = applyExternalForce;
    tile.fixPosition = fixPosition;
    tile.getNeighborStates = getNeighborStates;
    tile.getIsBorderTile = getIsBorderTile;
    tile.setIsBorderTile = setIsBorderTile;
    tile.destroy = destroy;
    tile.hide = hide;
    tile.show = show;

    createElement.call(tile);
    createParticle.call(tile, mass);

    if (tile.holdsContent) {
      createTilePost.call(tile);
    }
  }

  Tile.computeVertexDeltas = computeVertexDeltas;
  Tile.setTileNeighborState = setTileNeighborState;
  Tile.initializeTileExpandedState = initializeTileExpandedState;
  Tile.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.Tile = Tile;

  initStaticFields();

  console.log('Tile module loaded');
})();

/**
 * This module defines a constructor for TilePost objects.
 *
 * TilePost objects handle the actual textual contents of the Tile objects.
 *
 * @module TilePost
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config;

  config = {};

  config.activeScreenOpacity = 0.0;
  config.inactiveScreenOpacity = 0.8;

  config.fontSize = 18;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  /**
   * @this TilePost
   */
  function createElements() {
    var tilePost = this;

    var patternId = 'hg-pattern-' + tilePost.tile.postData.id;

    var screenColorString = 'hsl(' + window.hg.Grid.config.backgroundHue + ',' +
        window.hg.Grid.config.backgroundSaturation + '%,' + window.hg.Grid.config.backgroundLightness + '%)';

    var outerSideLength = window.hg.Grid.config.tileOuterRadius * 2;

    var textTop = -config.fontSize * (1.5 + 0.53 * (tilePost.tile.postData.titleShort.split('\n').length - 1));

    var longRadiusRatio = 1;
    var shortRadiusRatio = window.hg.Grid.config.tileOuterRadius / window.hg.Grid.config.tileInnerRadius;
    var offsetDistance = (1 - shortRadiusRatio) / 2;

    var imageWidth, imageHeight, imageX, imageY;
    if (tilePost.tile.grid.isVertical) {
      imageWidth = shortRadiusRatio;
      imageHeight = longRadiusRatio;
      imageX = offsetDistance;
      imageY = '0';
    } else {
      imageWidth = longRadiusRatio;
      imageHeight = shortRadiusRatio;
      imageX = '0';
      imageY = offsetDistance;
    }

    // --- Create the elements, add them to the DOM, save them in this TilePost --- //

    var backgroundPattern = document.createElementNS(window.hg.util.svgNamespace, 'pattern');
    var backgroundImage = document.createElementNS(window.hg.util.svgNamespace, 'image');
    var backgroundImageScreen = document.createElementNS(window.hg.util.svgNamespace, 'rect');
    var title = document.createElement('h2');

    tilePost.tile.grid.svgDefs.appendChild(backgroundPattern);
    backgroundPattern.appendChild(backgroundImage);
    backgroundPattern.appendChild(backgroundImageScreen);
    tilePost.tile.grid.parent.appendChild(title);

    tilePost.elements = [];
    tilePost.elements.backgroundPattern = backgroundPattern;
    tilePost.elements.backgroundImage = backgroundImage;
    tilePost.elements.backgroundImageScreen = backgroundImageScreen;
    tilePost.elements.title = title;

    // --- Set the parameters of the elements --- //

    backgroundPattern.setAttribute('id', patternId);
    backgroundPattern.setAttribute('patternContentUnits', 'objectBoundingBox');
    backgroundPattern.setAttribute('width', '1');
    backgroundPattern.setAttribute('height', '1');

    backgroundImage.setAttributeNS(window.hg.util.xlinkNamespace, 'xlink:href', tilePost.tile.postData.thumbnailSrc);
    backgroundImage.setAttribute('preserveAspectRatio', 'none');
    backgroundImage.setAttribute('x', imageX);
    backgroundImage.setAttribute('y', imageY);
    backgroundImage.setAttribute('width', imageWidth);
    backgroundImage.setAttribute('height', imageHeight);
    // TODO: this should have worked, but the aspect ratio was NOT being maintained; it may have been a browser bug
    //backgroundImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    //backgroundImage.setAttribute('width', '1');
    //backgroundImage.setAttribute('height', '1');

    backgroundImageScreen.setAttribute('width', '1');
    backgroundImageScreen.setAttribute('height', '1');
    backgroundImageScreen.setAttribute('fill', screenColorString);

    tilePost.tile.element.setAttribute('fill', 'url(#' + patternId + ')');

    title.innerHTML = tilePost.tile.postData.titleShort;
    title.setAttribute('data-hg-tile-title', 'data-hg-tile-title');
    title.style.position = 'absolute';
    title.style.left = -outerSideLength / 2 + 'px';
    title.style.top = textTop + 'px';
    title.style.width = outerSideLength + 'px';
    title.style.height = outerSideLength + 'px';
    title.style.fontSize = config.fontSize + 'px';
    title.style.textAlign = 'center';
    title.style.whiteSpace = 'pre-wrap';
    title.style.pointerEvents = 'none';
    title.style.zIndex = '2000';

    tilePost.tile.imageScreenOpacity = config.inactiveScreenOpacity;
    draw.call(tilePost);

    // TODO: for the canvas version: http://stackoverflow.com/a/4961439/489568
  }

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * @this TilePost
   */
  function draw() {
    var tilePost = this;

    // Keep hovered tiles highlighted
    var backgroundImageScreenOpacity = tilePost.tile.isHighlighted ?
        window.hg.TilePost.config.activeScreenOpacity : tilePost.tile.imageScreenOpacity;

    // Have the title change across a wider opacity range than the background screen
    var titleOpacity = 0.5 + (backgroundImageScreenOpacity - 0.5) * 2;
    titleOpacity = titleOpacity > 1 ? 1 : (titleOpacity < 0 ? 0 : titleOpacity);

    window.hg.util.applyTransform(tilePost.elements.title,
        'translate(' + tilePost.tile.particle.px + 'px,' + tilePost.tile.particle.py + 'px)');
    tilePost.elements.backgroundImageScreen.setAttribute('opacity', backgroundImageScreenOpacity);

    // Only set the title opacity for collapsed tiles
    if (tilePost.tile.grid.expandedTile !== tilePost.tile) {
      tilePost.elements.title.style.opacity = titleOpacity;
    }
  }

  /**
   * @this TilePost
   */
  function destroy() {
    var tilePost = this;

    tilePost.tile.grid.parent.removeChild(tilePost.elements.title);
    tilePost.tile.grid.svgDefs.removeChild(tilePost.elements.backgroundPattern);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Tile} tile
   */
  function TilePost(tile) {
    var tilePost = this;

    tilePost.tile = tile;
    tilePost.elements = null;

    tilePost.draw = draw;
    tilePost.destroy = destroy;

    createElements.call(tilePost);
  }

  TilePost.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.TilePost = TilePost;

  console.log('TilePost module loaded');
})();

/**
 * @typedef {AnimationJob} ColorResetJob
 */

/**
 * This module defines a constructor for ColorResetJob objects.
 *
 * ColorResetJob objects reset tile color values during each animation frame.
 *
 * @module ColorResetJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorResetJob as started.
   *
   * @this ColorResetJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorResetJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].currentColor.h = job.grid.allTiles[i].originalColor.h;
      job.grid.allTiles[i].currentColor.s = job.grid.allTiles[i].originalColor.s;
      job.grid.allTiles[i].currentColor.l = job.grid.allTiles[i].originalColor.l;
      job.grid.allTiles[i].imageScreenOpacity = window.hg.TilePost.config.inactiveScreenOpacity;
    }
  }

  /**
   * Draws the current state of this ColorResetJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorResetJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorResetJob, and returns the element its original form.
   *
   * @this ColorResetJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this ColorResetJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorResetJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    job.init();

    console.log('ColorResetJob created');
  }

  ColorResetJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorResetJob = ColorResetJob;

  console.log('ColorResetJob module loaded');
})();

/**
 * @typedef {AnimationJob} ColorShiftJob
 */

/**
 * This module defines a constructor for ColorShiftJob objects.
 *
 * ColorShiftJob objects animate the colors of the tiles in a random fashion.
 *
 * @module ColorShiftJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  // TODO:

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorShiftJob as started.
   *
   * @this ColorShiftJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorShiftJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Draws the current state of this ColorShiftJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorShiftJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorShiftJob.
   *
   * @this ColorShiftJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this ColorShiftJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorShiftJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    job.init();

    console.log('ColorShiftJob created');
  }

  ColorShiftJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorShiftJob = ColorShiftJob;

  console.log('ColorShiftJob module loaded');
})();

/**
 * @typedef {AnimationJob} ColorWaveJob
 */

/**
 * This module defines a constructor for ColorWaveJob objects.
 *
 * ColorWaveJob objects animate the tiles of a Grid in order to create waves of color.
 *
 * @module ColorWaveJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 1000;
  config.wavelength = 600;
  config.originX = -100;
  config.originY = 1400;

  // Amplitude (will range from negative to positive)
  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 5;

  config.deltaOpacityImageBackgroundScreen = 0.18;

  config.opacity = 0.5;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.halfPeriod = config.period / 2;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this ColorWaveJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;
    job.waveProgressOffsetsNonContentTiles = [];
    job.waveProgressOffsetsContentTiles = [];

    // Calculate offsets for the non-content tiles
    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      tile = job.grid.allNonContentTiles[i];

      deltaX = tile.originalAnchor.x - config.originX;
      deltaY = tile.originalAnchor.y - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsetsNonContentTiles[i] =
          -(length % config.wavelength - halfWaveProgressWavelength) / halfWaveProgressWavelength;
    }

    // Calculate offsets for the content tiles
    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      tile = job.grid.contentTiles[i];

      deltaX = tile.originalAnchor.x - config.originX;
      deltaY = tile.originalAnchor.y - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsetsContentTiles[i] =
          -(length % config.wavelength - halfWaveProgressWavelength) / halfWaveProgressWavelength;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the animation progress of the given non-content tile.
   *
   * @param {Number} progress From -1 to 1
   * @param {Tile} tile
   * @param {Number} waveProgressOffset From -1 to 1
   */
  function updateNonContentTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.currentColor.h += config.deltaHue * tileProgress * config.opacity;
    tile.currentColor.s += config.deltaSaturation * tileProgress * config.opacity;
    tile.currentColor.l += config.deltaLightness * tileProgress * config.opacity;
  }

  /**
   * Updates the animation progress of the given content tile.
   *
   * @param {Number} progress From -1 to 1
   * @param {Tile} tile
   * @param {Number} waveProgressOffset From -1 to 1
   */
  function updateContentTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI) * 0.5 + 0.5;

    tile.imageScreenOpacity += -tileProgress * config.opacity *
        config.deltaOpacityImageBackgroundScreen;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ColorWaveJob as started.
   *
   * @this ColorWaveJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this ColorWaveJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      updateNonContentTile(progress, job.grid.allNonContentTiles[i],
          job.waveProgressOffsetsNonContentTiles[i]);
    }

    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      updateContentTile(progress, job.grid.contentTiles[i],
          job.waveProgressOffsetsContentTiles[i]);
    }
  }

  /**
   * Draws the current state of this ColorWaveJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ColorWaveJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ColorWaveJob, and returns the element its original form.
   *
   * @this ColorWaveJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this ColorWaveJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    initTileProgressOffsets.call(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function ColorWaveJob(grid) {
    var job = this;

    job.grid = grid;
    job.waveProgressOffsetsNonContentTiles = null;
    job.waveProgressOffsetsContentTiles = null;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    job.init();

    console.log('ColorWaveJob created');
  }

  ColorWaveJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ColorWaveJob = ColorWaveJob;

  console.log('ColorWaveJob module loaded');
})();

/**
 * @typedef {AnimationJob} DisplacementResetJob
 */

/**
 * This module defines a constructor for DisplacementResetJob objects.
 *
 * DisplacementResetJob objects reset tile displacement values during each animation frame.
 *
 * @module DisplacementResetJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this DisplacementResetJob as started.
   *
   * @this DisplacementResetJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this DisplacementResetJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementResetJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    // Update the Tiles
    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].currentAnchor.x = job.grid.allTiles[i].originalAnchor.x;
      job.grid.allTiles[i].currentAnchor.y = job.grid.allTiles[i].originalAnchor.y;
    }

    if (job.grid.isPostOpen) {
      // Update the Carousel
      job.grid.pagePost.carousel.currentIndexPositionRatio =
        job.grid.pagePost.carousel.currentIndex;
    }
  }

  /**
   * Draws the current state of this DisplacementResetJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementResetJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DisplacementResetJob, and returns the element its original form.
   *
   * @this DisplacementResetJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this DisplacementResetJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function DisplacementResetJob(grid) {
    var job = this;

    job.grid = grid;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    job.init();

    console.log('DisplacementResetJob created');
  }

  DisplacementResetJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.DisplacementResetJob = DisplacementResetJob;

  console.log('DisplacementResetJob module loaded');
})();

/**
 * @typedef {AnimationJob} DisplacementWaveJob
 */

/**
 * This module defines a constructor for DisplacementWaveJob objects.
 *
 * DisplacementWaveJob objects animate the tiles of a Grid in order to create waves of
 * motion.
 *
 * @module DisplacementWaveJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.period = 3200;
  config.wavelength = 1800;
  config.originX = 0;
  config.originY = 0;

  // Amplitude (will range from negative to positive)
  config.tileDeltaX = -15;
  config.tileDeltaY = -config.tileDeltaX * Math.sqrt(3);

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.halfPeriod = config.period / 2;

    config.displacementAmplitude =
        Math.sqrt(config.tileDeltaX * config.tileDeltaX +
            config.tileDeltaY * config.tileDeltaY);
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates a wave offset value for each tile according to their positions in the grid.
   *
   * @this DisplacementWaveJob
   */
  function initTileProgressOffsets() {
    var job, i, count, tile, length, deltaX, deltaY, halfWaveProgressWavelength;

    job = this;

    halfWaveProgressWavelength = config.wavelength / 2;
    job.waveProgressOffsets = [];

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      tile = job.grid.allTiles[i];

      deltaX = tile.originalAnchor.x - config.originX;
      deltaY = tile.originalAnchor.y - config.originY;
      length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + config.wavelength;

      job.waveProgressOffsets[i] = -(length % config.wavelength - halfWaveProgressWavelength)
          / halfWaveProgressWavelength;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the animation progress of the given tile.
   *
   * @param {Number} progress
   * @param {Tile} tile
   * @param {Number} waveProgressOffset
   */
  function updateTile(progress, tile, waveProgressOffset) {
    var tileProgress =
        Math.sin(((((progress + 1 + waveProgressOffset) % 2) + 2) % 2 - 1) * Math.PI);

    tile.currentAnchor.x += config.tileDeltaX * tileProgress;
    tile.currentAnchor.y += config.tileDeltaY * tileProgress;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this DisplacementWaveJob as started.
   *
   * @this DisplacementWaveJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this DisplacementWaveJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementWaveJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    progress = (currentTime + config.halfPeriod) / config.period % 2 - 1;

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      updateTile(progress, job.grid.allTiles[i], job.waveProgressOffsets[i]);
    }
  }

  /**
   * Draws the current state of this DisplacementWaveJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementWaveJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DisplacementWaveJob, and returns the element its original form.
   *
   * @this DisplacementWaveJob
   */
  function cancel() {
    var job = this;

    job.isComplete = true;
  }

  /**
   * @this DisplacementWaveJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    initTileProgressOffsets.call(job);
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   */
  function DisplacementWaveJob(grid) {
    var job = this;

    job.grid = grid;
    job.waveProgressOffsets = null;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    job.init();

    console.log('DisplacementWaveJob created');
  }

  DisplacementWaveJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.DisplacementWaveJob = DisplacementWaveJob;

  console.log('DisplacementWaveJob module loaded');
})();

/**
 * @typedef {AnimationJob} CarouselImageSlideJob
 */

/**
 * This module defines a constructor for CarouselImageSlideJob objects.
 *
 * @module CarouselImageSlideJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 300;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this CarouselImageSlideJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('CarouselImageSlideJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;
    job.onComplete();

    job.carousel.onSlideFinished();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this CarouselImageSlideJob as started.
   *
   * @this CarouselImageSlideJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.indexInitialDisplacement = job.carousel.previousIndex - job.carousel.currentIndex;
  }

  /**
   * Updates the animation progress of this CarouselImageSlideJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this CarouselImageSlideJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    progress = 1 - window.hg.util.easingFunctions.easeInOutCubic(progress);
    progress = progress < 0 ? 0 : progress;

    job.carousel.currentIndexPositionRatio += job.indexInitialDisplacement * progress;

    // Is the job done?
    if (progress === 0) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this CarouselImageSlideJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this CarouselImageSlideJob
   */
  function draw() {
    // This animation job updates the state of the carousel and has nothing of its own to draw
  }

  /**
   * Stops this CarouselImageSlideJob, and returns the element its original form.
   *
   * @this CarouselImageSlideJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this CarouselImageSlideJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @param {Carousel} carousel
   */
  function CarouselImageSlideJob(grid, tile, onComplete, carousel) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.carousel = carousel;

    job.indexInitialDisplacement = Number.NaN;

    job.duration = config.duration;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('CarouselImageSlideJob created: currentIndex=' + job.carousel.currentIndex +
      ', previousIndex=' + job.carousel.previousIndex);
  }

  CarouselImageSlideJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.CarouselImageSlideJob = CarouselImageSlideJob;

  console.log('CarouselImageSlideJob module loaded');
})();

/**
 * @typedef {AnimationJob} ClosePostJob
 */

/**
 * This module defines a constructor for ClosePostJob objects.
 *
 * @module ClosePostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this ClosePostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('ClosePostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    destroySectors.call(job);

    // Don't reset some state if another expansion job started after this one did
    if (job.grid.lastExpansionJob === job) {
      // Destroy the expanded tile expanded state
      job.baseTile.expandedState = null;

      job.grid.sectors = [];
      job.grid.updateAllTilesCollection(job.grid.originalTiles);

      job.grid.isTransitioning = false;
      job.grid.expandedTile = null;

      // TODO: this should instead fade out the old persistent animations and fade in the new ones
      // Restart the persistent jobs now the the overall collection of tiles has changed
      window.hg.controller.resetPersistentJobs(job.grid);
    }

    job.isComplete = true;
    job.onComplete();
  }

  /**
   * @this ClosePostJob
   */
  function destroySectors() {
    var job, i, count, alsoDestroyOriginalTileExpandedState;

    job = this;

    alsoDestroyOriginalTileExpandedState = job.grid.lastExpansionJob === job;

    // Destroy the sectors
    for (i = 0, count = job.sectors.length; i < count; i += 1) {
      job.sectors[i].destroy(alsoDestroyOriginalTileExpandedState);
    }

    job.sectors = [];
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this ClosePostJob as started.
   *
   * @this ClosePostJob
   */
  function start() {
    var panDisplacement;
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.grid.isPostOpen = false;
    job.grid.isTransitioning = true;
    job.grid.lastExpansionJob = job;

    panDisplacement = {
      x: job.grid.originalCenter.x - job.grid.panCenter.x,
      y: job.grid.originalCenter.y - job.grid.panCenter.y
    };

    // Start the sub-jobs
    window.hg.controller.transientJobs.spread.create(job.grid, job.baseTile)
        .duration = config.duration + window.hg.OpenPostJob.config.spreadDurationOffset;
    window.hg.controller.transientJobs.pan.create(job.grid, job.baseTile, {
      x: job.grid.panCenter.x,
      y: job.grid.panCenter.y
    })
        .duration = config.duration + window.hg.OpenPostJob.config.panDurationOffset;
    window.hg.controller.transientJobs.dilateSectors.create(job.grid, job.baseTile, panDisplacement)
        .duration = config.duration + window.hg.OpenPostJob.config.dilateSectorsDurationOffset;
    window.hg.controller.transientJobs.fadePost.create(job.grid, job.baseTile)
        .duration = config.duration + window.hg.OpenPostJob.config.fadePostDurationOffset;

    job.grid.annotations.setExpandedAnnotations(false);

    // Turn scrolling back on
    job.grid.parent.style.overflowY = 'auto';
  }

  /**
   * Updates the animation progress of this ClosePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // Is the job done?
    if (currentTime - job.startTime >= config.duration) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this ClosePostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this ClosePostJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this ClosePostJob, and returns the element its original form.
   *
   * @this ClosePostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this ClosePostJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function ClosePostJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.sectors = grid.sectors;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('ClosePostJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  ClosePostJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.ClosePostJob = ClosePostJob;

  console.log('ClosePostJob module loaded');
})();

/**
 * @typedef {AnimationJob} DilateSectorsJob
 */

/**
 * This module defines a constructor for DilateSectorsJob objects.
 *
 * @module DilateSectorsJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this DilateSectorsJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('DilateSectorsJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;
    job.onComplete();
  }

  /**
   * @this OpenPostJob
   */
  function setFinalPositions() {
    var i;

    var job = this;

    // Displace the sectors
    for (i = 0; i < 6; i += 1) {
      // Update the Sector's base position to account for the panning
      job.sectors[i].originalAnchor.x += job.panDisplacement.x;
      job.sectors[i].originalAnchor.y += job.panDisplacement.y;

      job.sectors[i].setOriginalPositionForExpansion(job.isExpanding);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this DilateSectorsJob as started.
   *
   * @this DilateSectorsJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    // Set the final positions at the start, and animate everything in "reverse"
    setFinalPositions.call(job);
  }

  /**
   * Updates the animation progress of this DilateSectorsJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DilateSectorsJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, dx, dy;

    job = this;

    // Calculate progress with an easing function
    // Because the final positions were set at the start, the progress needs to update in "reverse"
    progress = (currentTime - job.startTime) / job.duration;
    progress = 1 - window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress < 0 ? 0 : (job.isExpanding ? progress : -progress);

    // Update the offsets for each of the six sectors
    for (i = 0; i < 6; i += 1) {
      dx = job.sectors[i].expandedDisplacement.x * progress;
      dy = job.sectors[i].expandedDisplacement.y * progress;

      job.sectors[i].updateCurrentPosition(dx, dy);
    }

    // Is the job done?
    if (progress === 0) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this DilateSectorsJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DilateSectorsJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DilateSectorsJob, and returns the element its original form.
   *
   * @this DilateSectorsJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this DilateSectorsJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   * @param {{x:Number,y:Number}} panDisplacement
   */
  function DilateSectorsJob(grid, tile, onComplete, panDisplacement) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.panDisplacement = panDisplacement;
    job.sectors = grid.sectors;
    job.parentExpansionJob = job.grid.lastExpansionJob;
    job.isExpanding = grid.isPostOpen;

    job.duration = config.duration;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('DilateSectorsJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  DilateSectorsJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.DilateSectorsJob = DilateSectorsJob;

  console.log('DilateSectorsJob module loaded');
})();

/**
 * @typedef {AnimationJob} DisplacementRadiateJob
 */

/**
 * This module defines a constructor for DisplacementRadiateJob objects.
 *
 * @module DisplacementRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;
  config.waveSpeed = 3; // pixels / millisecond
  config.waveWidth = 500;

  config.displacementDistance = 50;

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates and stores the maximal displacement values for all tiles.
   *
   * @this DisplacementRadiateJob
   */
  function initializeDisplacements() {
    // TODO:
//    var job, i, iCount, j, jCount, k, tiles, displacementRatio;
//
//    job = this;
//
//    displacementRatio =
//        (window.hg.Grid.config.tileShortLengthWithGap + window.hg.Grid.config.tileGap) /
//        (window.hg.Grid.config.tileShortLengthWithGap);
//
//    job.displacements = [];
//
//    k = 0;
//
//    if (job.grid.isPostOpen) {
//      // Consider all of the old AND new tiles
//      for (i = 0, iCount = job.grid.sectors.length; i < iCount; i += 1) {
//        tiles = job.grid.sectors[i].tiles;
//
//        for (j = 0, jCount = tiles.length; j < jCount; j += 1) {
//          job.displacements[k] = {
//            tile: tiles[j],
//            displacementX: displacementRatio *
//                (tiles[j].originalAnchorX - job.tile.originalAnchorX),
//            displacementY: displacementRatio *
//                (tiles[j].originalAnchorY - job.tile.originalAnchorY)
//          };
//          k += 1;
//        }
//      }
//    } else {
//      for (i = 0, iCount = job.grid.originalTiles.length; i < iCount; i += 1) {
//        job.displacements[i] = {
//          tile: job.grid.originalTiles[i],
//          displacementX: displacementRatio *
//              (job.grid.originalTiles[i].originalAnchorX - job.tile.originalAnchorX),
//          displacementY: displacementRatio *
//              (job.grid.originalTiles[i].originalAnchorY - job.tile.originalAnchorY)
//        };
//      }
//    }
  }

  /**
   * @this DisplacementRadiateJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('DisplacementRadiateJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this DisplacementRadiateJob as started.
   *
   * @this DisplacementRadiateJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this DisplacementRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementRadiateJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    // TODO:
//    var job, progress, i, count;
//
//    job = this;
//
//    if (currentTime > job.startTime + config.duration) {
//      handleComplete.call(job, false);
//    } else {
//      // Ease-out halfway, then ease-in back
//      progress = (currentTime - job.startTime) / config.duration;
//      progress = (progress > 0.5 ? 1 - progress : progress) * 2;
//      progress = window.hg.util.easingFunctions.easeOutQuint(progress);
//
//      // Displace the tiles
//      for (i = 0, count = job.displacements.length; i < count; i += 1) {
//        job.displacements[i].tile.anchorX += job.displacements[i].displacementX * progress;
//        job.displacements[i].tile.anchorY += job.displacements[i].displacementY * progress;
//      }
//    }
  }

  /**
   * Draws the current state of this DisplacementRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this DisplacementRadiateJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this DisplacementRadiateJob, and returns the element its original form.
   *
   * @this DisplacementRadiateJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this DisplacementRadiateJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function DisplacementRadiateJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.displacements = null;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    initializeDisplacements.call(job);

    console.log('DisplacementRadiateJob created: tileIndex=' + job.tile.originalIndex);
  }

  DisplacementRadiateJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.DisplacementRadiateJob = DisplacementRadiateJob;

  console.log('DisplacementRadiateJob module loaded');
})();

/**
 * @typedef {AnimationJob} FadePostJob
 */

/**
 * This module defines a constructor for FadePostJob objects.
 *
 * @module FadePostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.quick1FadeDurationRatio = 0.7;
  config.quick2FadeDurationRatio = 0.3;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this FadePostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('FadePostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;
    job.onComplete();

    if (!job.isFadingIn) {
      // Don't reset some state if another expansion job started after this one did
      if (job.parentExpansionJob === job.grid.lastExpansionJob) {
        job.grid.destroyPagePost();
      } else {
        job.pagePost.destroy();

        job.baseTile.currentVertexDeltas = job.baseTile.originalVertexDeltas.slice(0);
      }

      job.baseTile.show();
    } else {
      // Don't reset some state if another expansion job started after this one did
      if (job.parentExpansionJob === job.grid.lastExpansionJob) {
        job.baseTile.hide();
      }
    }

    job.baseTile.element.style.pointerEvents = 'auto';
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * @param {Array.<Number>} currentVertexDeltas
   * @param {Array.<Number>} oldVertexDeltas
   * @param {Array.<Number>} newVertexDeltas
   * @param {Number} progress
   */
  function interpolateVertexDeltas(currentVertexDeltas, oldVertexDeltas, newVertexDeltas,
                                   progress) {
    var i, count;

    for (i = 0, count = currentVertexDeltas.length; i < count; i += 1) {
      currentVertexDeltas[i] =
        oldVertexDeltas[i] + (newVertexDeltas[i] - oldVertexDeltas[i]) * progress;
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this FadePostJob as started.
   *
   * @this FadePostJob
   */
  function start() {
    var expandedTileOuterRadius;
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    job.pagePostStartPosition = {};
    job.pagePostDisplacement = {};

    job.baseTile.show();

    if (job.isFadingIn) {
      job.pagePostStartPosition.x = job.baseTile.particle.px;
      job.pagePostStartPosition.y = job.baseTile.particle.py;
      job.pagePostDisplacement.x = job.grid.originalCenter.x - job.pagePostStartPosition.x;
      job.pagePostDisplacement.y = job.grid.originalCenter.y - job.pagePostStartPosition.y +
      job.grid.scrollTop;

      job.pagePost = job.grid.createPagePost(job.baseTile, job.pagePostStartPosition);

      expandedTileOuterRadius = window.hg.OpenPostJob.config.expandedDisplacementTileCount *
      window.hg.Grid.config.tileShortLengthWithGap;

      job.baseTile.expandedVertexDeltas =
        window.hg.Tile.computeVertexDeltas(expandedTileOuterRadius, job.grid.isVertical);
    } else {
      job.pagePostStartPosition.x = job.grid.originalCenter.x;
      job.pagePostStartPosition.y = job.grid.originalCenter.y + job.grid.scrollTop;
      job.pagePostDisplacement.x = job.pagePostStartPosition.x - job.grid.currentCenter.x;
      job.pagePostDisplacement.y = job.pagePostStartPosition.y - job.grid.currentCenter.y -
      job.grid.scrollTop;
    }

    job.baseTile.element.style.pointerEvents = 'none';
  }

  /**
   * Updates the animation progress of this FadePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function updateFadeIn(currentTime, deltaTime) {
    var job, progress, uneasedProgress, quick1FadeProgress, quick2FadeProgress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    uneasedProgress = progress;
    progress = window.hg.util.easingFunctions.easeOutCubic(progress);
    progress = progress > 1 ? 1 : progress;

    // Some parts of the animation should happen at different speeds
    quick1FadeProgress = progress / config.quick1FadeDurationRatio;
    quick1FadeProgress = (quick1FadeProgress > 1 ? 1 : quick1FadeProgress);
    quick2FadeProgress = progress / config.quick2FadeDurationRatio;
    quick2FadeProgress = (quick2FadeProgress > 1 ? 1 : quick2FadeProgress);

    // Update the opacity of the center Tile
    job.baseTile.element.style.opacity = 1 - quick1FadeProgress;
    job.baseTile.tilePost.elements.title.style.opacity = 1 - quick2FadeProgress;

    // Update the opacity of the PagePost
    job.pagePost.opacity = uneasedProgress;

    // Update the position of the PagePost
    job.pagePost.center.x = job.pagePostStartPosition.x +
    job.pagePostDisplacement.x * progress;
    job.pagePost.center.y = job.pagePostStartPosition.y +
    job.pagePostDisplacement.y * progress;

    interpolateVertexDeltas(job.baseTile.currentVertexDeltas, job.baseTile.originalVertexDeltas,
      job.baseTile.expandedVertexDeltas, quick1FadeProgress);

    // Is the job done?
    if (progress === 1) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Updates the animation progress of this FadePostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function updateFadeOut(currentTime, deltaTime) {
    var job, progress, quick1FadeProgress;

    job = this;

    // Calculate progress with an easing function
    progress = (currentTime - job.startTime) / job.duration;
    progress = window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress > 1 ? 1 : progress;

    // Some parts of the animation should happen at different speeds
    quick1FadeProgress = progress / config.quick1FadeDurationRatio;
    quick1FadeProgress = (quick1FadeProgress > 1 ? 1 : quick1FadeProgress);

    // Update the opacity of the center Tile
    job.baseTile.element.style.opacity = progress;
    job.baseTile.tilePost.elements.title.style.opacity = progress;

    // Update the opacity of the PagePost
    job.pagePost.opacity = 1 - quick1FadeProgress;

    // Update the position of the PagePost
    job.pagePost.center.x = job.pagePostStartPosition.x +
    job.pagePostDisplacement.x * progress;
    job.pagePost.center.y = job.pagePostStartPosition.y +
    job.pagePostDisplacement.y * progress;

    interpolateVertexDeltas(job.baseTile.currentVertexDeltas, job.baseTile.expandedVertexDeltas,
      job.baseTile.originalVertexDeltas, quick1FadeProgress);

    // Is the job done?
    if (progress === 1) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this FadePostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this FadePostJob
   */
  function draw() {
    var job = this;

    job.pagePost.draw();
  }

  /**
   * Stops this FadePostJob, and returns the element its original form.
   *
   * @this FadePostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this FadePostJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function FadePostJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = grid.expandedTile;
    job.startTime = 0;
    job.isComplete = true;
    job.pagePost = grid.pagePost;
    job.parentExpansionJob = job.grid.lastExpansionJob;
    job.isFadingIn = grid.isPostOpen;
    job.pagePostStartPosition = null;
    job.pagePostDisplacement = null;

    job.duration = config.duration;

    job.start = start;
    job.update = job.isFadingIn ? updateFadeIn : updateFadeOut;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('FadePostJob created: tileIndex=' + job.baseTile.originalIndex +
    ', isFadingIn=' + job.isFadingIn);
  }

  FadePostJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.FadePostJob = FadePostJob;

  console.log('FadePostJob module loaded');
})();

/**
 * @typedef {AnimationJob} HighlightHoverJob
 */

/**
 * This module defines a constructor for HighlightHoverJob objects.
 *
 * @module HighlightHoverJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 50;

  config.opacity = 0.5;

  config.isRecurring = false;
  config.avgDelay = 30;
  config.delayDeviationRange = 20;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this HighlightHoverJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

//    console.log('HighlightHoverJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the background image screen opacity of the given content tile according to the given
   * durationRatio.
   *
   * @param {Tile} tile
   * @param {Number} durationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateContentTile(tile, durationRatio) {
    var opacity = window.hg.TilePost.config.activeScreenOpacity +
        (durationRatio * (window.hg.TilePost.config.inactiveScreenOpacity -
        window.hg.TilePost.config.activeScreenOpacity));

    tile.imageScreenOpacity = opacity;
  }

  /**
   * Updates the color of the given non-content tile according to the given durationRatio.
   *
   * @param {Tile} tile
   * @param {Number} durationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateNonContentTile(tile, durationRatio) {
    var opacity = config.opacity * (1 - durationRatio);

    tile.currentColor.h += config.deltaHue * opacity;
    tile.currentColor.s += config.deltaSaturation * opacity;
    tile.currentColor.l += config.deltaLightness * opacity;
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this HighlightHoverJob as started.
   *
   * @this HighlightHoverJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this HighlightHoverJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightHoverJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, durationRatio;

    job = this;

    // When the tile is re-highlighted after this job has started, then this job should be
    // cancelled
    if (job.tile.isHighlighted) {
      job.cancel();
      return;
    }

    if (currentTime > job.startTime + config.duration) {
      job.updateTile(job.tile, 1);
      handleComplete.call(job, false);
    } else {
      durationRatio = (currentTime - job.startTime) / config.duration;

      job.updateTile(job.tile, durationRatio);
    }
  }

  /**
   * Draws the current state of this HighlightHoverJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightHoverJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this HighlightHoverJob, and returns the element its original form.
   *
   * @this HighlightHoverJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this HighlightHoverJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function HighlightHoverJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.updateTile = tile.holdsContent ? updateContentTile : updateNonContentTile;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

//    console.log('HighlightHoverJob created: tileIndex=' + job.tile.originalIndex);
  }

  HighlightHoverJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.HighlightHoverJob = HighlightHoverJob;

  console.log('HighlightHoverJob module loaded');
})();

/**
 * @typedef {AnimationJob} HighlightRadiateJob
 */

/**
 * This module defines a constructor for HighlightRadiateJob objects.
 *
 * @module HighlightRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.shimmerSpeed = 3; // pixels / millisecond
  config.shimmerWaveWidth = 500;
  config.duration = 500;

  config.deltaHue = 0;
  config.deltaSaturation = 0;
  config.deltaLightness = 50;

  config.opacity = 0.5;

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates the distance from each tile in the grid to the starting point of this
   * HighlightRadiateJob.
   *
   * This cheats by only calculating the distance to the tiles' original center. This allows us to
   * not need to re-calculate tile distances during each time step.
   *
   * @this HighlightRadiateJob
   */
  function calculateTileDistances() {
    var job, i, count, deltaX, deltaY, distanceOffset;

    job = this;

    distanceOffset = -window.hg.Grid.config.tileShortLengthWithGap;

    for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
      deltaX = job.grid.allNonContentTiles[i].originalAnchor.x - job.startPoint.x;
      deltaY = job.grid.allNonContentTiles[i].originalAnchor.y - job.startPoint.y;
      job.distancesNonContentTiles[i] = Math.sqrt(deltaX * deltaX + deltaY * deltaY) +
          distanceOffset;
    }

    for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
      deltaX = job.grid.contentTiles[i].originalAnchor.x - job.startPoint.x;
      deltaY = job.grid.contentTiles[i].originalAnchor.y - job.startPoint.y;
      job.distancesContentTiles[i] = Math.sqrt(deltaX * deltaX + deltaY * deltaY) + distanceOffset;
    }
  }

  /**
   * @this HighlightRadiateJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('HighlightRadiateJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  /**
   * Updates the color of the given non-content tile according to the given waveWidthRatio and
   * durationRatio.
   *
   * @param {Tile} tile
   * @param {Number} waveWidthRatio Specifies the tile's relative distance to the min and max
   * shimmer distances.
   * @param {Number} oneMinusDurationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateNonContentTile(tile, waveWidthRatio, oneMinusDurationRatio) {
    var opacity = waveWidthRatio * config.opacity * oneMinusDurationRatio;

    tile.currentColor.h += config.deltaHue * opacity;
    tile.currentColor.s += config.deltaSaturation * opacity;
    tile.currentColor.l += config.deltaLightness * opacity;
  }

  /**
   * Updates the color of the given content tile according to the given waveWidthRatio and
   * durationRatio.
   *
   * @param {Tile} tile
   * @param {Number} waveWidthRatio Specifies the tile's relative distance to the min and max
   * shimmer distances.
   * @param {Number} oneMinusDurationRatio Specifies how far this animation is through its overall
   * duration.
   */
  function updateContentTile(tile, waveWidthRatio, oneMinusDurationRatio) {
    tile.imageScreenOpacity += -waveWidthRatio * config.opacity * oneMinusDurationRatio *
        (window.hg.TilePost.config.inactiveScreenOpacity -
        window.hg.TilePost.config.activeScreenOpacity);
  }

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this HighlightRadiateJob as started.
   *
   * @this HighlightRadiateJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this HighlightRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightRadiateJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, currentMaxDistance, currentMinDistance, i, count, distance, waveWidthRatio,
        oneMinusDurationRatio, animatedSomeTile;

    job = this;

    if (currentTime > job.startTime + config.duration) {
      handleComplete.call(job, false);
    } else {
      oneMinusDurationRatio = 1 - (currentTime - job.startTime) / config.duration;

      currentMaxDistance = config.shimmerSpeed * (currentTime - job.startTime);
      currentMinDistance = currentMaxDistance - config.shimmerWaveWidth;

      animatedSomeTile = false;

      for (i = 0, count = job.grid.allNonContentTiles.length; i < count; i += 1) {
        distance = job.distancesNonContentTiles[i];

        if (distance > currentMinDistance && distance < currentMaxDistance) {
          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;

          updateNonContentTile(job.grid.allNonContentTiles[i], waveWidthRatio,
              oneMinusDurationRatio);

          animatedSomeTile = true;
        }
      }

      for (i = 0, count = job.grid.contentTiles.length; i < count; i += 1) {
        distance = job.distancesContentTiles[i];

        if (distance > currentMinDistance && distance < currentMaxDistance) {
          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;

          updateContentTile(job.grid.contentTiles[i], waveWidthRatio, oneMinusDurationRatio);

          animatedSomeTile = true;
        }
      }

      if (!animatedSomeTile) {
        handleComplete.call(job, false);
      }
    }
  }

  /**
   * Draws the current state of this HighlightRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this HighlightRadiateJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this HighlightRadiateJob, and returns the element its original form.
   *
   * @this HighlightRadiateJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this HighlightRadiateJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} [onComplete]
   */
  function HighlightRadiateJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.startPoint = {x: tile.originalAnchor.x, y: tile.originalAnchor.y};
    job.distancesNonContentTiles = [];
    job.distancesContentTiles = [];
    job.startTime = 0;
    job.isComplete = true;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    calculateTileDistances.call(job);

    console.log('HighlightRadiateJob created: tileIndex=' + (tile && tile.originalIndex));
  }

  HighlightRadiateJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.HighlightRadiateJob = HighlightRadiateJob;

  console.log('HighlightRadiateJob module loaded');
})();

/**
 * @typedef {AnimationJob} IntraTileRadiateJob
 */

/**
 * This module defines a constructor for IntraTileRadiateJob objects.
 *
 * @module IntraTileRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  // TODO:

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this IntraTileRadiateJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('IntraTileRadiateJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this IntraTileRadiateJob as started.
   *
   * @this IntraTileRadiateJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this IntraTileRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this IntraTileRadiateJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    // TODO:
//    var job, currentMaxDistance, currentMinDistance, i, count, distance, waveWidthRatio,
//        oneMinusDurationRatio, animatedSomeTile;
//
//    job = this;
//
//    if (currentTime > job.startTime + config.duration) {
//      handleComplete.call(job, false);
//    } else {
//      oneMinusDurationRatio = 1 - (currentTime - job.startTime) / config.duration;
//
//      currentMaxDistance = config.shimmerSpeed * (currentTime - job.startTime);
//      currentMinDistance = currentMaxDistance - config.shimmerWaveWidth;
//
//      animatedSomeTile = false;
//
//      for (i = 0, count = job.grid.originalTiles.length; i < count; i += 1) {
//        distance = job.tileDistances[i];
//
//        if (distance > currentMinDistance && distance < currentMaxDistance) {
//          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;
//
//          updateTile(job.grid.originalTiles[i], waveWidthRatio, oneMinusDurationRatio);
//
//          animatedSomeTile = true;
//        }
//      }
//
//      if (!animatedSomeTile) {
//        handleComplete.call(job, false);
//      }
//    }**;
  }

  /**
   * Draws the current state of this IntraTileRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this IntraTileRadiateJob
   */
  function draw() {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Stops this IntraTileRadiateJob, and returns the element its original form.
   *
   * @this IntraTileRadiateJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this IntraTileRadiateJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function IntraTileRadiateJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('IntraTileRadiateJob created: tileIndex=' + job.tile.originalIndex);
  }

  IntraTileRadiateJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.IntraTileRadiateJob = IntraTileRadiateJob;

  console.log('IntraTileRadiateJob module loaded');
})();

/**
 * @typedef {AnimationJob} LineJob
 */

/**
 * This module defines a constructor for LineJob objects.
 *
 * @module LineJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 2000;
  config.lineWidth = 28;
  config.lineLength = 60000;
  config.lineSidePeriod = 5; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 100;
  config.startOpacity = 0.6;

  config.endSaturation = 100;
  config.endLightness = 60;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.8;

  config.blurStdDeviation = 2;
  config.isBlurOn = false;

  config.isRecurring = true;
  config.avgDelay = 2200;
  config.delayDeviationRange = 2100;

  // ---  --- //

  config.NEIGHBOR = 0;
  config.LOWER_SELF = 1;
  config.UPPER_SELF = 2;

  config.oppositeDirectionProb = 0;
  config.epsilon = 0.00001;

  config.haveDefinedLineBlur = false;
  config.filterId = 'random-line-filter';

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    config.distantSidewaysDirectionProb = (1 - config.sameDirectionProb) / 2;
    config.closeSidewaysDirectionProb = (1 - config.oppositeDirectionProb) / 2;
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates an SVG definition that is used for blurring the lines of LineJobs.
   *
   * @this LineJob
   */
  function defineLineBlur() {
    var job, filter, feGaussianBlur;

    job = this;

    // Create the elements

    filter = document.createElementNS(window.hg.util.svgNamespace, 'filter');
    job.grid.svgDefs.appendChild(filter);

    feGaussianBlur = document.createElementNS(window.hg.util.svgNamespace, 'feGaussianBlur');
    filter.appendChild(feGaussianBlur);

    // Define the blur

    filter.setAttribute('id', config.filterId);
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-10%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '120%');

    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('result', 'blurOut');

    config.filter = filter;
    config.feGaussianBlur = feGaussianBlur;
  }

  /**
   * Creates the start and end hue for the line of this animation.
   *
   * @this LineJob
   */
  function createHues() {
    var job;

    job = this;

    job.startHue = Math.random() * 360;
    job.endHue = Math.random() * 360;
  }

  /**
   * Creates the polyline SVG element that is used to render this animation.
   *
   * @this LineJob
   */
  function createPolyline() {
    var job;

    job = this;

    job.polyline = document.createElementNS(window.hg.util.svgNamespace, 'polyline');
    job.grid.svg.insertBefore(job.polyline, job.grid.svg.firstChild);

    job.polyline.setAttribute('fill-opacity', '0');

    if (config.isBlurOn) {
      job.polyline.setAttribute('filter', 'url(#' + config.filterId + ')');
    }
  }

  /**
   * Updates the color values of the line of this animation.
   *
   * @this LineJob
   */
  function updateColorValues() {
    var job, progress, oneMinusProgress;

    job = this;

    progress = job.ellapsedTime / job.duration;
    oneMinusProgress = 1 - progress;

    job.currentColor.h = oneMinusProgress * job.startHue + progress * job.endHue;
    job.currentColor.s = oneMinusProgress * job.startSaturation + progress * job.endSaturation;
    job.currentColor.l = oneMinusProgress * job.startLightness + progress * job.endLightness;
    job.currentOpacity = oneMinusProgress * job.startOpacity + progress * job.endOpacity;
  }

  /**
   * Updates the state of this job to handle its completion.
   *
   * @this LineJob
   */
  function handleCompletion() {
    var job;

    job = this;

    console.log('LineJob completed');

    if (job.polyline) {
      job.grid.svg.removeChild(job.polyline);
      job.polyline = null;
    }

    job.tiles = [];
    job.corners = [];
    job.direction = Number.NaN;
    job.currentCornerIndex = Number.NaN;
    job.hasReachedEdge = true;

    job.isComplete = true;

    job.onComplete(job);
  }

  /**
   * Determines whether this LineJob has reached the edge of the grid.
   *
   * @this LineJob
   */
  function checkHasAlmostReachedEdge() {
    var job;

    job = this;

    if (job.direction === (job.corners[job.currentCornerIndex] + 3) % 6) {
      // When the job is at the opposite corner of a tile from the direction it is headed, then it
      // has not reached the edge
      job.hasAlmostReachedEdge = false;
    } else {
      job.hasAlmostReachedEdge = !job.lowerNeighbors[job.currentCornerIndex] ||
          !job.upperNeighbors[job.currentCornerIndex];
    }
  }

  /**
   * Determines the neighbors of this job's current tile at the current corner.
   *
   * @this LineJob
   */
  function determineNeighbors() {
    var job, lowerNeigborTileIndex, upperNeigborTileIndex, currentCorner;

    job = this;
    currentCorner = job.corners[job.currentCornerIndex];

    if (job.grid.isVertical) {
      lowerNeigborTileIndex = (currentCorner + 5) % 6;
      upperNeigborTileIndex = currentCorner;
    } else {
      lowerNeigborTileIndex = currentCorner;
      upperNeigborTileIndex = (currentCorner + 1) % 6;
    }

    job.lowerNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighborStates[lowerNeigborTileIndex];
    job.upperNeighbors[job.currentCornerIndex] =
        job.tiles[job.currentCornerIndex].neighborStates[upperNeigborTileIndex];

    job.lowerNeighborCorners[job.currentCornerIndex] = (currentCorner + 2) % 6;
    job.upperNeighborCorners[job.currentCornerIndex] = (currentCorner + 4) % 6;
  }

  /**
   * Returns the next vertex in the path of this animation.
   *
   * @this LineJob
   */
  function chooseNextVertex() {
    var job, cornerConfig, neighborProb, lowerSelfProb, upperSelfProb, random, relativeDirection,
        absoluteDirection, nextCorner, nextTile, currentCorner;

    job = this;
    currentCorner = job.corners[job.currentCornerIndex];

    // The first segment of a line animation is forced to go in a given direction
    if (job.currentCornerIndex === 0) {
      relativeDirection = job.forcedInitialRelativeDirection;
      job.latestDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);
    } else {
      cornerConfig = (currentCorner - job.direction + 6) % 6;

      // Determine relative direction probabilities
      switch (cornerConfig) {
        case 0:
          neighborProb = job.sameDirectionProb;
          lowerSelfProb = config.distantSidewaysDirectionProb;
          upperSelfProb = config.distantSidewaysDirectionProb;
          break;
        case 1:
          neighborProb = config.closeSidewaysDirectionProb;
          lowerSelfProb = config.closeSidewaysDirectionProb;
          upperSelfProb = config.oppositeDirectionProb;
          break;
        case 2:
          neighborProb = config.distantSidewaysDirectionProb;
          lowerSelfProb = job.sameDirectionProb;
          upperSelfProb = config.distantSidewaysDirectionProb;
          break;
        case 3:
          neighborProb = config.oppositeDirectionProb;
          lowerSelfProb = config.closeSidewaysDirectionProb;
          upperSelfProb = config.closeSidewaysDirectionProb;
          break;
        case 4:
          neighborProb = config.distantSidewaysDirectionProb;
          lowerSelfProb = config.distantSidewaysDirectionProb;
          upperSelfProb = job.sameDirectionProb;
          break;
        case 5:
          neighborProb = config.closeSidewaysDirectionProb;
          lowerSelfProb = config.oppositeDirectionProb;
          upperSelfProb = config.closeSidewaysDirectionProb;
          break;
        default:
          throw new Error('Invalid state: cornerConfig=' + cornerConfig);
      }

      // Determine the next direction to travel
      do {
        // Pick a random direction
        random = Math.random();
        relativeDirection = random < neighborProb ? config.NEIGHBOR :
                random < neighborProb + lowerSelfProb ? config.LOWER_SELF : config.UPPER_SELF;
        absoluteDirection = relativeToAbsoluteDirection(relativeDirection, currentCorner);

        // Disallow the line from going back the way it just came
      } while (absoluteDirection === (job.latestDirection + 3) % 6);

      job.latestDirection = absoluteDirection;
    }

    // Determine the next corner configuration
    switch (relativeDirection) {
      case config.NEIGHBOR:
        if (job.grid.isVertical) {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighborStates[(currentCorner + 5) % 6].tile;
        } else {
          nextCorner = (currentCorner + 1) % 6;
          nextTile = job.tiles[job.currentCornerIndex].neighborStates[currentCorner].tile;
        }
        break;
      case config.LOWER_SELF:
        nextCorner = (currentCorner + 5) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      case config.UPPER_SELF:
        nextCorner = (currentCorner + 1) % 6;
        nextTile = job.tiles[job.currentCornerIndex];
        break;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }

    job.currentCornerIndex = job.corners.length;

    job.corners[job.currentCornerIndex] = nextCorner;
    job.tiles[job.currentCornerIndex] = nextTile;

    determineNeighbors.call(job);
    checkHasAlmostReachedEdge.call(job);
  }

  /**
   * Translates the givern relative direction to an absolute direction.
   *
   * @param {Number} relativeDirection
   * @param {Number} corner
   * @returns {Number}
   */
  function relativeToAbsoluteDirection(relativeDirection, corner) {
    switch (relativeDirection) {
      case config.NEIGHBOR:
        return corner;
      case config.LOWER_SELF:
        return (corner + 4) % 6;
      case config.UPPER_SELF:
        return (corner + 2) % 6;
      default:
        throw new Error('Invalid state: relativeDirection=' + relativeDirection);
    }
  }

  /**
   * Updates the parameters of the segments of this animation.
   *
   * @this LineJob
   */
  function updateSegments() {
    var job, distanceTravelled, frontSegmentLength, backSegmentLength, segmentsTouchedCount,
        distancePastEdge, segmentsPastEdgeCount;

    job = this;

    // --- Compute some values of the polyline at the current time --- //

    distanceTravelled = job.ellapsedTime / job.lineSidePeriod * window.hg.Grid.config.tileOuterRadius;
    segmentsTouchedCount = parseInt(job.ellapsedTime / job.lineSidePeriod) + 1;

    // Add additional vertices to the polyline as needed
    while (segmentsTouchedCount >= job.corners.length && !job.hasAlmostReachedEdge) {
      chooseNextVertex.call(job);
    }

    frontSegmentLength = distanceTravelled % window.hg.Grid.config.tileOuterRadius;
    backSegmentLength = (job.lineLength - frontSegmentLength +
        window.hg.Grid.config.tileOuterRadius) % window.hg.Grid.config.tileOuterRadius;

    job.frontSegmentEndRatio = frontSegmentLength / window.hg.Grid.config.tileOuterRadius;
    job.backSegmentStartRatio = 1 - (backSegmentLength / window.hg.Grid.config.tileOuterRadius);

    job.isShort = job.lineLength < window.hg.Grid.config.tileOuterRadius;
    job.isStarting = distanceTravelled < job.lineLength;

    // Check whether the line has reached the edge
    if (job.hasAlmostReachedEdge && segmentsTouchedCount >= job.corners.length) {
      job.hasReachedEdge = true;
    }

    // --- Determine how many segments are included in the polyline --- //

    // When the polyline is neither starting nor ending and is not shorter than the length of a
    // segment, then this is how many segments it includes
    job.segmentsIncludedCount = parseInt((job.lineLength - frontSegmentLength -
        backSegmentLength - config.epsilon) / window.hg.Grid.config.tileOuterRadius) + 2;

    // Subtract from the number of included segments depending on current conditions
    if (job.isShort) {
      // The polyline is shorter than a tile side

      if (job.isStarting || job.hasReachedEdge) {
        // One end of the polyline would lie outside the grid
        job.segmentsIncludedCount = 1;
      } else {
        if (frontSegmentLength - job.lineLength >= 0) {
          // The polyline is between corners
          job.segmentsIncludedCount = 1;
        } else {
          // The polyline is across a corner
          job.segmentsIncludedCount = 2;
        }
      }
    } else {
      // The polyline is longer than a tile side

      if (job.isStarting) {
        // The polyline is starting; the back of the polyline would lie outside the grid
        job.segmentsIncludedCount = segmentsTouchedCount;
      }

      if (job.hasReachedEdge) {
        // The polyline is ending; the front of the polyline would lie outside the grid
        segmentsPastEdgeCount = segmentsTouchedCount - job.corners.length + 1;
        distancePastEdge = distanceTravelled - (job.corners.length - 1) *
            window.hg.Grid.config.tileOuterRadius;

        if (distancePastEdge > job.lineLength) {
          handleCompletion.call(job);
        }

        job.segmentsIncludedCount -= segmentsPastEdgeCount;
      }
    }
  }


  /**
   * Calculates the points in the middle of the gaps between tiles at each known corner.
   *
   * @this LineJob
   */
  function computeCornerGapPoints() {
    var job, i, count;

    job = this;

    job.gapPoints = [];

    for (i = 0, count = job.corners.length; i < count; i += 1) {
      job.gapPoints[i] = computeCornerGapPoint(job.tiles[i], job.corners[i], job.lowerNeighbors[i],
          job.upperNeighbors[i], job.lowerNeighborCorners[i], job.upperNeighborCorners[i]);
    }
  }

  /**
   * Calculates the point in the middle of the gap between tiles at the given corner.
   *
   * @param {Tile} tile
   * @param {Number} corner
   * @param {Object} lowerNeighbor
   * @param {Object} upperNeighbor
   * @param {Number} lowerNeighborCorner
   * @param {Number} upperNeighborCorner
   * @returns {{x:Number,y:Number}}
   */
  function computeCornerGapPoint(tile, corner, lowerNeighbor, upperNeighbor, lowerNeighborCorner,
                             upperNeighborCorner) {
    var count, xSum, ySum;

    if (lowerNeighbor) {
      if (upperNeighbor) {
        count = 3;
        xSum = tile.particle.px + lowerNeighbor.tile.particle.px + upperNeighbor.tile.particle.px;
        ySum = tile.particle.py + lowerNeighbor.tile.particle.py + upperNeighbor.tile.particle.py;
      } else {
        count = 2;
        xSum = tile.vertices[corner * 2] + lowerNeighbor.tile.vertices[lowerNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            lowerNeighbor.tile.vertices[lowerNeighborCorner * 2 + 1];
      }
    } else {
      if (upperNeighbor) {
        count = 2;
        xSum = tile.vertices[corner * 2] + upperNeighbor.tile.vertices[upperNeighborCorner * 2];
        ySum = tile.vertices[corner * 2 + 1] +
            upperNeighbor.tile.vertices[upperNeighborCorner * 2 + 1];
      } else {
        count = 1;
        xSum = tile.vertices[corner * 2];
        ySum = tile.vertices[corner * 2 + 1];
      }
    }

    return {
      x: xSum / count,
      y: ySum / count
    };
  }

  /**
   * Calculates the points of the SVG polyline element.
   *
   * @this LineJob
   */
  function computePolylinePoints() {
    var job, gapPointsIndex, polylinePointsIndex, stopIndex;

    job = this;

    job.polylinePoints = [];
    gapPointsIndex = job.currentCornerIndex;

    if (job.extraStartPoint && job.isStarting) {
      // Add the extra, forced initial point (this is useful for making radiating lines actually
      // start from the center of the tile and not show any gap around the corners of the tile)
      job.polylinePoints[0] = job.extraStartPoint;

      polylinePointsIndex = job.segmentsIncludedCount + 1;
      stopIndex = 1;
    } else {
      polylinePointsIndex = job.segmentsIncludedCount;
      stopIndex = 0;
    }

    // Add the front-end segment point
    if (!job.hasReachedEdge) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].x * (1 - job.frontSegmentEndRatio),
        y: job.gapPoints[gapPointsIndex].y * job.frontSegmentEndRatio +
            job.gapPoints[gapPointsIndex - 1].y * (1 - job.frontSegmentEndRatio)
      };
    } else {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x,
        y: job.gapPoints[gapPointsIndex].y
      };
    }

    polylinePointsIndex -= 1;
    gapPointsIndex -= 1;

    // Add the internal segment points
    for (; polylinePointsIndex > stopIndex; polylinePointsIndex -= 1, gapPointsIndex -= 1) {
      job.polylinePoints[polylinePointsIndex] = job.gapPoints[gapPointsIndex];
    }

    // Add the back-end segment point
    if (!job.isStarting) {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex + 1].x * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].x * (1 - job.backSegmentStartRatio),
        y: job.gapPoints[gapPointsIndex + 1].y * job.backSegmentStartRatio +
            job.gapPoints[gapPointsIndex].y * (1 - job.backSegmentStartRatio)
      }
    } else {
      job.polylinePoints[polylinePointsIndex] = {
        x: job.gapPoints[gapPointsIndex].x,
        y: job.gapPoints[gapPointsIndex].y
      };
    }
  }

  /**
   * Updates the actual SVG elements to render the current state of this animation.
   *
   * @this LineJob
   */
  function drawSegments() {
    var job, i, count, pointsString;

    job = this;

    // Create the points string
    pointsString = '';
    for (i = 0, count = job.polylinePoints.length; i < count; i += 1) {
      pointsString += job.polylinePoints[i].x + ',' + job.polylinePoints[i].y + ' ';
    }

    // Update the attributes of the polyline SVG element
    job.polyline.setAttribute('points', pointsString);
    job.polyline.setAttribute('stroke', 'hsl(' + job.currentColor.h + ',' + job.currentColor.s +
        '%,' + job.currentColor.l + '%)');
    job.polyline.setAttribute('stroke-opacity', job.currentOpacity);
    job.polyline.setAttribute('stroke-width', job.lineWidth);
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LineJob as started.
   *
   * @this LineJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this LineJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    job.ellapsedTime = currentTime - job.startTime;

    if (job.ellapsedTime >= job.duration) {
      handleCompletion.call(job);
    } else {
      updateColorValues.call(job);
      updateSegments.call(job);

      config.feGaussianBlur.setAttribute('stdDeviation', job.blurStdDeviation);

      if (!job.isComplete) {
        computeCornerGapPoints.call(job);
        computePolylinePoints.call(job);
      }
    }
  }

  /**
   * Draws the current state of this LineJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LineJob
   */
  function draw() {
    var job = this;

    drawSegments.call(job);
  }

  /**
   * Stops this LineJob, and returns the element its original form.
   *
   * @this LineJob
   */
  function cancel() {
    var job;

    job = this;

    handleCompletion.call(job);
  }

  /**
   * @this LineJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Number} corner
   * @param {Number} direction
   * @param {Number} forcedInitialRelativeDirection
   * @param {Function} [onComplete]
   * @param {{x:Number,y:Number}} extraStartPoint
   * @throws {Error}
   */
  function LineJob(grid, tile, corner, direction, forcedInitialRelativeDirection,
                            onComplete, extraStartPoint) {
    var job = this;

    job.grid = grid;
    job.tiles = [tile];
    job.corners = [corner];
    job.lowerNeighbors = [];
    job.upperNeighbors = [];
    job.lowerNeighborCorners = [];
    job.upperNeighborCorners = [];
    job.direction = direction;
    job.forcedInitialRelativeDirection = forcedInitialRelativeDirection;
    job.extraStartPoint = extraStartPoint;
    job.currentCornerIndex = 0;
    job.frontSegmentEndRatio = Number.NaN;
    job.backSegmentStartRatio = Number.NaN;
    job.latestDirection = direction;
    job.polyline = null;
    job.gapPoints = [];
    job.polylinePoints = null;
    job.hasReachedEdge = false;
    job.startTime = 0;
    job.ellapsedTime = 0;
    job.isComplete = true;

    job.startHue = Number.NaN;
    job.endHue = Number.NaN;
    job.currentColor = {
      h: Number.NaN,
      s: config.startSaturation,
      l: config.startLightness
    };
    job.currentOpacity = config.startOpacity;

    job.duration = config.duration;
    job.lineWidth = config.lineWidth;
    job.lineLength = config.lineLength;
    job.lineSidePeriod = config.lineSidePeriod;

    job.startSaturation = config.startSaturation;
    job.startLightness = config.startLightness;
    job.startOpacity = config.startOpacity;

    job.endSaturation = config.endSaturation;
    job.endLightness = config.endLightness;
    job.endOpacity = config.endOpacity;

    job.sameDirectionProb = config.sameDirectionProb;

    job.blurStdDeviation = config.blurStdDeviation;
    job.isBlurOn = config.isBlurOn;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    if (!config.haveDefinedLineBlur) {
      config.haveDefinedLineBlur = true;
      defineLineBlur.call(job);
    }

    if (!checkIsValidInitialCornerConfiguration(job)) {
      throw new Error('LineJob created with invalid initial corner configuration: ' +
          'tileIndex=' + tile.originalIndex + ', corner=' + corner + ', direction=' + direction);
    } else {
      determineNeighbors.call(job);
      createHues.call(job);
      createPolyline.call(job);

      console.log('LineJob created: tileIndex=' + tile.originalIndex + ', corner=' + corner +
          ', direction=' + direction);
    }
  }

  /**
   * Creates a LineJob that is initialized at a tile vertex along the border of the grid.
   *
   * @param {Grid} grid
   * @param {Function} onComplete
   */
  function createRandomLineJob(grid, onComplete) {
    var tile, corner, direction, forcedInitialRelativeDirection;

    // Pick a random, non-corner, border tile to start from
    do {
      tile = grid.originalBorderTiles[parseInt(Math.random() * grid.originalBorderTiles.length)];
    } while (tile.isCornerTile);

    // Determine which corner and direction to use based on the selected tile
    if (grid.isVertical) {
      if (!tile.neighborStates[4]) { // Left side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 4;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 1;
          }
        }
        direction = tile.originalAnchor.y < grid.originalCenter.y ? 2 : 1;
      } else if (!tile.neighborStates[1]) { // Right side
        if (tile.isInLargerRow) {
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        } else { // Smaller row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 2;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 4;
          }
        }
        direction = tile.originalAnchor.y < grid.originalCenter.y ? 4 : 5;
      } else if (!tile.neighborStates[0]) { // Top side
        if (Math.random() < 0.5) {
          corner = 1;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        }
        //forcedInitialAbsoluteDirection = 3;
        direction = 3;
      } else { // Bottom side
        if (Math.random() < 0.5) {
          corner = 2;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 4;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 0;
        direction = 0;
      }
    } else { // Not vertical
      if (!tile.neighborStates[0]) { // Top side
        if (tile.rowIndex === 0) { // First row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          }
        } else { // Second row
          if (Math.random() < 0.5) {
            corner = 0;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 2;
          } else {
            corner = 5;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 3;
          }
        }
        direction = tile.originalAnchor.x < grid.originalCenter.x ? 2 : 3;
      } else if (!tile.neighborStates[3]) { // Bottom side
        if (tile.rowIndex === grid.rowCount - 1) { // Last row
          if (Math.random() < 0.5) {
            corner = 1;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          } else {
            corner = 4;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          }
        } else { // Second-to-last row
          if (Math.random() < 0.5) {
            corner = 2;
            forcedInitialRelativeDirection = config.LOWER_SELF;
            //forcedInitialAbsoluteDirection = 0;
          } else {
            corner = 3;
            forcedInitialRelativeDirection = config.UPPER_SELF;
            //forcedInitialAbsoluteDirection = 5;
          }
        }
        direction = tile.originalAnchor.x < grid.originalCenter.x ? 0 : 5;
      } else if (!tile.neighborStates[4]) { // Left side
        if (Math.random() < 0.5) {
          corner = 3;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 5;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 1;
        direction = 1;
      } else { // Right side
        if (Math.random() < 0.5) {
          corner = 0;
          forcedInitialRelativeDirection = config.LOWER_SELF;
        } else {
          corner = 2;
          forcedInitialRelativeDirection = config.UPPER_SELF;
        }
        //forcedInitialAbsoluteDirection = 4;
        direction = 4;
      }
    }

    return new LineJob(grid, tile, corner, direction, forcedInitialRelativeDirection,
        onComplete, null);
  }

  /**
   * Checks whether the given LineJob has a valid corner configuration for its initial
   * position.
   *
   * @param {LineJob} job
   */
  function checkIsValidInitialCornerConfiguration(job) {
    var tile, corner, direction, forcedInitialRelativeDirection, isValidEdgeDirection;

    tile = job.tiles[0];
    corner = job.corners[0];
    direction = job.direction;
    forcedInitialRelativeDirection = job.forcedInitialRelativeDirection;

    if (tile.isCornerTile) {
      return false;
    }

    if (tile.isBorderTile) {
      if (job.grid.isVertical) {
        if (!tile.neighborStates[4]) { // Left side
          isValidEdgeDirection = direction === 1 || direction === 2;

          if (tile.isInLargerRow) {
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 4:
                return false;
              case 5:
                return false;
            }
          } else {
            switch (corner) {
              case 0:
                return true;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 5:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            }
          }
        } else if (!tile.neighborStates[1]) { // Right side
          isValidEdgeDirection = direction === 4 || direction === 5;

          if (tile.isInLargerRow) {
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 1:
                return false;
              case 2:
                return false;
              case 3:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 4:
                return true;
              case 5:
                return true;
            }
          } else { // Smaller row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 2:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 3:
                return true;
              case 4:
                return true;
              case 5:
                return true;
            }
          }
        } else if (!tile.neighborStates[0]) { // Top side
          isValidEdgeDirection = direction === 3;

          switch (corner) {
            case 0:
              return false;
            case 1:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 2:
              return true;
            case 3:
              return true;
            case 4:
              return true;
            case 5:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
          }
        } else { // Bottom side
          isValidEdgeDirection = direction === 0;

          switch (corner) {
            case 0:
              return true;
            case 1:
              return true;
            case 2:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 3:
              return false;
            case 4:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 5:
              return true;
          }
        }
      } else { // Not vertical
        if (!tile.neighborStates[0]) { // Top side
          isValidEdgeDirection = direction === 2 || direction === 3;

          if (tile.rowIndex === 0) { // First row
            switch (corner) {
              case 0:
                return false;
              case 1:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 5:
                return false;
            }
          } else { // Second row
            switch (corner) {
              case 0:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 1:
                return true;
              case 2:
                return true;
              case 3:
                return true;
              case 4:
                return true;
              case 5:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            }
          }
        } else if (!tile.neighborStates[3]) { // Bottom side
          isValidEdgeDirection = direction === 0 || direction === 5;

          if (tile.rowIndex === job.grid.rowCount - 1) { // Last row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 2:
                return false;
              case 3:
                return false;
              case 4:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 5:
                return true;
            }
          } else { // Second-to-last row
            switch (corner) {
              case 0:
                return true;
              case 1:
                return true;
              case 2:
                return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
              case 3:
                return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
              case 4:
                return true;
              case 5:
                return true;
            }
          }
        } else if (!tile.neighborStates[4]) { // Left side
          isValidEdgeDirection = direction === 1;

          switch (corner) {
            case 0:
              return true;
            case 1:
              return true;
            case 2:
              return true;
            case 3:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 4:
              return false;
            case 5:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
          }
        } else { // Right side
          isValidEdgeDirection = direction === 4;

          switch (corner) {
            case 0:
              return forcedInitialRelativeDirection === config.LOWER_SELF && isValidEdgeDirection;
            case 1:
              return false;
            case 2:
              return forcedInitialRelativeDirection === config.UPPER_SELF && isValidEdgeDirection;
            case 3:
              return true;
            case 4:
              return true;
            case 5:
              return true;
          }
        }
      }
    }

    return true;
  }

  LineJob.config = config;
  LineJob.createRandomLineJob = createRandomLineJob;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.LineJob = LineJob;

  console.log('LineJob module loaded');
})();

/**
 * @typedef {AnimationJob} LinesRadiateJob
 */

/**
 * This module defines a constructor for LinesRadiateJob objects.
 *
 * @module LinesRadiateJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 700;
  config.lineWidth = 24;
  config.lineLength = 1300;
  config.lineSidePeriod = 30; // milliseconds per tile side

  config.startSaturation = 100;
  config.startLightness = 100;
  config.startOpacity = 0.8;

  config.endSaturation = 100;
  config.endLightness = 70;
  config.endOpacity = 0;

  config.sameDirectionProb = 0.85;

  config.blurStdDeviation = 2;
  config.isBlurOn = false;

  config.isRecurring = false;
  config.avgDelay = 2000;
  config.delayDeviationRange = 1800;

  // ---  --- //

  config.haveDefinedLineBlur = false;
  config.filterId = 'random-line-filter';

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Creates an SVG definition that is used for blurring the lines of LineJobs.
   *
   * @this LinesRadiateJob
   */
  function defineLineBlur() {
    var job, filter, feGaussianBlur;

    job = this;

    // Create the elements

    filter = document.createElementNS(window.hg.util.svgNamespace, 'filter');
    job.grid.svgDefs.appendChild(filter);

    feGaussianBlur = document.createElementNS(window.hg.util.svgNamespace, 'feGaussianBlur');
    filter.appendChild(feGaussianBlur);

    // Define the blur

    filter.setAttribute('id', config.filterId);
    filter.setAttribute('x', '-10%');
    filter.setAttribute('y', '-10%');
    filter.setAttribute('width', '120%');
    filter.setAttribute('height', '120%');

    feGaussianBlur.setAttribute('in', 'SourceGraphic');
    feGaussianBlur.setAttribute('result', 'blurOut');

    job.feGaussianBlur = feGaussianBlur;
  }

  /**
   * Creates the individual LineJobs that comprise this LinesRadiateJob.
   *
   * @this LinesRadiateJob
   */
  function createLineJobs() {
    var job, i, line;

    job = this;
    job.lineJobs = [];

    for (i = 0; i < 6; i += 1) {
      try {
        line = new window.hg.LineJob(job.grid, job.tile, i, i,
            window.hg.LineJob.config.NEIGHBOR, job.onComplete, job.extraStartPoint);
      } catch (error) {
        console.debug(error.message);
        continue;
      }

      job.lineJobs.push(line);

      // Replace the line animation's normal parameters with some that are specific to radiating
      // lines
      line.duration = config.duration;
      line.lineWidth = config.lineWidth;
      line.lineLength = config.lineLength;
      line.lineSidePeriod = config.lineSidePeriod;

      line.startSaturation = config.startSaturation;
      line.startLightness = config.startLightness;
      line.startOpacity = config.startOpacity;

      line.endSaturation = config.endSaturation;
      line.endLightness = config.endLightness;
      line.endOpacity = config.endOpacity;

      line.sameDirectionProb = config.sameDirectionProb;

      line.filterId = config.filterId;
      line.blurStdDeviation = config.blurStdDeviation;
      line.isBlurOn = config.isBlurOn;

      if (config.isBlurOn) {
        line.polyline.setAttribute('filter', 'url(#' + config.filterId + ')');
      } else {
        line.polyline.setAttribute('filter', 'none');
      }
    }
  }

  /**
   * Checks whether this job is complete. If so, a flag is set and a callback is called.
   *
   * @this LinesRadiateJob
   */
  function checkForComplete() {
    var job, i;

    job = this;

    for (i = 0; i < job.lineJobs.length; i += 1) {
      if (job.lineJobs[i].isComplete) {
        job.lineJobs.splice(i--, 1);
      } else {
        return;
      }
    }

    console.log('LinesRadiateJob completed');

    job.isComplete = true;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this LinesRadiateJob as started.
   *
   * @this LinesRadiateJob
   */
  function start() {
    var job, i, count;

    job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].start();
    }
  }

  /**
   * Updates the animation progress of this LinesRadiateJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, i, count;

    job = this;

    // Update the extra point
    job.extraStartPoint.x = job.tile.particle.px;
    job.extraStartPoint.y = job.tile.particle.py;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].update(currentTime, deltaTime);

      if (job.lineJobs[i].isComplete) {
        job.lineJobs.splice(i, 1);
        i--;
        count--;
      }
    }

    job.feGaussianBlur.setAttribute('stdDeviation', config.blurStdDeviation);

    checkForComplete.call(job);
  }

  /**
   * Draws the current state of this LinesRadiateJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this LinesRadiateJob
   */
  function draw() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].draw();
    }
  }

  /**
   * Stops this LinesRadiateJob, and returns the element its original form.
   *
   * @this LinesRadiateJob
   */
  function cancel() {
    var job, i, count;

    job = this;

    for (i = 0, count = job.lineJobs.length; i < count; i += 1) {
      job.lineJobs[i].cancel();
    }

    job.lineJobs = [];

    job.isComplete = true;
  }

  /**
   * @this LinesRadiateJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} [onComplete]
   */
  function LinesRadiateJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.extraStartPoint = { x: tile.particle.px, y: tile.particle.py };
    job.startTime = 0;
    job.isComplete = true;
    job.lineJobs = null;

    job.onComplete = onComplete || function () {};

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.init = init;

    if (!config.haveDefinedLineBlur) {
      defineLineBlur.call(job);
    }

    createLineJobs.call(job);

    console.log('LinesRadiateJob created: tileIndex=' + tile.originalIndex);
  }

  LinesRadiateJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.LinesRadiateJob = LinesRadiateJob;

  console.log('LinesRadiateJob module loaded');
})();

/**
 * @typedef {AnimationJob} OpenPostJob
 */

/**
 * This module defines a constructor for OpenPostJob objects.
 *
 * @module OpenPostJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  config.expandedDisplacementTileCount = 3;

  config.spreadDurationOffset = -200;
  config.panDurationOffset = -100;
  config.fadePostDurationOffset = 1100;
  config.dilateSectorsDurationOffset = 0;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this OpenPostJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('OpenPostJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.grid.isTransitioning = false;

    // Don't reset some state if another expansion job started after this one did
    if (job.grid.lastExpansionJob === job) {
      job.grid.pagePost.loadCarouselMedia();
    }

    job.isComplete = true;
    job.onComplete();
  }

  /**
   * Creates the Sectors for expanding the grid.
   *
   * @this OpenPostJob
   */
  function createSectors() {
    var job, i, j, jCount, k, sectorTiles, allExpandedTiles;

    job = this;

    // Create the sectors
    for (i = 0; i < 6; i += 1) {
      job.sectors[i] = new window.hg.Sector(job.grid, job.baseTile, i,
          config.expandedDisplacementTileCount);
    }

    // Connect the sectors' tiles' external neighbor states
    for (i = 0; i < 6; i += 1) {
      job.sectors[i].initializeExpandedStateExternalTileNeighbors(job.sectors);
    }

//    dumpSectorInfo.call(job);

    // De-allocate the now-unnecessary two-dimensional sector tile collections
    for (i = 0; i < 6; i += 1) {
      job.sectors[i].tilesByIndex = null;
    }

    // Set up the expanded state for the selected tile (which is a member of no sector)
    window.hg.Tile.initializeTileExpandedState(job.baseTile, null, Number.NaN, Number.NaN);

    job.grid.sectors = job.sectors;

    // Give the grid a reference to the new complete collection of all tiles
    allExpandedTiles = [];
    for (k = 0, i = 0; i < 6; i += 1) {
      sectorTiles = job.sectors[i].tiles;

      for (j = 0, jCount = sectorTiles.length; j < jCount; j += 1, k += 1) {
        allExpandedTiles[k] = sectorTiles[j];
      }
    }
    allExpandedTiles[k] = job.baseTile;
    job.grid.updateAllTilesCollection(allExpandedTiles);
  }

  /**
   * Logs the new Sector data.
   *
   * @this OpenPostJob
   */
  function dumpSectorInfo() {
    var job, i;

    job = this;

    for (i = 0; i < 6; i += 1) {
      console.log(job.sectors[i]);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this OpenPostJob as started.
   *
   * @this OpenPostJob
   */
  function start() {
    var panDisplacement;
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;

    if (job.grid.isTransitioning) {
      job.previousJob.cancel();
    }

    job.grid.isPostOpen = true;
    job.grid.isTransitioning = true;
    job.grid.expandedTile = job.baseTile;
    job.grid.lastExpansionJob = job;

    // Turn scrolling off while the grid is expanded
    job.grid.parent.style.overflow = 'hidden';

    createSectors.call(job);

    job.grid.annotations.setExpandedAnnotations(true);

    // Start the sub-jobs
    window.hg.controller.transientJobs.spread.create(job.grid, job.baseTile)
        .duration = config.duration + config.spreadDurationOffset;
    window.hg.controller.transientJobs.pan.create(job.grid, job.baseTile)
        .duration = config.duration + config.panDurationOffset;

    panDisplacement = {
      x: job.grid.panCenter.x - job.grid.originalCenter.x,
      y: job.grid.panCenter.y - job.grid.originalCenter.y
    };

    window.hg.controller.transientJobs.dilateSectors.create(job.grid, job.baseTile, panDisplacement)
        .duration = config.duration + config.dilateSectorsDurationOffset;
    window.hg.controller.transientJobs.fadePost.create(job.grid, job.baseTile)
        .duration = config.duration + config.fadePostDurationOffset;

    // TODO: this should instead fade out the old persistent animations and fade in the new ones
    window.hg.controller.resetPersistentJobs(job.grid);
  }

  /**
   * Updates the animation progress of this OpenPostJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job = this;

    // Is the job done?
    if (currentTime - job.startTime >= config.duration) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this OpenPostJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this OpenPostJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this OpenPostJob, and returns the element its original form.
   *
   * @this OpenPostJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this OpenPostJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function OpenPostJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = tile;
    job.startTime = 0;
    job.isComplete = true;
    job.sectors = [];
    job.previousJob = grid.lastExpansionJob;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('OpenPostJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  OpenPostJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.OpenPostJob = OpenPostJob;

  console.log('OpenPostJob module loaded');
})();

/**
 * @typedef {AnimationJob} PanJob
 */

/**
 * This module defines a constructor for PanJob objects.
 *
 * @module PanJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 400;

  config.displacementRatio = 0.28;

  config.isRecurring = false;
  config.avgDelay = 300;
  config.delayDeviationRange = 0;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this PanJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('PanJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  /**
   * @this PanJob
   */
  function setFinalPositions() {
    var job, i, count;

    job = this;

    // Displace the tiles
    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].originalAnchor.x += job.displacement.x;
      job.grid.allTiles[i].originalAnchor.y += job.displacement.y;
    }

    // Update the grid
    job.grid.panCenter.x += job.displacement.x;
    job.grid.panCenter.y += job.displacement.y;
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this PanJob as started.
   *
   * @this PanJob
   */
  function start() {
    var job = this;

    job.reverseDisplacement = {x: job.endPoint.x - job.startPoint.x, y: job.endPoint.y - job.startPoint.y};
    job.displacement = {x: -job.reverseDisplacement.x, y: -job.reverseDisplacement.y};

    job.startTime = Date.now();
    job.isComplete = false;

    // Set the final positions at the start, and animate everything in "reverse"
    setFinalPositions.call(job);
  }

  /**
   * Updates the animation progress of this PanJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this PanJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count, displacementX, displacementY;

    job = this;

    // Calculate progress with an easing function
    // Because the final positions were set at the start, the progress needs to update in "reverse"
    progress = (currentTime - job.startTime) / job.duration;
    progress = 1 - window.hg.util.easingFunctions.easeOutQuint(progress);
    progress = progress < 0 ? 0 : progress;

    displacementX = job.reverseDisplacement.x * progress;
    displacementY = job.reverseDisplacement.y * progress;

    // Displace the tiles
    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.grid.allTiles[i].currentAnchor.x += displacementX;
      job.grid.allTiles[i].currentAnchor.y += displacementY;
    }

    // Update the grid
    job.grid.currentCenter.x = job.grid.panCenter.x + displacementX;
    job.grid.currentCenter.y = job.grid.panCenter.y + displacementY;

    // Is the job done?
    if (progress === 0) {
      handleComplete.call(job, false);
    }
  }

  /**
   * Draws the current state of this PanJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this PanJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this PanJob, and returns the element its original form.
   *
   * @this PanJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this PanJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {?Tile} tile
   * @param {Function} onComplete
   * @param {{x:Number,y:Number}} [destinationPoint]
   */
  function PanJob(grid, tile, onComplete, destinationPoint) {
    var job = this;

    job.grid = grid;
    job.baseTile = tile;
    job.reverseDisplacement = null;
    job.displacement = null;
    job.startTime = 0;
    job.isComplete = true;

    grid.scrollTop = grid.parent.scrollTop;

    // The current viewport coordinates of the point that we would like to move to the center of the viewport
    job.endPoint = destinationPoint || {
      x: tile.originalAnchor.x,
      y: tile.originalAnchor.y - grid.scrollTop
    };

    // The center of the viewport
    job.startPoint = {x: grid.originalCenter.x, y: grid.originalCenter.y};

    job.duration = config.duration;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('PanJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  PanJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.PanJob = PanJob;

  console.log('PanJob module loaded');
})();

/**
 * @typedef {AnimationJob} SpreadJob
 */

/**
 * This module defines a constructor for SpreadJob objects.
 *
 * @module SpreadJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 300;

  config.displacementRatio = 0.2;

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * Calculates and stores the maximal displacement values for all tiles.
   *
   * @this SpreadJob
   */
  function initializeDisplacements() {
    var job, i, count;

    job = this;

    job.displacements = [];

    for (i = 0, count = job.grid.allTiles.length; i < count; i += 1) {
      job.displacements[i] = {
        tile: job.grid.allTiles[i],
        dx: config.displacementRatio *
            (job.grid.allTiles[i].originalAnchor.x - job.baseTile.originalAnchor.x),
        dy: config.displacementRatio *
            (job.grid.allTiles[i].originalAnchor.y - job.baseTile.originalAnchor.y)
      };
    }
  }

  /**
   * @this SpreadJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('SpreadJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this SpreadJob as started.
   *
   * @this SpreadJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this SpreadJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this SpreadJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    var job, progress, i, count;

    job = this;

    if (currentTime > job.startTime + job.duration) {
      handleComplete.call(job, false);
    } else {
      // Ease-out halfway, then ease-in back
      progress = (currentTime - job.startTime) / job.duration;
      progress = (progress > 0.5 ? 1 - progress : progress) * 2;
      progress = window.hg.util.easingFunctions.easeOutQuint(progress);

      // Displace the tiles
      for (i = 0, count = job.displacements.length; i < count; i += 1) {
        job.displacements[i].tile.currentAnchor.x += job.displacements[i].dx * progress;
        job.displacements[i].tile.currentAnchor.y += job.displacements[i].dy * progress;
      }
    }
  }

  /**
   * Draws the current state of this SpreadJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this SpreadJob
   */
  function draw() {
    // This animation job updates the state of actual tiles, so it has nothing of its own to draw
  }

  /**
   * Stops this SpreadJob, and returns the element its original form.
   *
   * @this SpreadJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this SpreadJob
   */
  function init() {
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function SpreadJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.baseTile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.displacements = null;

    job.duration = config.duration;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    initializeDisplacements.call(job);

    console.log('SpreadJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  SpreadJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.SpreadJob = SpreadJob;

  console.log('SpreadJob module loaded');
})();

/**
 * @typedef {AnimationJob} TileBorderJob
 */

/**
 * This module defines a constructor for TileBorderJob objects.
 *
 * @module TileBorderJob
 */
(function () {
  // ------------------------------------------------------------------------------------------- //
  // Private static variables

  var config = {};

  config.duration = 500;

  // TODO:

  config.isRecurring = false;
  config.avgDelay = 4000;
  config.delayDeviationRange = 3800;

  //  --- Dependent parameters --- //

  config.computeDependentValues = function () {
    // TODO:
  };

  config.computeDependentValues();

  // ------------------------------------------------------------------------------------------- //
  // Private dynamic functions

  /**
   * @this TileBorderJob
   */
  function handleComplete(wasCancelled) {
    var job = this;

    console.log('TileBorderJob ' + (wasCancelled ? 'cancelled' : 'completed'));

    job.isComplete = true;

    job.onComplete();
  }

  // ------------------------------------------------------------------------------------------- //
  // Private static functions

  // ------------------------------------------------------------------------------------------- //
  // Public dynamic functions

  /**
   * Sets this TileBorderJob as started.
   *
   * @this TileBorderJob
   */
  function start() {
    var job = this;

    job.startTime = Date.now();
    job.isComplete = false;
  }

  /**
   * Updates the animation progress of this TileBorderJob to match the given time.
   *
   * This should be called from the overall animation loop.
   *
   * @this TileBorderJob
   * @param {Number} currentTime
   * @param {Number} deltaTime
   */
  function update(currentTime, deltaTime) {
    // TODO:
//    var job, currentMaxDistance, currentMinDistance, i, count, distance, waveWidthRatio,
//        oneMinusDurationRatio, animatedSomeTile;
//
//    job = this;
//
//    if (currentTime > job.startTime + config.duration) {
//      handleComplete.call(job, false);
//    } else {
//      oneMinusDurationRatio = 1 - (currentTime - job.startTime) / config.duration;
//
//      currentMaxDistance = config.shimmerSpeed * (currentTime - job.startTime);
//      currentMinDistance = currentMaxDistance - config.shimmerWaveWidth;
//
//      animatedSomeTile = false;
//
//      for (i = 0, count = job.grid.originalTiles.length; i < count; i += 1) {
//        distance = job.tileDistances[i];
//
//        if (distance > currentMinDistance && distance < currentMaxDistance) {
//          waveWidthRatio = (distance - currentMinDistance) / config.shimmerWaveWidth;
//
//          updateTile(job.grid.originalTiles[i], waveWidthRatio, oneMinusDurationRatio);
//
//          animatedSomeTile = true;
//        }
//      }
//
//      if (!animatedSomeTile) {
//        handleComplete.call(job, false);
//      }
//    }**;
  }

  /**
   * Draws the current state of this TileBorderJob.
   *
   * This should be called from the overall animation loop.
   *
   * @this TileBorderJob
   */
  function draw() {
    var job;

    job = this;

    // TODO:
  }

  /**
   * Stops this TileBorderJob, and returns the element its original form.
   *
   * @this TileBorderJob
   */
  function cancel() {
    var job = this;

    handleComplete.call(job, true);
  }

  /**
   * @this TileBorderJob
   */
  function init() {
    var job = this;

    config.computeDependentValues();
    // TODO:
  }

  // ------------------------------------------------------------------------------------------- //
  // Expose this module's constructor

  /**
   * @constructor
   * @global
   * @param {Grid} grid
   * @param {Tile} tile
   * @param {Function} onComplete
   */
  function TileBorderJob(grid, tile, onComplete) {
    var job = this;

    job.grid = grid;
    job.tile = tile;
    job.startTime = 0;
    job.isComplete = true;

    job.start = start;
    job.update = update;
    job.draw = draw;
    job.cancel = cancel;
    job.onComplete = onComplete;
    job.init = init;

    console.log('TileBorderJob created: tileIndex=' + job.baseTile.originalIndex);
  }

  TileBorderJob.config = config;

  // Expose this module
  window.hg = window.hg || {};
  window.hg.TileBorderJob = TileBorderJob;

  console.log('TileBorderJob module loaded');
})();

'use strict';

/**
 * This module defines a singleton that fetches and parses data for the app.
 *
 * @module data
 */
(function () {

  var config = {};

  config.youtubeVideoBaseUrl = '//www.youtube.com/embed';
  config.youtubeThumbnailBaseUrl = 'http://img.youtube.com/vi';

  config.vimeoVideoBaseUrl = '//player.vimeo.com/video';

  config.appRootPath = '/example';
  config.metadataUrl = config.appRootPath + '/dist/data.min.json';

  var data = {};

  data.config = config;
  data.dataRequestState = 'request-not-sent';
  data.combinedMetadata = {};
  data.collectionMetadata = {};
  data.postData = [];

  data.fetchData = fetchData;

  window.app = window.app || {};
  app.data = data;

  // ---  --- //

  function fetchData(callback) {
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', onLoad, false);
    xhr.addEventListener('error', onError, false);
    xhr.addEventListener('abort', onAbort, false);

    console.log('Sending request to ' + config.metadataUrl);

    xhr.open('GET', config.metadataUrl, true);
    xhr.send();

    data.dataRequestState = 'waiting-for-response';

    // ---  --- //

    function onLoad() {
      console.log('Response status=' + xhr.status + ' (' + xhr.statusText + ')');
      //console.log('Response body=' + xhr.response);

      data.dataRequestState = 'received-response';

      try {
        data.combinedMetadata = JSON.parse(xhr.response);
      } catch (error) {
        data.combinedMetadata = {};
        data.collectionMetadata = {};
        data.postData = [];
        console.error('Unable to parse response body as JSON: ' + xhr.response);
        return;
      }

      data.collectionMetadata = data.combinedMetadata.collectionMetadata;
      data.postData = data.combinedMetadata.posts;

      updatePostsSrcUrls();

      callback();
    }

    function onError() {
      console.error('An error occurred while transferring the data');

      data.dataRequestState = 'error-with-request';
    }

    function onAbort() {
      console.error('The transfer has been cancelled by the user');

      data.dataRequestState = 'error-with-request';
    }
  }

  function updatePostsSrcUrls() {
    data.postData.forEach(updatePostSrcUrls);

    // ---  --- //

    function updatePostSrcUrls(postDatum) {
      var postBaseUrl = data.collectionMetadata.baseUrl + '/' + postDatum.id + '/';

      postDatum.images.forEach(updateSrcImageMetadata);
      postDatum.videos.forEach(updateSrcVideoMetadata);

      postDatum.thumbnailSrc = postBaseUrl + data.collectionMetadata.thumbnailName;
      postDatum.logoSrc = postBaseUrl + data.collectionMetadata.logoName;

      // ---  --- //

      function updateSrcImageMetadata(imageMetadatum) {
        imageMetadatum.src = postBaseUrl + imageMetadatum.fileName;
      }

      function updateSrcVideoMetadata(videoMetadatum) {
        switch (videoMetadatum.videoHost) {
          case 'youtube':
            videoMetadatum.videoSrc = config.youtubeVideoBaseUrl + '/' + videoMetadatum.id + '?enablejsapi=1';
            videoMetadatum.thumbnailSrc = config.youtubeThumbnailBaseUrl + '/' + videoMetadatum.id + '/default.jpg';
            break;
          case 'vimeo':
            videoMetadatum.videoSrc = config.vimeoVideoBaseUrl + '/' + videoMetadatum.id;
            videoMetadatum.thumbnailSrc = null;
            break;
          default:
            throw new Error('Invalid video host: ' + videoMetadatum.videoHost);
        }
      }
    }
  }

  console.log('data module loaded');
})();

'use strict';

/**
 * This module defines a singleton that drives the app.
 *
 * @module main
 */
(function () {

  var main = {};

  main.grid = null;

  window.app = window.app || {};
  app.main = main;

  window.addEventListener('load', initHexGrid, false);

  // ---  --- //

  /**
   * This is the event handler for the completion of the DOM loading. This creates the Grid
   * within the body element.
   */
  function initHexGrid() {
    console.log('onDocumentLoad');

    window.removeEventListener('load', initHexGrid);

    app.data.fetchData(updateTileData);
  }

  function updateTileData() {
    var hexGridContainer = document.getElementById('hex-grid-area');

    main.grid = window.hg.controller.createNewHexGrid(hexGridContainer, app.data.postData, false);

    app.parameters.initDatGui(main.grid);
  }

  console.log('main module loaded');
})();

'use strict';

/**
 * This module defines a singleton that renders a menu panel across the top of the window.
 *
 * @module menu-panel
 */
(function () {

  var config = {};

  var menuPanel = {};

  menuPanel.config = config;

  window.app = window.app || {};
  app.menuPanel = menuPanel;

  // ---  --- //

  console.log('menu-panel module loaded');
})();

'use strict';

/**
 * This module defines a singleton that handles the communication between the dat.GUI controller
 * and the hex-grid parameters.
 *
 * @module parameters
 */
(function () {

  var parameters = {},
      config = {};

  config.datGuiWidth = 300;

  // ---  --- //

  parameters.config = config;
  parameters.initDatGui = initDatGui;
  parameters.grid = null;

  window.app = window.app || {};
  app.parameters = parameters;

  // ---  --- //

  /**
   * Sets up the dat.GUI controller.
   *
   * @param {Grid} grid
   */
  function initDatGui(grid) {
    var gui, miscellaneousFolder, animationsFolder, transientFolder, persistentFolder;

    parameters.grid = grid;

    gui = new dat.GUI();
    gui.width = config.datGuiWidth;

    // --- Miscellaneous grid properties --- //

    miscellaneousFolder = gui.addFolder('Misc');
    //miscellaneousFolder.open();// TODO: remove me

    initAnnotationsFolder(miscellaneousFolder);
    initGridFolder(miscellaneousFolder);
    initInputFolder(miscellaneousFolder);
    initTileFolder(miscellaneousFolder);

    // --- Animation properties --- //

    animationsFolder = gui.addFolder('Animations');
    animationsFolder.open();// TODO: remove me

    // One-time animations

    transientFolder = animationsFolder.addFolder('One Time');
    transientFolder.open();// TODO: remove me

    initOpenClosePostJobFolder(transientFolder);
    initDisplacementRadiateJobFolder(transientFolder);
    initHighlightHoverJobFolder(transientFolder);
    initHighlightRadiateJobFolder(transientFolder);
    initIntraTileRadiateJobFolder(transientFolder);
    initRandomLineJobFolder(transientFolder);
    initLinesRadiateJobFolder(transientFolder);
    initPanJobFolder(transientFolder);
    initSpreadJobFolder(transientFolder);
    initTileBorderJobFolder(transientFolder);

    // Persistent animations

    persistentFolder = animationsFolder.addFolder('Persistent');

    initColorShiftJobFolder(persistentFolder);
    initColorWaveJobFolder(persistentFolder);
    initDisplacementWaveJobFolder(persistentFolder);

    // TODO: add an additional control to completely hide the dat.GUI controls?
  }

  // ------------------------------------------------------------------------------------------- //
  // Miscellaneous

  /**
   * Sets up the folder for Grid parameters within the dat.GUI controller.
   */
  function initGridFolder(parentFolder) {
    var gridFolder, colors;

    gridFolder = parentFolder.addFolder('Grid');

    colors = {};
    colors.backgroundColor = window.hg.util.hslToHsv({
      h: window.hg.Grid.config.backgroundHue,
      s: window.hg.Grid.config.backgroundSaturation * 0.01,
      l: window.hg.Grid.config.backgroundLightness * 0.01
    });
    colors.tileColor = window.hg.util.hslToHsv({
      h: window.hg.Grid.config.tileHue,
      s: window.hg.Grid.config.tileSaturation * 0.01,
      l: window.hg.Grid.config.tileLightness * 0.01
    });

    gridFolder.add(parameters.grid, 'isVertical')
        .onChange(function () {
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'tileOuterRadius', 10, 400)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'tileGap', -50, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.addColor(colors, 'backgroundColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.backgroundColor);

          window.hg.Grid.config.backgroundHue = color.h;
          window.hg.Grid.config.backgroundSaturation = color.s * 100;
          window.hg.Grid.config.backgroundLightness = color.l * 100;

          parameters.grid.setBackgroundColor();
        });
    gridFolder.addColor(colors, 'tileColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.tileColor);

          window.hg.Grid.config.tileHue = color.h;
          window.hg.Grid.config.tileSaturation = color.s * 100;
          window.hg.Grid.config.tileLightness = color.l * 100;

          parameters.grid.updateTileColor();
          if (window.hg.Annotations.config.annotations['contentTiles'].enabled) {
            parameters.grid.annotations.toggleAnnotationEnabled('contentTiles', true);
          }
        });
    gridFolder.add(window.hg.Grid.config, 'firstRowYOffset', -100, 100)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'contentStartingRowIndex', 0, 4).step(1)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'targetContentAreaWidth', 500, 1500)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
    gridFolder.add(window.hg.Grid.config, 'contentDensity', 0.1, 1.0)
        .onChange(function () {
          window.hg.Grid.config.computeDependentValues();
          parameters.grid.computeContentIndices();
          window.hg.controller.resetGrid(parameters.grid);
        });
  }

  /**
   * Sets up the folder for Annotation parameters within the dat.GUI controller.
   */
  function initAnnotationsFolder(parentFolder) {
    var annotationsFolder, key, data;

    annotationsFolder = parentFolder.addFolder('Annotations');

    for (key in window.hg.Annotations.config.annotations) {
      data = {};
      data[key] = window.hg.Annotations.config.annotations[key].enabled;

      annotationsFolder.add(data, key).onChange(function (value) {
        parameters.grid.annotations.toggleAnnotationEnabled(this.property, value);
      });
    }
  }

  /**
   * Sets up the folder for Input parameters within the dat.GUI controller.
   */
  function initInputFolder(parentFolder) {
    var inputFolder;

    inputFolder = parentFolder.addFolder('Input');
    //inputFolder.open();// TODO: remove me

    inputFolder.add(window.hg.Input.config, 'contentTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
    inputFolder.add(window.hg.Input.config, 'emptyTileClickAnimation',
        Object.keys(window.hg.Input.config.possibleClickAnimations));
  }

  /**
   * Sets up the folder for Tile parameters within the dat.GUI controller.
   */
  function initTileFolder(parentFolder) {
    var tileFolder;

    tileFolder = parentFolder.addFolder('Tiles');

    tileFolder.add(window.hg.Tile.config, 'dragCoeff', 0.000001, 0.1);
    tileFolder.add(window.hg.Tile.config, 'neighborSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(window.hg.Tile.config, 'neighborDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'innerAnchorSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(window.hg.Tile.config, 'innerAnchorDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'borderAnchorSpringCoeff', 0.000001, 0.0001);
    tileFolder.add(window.hg.Tile.config, 'borderAnchorDampingCoeff', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'forceSuppressionLowerThreshold', 0.000001, 0.009999);
    tileFolder.add(window.hg.Tile.config, 'velocitySuppressionLowerThreshold', 0.000001, 0.009999);
    tileFolder.add(window.hg.Grid.config, 'tileMass', 0.1, 10)
        .onChange(function (value) {
          parameters.grid.updateTileMass(value);
        });
  }

  // ------------------------------------------------------------------------------------------- //
  // One-time animations

  /**
   * Sets up the folder for OpenPostJob parameters and the ClosePostJob parameters within the
   * dat.GUI controller.
   */
  function initOpenClosePostJobFolder(parentFolder) {
    var openClosePostJobFolder, data;

    openClosePostJobFolder = parentFolder.addFolder('Open/Close Post');

    data = {
      'triggerOpenPost': window.hg.controller.transientJobs.openPost.createRandom.bind(
          window.hg.controller, parameters.grid),
      'triggerClosePost': window.hg.controller.transientJobs.closePost.createRandom.bind(
              window.hg.controller, parameters.grid),
      'triggerTogglePost': function () {
        if (parameters.grid.isPostOpen) {
          data.triggerClosePost();
        } else {
          data.triggerOpenPost();
        }
      }
    };

    openClosePostJobFolder.add(data, 'triggerTogglePost');

    openClosePostJobFolder.add(window.hg.OpenPostJob.config, 'duration', 10, 10000)
        .name('Open Duration');
    openClosePostJobFolder.add(window.hg.ClosePostJob.config, 'duration', 10, 10000)
        .name('Close Duration');
    openClosePostJobFolder.add(window.hg.OpenPostJob.config, 'expandedDisplacementTileCount', 0, 5)
        .step(1);
  }

  /**
   * Sets up the folder for DisplacementRadiateJob parameters within the dat.GUI controller.
   */
  function initDisplacementRadiateJobFolder(parentFolder) {
    var displacementRadiateJobFolder, data;

    displacementRadiateJobFolder = parentFolder.addFolder('Displacement Radiate');
//    displacementRadiateJobFolder.open();// TODO: remove me

    data = {
      'triggerDisplacement':
          window.hg.controller.transientJobs.displacementRadiate.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    displacementRadiateJobFolder.add(data, 'triggerDisplacement');

    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'duration', 10, 10000);

    // TODO:

    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    displacementRadiateJobFolder.add(window.hg.DisplacementRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.displacementRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.DisplacementRadiateJob.config.isRecurring,
          window.hg.DisplacementRadiateJob.config.avgDelay,
          window.hg.DisplacementRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for HighlightHoverJob parameters within the dat.GUI controller.
   */
  function initHighlightHoverJobFolder(parentFolder) {
    var highlightHoverJobFolder, data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightHoverJob.config.deltaHue,
      s: window.hg.HighlightHoverJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightHoverJob.config.deltaLightness * 0.01
    });

    highlightHoverJobFolder = parentFolder.addFolder('Hover Highlight');

    data = {
      'triggerHighlightHover': window.hg.controller.transientJobs.highlightHover.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    highlightHoverJobFolder.add(data, 'triggerHighlightHover');

    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'duration', 10, 10000);
    highlightHoverJobFolder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightHoverJob.config.deltaHue = color.h;
          window.hg.HighlightHoverJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightHoverJob.config.deltaLightness = color.l * 100;
        });
    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'opacity', 0, 1);

    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'avgDelay', 10, 2000)
        .onChange(toggleRecurrence);
    highlightHoverJobFolder.add(window.hg.HighlightHoverJob.config, 'delayDeviationRange', 0, 2000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.highlightHover.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightHoverJob.config.isRecurring,
          window.hg.HighlightHoverJob.config.avgDelay,
          window.hg.HighlightHoverJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for HighlightRadiateJob parameters within the dat.GUI controller.
   */
  function initHighlightRadiateJobFolder(parentFolder) {
    var highlightRadiateJobFolder, data, colors;

    colors = [];
    colors.deltaColor = window.hg.util.hslToHsv({
      h: window.hg.HighlightRadiateJob.config.deltaHue,
      s: window.hg.HighlightRadiateJob.config.deltaSaturation * 0.01,
      l: window.hg.HighlightRadiateJob.config.deltaLightness * 0.01
    });

    highlightRadiateJobFolder = parentFolder.addFolder('Radiating Highlight');

    data = {
      'triggerHighlightRadiate':
          window.hg.controller.transientJobs.highlightRadiate.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    highlightRadiateJobFolder.add(data, 'triggerHighlightRadiate');

    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'shimmerSpeed', 0.1, 10);
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'shimmerWaveWidth', 1, 2000);
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'duration', 10, 10000);
    highlightRadiateJobFolder.addColor(colors, 'deltaColor')
        .onChange(function () {
          var color = window.hg.util.hsvToHsl(colors.deltaColor);

          window.hg.HighlightRadiateJob.config.deltaHue = color.h;
          window.hg.HighlightRadiateJob.config.deltaSaturation = color.s * 100;
          window.hg.HighlightRadiateJob.config.deltaLightness = color.l * 100;
        });
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'opacity', 0, 1);

    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    highlightRadiateJobFolder.add(window.hg.HighlightRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    highlightRadiateJobFolder
        .add(window.hg.HighlightRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.highlightRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.HighlightRadiateJob.config.isRecurring,
          window.hg.HighlightRadiateJob.config.avgDelay,
          window.hg.HighlightRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for IntraTileRadiateJob parameters within the dat.GUI controller.
   */
  function initIntraTileRadiateJobFolder(parentFolder) {
    var intraTileRadiateJobFolder, data;

    intraTileRadiateJobFolder = parentFolder.addFolder('Intra-Tile Radiate');
//    intraTileRadiateJobFolder.open();// TODO: remove me

    data = {
      'triggerIntraTileRadiate':
          window.hg.controller.transientJobs.intraTileRadiate.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    intraTileRadiateJobFolder.add(data, 'triggerIntraTileRadiate');

    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'duration', 10, 10000);

    // TODO:

    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    intraTileRadiateJobFolder.add(window.hg.IntraTileRadiateJob.config, 'delayDeviationRange',
        0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.intraTileRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.IntraTileRadiateJob.config.isRecurring,
          window.hg.IntraTileRadiateJob.config.avgDelay,
          window.hg.IntraTileRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for LineJob parameters within the dat.GUI controller.
   */
  function initRandomLineJobFolder(parentFolder) {
    var randomLineJobFolder, data;

    randomLineJobFolder = parentFolder.addFolder('Random Lines');

    data = {
      'triggerLine': window.hg.controller.transientJobs.line.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    randomLineJobFolder.add(data, 'triggerLine');

    randomLineJobFolder.add(window.hg.LineJob.config, 'duration', 100, 20000);
    randomLineJobFolder.add(window.hg.LineJob.config, 'lineWidth', 1, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'lineLength', 10, 60000);
    randomLineJobFolder.add(window.hg.LineJob.config, 'lineSidePeriod', 5, 500);
    randomLineJobFolder.add(window.hg.LineJob.config, 'startSaturation', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'startLightness', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'startOpacity', 0, 1);
    randomLineJobFolder.add(window.hg.LineJob.config, 'endSaturation', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'endLightness', 0, 100);
    randomLineJobFolder.add(window.hg.LineJob.config, 'endOpacity', 0, 1);
    randomLineJobFolder.add(window.hg.LineJob.config, 'sameDirectionProb', 0, 1);

    randomLineJobFolder.add(window.hg.LineJob.config, 'isBlurOn');
    randomLineJobFolder.add(window.hg.LineJob.config, 'blurStdDeviation', 0, 80);

    randomLineJobFolder.add(window.hg.LineJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    randomLineJobFolder.add(window.hg.LineJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    randomLineJobFolder.add(window.hg.LineJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.line.toggleRecurrence(
          parameters.grid,
          window.hg.LineJob.config.isRecurring,
          window.hg.LineJob.config.avgDelay,
          window.hg.LineJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for LinesRadiateJob parameters within the dat.GUI controller.
   */
  function initLinesRadiateJobFolder(parentFolder) {
    var linesRadiateJobFolder, data;

    linesRadiateJobFolder = parentFolder.addFolder('Radiating Lines');

    data = {
      'triggerLinesRadiate': window.hg.controller.transientJobs.linesRadiate.createRandom.bind(
          window.hg.controller, parameters.grid)
    };

    linesRadiateJobFolder.add(data, 'triggerLinesRadiate');

    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'duration', 100, 20000);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'lineWidth', 1, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'lineLength', 10, 60000);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'lineSidePeriod', 5, 500);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'startSaturation', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'startLightness', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'startOpacity', 0, 1);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'endSaturation', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'endLightness', 0, 100);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'endOpacity', 0, 1);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'sameDirectionProb', 0, 1);

    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'isBlurOn');
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'blurStdDeviation', 0, 80);

    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    linesRadiateJobFolder.add(window.hg.LinesRadiateJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.linesRadiate.toggleRecurrence(
          parameters.grid,
          window.hg.LinesRadiateJob.config.isRecurring,
          window.hg.LinesRadiateJob.config.avgDelay,
          window.hg.LinesRadiateJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for PanJob parameters within the dat.GUI controller.
   */
  function initPanJobFolder(parentFolder) {
    var panJobFolder, data;

    panJobFolder = parentFolder.addFolder('Pan');

    data = {
      'triggerPan':
          window.hg.controller.transientJobs.pan.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    panJobFolder.add(data, 'triggerPan');

    panJobFolder.add(window.hg.PanJob.config, 'duration', 10, 10000);

    panJobFolder.add(window.hg.PanJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    panJobFolder.add(window.hg.PanJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    panJobFolder.add(window.hg.PanJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.pan.toggleRecurrence(
          parameters.grid,
          window.hg.PanJob.config.isRecurring,
          window.hg.PanJob.config.avgDelay,
          window.hg.PanJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for SpreadJob parameters within the dat.GUI controller.
   */
  function initSpreadJobFolder(parentFolder) {
    var spreadJobFolder, data;

    spreadJobFolder = parentFolder.addFolder('Spread');

    data = {
      'triggerSpread':
          window.hg.controller.transientJobs.spread.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    spreadJobFolder.add(data, 'triggerSpread');

    spreadJobFolder.add(window.hg.SpreadJob.config, 'duration', 10, 10000);

    spreadJobFolder.add(window.hg.SpreadJob.config, 'displacementRatio', 0.01, 1);

    spreadJobFolder.add(window.hg.SpreadJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    spreadJobFolder.add(window.hg.SpreadJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    spreadJobFolder.add(window.hg.SpreadJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.spread.toggleRecurrence(
          parameters.grid,
          window.hg.SpreadJob.config.isRecurring,
          window.hg.SpreadJob.config.avgDelay,
          window.hg.SpreadJob.config.delayDeviationRange);
    }
  }

  /**
   * Sets up the folder for TileBorderJob parameters within the dat.GUI controller.
   */
  function initTileBorderJobFolder(parentFolder) {
    var tileBorderJobFolder, data;

    tileBorderJobFolder = parentFolder.addFolder('Tile Border');
//    tileBorderJobFolder.open();// TODO: remove me

    data = {
      'triggerTileBorder': window.hg.controller.transientJobs.tileBorder.createRandom.bind(
              window.hg.controller, parameters.grid)
    };

    tileBorderJobFolder.add(data, 'triggerTileBorder');

    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'duration', 10, 10000);

    // TODO:

    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'isRecurring')
        .onChange(toggleRecurrence);
    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'avgDelay', 10, 10000)
        .onChange(toggleRecurrence);
    tileBorderJobFolder.add(window.hg.TileBorderJob.config, 'delayDeviationRange', 0, 10000)
        .onChange(toggleRecurrence);

    // ---  --- //

    function toggleRecurrence() {
      window.hg.controller.transientJobs.tileBorder.toggleRecurrence(
          parameters.grid,
          window.hg.TileBorderJob.config.isRecurring,
          window.hg.TileBorderJob.config.avgDelay,
          window.hg.TileBorderJob.config.delayDeviationRange);
    }
  }

  // ------------------------------------------------------------------------------------------- //
  // Persistent animations

  /**
   * Sets up the folder for ColorShiftJob parameters within the dat.GUI controller.
   */
  function initColorShiftJobFolder(parentFolder) {
    var colorWaveJobFolder;

    colorWaveJobFolder = parentFolder.addFolder('Color Shift');
//    colorWaveJobFolder.open();// TODO: remove me

    // TODO:
  }

  /**
   * Sets up the folder for ColorWaveJob parameters within the dat.GUI controller.
   */
  function initColorWaveJobFolder(parentFolder) {
    var colorWaveJobFolder = parentFolder.addFolder('Color Wave');

    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.ColorWaveJob.config.halfPeriod = value / 2;
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.start(parameters.grid);
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.start(parameters.grid);
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.colorWave.start(parameters.grid);
        });
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'deltaHue', 0, 360);
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'deltaSaturation', 0, 100);
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'deltaLightness', 0, 100);
    colorWaveJobFolder.add(window.hg.ColorWaveJob.config, 'opacity', 0, 1);
  }

  /**
   * Sets up the folder for DisplacementWaveJob parameters within the dat.GUI controller.
   */
  function initDisplacementWaveJobFolder(parentFolder) {
    var displacementWaveJobFolder;

    displacementWaveJobFolder = parentFolder.addFolder('Displacement Wave');

    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'period', 1, 10000)
        .onChange(function (value) {
          window.hg.DisplacementWaveJob.config.halfPeriod = value / 2;
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'wavelength', 1, 4000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.start(parameters.grid);
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'originX', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.start(parameters.grid);
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'originY', -500, 3000)
        .onChange(function () {
          window.hg.controller.persistentJobs.displacementWave.start(parameters.grid);
        });
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaX', -300, 300);
    displacementWaveJobFolder.add(window.hg.DisplacementWaveJob.config, 'tileDeltaY', -300, 300);
  }

  console.log('parameters module loaded');
})();
