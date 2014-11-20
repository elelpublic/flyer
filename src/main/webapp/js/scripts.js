/*!
	Autosize 1.18.12
	license: MIT
	http://www.jacklmoore.com/autosize
*/
(function(e){var t,o={className:"autosizejs",id:"autosizejs",append:"\n",callback:!1,resizeDelay:10,placeholder:!0},i='<textarea tabindex="-1" style="position:absolute; top:-999px; left:0; right:auto; bottom:auto; border:0; padding: 0; -moz-box-sizing:content-box; -webkit-box-sizing:content-box; box-sizing:content-box; word-wrap:break-word; height:0 !important; min-height:0 !important; overflow:hidden; transition:none; -webkit-transition:none; -moz-transition:none;"/>',n=["fontFamily","fontSize","fontWeight","fontStyle","letterSpacing","textTransform","wordSpacing","textIndent","whiteSpace"],s=e(i).data("autosize",!0)[0];s.style.lineHeight="99px","99px"===e(s).css("lineHeight")&&n.push("lineHeight"),s.style.lineHeight="",e.fn.autosize=function(i){return this.length?(i=e.extend({},o,i||{}),s.parentNode!==document.body&&e(document.body).append(s),this.each(function(){function o(){var t,o=window.getComputedStyle?window.getComputedStyle(u,null):!1;o?(t=u.getBoundingClientRect().width,(0===t||"number"!=typeof t)&&(t=parseInt(o.width,10)),e.each(["paddingLeft","paddingRight","borderLeftWidth","borderRightWidth"],function(e,i){t-=parseInt(o[i],10)})):t=p.width(),s.style.width=Math.max(t,0)+"px"}function a(){var a={};if(t=u,s.className=i.className,s.id=i.id,d=parseInt(p.css("maxHeight"),10),e.each(n,function(e,t){a[t]=p.css(t)}),e(s).css(a).attr("wrap",p.attr("wrap")),o(),window.chrome){var r=u.style.width;u.style.width="0px",u.offsetWidth,u.style.width=r}}function r(){var e,n;t!==u?a():o(),s.value=!u.value&&i.placeholder?(p.attr("placeholder")||"")+i.append:u.value+i.append,s.style.overflowY=u.style.overflowY,n=parseInt(u.style.height,10),s.scrollTop=0,s.scrollTop=9e4,e=s.scrollTop,d&&e>d?(u.style.overflowY="scroll",e=d):(u.style.overflowY="hidden",c>e&&(e=c)),e+=w,n!==e&&(u.style.height=e+"px",f&&i.callback.call(u,u),p.trigger("autosize.resized"))}function l(){clearTimeout(h),h=setTimeout(function(){var e=p.width();e!==g&&(g=e,r())},parseInt(i.resizeDelay,10))}var d,c,h,u=this,p=e(u),w=0,f=e.isFunction(i.callback),z={height:u.style.height,overflow:u.style.overflow,overflowY:u.style.overflowY,wordWrap:u.style.wordWrap,resize:u.style.resize},g=p.width(),y=p.css("resize");p.data("autosize")||(p.data("autosize",!0),("border-box"===p.css("box-sizing")||"border-box"===p.css("-moz-box-sizing")||"border-box"===p.css("-webkit-box-sizing"))&&(w=p.outerHeight()-p.height()),c=Math.max(parseInt(p.css("minHeight"),10)-w||0,p.height()),p.css({overflow:"hidden",overflowY:"hidden",wordWrap:"break-word"}),"vertical"===y?p.css("resize","none"):"both"===y&&p.css("resize","horizontal"),"onpropertychange"in u?"oninput"in u?p.on("input.autosize keyup.autosize",r):p.on("propertychange.autosize",function(){"value"===event.propertyName&&r()}):p.on("input.autosize",r),i.resizeDelay!==!1&&e(window).on("resize.autosize",l),p.on("autosize.resize",r),p.on("autosize.resizeIncludeStyle",function(){t=null,r()}),p.on("autosize.destroy",function(){t=null,clearTimeout(h),e(window).off("resize",l),p.off("autosize").off(".autosize").css(z).removeData("autosize")}),r())})):this}})(jQuery||$);
/*!
 * jQuery Modal
 * Copyright (c) 2014 CreativeDream
 * Website http://creativedream.net/plugins
 * Version: 1.0 (07-01-2014)
 * Requires: jQuery v1.7.1 or later 
*/
function modal(e){return $.cModal(e)}(function(e){e.cModal=function(t){var n={type:"default",title:null,text:null,size:"normal",buttons:[{text:"OK",val:true,onClick:function(e){return true}}],center:true,autoclose:false,callback:null,onShow:null,animate:true,closeClick:true,closable:true,theme:"default",background:"rgba(0,0,0,0.3)",zIndex:1050,buttonText:{ok:"OK",yes:"Yes",cancel:"Cancel"},template:'<div class="modal-box"><div class="modal-inner"><div class="modal-title"><a class="modal-close-btn"></a></div><div class="modal-text"></div><div class="modal-buttons"></div></div></div>',_classes:{box:".modal-box",boxInner:".modal-inner",title:".modal-title",content:".modal-text",buttons:".modal-buttons",closebtn:".modal-close-btn"}},t=e.extend({},n,t),r,i=e("<div id='modal-window' />").hide(),s=t._classes.box,o=i.append(t.template),u={init:function(){e("#modal-window").remove();i.css({position:"fixed",width:"100%",height:"100%",top:"0",left:"0","z-index":t.zIndex,overflow:"auto"});i.find(t._classes.box).css({position:"absolute"});u._modalShow();u._modalConent();t.onShow!=null?t.onShow({close:function(){u._modalHide()},getModal:function(){return i},getTitle:function(){return i.find(t._classes.title)},getContet:function(){return i.find(t._classes.content)},setTitle:function(e){i.find(t._classes.title+" h3").html(e);return true},setContent:function(e){i.find(t._classes.content).html(e);return true},setClosable:function(e){if(e===false){t.closable=false}else{t.closable=true}return true}}):null;i.on("click","a.modal-btn",function(t){u._modalBtn(e(this))}).on("click",t._classes.closebtn,function(e){u._modalHide()}).click(function(e){if(t.closeClick){if(e.target.id=="modal-window"){u._modalHide()}}});e(window).bind("keyup",u._keyUpF);i.bind("DOMSubtreeModified",u._position).bind("DOMNodeRemoved",function(e){if(t.closable){u._modalHide()}else{modal(t)}})},_keyUpF:function(e){switch(e.keyCode){case 13:if($("input:not(.modal-prompt-input),textarea").is(":focus")){return false}u._modalBtn(i.find(t._classes.buttons+" a.modal-btn"+(typeof u.btnForEKey!=="undefined"&&i.find(t._classes.buttons+" a.modal-btn:eq("+u.btnForEKey+")").size()>0?":eq("+u.btnForEKey+")":":last-child")));break;case 27:u._modalHide();break}},_modalShow:function(){e("body").css({overflow:"hidden",width:e("body").innerWidth()}).append(o)},_modalHide:function(n){if(t.closable===false){return false}r=typeof r=="undefined"?false:r;var o=function(){i.fadeOut(200,function(){t.callback!=null?t.callback(r):null;e(this).remove();e("body").css({overflow:"",width:""})});var n=100*parseFloat(e(s).css("top"))/parseFloat(e(s).parent().css("height"));e(s).animate({top:n+(t.animate?3:0)+"%"},"fast")};if(!n){o()}else{setTimeout(function(){o()},n)}e(window).unbind("keyup",u._keyUpF)},_modalConent:function(){var n=t._classes.title,r=t._classes.content,o=t._classes.buttons,a=t.buttonText,f=["alert","confirm","prompt"],l=["xenon","atlant","reseted"];if(e.inArray(t.type,f)==-1&&t.type!="default"){e(s).addClass("modal-type-"+t.type)}if(t.size&&t.size!=null){e(s).addClass("modal-size-"+t.size)}else{e(s).addClass("modal-size-normal")}if(t.theme&&t.theme!=null&&t.theme!="default"){e(s).addClass((e.inArray(t.theme,l)==-1?"":"modal-theme-")+t.theme)}if(t.background&&t.background!=null){i.css("background-color",t.background)}if(t.title||t.title!=null){e(n).prepend("<h3>"+t.title+"</h3>")}else{e(n).remove()}t.type=="prompt"?t.text+='<input type="text" name="modal-prompt-input" class="modal-prompt-input" autocomplete="off" autofocus="on" />':"";e(r).html(t.text);if(t.buttons||t.buttons!=null){var c="";switch(t.type){case"alert":c='<a class="modal-btn'+(t.buttons[0].addClass?" "+t.buttons[0].addClass:"")+'">'+a.ok+"</a>";break;case"confirm":c='<a class="modal-btn'+(t.buttons[0].addClass?" "+t.buttons[0].addClass:"")+'">'+a.cancel+'</a><a class="modal-btn '+(t.buttons[1]&&t.buttons[1].addClass?" "+t.buttons[1].addClass:"btn-light-blue")+'">'+a.yes+"</a>";break;case"prompt":c='<a class="modal-btn'+(t.buttons[0].addClass?" "+t.buttons[0].addClass:"")+'">'+a.cancel+'</a><a class="modal-btn '+(t.buttons[1]&&t.buttons[1].addClass?" "+t.buttons[1].addClass:"btn-light-blue")+'">'+a.ok+"</a>";break;default:if(t.buttons.length>0&&e.isArray(t.buttons)){e.each(t.buttons,function(e,t){var n=t["addClass"]&&typeof t["addClass"]!="undefined"?" "+t["addClass"]:"";c+='<a class="modal-btn'+n+'">'+t["text"]+"</a>";if(t["eKey"]){u.btnForEKey=e}})}else{c+='<a class="modal-btn">'+a.ok+"</a>"}}e(o).html(c)}else{e(o).remove()}i.fadeIn(200);u._position();if(t.type=="prompt"){$(".modal-prompt-input").focus()}if(t.autoclose){var h=t.buttons||t.buttons!=null?e(r).text().length*32:900;u._modalHide(h<900?900:h)}},_position:function(){var n=null;if(t.center){n={top:50,left:50,marginTop:-e(s).outerHeight()/2,marginLeft:-e(s).outerWidth()/2};if(e(window).height()<e(s).outerHeight()){n.top=1;n.marginTop=0}e(s).css({top:n.top-(t.animate?3:0)+"%",left:n.left+"%","margin-top":n.marginTop,"margin-left":n.marginLeft}).animate({top:n.top+"%"},"fast")}else{n={top:10,left:50,marginTop:0,marginLeft:-e(s).outerWidth()/2};e(s).css({top:n.top-(t.animate?3:0)+"%",left:n.left+"%","margin-top":n.marginTop,"margin-left":n.marginLeft}).animate({top:n.top+"%"},"fast")}},_modalBtn:function(n){var s=false,o=t.type,a=n.index(),f=t.buttons[a];if(e.inArray(o,["alert","confirm","prompt"])>-1){s=a==1?true:false;if(o=="prompt"){s=s&&i.find("input.modal-prompt-input").size()>0&&i.find("input.modal-prompt-input").val().length!=0?i.find("input.modal-prompt-input").val():false}u._modalHide()}else{if(n.hasClass("btn-disabled")){return false}s=f&&f["val"]?f["val"]:true;if(!f["onClick"]||f["onClick"]({val:s,bObj:n,bOpts:f,close:function(){u._modalHide()},getModal:function(){return i},getTitle:function(){return i.find(t._classes.title)},getContet:function(){return i.find(t._classes.content)},setTitle:function(e){i.find(t._classes.title+" h3").html(e);return true},setContent:function(e){i.find(t._classes.content).html(e);return true},setClosable:function(e){if(e===false){t.closable=false}else{t.closable=true}return true}})){u._modalHide()}}r=s}};u.init();return true}})(jQuery);
/*!
 * jQuery.tipsy
 * Copyright (c) 2014 CreativeDream
 * Website: http://creativedream.net/plugins/
 * Version: 1.0 (18-11-2014)
 * Requires: jQuery v1.7.1 or later
 */
