/*!
 * jQuery.filer
 * Copyright (c) 2014 CreativeDream
 * Website: http://creativedream.net/plugins/
 * Version: 1.0 (18-11-2014)
 * Requires: jQuery v1.7.1 or later
 */
(function($) {

    $.fn.filer = function(t){
        var n = $.extend(true, {}, $.fn.filer.defaults, t);
        
        return this.each(function(t, r) {
            var s = $(r),
                b = '.jFiler',
                p = $(), o = $(), l = $(),
                f = {
                    init: function(){
                        s.wrap('<div class="jFiler"></div>');
                        p = s.closest(b);
                        f._changeInput();
                    },
                    _bindInput: function(){
                        if(n.changeInput && o.length > 0){
                            o.on({
                                "click": function(){
                                    s.click();
                                }
                            });
                        }
                        
                        s.on({
                            "focus": function(){
                                o.addClass('focused');
                            },
                            "blur": function(){
                                o.removeClass('focused');
                            },
                            "change": function(){
                                f._onChange();
                            }
                        });
                        
                        if(n.dragDrop && !$.isEmptyObject(n.dragDrop)){
                            (o.length > 0 ? o : s).bind("drop", f._dragDrop.drop).bind("dragover", f._dragDrop.dragEnter).bind("dragleave", f._dragDrop.dragLeave);
						}
                        
                        if(n.clipBoardPaste){
                            window.addEventListener("paste", f._clipboardPaste);
                        }
                    },
                    _changeInput: function(){
                        if(n.theme){
                            p.addClass('jFiler-theme-' + n.theme);   
                        }
                        if(n.changeInput) {
                            switch (typeof n.changeInput) {
								case "boolean":
									o = $('<div class="jFiler-input"><div class="jFiler-input-caption"><span>' + n.captions.feedback + '</span></div><div class="jFiler-input-button">' + n.captions.button + '</div></div>"');
								break;
								case "string":
                                case "object":
                                    o = $(n.changeInput);
								break;
                                case "function":
                                    o = $(n.changeInput(s, p, n));
                                break;
                            }
                            s.after(o);
                            s.css({
								position: "absolute",
								left: "-9999px",
								top: "-9999px",
								"z-index": "-9999"
							});
                        }
                        if (n.limit >= 2) {
							s.attr("multiple", "multiple");
							s.attr("name").slice(-2) != "[]" ? s.attr("name", s.attr("name") + "[]") : null;
						}
                        f._bindInput();
                    },
                    _clear: function(){
                        f.files = null;
                        if(!n.uploadFile && !n.addMore){
                            f._reset();
                        }
                        f._set('feedback', (f._itFl && f._itFl.length > 0 ? f._itFl.length + ' ' + n.captions.feedback2 : n.captions.feedback));
                        n.onEmpty != null && typeof n.onEmpty == "function" ? n.onEmpty(s, p, o) : null
                    },
                    _reset: function(a){
                        if(!a){
                            f._set('input','');   
                        }
                        f._itFl = [];
                        f._itFc = null;
                        l = $();
                        p.find('.jFiler-items').fadeOut("fast", function(){
                            $(this).remove();   
                        });
                    },
                    _set: function(element, value){
                        switch(element){
                            case 'input':
                                s.val("");
                            break;
                            case 'feedback':
                                if(o.length > 0){
                                    o.find('.jFiler-input-caption span').html(value);
                                }
                            break;
                        }
                    },
                    _filesCheck: function(){
                        var s = 0;
                        if(n.limit && f.files.length + f._itFl.length > n.limit){
                            alert(f._assets.textParse(n.captions.errors.filesLimit));
                            return false
                        }
                        for(var t=0; t<f.files.length; t++){
                            var x = f.files[t].name.split(".").pop().toLowerCase(),
                                file = f.files[t],
                                m = {name: file.name, size: file.size, size2: f._assets.bytesToSize(file.size), type: file.type};
                            if (n.extensions != null && $.inArray(x, n.extensions) == -1) {
								alert(f._assets.textParse(n.captions.errors.filesType, m));
								return false;
								break
							}
                            if (n.maxSize != null && f.files[t].size > n.maxSize * 1048576) {
								alert(f._assets.textParse(n.captions.errors.filesSize, m));
								return false;
								break
							}
                            s += f.files[t].size
                        }
                        if (n.maxSize != null && s >= Math.round(n.maxSize * 1048576)) {
				            alert(f._assets.textParse(n.captions.errors.filesSizeAll));
				            return false
				        }
                        return true;
                    },
                    _onSelect: function(i){
                        if (n.uploadFile && !$.isEmptyObject(n.uploadFile)) {
							f._upload(i)
						}
                        
                        n.onSelect != null && typeof n.onSelect == "function" ? n.onSelect(f.files[i], s, p, o, l) : null;
                        
                        if(i+1 >= f.files.length){
                            n.afterShow != null && typeof n.afterShow == "function" ? n.afterShow(s, p, o, l) : null
                        }
                    },
                    _thumbCreator: {
                        create: function(i){
                            var file = f.files[i],
                                id = f._itFc.id,
                                name = file.name,
                                size = file.size,
                                type = file.type.split("/", 1).toString().toLowerCase(),
                                ext = name.indexOf(".") != -1 ? name.split(".").pop().toLowerCase() : "",
                                progressBar = '<div class="jFiler-jProgressBar">' + n.templates.progressBar + '</div>',
                                opts = {
                                    id: id,
                                    name: name,
                                    size: size,
                                    size2: f._assets.bytesToSize(size),
                                    type: type,
                                    extension: ext,
                                    icon: f._assets.getIcon(type),
                                    icon2: f._thumbCreator.generateIcon({type: type, extension: ext}),
                                    image: '<div class="jFiler-item-thumb-image fi-loading"></div>',
                                    progressBar: progressBar,
                                };
                            if(file.file) {
                                // + IG 05.01.2015 - Fix jQuery Error: "Maximum call stack size exceeded"
                                /*    
                                if(file.forList){
                                    opts = $.extend({}, file, opts);
                                }else{
                                    opts = $.extend(true, {}, file, opts);
                                }
                                */
                                opts = $.extend({}, file, opts);
                            }
                            var item = f._thumbCreator.renderContent(opts);
                            
                            f._itFc.html = $(item).attr("data-jfiler-index", id);
                            f._thumbCreator.renderFile(file, f._itFc, opts);
                            
                            if(file.forList){
                                return f._itFc.html;
                            }
                            
                            f._itFc.html.hide().prependTo(l.find(n.templates._selectors.list)).fadeIn("fast");
                            
                            if(!file.file){
                                f._onSelect(i);
                            }
                        },
                        renderContent: function(opts){
                            return f._assets.textParse((opts.file ? n.templates.itemAppended : n.templates.item), opts);
                        },
                        renderFile: function(file, obj, opts){
                            if(file.file && opts.type == "image"){
                                 var g = '<img src="' + file.file + '" draggable="false" />',
                                        m = obj.html.find('.jFiler-item-thumb-image.fi-loading');
                                    $(g).error(function(){
                                        g = f._thumbCreator.generateIcon(opts);
                                        obj.html.addClass('jFiler-no-thumbnail');
                                        m.removeClass('fi-loading').html(g);
                                    }).load(function(){
                                        m.removeClass('fi-loading').html(g);
                                    });
                                return;
                            }
                            if (window.File && window.FileList && window.FileReader && opts.type == "image" && obj.html.find('.jFiler-item-thumb-image').size()>0) {
                                var y = new FileReader;
                                y.onload = function(e) {
                                    var g = '<img src="' + e.target.result + '" draggable="false" />',
                                        m = obj.html.find('.jFiler-item-thumb-image.fi-loading');
                                    $(g).error(function(){
                                        g = f._thumbCreator.generateIcon(opts);
                                        obj.html.addClass('jFiler-no-thumbnail');
                                        m.removeClass('fi-loading').html(g);
                                    }).load(function(){
                                        m.removeClass('fi-loading').html(g);
                                    });
                                };
                                y.readAsDataURL(file)
                            }else{
                                var g = f._thumbCreator.generateIcon(opts),
                                    m = obj.html.find('.jFiler-item-thumb-image.fi-loading');
                                obj.html.addClass('jFiler-no-thumbnail');
                                m.removeClass('fi-loading').html(g);
                            }
                        },
                        generateIcon: function(obj){
                            var m = new Array(3);
                            if(obj && obj.type && obj.extension){
                                switch(obj.type){
                                    case "image":
                                        m[0] = "f-image";
                                        m[1] = "<i class=\"icon-jfi-file-image\"></i>"
                                    break;
                                    case "video":
                                        m[0] = "f-video";
                                        m[1] = "<i class=\"icon-jfi-file-video\"></i>"
                                    break;
                                    case "audio":
                                        m[0] = "f-audio";
                                        m[1] = "<i class=\"icon-jfi-file-audio\"></i>"
                                    break;
                                    default:
                                        m[0] = "f-file f-file-ext-" + obj.extension;
                                        m[1] = (obj.extension.length > 0 ? "." + obj.extension : "");
                                        m[2] = 1
                                }
                            }else{
                                m[0] = "f-file";
                                m[1] = (obj.extension && obj.extension.length > 0 ? "." + obj.extension : "");
                                m[2] = 1
                            }
                            var el = '<span class="jFiler-icon-file ' + m[0] + '">' + m[1] + '</span>';
                            
                            if(m[2] == 1){
                                var j = $(el).appendTo("body"),
                                h = j.css("box-shadow");
                            
                                h = f._assets.text2Color(obj.extension) + h.substring(h.replace(/^.*(rgba?\([^)]+\)).*$/,'$1').length, h.length);
                                j.css({
                                    '-webkit-box-shadow' : h,
                                    '-moz-box-shadow': h,
                                    'box-shadow': h
                                });
                                el = j.prop('outerHTML');

                                j.remove();
                            }

                            return el;
                        }
                    },
                    _upload: function(i){
                        var el = f._itFc.html,
                            formData = new FormData();
                        
                        formData.append(s.attr('name'), f._itFc.file, (f._itFc.file.name ? f._itFc.file.name : false));
                        
                        if(p.next().attr("id") == "filerComment"){
                            var comment = p.next("#filerComment").find("textarea");
                            formData.append(comment.attr('name'), comment.val());
                        }
                        
                        if (n.uploadFile.data != null && $.isPlainObject(n.uploadFile.data)) {
							for (k in n.uploadFile.data) {
								formData.append(k, n.uploadFile.data[k])
							}
						}
                        
                        f._ajax.send(el, formData, f._itFc);
                    },
                    _ajax:{
                        send: function(el, formData, c){
                            c.ajax = $.ajax({
                                url: n.uploadFile.url,
                                data: formData,
                                type: n.uploadFile.type,
                                enctype: n.uploadFile.enctype,
                                xhr: function() {
                                    var myXhr = $.ajaxSettings.xhr();
                                    if (myXhr.upload) {
                                        myXhr.upload.addEventListener("progress", function(e){f._ajax.progressHandling(e, el)}, false)
                                    }
                                    return myXhr
                                },
                                complete: function() {
                                    c.ajax = false;
                                },
                                beforeSend: function(jqXHR, settings){
                                    return n.uploadFile.beforeSend != null && typeof n.uploadFile.beforeSend == "function" ? n.uploadFile.beforeSend(el, l, o, p, s, jqXHR, settings) : true;
                                },
                                success: function(data, textStatus, jqXHR) {
                                    c.uploaded = true;
                                    
                                    n.uploadFile.success != null && typeof n.uploadFile.success == "function" ? n.uploadFile.success(data, el, l, o, p, s) : null
                                },
                                error: function(jqXHR, textStatus, errorThrown) {
                                    c.uploaded = false;
                                    
                                    n.uploadFile.error != null && typeof n.uploadFile.error == "function" ? n.uploadFile.error(el, l, o, p, s, jqXHR, textStatus, errorThrown) : null
                                },
                                statusCode: n.uploadFile.statusCode,
							    cache: false,
							    contentType: false,
							    processData: false
                            });
                            
                            return c.ajax;
                        },
                        progressHandling: function(e, el){
                            if (e.lengthComputable) {
				                var t = Math.round(e.loaded * 100 / e.total).toString();
                                
				                n.uploadFile.onProgress != null && typeof n.uploadFile.onProgress == "function" ? n.uploadFile.onProgress(t, el, s) : null;
                                
				                el.find('.jFiler-jProgressBar').find(n.templates._selectors.progressBar).css("width", t + "%")
				            }
                        }
                    },
                    _dragDrop: {
                        dragEnter: function(e){
                            e.preventDefault();
                            e.stopPropagation();
                            p.addClass('dragged');
                            f._set('feedback', n.captions.drop);
                            n.dragDrop.dragEnter != null && typeof n.dragDrop.dragEnter == "function" ? n.dragDrop.dragEnter(e, o, s, p) : null;
                        },
                        dragLeave: function(e) {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            if(!f._dragDrop._dragLeaveCheck(e)){return false}
                            
                            p.removeClass('dragged');
                            f._set('feedback', n.captions.feedback);
                            n.dragDrop.dragLeave != null && typeof n.dragDrop.dragLeave == "function" ? n.dragDrop.dragLeave(e, o, s, p) : null;
                        },
                        drop: function(e) {
                            e.preventDefault();
                            p.removeClass('dragged');
                            if(!e.originalEvent.dataTransfer.files ||  e.originalEvent.dataTransfer.files.length <= 0){ 
                                if(!e.originalEvent.dataTransfer.items || e.originalEvent.dataTransfer.items.length <= 0){
                                    return;   
                                }else{
                                    f._clipboardPaste(e, true);
                                }
                                return;
                            }
                            f._set('feedback', n.captions.feedback);
                            f._onChange(e, e.originalEvent.dataTransfer.files);
                            n.dragDrop.drop != null && typeof n.dragDrop.drop == "function" ? n.dragDrop.drop(e.originalEvent.dataTransfer.files, e, o, s, p) : null;
                        },
                        _dragLeaveCheck: function(e){
                            var related = e.relatedTarget,
                                inside = false;
                            if (related !== o) {
                                if (related) {
                                    inside = jQuery.contains(o, related);
                                }
                                if (inside) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    },
                    _clipboardPaste: function(e, fromDrop){
                        if(!fromDrop && (!e.clipboardData && !e.clipboardData.items)) { return }
                        if(fromDrop && (!e.originalEvent.dataTransfer && !e.originalEvent.dataTransfer.items)){ return }
                        
                        var items = (fromDrop ? e.originalEvent.dataTransfer.items : e.clipboardData.items),
                            b64toBlob = function(b64Data, contentType, sliceSize) {
                                contentType = contentType || '';
                                sliceSize = sliceSize || 512;

                                var byteCharacters = atob(b64Data);
                                var byteArrays = [];

                                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                                    var byteNumbers = new Array(slice.length);
                                    for (var i = 0; i < slice.length; i++) {
                                        byteNumbers[i] = slice.charCodeAt(i);
                                    }

                                    var byteArray = new Uint8Array(byteNumbers);

                                    byteArrays.push(byteArray);
                                }

                                var blob = new Blob(byteArrays, {type: contentType});
                                return blob;
                            };
                        if (items) {
                            for (var i = 0; i < items.length; i++) {
                                if (items[i].type.indexOf("image") !== -1 || items[i].type.indexOf("text/uri-list") !== -1) {
                                    if(fromDrop){
                                        try {
                                            window.atob(e.originalEvent.dataTransfer.getData("text/uri-list").toString().split(',')[1]);
                                        } catch(e) {
                                            return;
                                        }
                                    }
                                    var blob = (fromDrop ? b64toBlob(e.originalEvent.dataTransfer.getData("text/uri-list").toString().split(',')[1], "image/png") : items[i].getAsFile());

                                    blob.name = Math.random().toString(36).substring(5);
                                    blob.name += blob.type.indexOf("/") != -1 ? "." + blob.type.split("/")[1].toString().toLowerCase() : ".png",
                                    f._onChange(e, [blob]);
                                }
                            }
                        }
                    },
                    _onChange: function(e, d){
                        if(!d){
                            if(!s.get(0).files || typeof s.get(0).files == "undefined" || s.get(0).files.length == 0){
                                if(!n.uploadFile && !n.addMore){
                                    f._set('input',''); f._clear();
                                }
                                return false 
                            }
                            f.files = s.get(0).files;
                        }else{
                            if(!d || d.length == 0){ f._set('input',''); f._clear(); return false }
                            f.files = d;
                        }
                        
                        if(!n.uploadFile && !n.addMore){
                            f._reset(true);
                        }
                        
                        if(!f._filesCheck()){ f._set('input',''); f._clear(); return false }
                        
                        f._set('feedback', f.files.length + f._itFl.length + ' ' + n.captions.feedback2);
                        
                        if(n.showThumbs){
                            if (n.beforeShow != null && typeof n.beforeShow == "function" ? !n.beforeShow(f.files, s, p, o, l) : false) {
                                return false
				            }
                            
                            if(l.length < 1){
                                if(n.appendTo){
                                    l = $(n.appendTo);
                                }else{
                                    p.find('.jFiler-items').remove();
                                    l = $('<div class="jFiler-items"></div>');
                                    l.append(f._assets.textParse(n.templates.thumbs)).appendTo(p);
                                }
                                
                                l.on('click', n.templates._selectors.remove, function(e){
                                    e.preventDefault();
                                    if($projectile && $projectile._config && $projectile._config.removeAction){
                                        $projectile._config.removeAction({e: e, el: $(this).closest(n.templates._selectors.item)}, function(data){
                                            f._remove(data.e, data.el);
                                        });    
                                    }else{
                                        f._remove(e, $(this).closest(n.templates._selectors.item));   
                                    }
                                });
                            }
                            
                            for(var i=0; i<f.files.length; i++){
                                f._addToMemory(i);
                                f._thumbCreator.create(i);
                            }
                        }else{
                            for(var i=0; i<f.files.length; i++){
                                f._addToMemory(i);
                                f._onSelect(i);
                            }
                        }
                    },
                    _append: function(e, data){
                        var data = data.data;
                        if(!data || data.length <= 0){ return; }
                        f.files = data;
                        if(n.showThumbs){
                            if (n.beforeShow != null && typeof n.beforeShow == "function" ? !n.beforeShow(f.files, s, p, o, l) : false) {
                                return false
				            }
                            
                            if(l.length < 1){
                                if(n.appendTo){
                                    l = $(n.appendTo);
                                }else{
                                    p.find('.jFiler-items').remove();
                                    l = $('<div class="jFiler-items"></div>');
                                    l.append(f._assets.textParse(n.templates.thumbs)).appendTo(p);
                                }
                                
                                l.on('click', n.templates._selectors.remove, function(e){
                                    e.preventDefault();
                                    if($projectile && $projectile._config && $projectile._config.removeAction){
                                        $projectile._config.removeAction({e: e, el: $(this).closest(n.templates._selectors.item)}, function(data){
                                            f._remove(data.e, data.el);
                                        });    
                                    }else{
                                        f._remove(e, $(this).closest(n.templates._selectors.item));   
                                    }
                                });
                            }
                            
                            for(var i=0; i<data.length; i++){
                                f._addToMemory(i);
                                f._thumbCreator.create(i);
                            }
                        }
                    },
                    _getList: function(e, data){
                        var data = data.data;
                        if(!data || data.length <= 0){ return; }
                        f.files = data;
                        if(n.showThumbs){
                            var returnData = [];
                            for(var i=0; i<data.length; i++){
                                returnData.push(f._thumbCreator.create(i));
                            }
                            if(data.callback){
                                data.callback(returnData); 
                            }
                        }
                    },
                    _remove: function(e, el){
                        if(el.fileData){
                            var a = el.fileData,
                                el = el.fileEl;
                        }
                        
                        var AttrId = el.attr('data-jfiler-index'),
                            id = null,
                            callback = function(el, id){
                                if(f._itFl.length < 1){
                                    f._reset();
                                    f._clear();
                                }else{
                                    f._set('feedback', f._itFl.length + ' ' + n.captions.feedback2);
                                }

                                el.fadeOut("fast", function(){
                                    $(this).remove();
                                });
                            };
                        
                        for(var key in f._itFl){
                            if (key === 'length' || !f._itFl.hasOwnProperty(key)) continue;
                            if(f._itFl[key].id == AttrId){
                                id = key;
                            }
                        }
                        
                        if(!f._itFl.hasOwnProperty(id)){ return false }
                        
                        if(f._itFl[id].ajax){
                            f._itFl[id].ajax.abort();
                            callback(el, id);
                            return;
                        }
                        
                        if(f._itFl[id].uploaded || f._itFl[id].file.file){
                            n.onRemove(el, (f._itFl[id].file.id ? f._itFl[id].file : {rId: f._itFl[id].html.attr("data-file-revisionid")}), id, function(el, id){
                                callback(el, id);
                            });
                        }else{
                            n.onRemove(el, f._itFl[id].file, id, function(el, id){
                                callback(el, id);   
                            })
                        }
                        
                        f._itFl.splice(id,1);
                    },
                    _addToMemory: function(i){
                        f._itFl.push({
                            id: f._itFl.length,
                            file: f.files[i],
                            html: $(),
                            ajax: false,
                            uploaded: false,
                        });
                        f._itFc = f._itFl[f._itFl.length - 1];
                    },
                    _assets: {
                        bytesToSize: function(bytes) {
                           if(bytes == 0) return '0 Byte';
                           var k = 1000;
                           var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                           var i = Math.floor(Math.log(bytes) / Math.log(k));
                           return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
                        },
                        getIcon: function(type){
                            var types = ["audio","image","text","video"];
                            if($.inArray(type, types)>-1){
                                return '<i class="icon-jfi-file-' + type + '"></i>';   
                            }
                            return '<i class="icon-jfi-file-o"></i>';
                        },
                        textParse: function(text, opts){
                            opts = $.extend({}, {limit: n.limit, maxSize: n.maxSize}, (opts && $.isPlainObject(opts) ? opts : {}));
                            switch(typeof(text)){
                                case "string":
                                    return text.replace(/\{\{fi-name[\s\S]?\|[\s\S]?limitTo\:[\s\S]*?(\d*?)\}\}/g, function(match, a){var name = opts.name, name2 = name.replace(/\.[^/.]+$/, ""), ext = opts.extension; name2 = name2.substring(0, (name.length > a ? a-ext.length-3 : name.length)) + (name.length > a ? '...' + ext : (ext.length > 0 ? '.' : '') + ext); return name2;}).replace(/\{\{fi-(.*?)\}\}/g, function(match, a){ return (opts[a] ? opts[a] : ""); }) 
                                break;
                                case "function":
                                    return text(opts);
                                break;
                                default:
                                    return text;    
                            }
                        },
                        text2Color: function(string){
                            function md5cycle(e,t){var n=e[0],r=e[1],i=e[2],s=e[3];n=ff(n,r,i,s,t[0],7,-680876936);s=ff(s,n,r,i,t[1],12,-389564586);i=ff(i,s,n,r,t[2],17,606105819);r=ff(r,i,s,n,t[3],22,-1044525330);n=ff(n,r,i,s,t[4],7,-176418897);s=ff(s,n,r,i,t[5],12,1200080426);i=ff(i,s,n,r,t[6],17,-1473231341);r=ff(r,i,s,n,t[7],22,-45705983);n=ff(n,r,i,s,t[8],7,1770035416);s=ff(s,n,r,i,t[9],12,-1958414417);i=ff(i,s,n,r,t[10],17,-42063);r=ff(r,i,s,n,t[11],22,-1990404162);n=ff(n,r,i,s,t[12],7,1804603682);s=ff(s,n,r,i,t[13],12,-40341101);i=ff(i,s,n,r,t[14],17,-1502002290);r=ff(r,i,s,n,t[15],22,1236535329);n=gg(n,r,i,s,t[1],5,-165796510);s=gg(s,n,r,i,t[6],9,-1069501632);i=gg(i,s,n,r,t[11],14,643717713);r=gg(r,i,s,n,t[0],20,-373897302);n=gg(n,r,i,s,t[5],5,-701558691);s=gg(s,n,r,i,t[10],9,38016083);i=gg(i,s,n,r,t[15],14,-660478335);r=gg(r,i,s,n,t[4],20,-405537848);n=gg(n,r,i,s,t[9],5,568446438);s=gg(s,n,r,i,t[14],9,-1019803690);i=gg(i,s,n,r,t[3],14,-187363961);r=gg(r,i,s,n,t[8],20,1163531501);n=gg(n,r,i,s,t[13],5,-1444681467);s=gg(s,n,r,i,t[2],9,-51403784);i=gg(i,s,n,r,t[7],14,1735328473);r=gg(r,i,s,n,t[12],20,-1926607734);n=hh(n,r,i,s,t[5],4,-378558);s=hh(s,n,r,i,t[8],11,-2022574463);i=hh(i,s,n,r,t[11],16,1839030562);r=hh(r,i,s,n,t[14],23,-35309556);n=hh(n,r,i,s,t[1],4,-1530992060);s=hh(s,n,r,i,t[4],11,1272893353);i=hh(i,s,n,r,t[7],16,-155497632);r=hh(r,i,s,n,t[10],23,-1094730640);n=hh(n,r,i,s,t[13],4,681279174);s=hh(s,n,r,i,t[0],11,-358537222);i=hh(i,s,n,r,t[3],16,-722521979);r=hh(r,i,s,n,t[6],23,76029189);n=hh(n,r,i,s,t[9],4,-640364487);s=hh(s,n,r,i,t[12],11,-421815835);i=hh(i,s,n,r,t[15],16,530742520);r=hh(r,i,s,n,t[2],23,-995338651);n=ii(n,r,i,s,t[0],6,-198630844);s=ii(s,n,r,i,t[7],10,1126891415);i=ii(i,s,n,r,t[14],15,-1416354905);r=ii(r,i,s,n,t[5],21,-57434055);n=ii(n,r,i,s,t[12],6,1700485571);s=ii(s,n,r,i,t[3],10,-1894986606);i=ii(i,s,n,r,t[10],15,-1051523);r=ii(r,i,s,n,t[1],21,-2054922799);n=ii(n,r,i,s,t[8],6,1873313359);s=ii(s,n,r,i,t[15],10,-30611744);i=ii(i,s,n,r,t[6],15,-1560198380);r=ii(r,i,s,n,t[13],21,1309151649);n=ii(n,r,i,s,t[4],6,-145523070);s=ii(s,n,r,i,t[11],10,-1120210379);i=ii(i,s,n,r,t[2],15,718787259);r=ii(r,i,s,n,t[9],21,-343485551);e[0]=add32(n,e[0]);e[1]=add32(r,e[1]);e[2]=add32(i,e[2]);e[3]=add32(s,e[3])}function cmn(e,t,n,r,i,s){t=add32(add32(t,e),add32(r,s));return add32(t<<i|t>>>32-i,n)}function ff(e,t,n,r,i,s,o){return cmn(t&n|~t&r,e,t,i,s,o)}function gg(e,t,n,r,i,s,o){return cmn(t&r|n&~r,e,t,i,s,o)}function hh(e,t,n,r,i,s,o){return cmn(t^n^r,e,t,i,s,o)}function ii(e,t,n,r,i,s,o){return cmn(n^(t|~r),e,t,i,s,o)}function md51(e){txt="";var t=e.length,n=[1732584193,-271733879,-1732584194,271733878],r;for(r=64;r<=e.length;r+=64){md5cycle(n,md5blk(e.substring(r-64,r)))}e=e.substring(r-64);var i=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(r=0;r<e.length;r++)i[r>>2]|=e.charCodeAt(r)<<(r%4<<3);i[r>>2]|=128<<(r%4<<3);if(r>55){md5cycle(n,i);for(r=0;r<16;r++)i[r]=0}i[14]=t*8;md5cycle(n,i);return n}function md5blk(e){var t=[],n;for(n=0;n<64;n+=4){t[n>>2]=e.charCodeAt(n)+(e.charCodeAt(n+1)<<8)+(e.charCodeAt(n+2)<<16)+(e.charCodeAt(n+3)<<24)}return t}function rhex(e){var t="",n=0;for(;n<4;n++)t+=hex_chr[e>>n*8+4&15]+hex_chr[e>>n*8&15];return t}function hex(e){for(var t=0;t<e.length;t++)e[t]=rhex(e[t]);return e.join("")}function md5(e){return hex(md51(e))}function add32(e,t){return e+t&4294967295}var hex_chr="0123456789abcdef".split("");if(md5("hello")!="5d41402abc4b2a76b9719d911017c592"){function add32(e,t){var n=(e&65535)+(t&65535),r=(e>>16)+(t>>16)+(n>>16);return r<<16|n&65535}}
                            return (!string || typeof string != "string" || string.length == 0 ? "#A4A7AC" : "#" + md5(string).slice(0, 6));
                        }
                    },
                    files:null,
                    _itFl:[],
                    _itFc: null
                }
                f.init();
                s.on("filer.append", function(e, data){f._append(e, data)});
                s.on("filer.removeFile", function(e, data){f._remove(e, data);});
                s.on("filer.removeAll", function(e){f._remove(e, 'remove-All')});
                s.on("filer.generateList", function(e, data){return f._getList(e, data)})
                return this;
            });
    };
    $.fn.filer.defaults = {
        limit: null,
        maxSize: null,
        extensions: null,
        changeInput: true,
        showThumbs: true,
        theme: null,
        templates: {
            thumbs: '',
            item: '',
            progressBar: '<div class="bar" style="width: 0"></div>',
            _selectors: {
                list: '',
                item: '',
                progressBar: '',
                remove: '',
            }
        },
        uploadFile: null,
		dragDrop: null,
        clipBoardPaste: true,
        beforeShow: null,
		onSelect: null,
		afterShow: null,
        beforeRemove: null,
		onRemove: null,
		onEmpty: null,
        captions: {
			button: "Choose Files",
			feedback: "Choose files To Upload",
			feedback2: "files were chosen",
            drop: "Drop file here to Upload",
			errors: {
				filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
				filesType: "Only Images are allowed to be uploaded.",
				filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.",
				filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB."
			}
		}
    }
})(jQuery);