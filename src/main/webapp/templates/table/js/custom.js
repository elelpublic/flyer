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
            el.attr("data-file-id", data.Entries[0].fileHistory);
            el.attr("data-file-revisionId", data.Entries[0].id);
            el.attr("data-file-type", data.Entries[0].mimeType.split("/", 1).toString().toLowerCase());
            el.attr("data-file-size", data.Entries[0].size);
            el.attr("data-file-user", data.Entries[0].createdByName);
            el.attr("data-file-date", data.Entries[0].createdDate);
            el.attr("data-file-name", data.Entries[0].fileName);

            var val = data.Entries[0],
                data = [];

            val.name = val.fileName;
            val.date = $projectile.dateFormat(val.created);
            val.type = val.mimeType;
            val.file = $projectile.restUrl + "rest/api/binary/0/filerevisions/" + val.id;
            val.rId = val.id;
            val.lockIcon = '';
            val.versionsButton = '';
            val.forList = true;

            data.push(val);

            data.callback = function(list){
                el.removeClass("animated");

                el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                    var parent = el,
                        inner = parent,
                        newItem = $(list[0]),
                        progress = $(this);
                    inner.fadeOut("slow", function(){
                        parent.html(newItem.html());

                        parent.find(".table-col:first-child").html('<i class="icon-jfi-check files-item-icon" style="color: #68b830"></i>');

                        inner.fadeIn("slow");
                    });
                });
            }

            el.removeClass("uploading");

            $($projectile._config.input_selector).trigger("filer.generateList", {data: data});
        }
        
        _filerOpts.uploadFile.error = function(el){
                    
            el.removeClass('uploading');
                    
            el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                $(this).closest(".table-row").find(".files-item-icon").parent().html('<i class="icon-jfi-minus-circle files-item-icon" style="color: #d9534f"></i>');
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
        
    });
});