(function(e){e.fn.tipsy=function(t){if(typeof t=="string"&&["show","hide"].indexOf(t)>-1){switch(t){case"show":$(this).trigger("tipsy.show");break;case"hide":$(this).trigger("tipsy.hide");break}return this}var n=e.extend({arrowWidth:10,attr:"data-tipsy",cls:null,duration:150,offset:7,position:"top-center",trigger:"hover",onShow:null,onHide:null},t);return this.each(function(t,r){var i=e(r),s=".tipsy",o=e('<div class="tipsy"></div>'),u=["top-left","top-center","top-right","bottom-left","bottom-center","bottom-right","left","right"],a={init:function(){var e={};switch(n.trigger){case"hover":e={mouseenter:a._show,mouseleave:a._hide};break;case"focus":e={focus:a._show,blur:a._hide};break;case"click":e={click:function(e){if(!a._clSe){a._clSe=true;a._show(e)}else{a._clSe=false;a._hide(e)}}};break;case"manual":a._unbindOptions();e={"tipsy.show":function(e){a._clSe=true;a._show(e)},"tipsy.hide":function(e){a._clSe=false;a._hide(e)}};break}$(s).remove();a._clear();i.on(e);o.hide()},_show:function(e){$(s).remove();a._clear();if(a.hasAttr(n.attr+"-disabled")){return false}a._createBox();if(n.trigger!="manual"){a._bindOptions()}},_hide:function(e){a._fixTitle(true);o.stop(true,true).fadeOut(n.duration,function(){n.onHide!=null&&typeof n.onHide=="function"?n.onHide(o,i):null;a._clear();$(this).remove()})},_showIn:function(){o.stop(true,true).fadeIn(n.duration,function(){n.onShow!=null&&typeof n.onShow=="function"?n.onShow(o,i):null})},_bindOptions:function(){e(window).bind("contextmenu",function(){a._hide()}).bind("blur",function(){a._hide()}).bind("resize",function(){a._hide()}).bind("scroll",function(){a._hide()})},_unbindOptions:function(){e(window).unbind("contextmenu",function(){a._hide()}).unbind("blur",function(){a._hide()}).unbind("resize",function(){a._hide()}).unbind("scroll",function(){a._hide()})},_clear:function(){o.attr("class","tipsy").empty();a._lsWpI=[];a._lsWtI=[]},hasAttr:function(e){e=i.attr(e);return typeof e!==typeof undefined&&e!==false},_fixTitle:function(e){if(e){if(a.hasAttr("data-title")&&!a.hasAttr("title")&&a._lsWtI[0]==true){i.attr("title",a._lsWtI[1]||"").removeAttr("data-title")}}else{if(a.hasAttr("title")||!a.hasAttr("data-title")){a._lsWtI=[true,i.attr("title")];i.attr("data-title",i.attr("title")||"").removeAttr("title")}}},_getTitle:function(){a._fixTitle();var e=i.attr("data-title");e=""+e;return e},_position:function(e){var t={top:0,left:0},r=e?e:a.hasAttr(n.attr+"-position")?i.attr(n.attr+"-position"):n.position,s=r.split("-"),f=a.hasAttr(n.attr+"-offset")?i.attr(n.attr+"-offset"):n.offset,l={offsetTop:i.offset().top,offsetLeft:i.offset().left,width:i.outerWidth(),height:i.outerHeight()},c={width:o.outerWidth(),height:o.outerHeight()},h={width:$(window).outerWidth(),height:$(window).outerHeight(),scrollTop:$(window).scrollTop(),scrollLeft:$(window).scrollLeft()};if($.inArray(r,u)==-1||$.inArray(r,a._lsWpI)!==-1){a._hide();return t}else{a._lsWpI.push(r)}switch(s[0]){case"bottom":t.top=l.offsetTop+l.height+f;if(t.top>=h.height+h.scrollTop){return a._position("top"+"-"+s[1])}o.addClass("arrow-top");break;case"top":t.top=l.offsetTop-c.height-f;if(t.top-h.scrollTop<=0){return a._position("bottom"+"-"+s[1])}o.addClass("arrow-bottom");break;case"left":t.top=l.offsetTop+l.height/2-c.height/2;t.left=l.offsetLeft-c.width-f;if(t.left<=0){return a._position("right")}o.addClass("arrow-side-right");return t;break;case"right":t.top=l.offsetTop+l.height/2-c.height/2;t.left=l.offsetLeft+l.width+f;if(t.left+c.width>h.width){return a._position("left")}o.addClass("arrow-side-left");return t;break}switch(s[1]){case"left":t.left=l.offsetLeft+l.width/2-c.width+n.arrowWidth;if(t.left<=0){return a._position(s[0]+"-"+"right")}o.addClass("arrow-right");break;case"center":t.left=l.offsetLeft+l.width/2-c.width/2;if(t.left+c.width>h.width){return a._position(s[0]+"-"+"left")}if(t.left<=0){return a._position(s[0]+"-"+"right")}o.addClass("arrow-center");break;case"right":t.left=l.offsetLeft+l.width/2-n.arrowWidth;if(t.left+c.width>h.width){return a._position(s[0]+"-"+"left")}o.addClass("arrow-left");break}return t},_createBox:function(){o.html(a._getTitle()).appendTo("body");o.css(a._position());if(n.cls!=null&&typeof n.cls=="string"||a.hasAttr(n.attr+"-cls")){o.addClass(a.hasAttr(n.attr+"-cls")?i.attr(n.attr+"-cls"):n.cls)}a._showIn()},_lsWtI:[],_lsWpI:[]};a.init();return this})}})(jQuery);
/*!
 * jQuery Notify
 * Copyright (c) 2014 CreativeDream
 * Website http://creativedream.net/plugins
 * Version: 1.0 (01-10-2014)
 * Requires: jQuery v1.7.1 or later 
*/
function notify(e){return $.cNotify(e)}(function(e){e.cNotify=function(t){var n={type:"default",title:null,message:null,position:{x:"right",y:"bottom"},icon:null,size:"normal",overlay:false,closeBtn:true,overflowHide:false,spacing:20,theme:"default",autoHide:false,delay:2500,onShow:null,onClick:null,onHide:null,template:'<div class="notify"><div class="notify-text"></div></div>',_classes:{box:".notify",closeBtn:".notify-close-btn",content:".notify-text",icon:".notify-icon",iconI:".notify-icon-inner",overlay:".notify-overlay"}},t=e.extend({},n,t),r=e(t.template).hide(),i=t._classes.box,s={init:function(){s._setContent();r.on("click",function(e){t.onClick!=null?t.onClick(e,r,t):null})},_show:function(){var e=function(e){t.onShow!=null?t.onShow(r,t):null;if(t.autoHide){s._hide(true)}};r.fadeIn(250,e)},_hide:function(n){var i;if(typeof n=="object"){i=n;i.remove();s._reposition(i.attr("class"));return}else{i=r}t.onHide!=null?t.onHide(i,t):null;var o=function(){if(e(t._classes.box+".notify-overlayed").size()<1){e(t._classes.overlay).fadeOut(250,function(){e(this).remove()})}s._reposition(i.attr("class"))};if(!n){i.fadeOut(function(){e(this).remove();o()})}else{var u=e(t._classes.content).text().length*30;setTimeout(function(){i.fadeOut(function(){e(this).remove();o()})},typeof t.delay!="number"||t.delay=="auto"?u<2500?2500:u:t.delay)}},_setContent:function(){if(t.theme&&t.theme!=null&&t.theme!="default"){r.addClass(t.theme)}if(e.inArray(t.type,["success","error","warning","info"])!=-1){r.addClass(t.type)}if(t.title&&t.title!=null){r.find(t._classes.content).prepend("<h3>"+t.title+"</h3>")}else{r.addClass("notify-without-title")}if(t.message&&t.message!=null){r.find(t._classes.content).append("<p>"+t.message+"</p>")}if(t.size&&t.size!=null&&t.size!="normal"){if(t.size=="full"&&(t.position.y=="top"||t.position.y=="bottom")){r.addClass("notify-"+t.position.y+"-full")}else{r.addClass("size-"+t.size)}}if(t.icon&&t.icon!=null){var n=e(t.icon).is("img")?e(t.icon):e(t.icon).find("img").size()!=0?e(t.icon).find("img"):e(t.icon);r.prepend('<div class="notify-icon"><div class="notify-icon-inner">'+t.icon+"</div>")}else{r.addClass("notify-without-icon")}if(t.overlay&&t.overlay!=null){if(e("body").find(t._classes.overlay).size()==0){e('<div class="notify-overlay'+(typeof t.overlay=="string"?" "+t.overlay:"")+'"></div>').hide().appendTo("body").fadeIn(250)}r.addClass("notify-overlayed")}if(t.closeBtn){r.prepend('<a href="javascript:;" class="notify-close-btn"></a>');r.on("click",t._classes.closeBtn,function(){s._hide()})}else{r.on("click",function(){s._hide()}).css("cursor","pointer")}r.appendTo("body");s._show();s._poisition();if(n){n.load(function(){var e=Math.round(r.find(t._classes.iconI).outerHeight()/2);if(e>0){r.find(t._classes.iconI).css("margin-top",e*-1)}})}},_poisition:function(){var n="notify-";if(t.position&&t.position!=null&&e.isPlainObject(t.position)&&t.position.x&&t.position.y){switch(t.position.y){case"top":n+="top-";break;case"center":n+="center-";break;case"bottom":n+="bottom-";break}switch(t.position.x){case"right":n+="right";break;case"center":n+="center";break;case"left":n+="left";break}}else{n+="bottom-right"}r.addClass(n);if(n=="notify-center-center"){if(e(".notify.notify-center-center").size()>1){s._hide(e(".notify.notify-center-center").first())}r.css({marginTop:r.outerHeight()/2*-1})}var i=e("body").find(".notify."+n).size();if(i>1){var o={};pS=n.split("-");switch(pS[1]){case"top":o.top=parseFloat(e("body").find(".notify."+n).eq(i-2).css("top"))+e("body").find(".notify."+n).eq(i-2).outerHeight()+t.spacing;break;case"bottom":o.bottom=parseFloat(e("body").find(".notify."+n).eq(i-2).css("bottom"))+e("body").find(".notify."+n).eq(i-2).outerHeight()+t.spacing;break}r.css(o);var u=0;$(".notify."+n).each(function(){u+=$(this).outerHeight()+t.spacing});if(u>=e(window).height()){if(t.overflowHide){s._hide(e("body").find(".notify."+n).first())}else{r.hide()}}}},_reposition:function(n){if(n.match(/notify\-bottom\-(right|left|center|full)/g)){n=n.match(/notify\-bottom\-(right|left|center|full)/g)[0]}else if(n.match(/notify\-top\-(right|left|center|full)/g)){n=n.match(/notify\-top\-(right|left|center|full)/g)[0]}else{return false}var i=0;$(".notify."+n).each(function(){i+=$(this).outerHeight()+t.spacing});if(i>=e(window).height()){if(t.overflowHide){s._hide(e("body").find(".notify."+n).first())}else{r.hide()}}e("body").find(".notify."+n+":hidden").first().show();var o={};$(".notify."+n).each(function(r,i){var s={},u=n.split("-");switch(u[1]){case"top":var a=u[2]=="full"?0:21;if(r==0){e(i).animate({top:a-1},300);o.top=a;o.height=e(i).outerHeight();return true}s.top=parseFloat(o.top)+o.height+t.spacing;o.top=s.top;o.height=e(i).outerHeight();break;case"bottom":var a=u[2]=="full"?0:21;if(r==0){e(i).animate({bottom:a-1},300);o.bottom=a;o.height=e(i).outerHeight();return true}s.bottom=parseFloat(o.bottom)+o.height+t.spacing;o.bottom=s.bottom;o.height=e(i).outerHeight();break}e(i).stop(true,true).animate(s,300)})}};s.init();return true}})(jQuery);
/*!
 * jQuery iLightbox
 * Copyright (c) 2014 Creativedream.net
 * Version: 0.1 (26-09-2014)
 * Requires: jQuery v1.7.1 or later
 */
