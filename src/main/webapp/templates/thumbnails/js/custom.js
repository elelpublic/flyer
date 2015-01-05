$(document).ready(function(){

    $projectile.ready(function(){
        
        /* 
            ====================
                Config Filer
            ====================
        */
        $($projectile._config.input_selector).filer({
            limit: null,
            maxSize: null,
            extensions: null,
            changeInput: '<div class="jFiler-input-dropDown"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>Drag & Drop Files Here</h3> <span class="margin15">or</span></div><a class="jFiler-input-choose-btn blue">Browse Files</a></div></div>',
            showThumbs: true,
            appendTo: $('.right-side'),
            theme: 'thumbnails',
            templates: {
                thumbs: null,
                item: '<li class="files-item uploading animated zoomIn col-xs-4">\
                            <div class="files-item-container">\
                                <div class="item-thumb">\
                                    <div class="item-info">\
                                        <span class="item-title"><b title="{{fi-name}}">{{fi-name | limitTo: 45}}</b></span>\
                                        <span class="item-others">{{fi-size2}}</span>\
                                    </div>\
                                    {{fi-image}}\
                                </div>\
                                <div class="item-assets row">\
                                    {{fi-progressBar}}\
                                    <ul class="list-inline pull-right">\
                                        <li><a class="icon-jfi-trash item-trash-action"></a></li>\
                                    </ul>\
                                </div>\
                            </div>\
                        </li>',
                itemAppended: '<li class="files-item col-xs-4" data-file-id="{{fi-fId}}" data-file-revisionId="{{fi-rId}}" data-file-type="{{fi-type}}" data-file-extension="{{fi-extension}}" data-file-name="{{fi-name}}" data-file-user="{{fi-createdByName}}" data-file-size="{{fi-size}}" data-file-date="{{fi-createdDate}}" data-file-orderKey="{{fi-orderKey}}">\
                        <div class="files-item-container">\
                            <div class="files-item-inner">\
                                <div class="item-thumb">\
                                    <div class="item-info">\
                                        <span class="item-title" title="{{fi-name}}">{{fi-name | limitTo: 45}}</span>\
                                        <span class="item-others">{{fi-size2}} | {{fi-createdByName}} | {{fi-date}}</span>\
                                    </div>\
                                    {{fi-image}}\
                                    <div class="item-thumb-overlay">\
                                        <div class="item-thumb-overlay-info animated fadeIn">\
                                            <div style="display:table-cell;vertical-align: middle;">\
                                                <br>\
                                                <a href="{{fi-file}}" target="_blank" title="Download" download="{{fi-name}}" class="download-button-blue"><i class="icon-jfi-download-o"></i></a>\
                                                <br><br>\
                                                <b>{{fi-name}}</b>\
                                                <br>\
                                                <span class="others">{{fi-size2}} | {{fi-createdByName}} | {{fi-date}}</span>\
                                                <br><br>\
                                                <p class="comment">{{fi-comment}}</p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="item-assets row">\
                                    <div class="item-assets-normal">\
                                        <ul class="list-inline pull-left">\
                                            <li><input type="checkbox" class="file-item-check" id="files-item-{{fi-fId}}"><label for="files-item-{{fi-fId}}">&nbsp;</label></li>\
                                        </ul>\
                                        <ul class="list-inline pull-right">\
                                            <li><a href="{{fi-file}}" target="_blank" class="icon-jfi-download-o item-download-action" title="Download" download="{{fi-name}}"></a></li>\
                                            {{fi-versionsButton}}\
                                            {{fi-lockIcon}}\
                                            <li><a class="icon-jfi-trash item-trash-action" title="Remove"></a></li>\
                                        </ul>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </li>',
                progressBar: '<div class="bar" style="width: 0"></div>',
                _selectors: {
                    list: $projectile._config.list_selector,
                    item: $projectile._config.item_selector,
                    progressBar: '.bar',
                    remove: $projectile._config.remove_item_selector,   
                }
            },
            uploadFile: {
                url: $projectile._config.uploadURL,
                data: {},
                type: 'POST',
                enctype: 'multipart/form-data',
                beforeSend: function(){},
                success: function(data, el, l, o, p, s){
                    el.attr("data-file-revisionId", data.Entries[0].id);
                    el.attr("data-file-type", data.Entries[0].mimeType.split("/", 1).toString().toLowerCase());
                    el.attr("data-file-size", data.Entries[0].size);
                    el.attr("data-file-user", data.Entries[0].createdByName);
                    el.attr("data-file-date", data.Entries[0].createdDate);
                    el.attr("data-file-name", data.Entries[0].fileName);
                    
                    el.removeClass("animated");
                    
                    el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                        $('<ul class="list-inline pull-left"><li><em class="jFiler-upload-success text-success"><i class="icon-jfi-check-circle"></i> Success</em></li></ul>').hide().appendTo($(this).parent()).fadeIn('slow');
                        $(this).remove();
                    });
                    
                    if(p.next().attr("id") == "filerComment"){
                        var comment = p.next("#filerComment").find("textarea");
                        if(comment){
                            comment.val("");
                        }
                    }
                },
                error: function(el){
                    el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                        $('<ul class="list-inline pull-left"><li><em class="jFiler-upload-error text-danger"><i class="icon-jfi-exclamation-circle"></i> Error!</em></li></ul>').hide().appendTo($(this).parent()).fadeIn('slow');
                        $(this).remove();
                    })
                },
                statusCode: {},
                onProgress: function(){},
            },
            dragDrop: {
                dragEnter: function(){},
                dragLeave: function(){},
                drop: function(){},
            },
            beforeShow: function(){
                $('.jFiler-emptyMessage').remove();
                return true;
            },
            onSelect: function(){
                $('.file-verions-right-side').fadeOut("slow", function(){
                    $(this).remove();
                    $(".right-side").fadeIn("slow");
                    history.pushState({}, "Flyer", $projectile._location.removeParameter("file"));
                })   
            },
            afterShow: null,
            onRemove: function(el, data, id, callback){
                $projectile._config.btnLoading(el.find(".item-trash-action"));
                $projectile.file.remove(data, function(r){
                    if(r._transfered){
                        callback(el, id);
                    }else{
                        $projectile._config.requestErrorMessage();   
                    }
                    $projectile._config.btnLoading(el.find(".item-trash-action"),true);
                });
            },
            onEmpty: function(a,b,c){
                $('.files-items-list').html('<p class="jFiler-emptyMessage" align="center">- No files Uploaded -</p>');
            },
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
        });

        /* 
            ====================
                Append Files
            ====================
        */
        for(key in $projectile.files){
            var val = $projectile.files[key];
            val.name = val.fileName;
            val.date = $projectile.dateFormat(val.created);
            val.type = val.mimeType;
            val.file = $projectile.restUrl + "rest/api/binary/0/filerevisions?fileHistory=" + val.fId;
            val.rId = val.id;
            val.lockIcon = '<li><a class="icon-jfi-'+(val.locked ? "unlock" : "lock")+' item-lock-action dropdown" title="'+(val.locked ? $projectile.captions.unlock : $projectile.captions.lock)+'"></a></li>';
            val.versionsButton = (val.revisions.length > 0 ? '<li><a href="'+$projectile._location.addParameter("file",val.fId)+'" class="item-versions-show dropdown" title="Versions"><i class="icon-jfi-history"></i></a></li>' : '');
        }
        $('input#filer1').trigger("filer.append", {data: $projectile.files});
        
        /* Lock Icon dropdown */
        $(".icon-jfi-unlock.dropdown").dropdown({
			   
           template : function(r){ return "<li><a>"+r.text+"</a></li>"; },
           buttons:[
               {
                   text:'<i class="icon-jfi-unlock"></i> ' + $projectile.captions.unlock, 
                   onClick: function(p,e){
                       p.removeClass('dropdown');
                       p.trigger("files-item.lock");
                       return true;
                   }
               },
               {}, 
               {
                   text:'<i class="icon-jfi-question-circle"></i> ' + "Show Info",
                   onClick: function(p,e){
                        var id = p.closest(".files-item").attr("data-file-orderKey"),
                            el = p,
                            data = $.grep($projectile.files, function(a,b){
                                return a.orderKey == id;
                            })[0];
                       modal({
                           type: "info",
                           title: "Info",
                           text: "<b>File:</b><br>" + "<p>" + data.name + "</p>" + "<b>User:</b><br>" + "<p>" + data.lockedByName + "</p>" + "<b>Time:</b><br>" + "<p>" + $projectile.dateFormat(data.lockTime) + "</p>" + "<b>Comment:</b><br>" + "<p>" + data.lockComment + "</p>",
                           center: false,
                           size: "small"
                       });
                       return true;
                   }
               },
           ]
        });
        
        
        /* 
            ====================
               Files Versions
            ====================
        */
        var itemVersionsGet = function(){
            if(!$projectile._location.getParameter("file") || !$projectile.files || $projectile.files.length == 0){ return false }
            var id = $projectile._location.getParameter("file"),
                data = $.grep($projectile.files, function(a,b){
                    return a.fId == id;
                });
            if(!data || !data[0] || !data[0].revisions){return false;}
            data = data[0].revisions;

            var current = null;
            for(key in data){
                var val = data[key];
                val.name = val.fileName;
                val.date = $projectile.dateFormat(val.created);
                val.type = val.mimeType;
                val.file = $projectile.restUrl + "rest/api/binary/0/filerevisions/" + val.id;
                val.rId = val.id;
                val.lockTitle = (val.locked ? $projectile.captions.unlock : $projectile.captions.lock);
                val.lockIcon = (val.fId ? '<li><a class="icon-jfi-'+(val.locked ? "unlock" : "lock")+' item-lock-action dropdown" title="'+(val.locked ? $projectile.captions.unlock : $projectile.captions.lock)+'"></a></li>' : '');
                val.forList = true;
                val.versionsButton = '';
                if(current){val.fId = current.fId}

                if(val.fId){ current = val }
            }

            data.callback = function(list){
                $('.file-verions-right-side').remove();

                var html = $('<div class="col-xs-9 _splr30 _sptG right-side file-verions-right-side"><div><ul class="files-items-list list-inline"></ul></div></div>').hide();

                for(key in list){
                    var val = list[key];
                    val.find(".item-assets-normal .list-inline.pull-left li:first-child").html("<span class='version-num'><i class='icon-jfi-history'></i> <b>" + (list.length - parseInt(key)) + "</b></span>");
                    html.find(".files-items-list").append(val);
                }

                $('.filter-list-type, .filter-list-mode').addClass("disabled");

                html.find(".files-items-list").prepend('<li class="files-item col-xs-4 veryBig-back-button"><div class="files-item-container"><div class="files-item-inner"><div class="item-thumb"><a><i class="icon-jfi-back"></i> Back</a></div></div></div></li>');

                html.find('.veryBig-back-button a').on("click", function(e){
                    $projectile._location.redirect_to($projectile._location.removeParameter("file"));
                });

                html.on("click", 'a.item-trash-action', function(e){
                    var id = $(this).closest($projectile._config.item_selector).attr("data-file-revisionid"),
                        el = $(this),
                        send = $.grep(data, function(a,b){
                            return a.id == id;
                        });
                    if(!send || !send[0]){return false}
                    
                    $projectile._config.removeAction({el: el, send: send}, function(data){
                        $projectile._config.btnLoading(el);
                        $projectile.file.remove(data.send[0], function(r){
                            if(r._transfered){
                                data.el.closest($projectile._config.item_selector).fadeOut("fast", function(){
                                    $(this).remove();   
                                })
                            }else{
                                $projectile._config.requestErrorMessage();   
                            }
                            $projectile._config.btnLoading(el,true);
                        });
                    });
                });

                $('.right-side').hide(0, function(){
                    var par = $(this).parent();
                    html.hide().appendTo(par).show(0);
                });
            }

            $($projectile._config.input_selector).trigger("filer.generateList", {data: data});
        }

        itemVersionsGet();
    });
});