/*!
 * jQuery.filer
 * Copyright (c) 2014 CreativeDream
 * Website: http://creativedream.net/plugins/
 * Version: 1.0 (18-11-2014)
 * Requires: jQuery v1.7.1 or later
 */
(function($) {
    "use strict";
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
                                opts = $.extend(true, {}, file, opts); 
                            }
                            var item = f._thumbCreator.renderContent(opts);
                            
                            f._itFc.html = $(item).attr("data-jfiler-index", id);
                            f._thumbCreator.renderFile(file, f._itFc, opts);
                            
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
                            var m = new Array(2);
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
                                }
                            }else{
                                m[0] = "f-file";
                                m[1] = (obj.extension && obj.extension.length > 0 ? "." + obj.extension : "");   
                            }
                            return '<span class="jFiler-icon-file ' + m[0] + '">' + m[1] + '</span>';
                        }
                    },
                    _upload: function(i){
                        var el = f._itFc.html,
                            formData = new FormData();
                        
                        formData.append(s.attr('name'), f._itFc.file);
                        
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
                            if(!e.originalEvent.dataTransfer.files ||  e.originalEvent.dataTransfer.files.length <= 0){ return }
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
                    _onChange: function(e, d){
                        if(!d){
                            if(!s.get(0).files || typeof s.get(0).files == "undefined" || s.get(0).files.length == 0){ f._set('input',''); f._clear(); return false }
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
                                    l = n.appendTo;
                                }else{
                                    p.find('.jFiler-items').remove();
                                    l = $('<div class="jFiler-items"></div>');
                                    l.append(f._assets.textParse(n.templates.thumbs)).appendTo(p);
                                }
                                
                                l.on('click', n.templates._selectors.remove, function(e){
                                    e.preventDefault();
                                    f._remove(e, $(this).closest(n.templates._selectors.item));
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
                                    l = n.appendTo;
                                }else{
                                    p.find('.jFiler-items').remove();
                                    l = $('<div class="jFiler-items"></div>');
                                    l.append(f._assets.textParse(n.templates.thumbs)).appendTo(p);
                                }
                                
                                l.on('click', n.templates._selectors.remove, function(e){
                                    e.preventDefault();
                                    f._remove(e, $(this).closest(n.templates._selectors.item));
                                });
                            }
                            
                            for(var i=0; i<data.length; i++){
                                f._addToMemory(i);
                                f._thumbCreator.create(i);
                            }
                        }
                    },
                    _remove: function(e, el){
                        if(el.fileData){
                            var a = el.fileData;
                            el = el.fileEl;
                            n.onRemove(el, a);
                        }
                        var AttrId = el.attr('data-jfiler-index'),
                            id = 0;
                        
                        f._itFl.map(function(val, key){
                            if(val && val.id && val.id == AttrId){
                                id = key;
                            }
                        });
                        
                        if(!f._itFl[id]){ return false }
                        
                        if(f._itFl[id].ajax){
                            f._itFl[id].ajax.abort();
                        }
                        
                        if(f._itFl[id].uploaded){
                            n.onRemove(el, (typeof f._itFl[id].html.attr("data-file-revisionid")=="undefined" ? f._itFl[id].file : {rId: f._itFl[id].html.attr("data-file-revisionid")}));
                        }else{
                            n.onRemove(el, f._itFl[id].file);   
                        }
                        
                        f._itFl.splice(id,1);
                        
                        if(f._itFl.length < 1){
                            f._reset();
                            f._clear();
                        }else{
                            f._set('feedback', f._itFl.length + ' ' + n.captions.feedback2);
                        }
                        
                        el.fadeOut("fast", function(){
                            $(this).remove();
                        });
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
                        }
                    },
                    files:null,
                    _itFl:[],
                    _itFc: null
                }
                f.init();
                s.on("filer.append", function(e, data){f._append(e, data)})
                s.on("filer.removeFile", function(e, data){f._remove(e, data)})
                s.on("filer.removeAll", function(e){f._remove(e, 'remove-All')});
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
        beforeShow: null,
		onSelect: null,
		afterShow: null,
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