(function(e){e.fn.iLightbox=function(t){var n=e.extend({},e.fn.iLightbox.defaults,t);this.each(function(t,r){var i,s=e(r),o=e('<div id="iLightbox"></div>'),u={container:"#iLightbox",box:".iLightbox-container:last-child",boxB:".iLightbox-media",boxM:".iLightbox-container:last-child img, .iLightbox-container:last-child iframe",boxD:".iLightbox-details",loader:".iLightbox-loader",btns:{closeB:".iLightbox-close",nextB:".iLightbox-btnNext",prevB:".iLightbox-btnPrev"}},f={},l={ESC:27,LEFT:37,UP:38,RIGHT:39,DOWN:40},c={init:function(){i=this;i.k=l;i.s=s;i.c=o;i.n=n;i.g=f;i._styleCont();e(s).on("click",function(e){e.preventDefault();i._showBox()});e("body").on("click",function(e){if(e.target.id=="iLightbox"){i._hideBox()}});e(window).on("resize",function(){i._styleBox();i.n.onUpdate?i.n.onUpdate(o):null})},_keyUp:function(e){e.preventDefault();switch(e.keyCode){case i.k.ESC:i._hideBox();break;case i.k.LEFT:case i.k.UP:i._goToPrev(e.keyCode);break;case i.k.RIGHT:case i.k.DOWN:i._goToNext(e.keyCode);break}},_styleCont:function(){o.css({position:"fixed",width:"100%",height:"100%",top:"0",left:"0",overflowY:"scroll",overflowX:"hidden",display:"none"})},_styleBox:function(e,t){if(!i.c||typeof i.c=="string"){return}var n={wH:.85,mT:0},r={};if(t){switch(t){case"next":case"prev":r.left="50%";break;case"up":case"down":r.top="50%";break}}if(o.find(u.boxD).length!=0){n.wH=.8;n.mT=0}if(o.find(u.boxM).is("iframe")){o.find(u.boxB).addClass("iLightbox-iframe");o.find(u.boxM).attr({width:Math.round($(window).width()*(.85-.25)),height:Math.round($(window).height()*(n.wH-.25))})}o.find(u.boxM).css({maxWidth:Math.round($(window).width()*.85),maxHeight:Math.round($(window).height()*n.wH)});o.find(u.box).css({marginLeft:-o.find(u.box).width()/2,marginTop:-o.find(u.box).height()/2-n.mT});if(e){o.find(u.box).animate(r,{queue:false,duration:"normal"})}else{o.find(u.box).css({left:"50%",top:"50%"})}},_clear:function(){e("body").find(u.container).remove();$(window).unbind("keyup",i._keyUp);o.html("")},_showBox:function(){i._clear();i._loaderToggle();e("body").css({overflow:"hidden",width:e("body").innerWidth()});o.appendTo("body").fadeIn(250,function(){i._loadContent()});o.on("click",u.btns.closeB,function(e){e.preventDefault();i._hideBox()}).on("click",u.boxB+" "+u.btns.nextB,function(e){e.preventDefault();i._goToNext()}).on("click",u.boxB+" "+u.btns.prevB,function(e){e.preventDefault();i._goToPrev()});$(window).bind("keyup",i._keyUp)},_hideBox:function(){i.n.beforeClose?i.n.beforeClose(o):null;e("body").find(u.container).fadeOut(250,function(){e("body").css({overflow:"",width:""});i._clear();i.n.afterClose?i.n.afterClose():null})},_loaderToggle:function(){if(e(i.c).find(".iLightbox-loader").length==0){e(i.c).prepend('<div class="iLightbox-loader"></div>')}else{e(i.c).find(".iLightbox-loader").remove()}},_goToPrev:function(e){var t=f.e.find(f.t),n=f.c-1,r={};if(e){switch(e){case i.k.LEFT:r.left="35%";break;case i.k.UP:r.top="35%";break}}else{r.left="35%"}if(n==t.length){n=0}if(n<0){if(!i.n.loop){return}}if(n<0){n=t.length-1}if(!t[n]){n=0}o.find(u.box).animate(r,{queue:false,duration:"normal"});o.find(u.box).fadeOut(250,function(){$(this).remove()});i._loadContent(t[n],e==l.UP?"up":"prev");i.n.onUpdate?i.n.onUpdate(o):null},_goToNext:function(e){var t=f.e.find(f.t),n=f.c+1,r={};if(e){switch(e){case i.k.RIGHT:r.left="65%";break;case i.k.DOWN:r.top="65%";break}}else{r.left="65%"}if(n>=t.length){if(!i.n.loop){return}n=0}if(!t[n]){n=0}o.find(u.box).animate(r,{queue:false,duration:"normal"});o.find(u.box).fadeOut(250,function(){$(this).remove()});i._loadContent(t[n],e==l.DOWN?"down":"next");i.n.onUpdate?i.n.onUpdate(o):null},_loadContent:function(t,n){var r=s,u=false;if(t){i._loaderToggle();r=e(t);u=true}o.append('<div class="iLightbox-container"></div>');a={href:!r.attr("href")?i.n.href?i.n.href:null:r.attr("href"),title:r.attr("data-lightbox-title")?r.attr("data-lightbox-title"):i.n.title?i.n.title:null,gallery:r.attr("data-lightbox-gallery")?r.attr("data-lightbox-gallery"):null,type:r.attr("data-lightbox-type")?r.attr("data-lightbox-type"):i.n.type?i.n.type:"image"};switch(a.type){case"image":a.html=e('<img src="'+a.href+'" alt="" />');a.html.error(function(){i._error();return false}).load(function(){i._render(t,n,r,u,a)});break;case"iframe":a.html='<iframe frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto" src="'+a.href+'"></iframe>';i._render(t,n,r,u,a);break;case"ajax":var f=$.ajax({url:a.href,type:"GET",data:{fromB:"lightbox"},dataType:"html"}).done(function(e){a.html=e;i._render(t,n,r,u,a)}).fail(function(e,t){i._error()});break;case"swf":a.html=e('<embed src="'+a.href+'" autostart="true">');i._render(t,n,r,u,a);break;case"html":a.html="<div>"+(r.attr("data-lightbox-content")?r.attr("data-lightbox-content"):i.n.content?i.n.content:null)+"</div>";i._render(t,n,r,u,a);break;default:i._clear();break}},_render:function(t,n,r,s,a){o.find(u.box).find("div").remove();var l=e("<div>"+(i.n.closeBtn?'<a href="javascript:;" class="iLightbox-close"></a>':null)+'<div class="iLightbox-media"></div></div>');if(a.html){l.find(".iLightbox-media").append(a.html)}if(a.title){l.append('<div class="iLightbox-details"><h3>'+a.title+"</h3></div>")}if(a.gallery!=null){var c;if(a.gallery=="gallery"){var h=r.parent();while(h[0]){var p=$(h);if(p.find('*[data-lightbox-gallery="gallery"]').length>1){c=p;break}else{c=null;h=p.parent()}}f.t='*[data-lightbox-gallery="gallery"]'}else if(a.gallery.length==0){c=e("body");c=c.find('*[data-lightbox-gallery=""]').length>1?c:null;f.t='*[data-lightbox-gallery=""]'}else{var h=r.parent();while(h[0]){var p=$(h);if(p.find('*[data-lightbox-gallery="'+a.gallery+'"]').length>1){c=p;break}else{c=null;h=p.parent()}}f.t='*[data-lightbox-gallery="'+a.gallery+'"]'}if(c!=null){f.e=c;f.c=c.find(f.t).index(r);if(i.n.arrows){l.find(u.boxB).prepend('<div class="iLightbox-btnPrev"><a href="javascript:;"></a></div>');l.find(u.boxB).append('<div class="iLightbox-btnNext"><a href="javascript:;"></a></div>');if(!i.n.loop){if(f.c==0){l.find(u.boxB).find(".iLightbox-btnPrev").remove()}}if(!i.n.loop){if(c.find(f.t).length==f.c+1){l.find(u.boxB).find(".iLightbox-btnNext").remove()}}}}else{f={}}}e(l).hide().appendTo(o.find(u.box));o=o;i.n.beforeShow?i.n.beforeShow(o,a):null;if(s){if(n){switch(n){case"next":o.find(u.box).css({left:"35%",top:"50%"});break;case"prev":o.find(u.box).css({left:"65%",top:"50%"});break;case"up":o.find(u.box).css({top:"65%",left:"50%"});break;case"down":o.find(u.box).css({top:"35%",left:"50%"});break}e(l).fadeIn(250,function(){i.n.onShow?i.n.onShow(o,a):null})}else{e(l).fadeIn(250,function(){i.n.onShow?i.n.onShow(o,a):null})}}else{e(l).fadeIn(250,function(){i.n.onShow?i.n.onShow(o,a):null})}i._styleBox(s,n);i._loaderToggle()},_error:function(){}};c.init()});return this};e.fn.iLightbox.defaults={type:"image",width:"auto",height:"auto",loop:true,arrows:true,closeBtn:true,title:null,href:null,content:null,openEffect:"fade",closeEffect:"fade",animation:"slide",beforeShow:function(e,t){},onShow:function(e,t){},beforeClose:function(){},afterClose:function(){},onUpdate:function(e){},template:{container:'<div class="iLightbox-container"></div>',image:'<div class="iLightbox-media"></div>',iframe:'<div class="iLightbox-media iLightbox-iframe"></div>',title:'<div class="iLightbox-details"></div>',error:'<div class="iLightbox-error">The requested content cannot be loaded.<br/>Please try again later.</div>',closeBtn:'<a href="#" class="iLightbox-close"></a>',prevBtn:'<div class="iLightbox-btnPrev"><a href="javascript:;"></a></div>',nextBtn:'<div class="iLightbox-btnNext"><a href="javascript:;"></a></div>'}}})(jQuery);
/*!
 * jQuery bbCode
 * Copyright (c) 2014 Infodesire
 * Version: 0.1 (04-10-2014)
 * Requires: jQuery v1.7.1 or later
 */
