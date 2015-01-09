$(document).ready(function(){

    $projectile.ready(function(){
        
        /* 
            ====================
                Config Filer
            ====================
        */
        
        var _filerOpts = $projectile._config._filerOpts;
        _filerOpts.theme = 'thumbnails';
        _filerOpts.templates.item = '<li class="files-item uploading animated zoomIn col-xs-4">\
                                        <div class="files-item-container">\
                                            <div class="files-item-inner">\
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
                                                        <li><a class="icon-jfi-ban item-trash-action"></a></li>\
                                                    </ul>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </li>';
        _filerOpts.templates.itemAppended = '<li class="files-item col-xs-4" data-file-id="{{fi-fId}}" data-file-revisionId="{{fi-rId}}" data-file-type="{{fi-type}}" data-file-extension="{{fi-extension}}" data-file-name="{{fi-name}}" data-file-user="{{fi-createdByName}}" data-file-size="{{fi-size}}" data-file-date="{{fi-createdDate}}" data-file-orderKey="{{fi-orderKey}}">\
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
                                                                <a href="{{fi-file}}" title="'+$projectile.captions.download+'" class="download-button-blue" download="{{fi-name}}"><i class="icon-jfi-download-o"></i></a>\
                                                                <a href="{{fi-file}}" target="_blank" title="'+$projectile.captions.openFile+'" class="download-button-red"><i class="icon-jfi-external-link"></i></a>\
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
                                                            <li><a href="{{fi-file}}" target="_blank" class="icon-jfi-external-link item-open-action" title="'+$projectile.captions.openFile+'"></a></li>\
                                                            {{fi-versionsButton}}\
                                                            {{fi-lockIcon}}\
                                                            <li><a class="icon-jfi-trash item-trash-action" title="'+$projectile.captions.remove+'"></a></li>\
                                                        </ul>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </li>';
        _filerOpts.uploadFile.success = function(data, el, l, o, p, s){
            var val = data.Entries[0],
                data = [],
                revisionsFind = function(id){
                    var items = $($projectile._config.item_selector + "[data-file-id='"+id+"']");
                    if(items && items.length > 0){
                        var matches = $.grep($projectile.files, function(a,b){
                            return a.fId == id;
                        });
                        items.remove();
                        return matches;
                    }
                    return [];
                },
                lockFind = function(id){
                    var items = $($projectile._config.item_selector + "[data-file-id='"+id+"']");
                    if(items && items.length > 0){
                        var matches = $.grep($projectile.files, function(a,b){
                            return a.fId == id;
                        });
                        if(matches[0] && matches[0].locked){
                            return true;   
                        }
                    }
                    return false;
                }

            val.name = val.fileName;
            val.date = $projectile.dateFormat(val.created);
            val.type = val.mimeType;
            val.file = $projectile.restUrl + "rest/api/binary/0/filerevisions/" + val.id;
            val.rId = val.id;
            val.orderKey = $projectile.files.length.toString();
            val.fId = val.fileHistory;
            val.locked = lockFind(val.fId);
            val.lockIcon = '<li><a class="icon-jfi-'+(val.locked ? "unlock" : "lock")+' item-lock-action dropdown" title="'+(val.locked ? $projectile.captions.unlock : $projectile.captions.lock)+'"></a></li>';
            val.revisions = revisionsFind(val.fId);
            val.versionsButton = (val.revisions.length > 0 ? '<li><a href="'+$projectile._location.addParameter("file",val.fId)+'" class="item-versions-show dropdown" title="'+$projectile.captions.versions+'"><i class="icon-jfi-history"></i></a></li>' : '');
            val.forList = true;

            data.push(val);
            $projectile.files.push(val);

            data.callback = function(list){
                el.removeClass("animated");

                el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                    var parent = el,
                        inner = parent.find(".files-item-inner"),
                        newItem = $(list[0]),
                        progress = $(this);
                    inner.fadeOut("slow", function(){
                        parent.html(newItem.html());

                        for (i = 0; i < newItem[0].attributes.length; i++){
                            var a = newItem[0].attributes[i];
                            if(a.name == "data-jfiler-index"){continue}
                            parent.attr(a.name, a.value);
                        }
                        
                        $(this).remove();

                        inner.fadeIn("slow");
                    });
                });
            }

            $($projectile._config.input_selector).trigger("filer.generateList", {data: data});

            if(p.next().attr("id") == "filerComment"){
                var comment = p.next("#filerComment").find("textarea");
                if(comment){
                    comment.val("");
                }
            }
        }
        
        _filerOpts.uploadFile.error = function(el){
            el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                $('<ul class="list-inline pull-left"><li><em class="jFiler-upload-error text-danger"><i class="icon-jfi-exclamation-circle"></i> '+$projectile.captions.errorText+'!</em></li></ul>').hide().appendTo($(this).parent()).fadeIn('slow');
                setTimeout(function(){
                    el.fadeOut("slow")   
                }, 1500);
                $(this).remove();
            })
        }
        
        $($projectile._config.input_selector).filer(_filerOpts);

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
            val.file = $projectile.restUrl + "rest/api/binary/0/filerevisions/" + val.id;
            val.rId = val.id;
            val.lockIcon = '<li><a class="icon-jfi-'+(val.locked ? "unlock" : "lock")+' item-lock-action dropdown" title="'+(val.locked ? $projectile.captions.unlock : $projectile.captions.lock)+'"></a></li>';
            val.versionsButton = (val.revisions.length > 0 ? '<li><a href="'+$projectile._location.addParameter("file",val.fId)+'" class="item-versions-show dropdown" title="'+$projectile.captions.versions+'"><i class="icon-jfi-history"></i></a></li>' : '');
        }
        $($projectile._config.input_selector).trigger("filer.append", {data: $projectile.files});
        
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
                   text:'<i class="icon-jfi-question-circle"></i> ' + $projectile.captions.infoShow,
                   onClick: function(p,e){
                        var id = p.closest(".files-item").attr("data-file-orderKey"),
                            el = p,
                            data = $.grep($projectile.files, function(a,b){
                                return a.orderKey == id;
                            })[0];
                       modal({
                           type: "info",
                           title: $projectile.captions.tInfo,
                           text: "<b>"+$projectile.captions.file+":</b><br>" + "<p>" + data.name + "</p>" + "<b>"+$projectile.captions.tUser+":</b><br>" + "<p>" + data.lockedByName + "</p>" + "<b>"+$projectile.captions.tDate+":</b><br>" + "<p>" + $projectile.dateFormat(data.lockTime) + "</p>" + "<b>"+$projectile.captions.tComment+":</b><br>" + "<p>" + data.lockComment + "</p>",
                           center: false,
                           size: "small",
                           buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel},
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

                var html = $('<div class="col-xs-9 _splr30 _sptG right-side file-verions-right-side"><div>' + $projectile._config.views["grid"].rightSide + '</div>').hide();
                
                html.find("input.file-item-check").remove();
                
                for(key in list){
                    var val = list[key];
                    val.find(".item-assets-normal .list-inline.pull-left li:first-child").html("<span class='version-num'><i class='icon-jfi-history'></i> <b>" + (list.length - parseInt(key)) + "</b></span>");
                    html.find($projectile._config.list_selector).append(val);
                }

                html.find(".files-items-list").prepend('<li class="files-item col-xs-4 veryBig-back-button"><div class="files-item-container"><div class="files-item-inner"><div class="item-thumb"><a><i class="icon-jfi-back"></i> '+$projectile.captions.back+'</a></div></div></div></li>');

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
                    send[0].isVersion = true;
                    $projectile._config.removeAction({el: el, send: send}, function(data){
                        $projectile._config._filerOpts.onRemove(data.el.closest($projectile._config.item_selector), data.send[0], id, function(el, id){
                            location.reload();
                            el.fadeOut("fast", function(){
                                $(this).remove();   
                            })
                        });
                    });
                });

                $('.right-side').hide(0, function(){
                    var par = $(this).parent();
                    html.hide().appendTo(par).show(0);
                    $('.filter-list-type, .filter-list-mode').addClass("disabled");
                    $projectile._config._filerOpts.beforeShow();
                });
            }

            $($projectile._config.input_selector).trigger("filer.generateList", {data: data});
        }

        itemVersionsGet();
    });
});