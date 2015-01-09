$(document).ready(function(){
    
    $('.files-items-table').hide();

    $projectile.ready(function(){
        
        var _filerOpts = $projectile._config._filerOpts;
        _filerOpts.theme = 'list';
        _filerOpts.templates.item = '<div class="table-row files-item uploading">\
                                        <div class="table-col"><i class="icon-jfi-reload files-item-icon"></i></div>\
                                        <div class="table-col"><span title="{{fi-name}}">{{fi-name | limitTo: 45}}</span></div>\
                                        <div class="table-col">{{fi-size2}}</div>\
                                        <div class="table-col"></div>\
                                        <div class="table-col"></div>\
                                        <div class="files-item-actions table-col" style="display:block">\
                                            <ul class="list-inline">\
                                                <li><a class="icon-jfi-trash item-trash-action" title="'+$projectile.captions.remove+'"></a></li>\
                                            </ul>\
                                        </div>\
                                        {{fi-progressBar}}\
                                    </div>';
        _filerOpts.templates.itemAppended = '<div class="table-row files-item" data-file-id="{{fi-fId}}" data-file-revisionId="{{fi-rId}}" data-file-type="{{fi-type}}" data-file-extension="{{fi-extension}}" data-file-name="{{fi-name}}" data-file-user="{{fi-createdByName}}" data-file-size="{{fi-size}}" data-file-date="{{fi-createdDate}}" data-file-orderKey="{{fi-orderKey}}">\
                                                <div class="table-col"><input type="checkbox" class="file-item-check" id="files-item-{{fi-fId}}"><label for="files-item-{{fi-fId}}"></label></div>\
                                                <div class="table-col"><a href="{{fi-file}}" target="_blank" class="item-download-action ns-underline" title="{{fi-name}}">{{fi-name | limitTo: 45}}</a></div>\
                                                <div class="table-col">{{fi-size2}}</div>\
                                                <div class="table-col">{{fi-date}}</div>\
                                                <div class="table-col">{{fi-createdByName}}</div>\
                                                <div class="files-item-actions table-col">\
                                                    <ul class="list-inline">\
                                                        <li><a href="{{fi-file}}" target="_blank" class="icon-jfi-download-o item-download-action" title="'+$projectile.captions.download+'" download="{{fi-name}}"></a></li>\
                                                        {{fi-lockIcon}}\
                                                        <li><a class="icon-jfi-trash item-trash-action" title="'+$projectile.captions.remove+'"></a></li>\
                                                    </ul>\
                                                </div>\
                                            </div>';

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
            val.versionsButton = '';
            val.forList = true;

            data.push(val);
            $projectile.files.push(val);

            data.callback = function(list){
                el.removeClass("animated");

                el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                    var parent = el,
                        inner = parent,
                        newItem = $(list[0]),
                        progress = $(this);
                    inner.fadeOut("slow", function(){
                        parent.html(newItem.html());

                        for (i = 0; i < newItem[0].attributes.length; i++){
                            var a = newItem[0].attributes[i];
                            if(a.name == "data-jfiler-index"){continue}
                            parent.attr(a.name, a.value);
                        }

                        inner.fadeIn("slow");
                    });
                });
                
                el.removeClass("uploading");
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
                    
            el.removeClass('uploading');
                    
            el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                $(this).closest(".table-row").find(".files-item-icon").parent().html('<i class="icon-jfi-minus-circle files-item-icon" style="color: #d9534f"></i>');
                setTimeout(function(){
                    el.fadeOut("slow")   
                }, 1500);
                $(this).remove();
            })
        }
        
        _filerOpts.beforeShow = function(){
            $('.files-items-table').show();
            return true;
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
            val.versionsButton = '';
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
        
    });
});