(function(e) {
	e.fn.bbCode = function(t) {
		var n = e.extend({}, {}, t);
		this.each(function(t, r) {
			var s = e(r),
                o = e('<div id="ibbCode" class="row"><ul><li class="ibbCode-group"><a title="URL" data-ibb="link"><i class="fa fa-link"></i></a><a title="Keyword" data-ibb="keyword"><i class="fa fa-chain-broken"></i></a><a title="Internal URL" data-ibb="euro"><i class="fa fa-anchor"></i></a></li></ul></div>'),
                //o = e('<div id="ibbCode" class="row"><ul><li class="ibbCode-group"><a title="Headline" data-ibb="headline"><i class="fa fa-header"></i></a></li><li class="ibbCode-group"><a title="Bold" data-ibb="bold"><i class="fa fa-bold"></i></a><a title="Italic" data-ibb="italic"><i class="fa fa-italic"></i></a><a title="Underline" data-ibb="underline"><i class="fa fa-underline"></i></a><a title="Strikethrough" data-ibb="strikethrough"><i class="fa fa-strikethrough"></i></a></li><li class="ibbCode-group"><a title="Font" data-ibb="text-font"><i class="fa fa-font"></i></a><ul><li class="ibbCode-group"><a data-ibb="text-font" title="Arial" style="font-family: Arial;">Arial</a><a data-ibb="text-font" title="Comic Sans MS" style="font-family: Comic Sans MS;">Comic Sans MS</a><a data-ibb="text-font" title="Courier New" style="font-family: Courier New;">Courier New</a><a data-ibb="text-font" title="Lucida Console" style="font-family: Lucida Console;">Lucida Console</a><a data-ibb="text-font" title="Tahoma" style="font-family: Tahoma;">Tahoma</a><a data-ibb="text-font" title="Times New Roman" style="font-family: Times New Roman;">Times New Roman</a><a data-ibb="text-font" title="Verdana" style="font-family: Verdana;">Verdana</a><a data-ibb="text-font" title="Symbol" style="font-family: Symbol;">Symbol</a></li></ul><a title="Font Size" data-ibb="text-size"><i class="fa fa-text-height"></i></a><ul><li class="ibbCode-group"><a data-ibb="text-size" style="font-size:10px;">Size 1</a><a data-ibb="text-size" style="font-size:12px;">Size 2</a><a data-ibb="text-size" style="font-size:14px;">Size 4</a><a data-ibb="text-size" style="font-size:16px;">Size 6</a></li></ul></li><li class="ibbCode-group"><a title="Image" data-ibb="image"><i class="fa fa-picture-o"></i></a><a title="URL" data-ibb="link"><i class="fa fa-link"></i></a><a title="Keyword" data-ibb="keyword"><i class="fa fa-chain-broken"></i></a><a title="Internal URL" data-ibb="euro"><i class="fa fa-anchor"></i></a><a title="Center Align" data-ibb="center"><i class="fa fa-align-center"></i></a></li></ul></div>'),
                f = {
					init: function() {
                        e(s).prev('div').html(o);
                        o.on('click', 'ul li a[data-ibb]', function(e){
                            e.preventDefault();
                            var data = $(this).attr('data-ibb');
                            switch(data){
                                case 'headline':
                                    f._trans(s, "[h4]", "[/h4]", 4);
                                break;
                                case 'bold':
                                    f._trans(s, "[b]", "[/b]", 3);
                                break;
                                case 'italic':
                                    f._trans(s, "[i]", "[/i]", 3);
                                break;
                                case 'underline':
                                    f._trans(s, "[u]", "[/u]", 3);
                                break;
                                case 'strikethrough':
                                    f._trans(s, "[s]", "[/s]", 3);
                                break;
                                case 'text-font':
                                   var font = $(this).css('font-family');
                                   f._trans(s, "[font=" + font + "]", "[/font]", 7+font.length); 
                                break;
                                case 'text-size':
                                   var size = parseFloat($(this).css('font-size')).toString();
                                   size = size.substr(1,1);
                                   size = (size == 0 || size>6 ? 1 : size);
                                   f._trans(s, "[size=" + size + "]", "[/size]", 8); 
                                break;
                                case 'image':
                                    var m = prompt('Paste URL here');
                                    if(!m || m.length == 0){return;}
                                    if(!f.validateURL(m)){alert('Image URL is not valid'); return;}
                                    f._trans(s, "[img]" + m, "[/img]", (m ? m.length : 0));
                                break;
                                case 'link':
                                    f._trans(s, "[web|", "]", 5);
                                break;
                                case 'keyword':
                                    f._trans(s, "[", "]", 1);
                                    s.trigger("kAutoComplete.show");
                                break;
                                case 'euro':
                                    f._trans(s, "[doc|", "]", 5);
                                break;
                                case 'center':
                                    f._trans(s, "[center]", "[/center]", 8);
                                break;
                            }
                        });
                    },
                    _trans: function r(s, e, t, n, r) {
                         var textarea = s[0];  
			             if (document.selection) {
				            textarea.focus();
				            var i = document.selection.createRange();
				            i.text = e + i.text + t
			             } else {
                             var s = textarea.value.length;
                             var o = textarea.selectionStart;
                             var u = textarea.selectionEnd;
                             var a = textarea.scrollTop;
                             var f = textarea.scrollLeft;
                             var i = textarea.value.substring(o, u);
                             var l = r != false ? e + i + t : i + e + t;
                             textarea.value = textarea.value.substring(0, o) + l + textarea.value.substring(u, s);
                             textarea.scrollTop = a;
                             textarea.scrollLeft = f;
                             if (i.length == 0) {
                                 textarea.selectionStart = textarea.selectionEnd = o + n
                             } else if (r != false && i.length > 0) {
                                 textarea.selectionStart = o + n;
                                 textarea.selectionEnd = o + l.length - n - 1
                             }
                         }
                         $(textarea).trigger('input');
                    },
                    validateURL: function(e){
	                   var t = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	                   return t.test(e);
                    }   
            };
            f.init();
            return this;
        });
    }
})(jQuery);
/*!
	textareaHelper 1.0
	license: MIT
	https://github.com/Codecademy/textarea-helper
*/
(function(e){"use strict";var t="textarea-helper-caret",n="textarea-helper",r=["box-sizing","height","width","padding-bottom","padding-left","padding-right","padding-top","font-family","font-size","font-style","font-variant","font-weight","word-spacing","letter-spacing","line-height","text-decoration","text-indent","text-transform","direction"];var i=function(t){if(t.nodeName.toLowerCase()!=="textarea")return;this.$text=e(t);this.$mirror=e("<div/>").css({position:"absolute",overflow:"auto","white-space":"pre-wrap","word-wrap":"break-word",top:0,left:-9999}).insertAfter(this.$text)};(function(){this.update=function(){var n={};for(var i=0,s;s=r[i];i++){n[s]=this.$text.css(s)}this.$mirror.css(n).empty();var o=this.getOriginalCaretPos(),u=this.$text.val(),a=document.createTextNode(u.substring(0,o)),f=document.createTextNode(u.substring(o)),l=e("<span/>").addClass(t).css("position","absolute").html("&nbsp;");this.$mirror.append(a,l,f).scrollTop(this.$text.scrollTop())};this.destroy=function(){this.$mirror.remove();this.$text.removeData(n);return null};this.caretPos=function(){this.update();var e=this.$mirror.find("."+t),n=e.position();if(this.$text.css("direction")==="rtl"){n.right=this.$mirror.innerWidth()-n.left-e.width();n.left="auto"}return n};this.height=function(){this.update();this.$mirror.css("height","");return this.$mirror.height()};this.getOriginalCaretPos=function(){var e=this.$text[0];if(e.selectionStart){return e.selectionStart}else if(document.selection){e.focus();var t=document.selection.createRange();if(t==null){return 0}var n=e.createTextRange(),r=n.duplicate();n.moveToBookmark(t.getBookmark());r.setEndPoint("EndToStart",n);return r.text.length}return 0}}).call(i.prototype);e.fn.textareaHelper=function(t){this.each(function(){var t=e(this),r=t.data(n);if(!r){r=new i(this);t.data(n,r)}});if(t){var r=this.first().data(n);return r[t]()}else{return this}}})(jQuery);
/*!
 * jQuery kAutoComplete
 * Copyright (c) 2014 Infodesire
 * Version: 0.1 (17-10-2014)
 * Requires: jQuery v1.7.1 or later
 */
(function(e) {
    e.fn.kAutoComplete = function(t){
       var n = e.extend({
           openTag: "[",
           closeTag: "]",
           url: null,
           itemsLimit: 10,
           limitScroll: true,
           textLength: 25,
       }, t),
            keys = {
                ESC: 27,
                UP: 38,
                DOWN: 40,
                ENTER: 13
            };
        return this.each(function(t, r) {
            var s = e(r),
                b = '.kACompleteBox',
                o = e('<div class="kACompleteBox"><ul></ul></div>'),
                f = {
                    init: function(){
                        f._loadData();
                        s.on('keyup', f._sKeyUp);
                    },
                    _loadData: function(){
                        if(f._data&&f._items){return true;}
                        $.get(n.url, {}, function(r){
                            f._data = f._items = r.Entries;
                        });    
                    },
                    _sortItems: function(){
                        return $.map(f._data, function (item) {
                            return item.keyword.toLowerCase().indexOf(f._lookup.toLowerCase()) === 0 ? item : null;
                        });
                    },
                    _show: function(){
                        f._hide();
                        f._createBox();
                        f._bindOptions();
                        f._crSAk = true;
                    },
                    _hide: function(){
                        e('body').find(b).remove();
                        f._unbindOptions();
                    },
                    _bindOptions: function(){
                        e(document).bind("contextmenu", function() {
                            f._hide()
                        }).bind('keydown', f._documentKeyDown);
                        e(window).blur(function() {
                            f._hide()
                        }).on("resize", function() {
                            f._hide()
                        }).bind('keyup', function(e){
                            if(e.which == keys.ESC){
                                f._hide();
                                delete f._cTps;
                                f._lookup = "";
                                f._oldVal = "";
                                return true;   
                            }
                        });
                        s.bind("keypress", f._sKeyPress);
                    },
                    _unbindOptions: function(){
                        $(document).unbind('keydown', f._documentKeyDown);     
                        s.unbind('keypress', f._sKeyPress);
                        f._crSAk = false;
                    },
                    _documentKeyDown: function(e){
                        var ar = new Array(38,40),
                            key = e.which;
                        if($.inArray(key,ar) > -1) {
                            e.preventDefault();
                            return false;
                        }
                        return true;
                    },
                    _sKeyUp: function(e){
                        f._cursorPos = f._getCursorPos();
                        var val = s.val(),
                            lastChar = val.charAt(f._cursorPos-1),
                            key = e.which;
                        
                        if(f._crSAk){
                            switch(key){
                                case keys.ESC:
                                    f._hide();
                                    delete f._cTps;
                                    f._lookup = "";
                                    f._oldVal = "";
                                    return true;
                                break;
                                case keys.ENTER:
                                    e.preventDefault();
                                    f._select(o.find('ul li.active a'));
                                    delete f._cTps;
                                    f._lookup = "";
                                    f._oldVal = "";
                                    return false;
                                break;
                                case keys.UP:
                                    f._goPrev();
                                    return false;
                                break;
                                case keys.DOWN:
                                    f._goNext();
                                    return false;
                                break;
                            }
                        }

                        if(lastChar == n.openTag && !f._crSAk){
                            f._cTps = f._cursorPos;
                            if(f._oldVal.length == 0 || f._oldVal.length < f._lookup.length || f._oldVal != val.substring(f._cTps, f._cTps+f._oldVal.length)){}else{
                                f._lookup = f._oldVal;
                                return;
                            }
                            f._lookup = "";
                            f._items = f._data;
                            f._show();
                        }else{
                            f._oldVal = f._lookup;
                            f._lookup = val.substring(f._cTps, f._cursorPos);   
                            
                            if(val.charAt(f._cTps + 1 + f._lookup.length) == n.closeTag || !f._cTps){f._hide(); return;}
                            
                            if(val.charAt(f._cursorPos - (f._lookup.length==0?2:1) - f._lookup.length) == n.openTag){
                                if(lastChar == n.closeTag){
                                    f._lookup = f._lookup.substring(0, f._lookup.length-1);
                                    f._hide();
                                    return;
                                }
                                
                                if(f._oldVal.length == 0 || f._oldVal.length <= f._lookup.length || f._oldVal != val.substring(f._cTps, f._cTps+f._oldVal.length)){}else{
                                    f._lookup = f._oldVal;   
                                }
                                
                                f._items = f._sortItems();
                                
                                var ar = new Array(38,40),
                                    key = e.which;
                                if($.inArray(key,ar) == -1) {
                                    f._createBox();
                                }
                            }else{
                                f._hide();
                                return;
                            }
                        }
                        
                        f._position();
                    },
                    _sKeyPress: function(e){
                        switch(e.which){
                            case keys.ENTER:
                            case keys.UP:
                            case keys.DOWN:
                                e.preventDefault();
                                return false;
                            break;
                        }
                    },
                    _select: function(el){
                        if(el.length == 0){return false;}
                        var id = el.parent().attr('data-idx'),
                            val = f._items[id].keyword,
                            crs = f._cTps;
                        
                        s.val(s.val().substring(0,crs-1) + n.openTag + val + n.closeTag + s.val().substring(crs+f._lookup.length + (s.val().substring(crs+f._lookup.length, crs+f._lookup.length+1) == n.closeTag ? 1 : 0),s.val().length));
                        
                        s[0].selectionStart = s[0].selectionEnd = s.val().substr(0,crs).length + val.length + n.closeTag.length;
                        
                        s.trigger('input');
                        f._hide();
                    },
                    _goPrev: function(){
                        var id = o.find('ul li').index(o.find('ul li.active'));
                        o.find('ul li.active').removeClass('active');
                        if(id-1 < 0){
                            o.find('ul li').last().addClass('active');
                        }else{
                            o.find('ul li').eq(id-1).addClass('active');  
                        }
                        o.find('ul').scrollTop(o.find('ul li.active').offset().top - o.find('ul').offset().top + o.find('ul').scrollTop());
                    },
                    _goNext: function(){
                        var id = o.find('ul li').index(o.find('ul li.active'));
                        o.find('ul li.active').removeClass('active');
                        if(id+1 >= o.find('ul li').size()){
                            o.find('ul li').first().addClass('active');
                        }else{
                            o.find('ul li').eq(id+1).addClass('active');  
                        }
                        o.find('ul').scrollTop(o.find('ul li.active').offset().top - o.find('ul').offset().top + o.find('ul').scrollTop());
                    },
                    _getCursorPos: function() {
                        var el = s.get(0),
                            pos = 0;
                        if('selectionStart' in el) {
                            pos = el.selectionStart;
                        } else if('selection' in document) {
                            el.focus();
                            var Sel = document.selection.createRange(),
                                SelLength = document.selection.createRange().text.length;
                            Sel.moveStart('character', -el.value.length);
                            pos = Sel.text.length - SelLength;
                        }
                        return pos;
                    },
                    _position: function(){
                        var caretPos = s.textareaHelper('caretPos');
                        
                        o.css({
                            top: s.offset().top + caretPos.top + 15,
                            left: s.offset().left + caretPos.left - 5
                        });
                        
                        s.textareaHelper('destroy');
                    },
                    _createBox: function(){
                        if(!f._items || f._items.length == 0){f._hide(); return}
                        var l = f._items.slice( 0, (!n.limitScroll ? n.itemsLimit : f._items.length) ),
                            html = "";
                        if(!l || l.length == 0){f._hide(); return}
                        for(key in l){
                            var value = l[key];
                            value = value.keyword.substring(0,n.textLength)+(value.keyword.length > n.textLength ? '...': '');
                            if(f._lookup){
                                value = "<b>" + value.substring(0, f._lookup.length) + "</b>" + value.substring(f._lookup.length);
                            }
                            html += '<li data-idx="'+key+'"'+(key==0?' class="active"':'')+'><a>'+value+'</a></li>';
                        }
                        o.find('ul').html(html);
                        $(document.body).append(o);
                        if(n.limitScroll){
                            var mH = 0;
                            for(var i = 0; i <= n.itemsLimit; i++){
                                mH += o.find('ul li').eq(i).outerHeight(); 
                            }
                            o.find('ul').css('height', mH);
                        }
                        o.find('ul li a').on('click', function(e){
                            e.preventDefault();
                            f._select($(this));
                        });
                        f._position();
                    },
                    _crSAk: false,
                    _lookup: "",
                    _oldVal: "",
                    _crAtI: 0
                };
            f.init();
            s.on("kAutoComplete.show", f._sKeyUp);
            
            return this;
        });
    }
})(jQuery);
