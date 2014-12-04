$(document).ready(function(){
    
    $projectile.preloader();
    
    var folder = "6";
    
    $projectile.ready(function(){
        
        /* 
            ====================
                Config Filer
            ====================
        */
        $('input#filer1').filer({
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
                                        <span class="item-title"><b title="{{fi-name}}">{{fi-name | limitTo: 30}}</b></span>\
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
                                        <span class="item-title" title="{{fi-name}}">{{fi-name | limitTo: 20}}</span>\
                                        <span class="item-others">{{fi-size2}} | {{fi-createdByName}} | {{fi-date}}</span>\
                                    </div>\
                                    {{fi-image}}\
                                    <div class="item-thumb-overlay">\
                                        <div>\
                                            <a class="item-thumb-info" title="More..."><i class="icon-jfi-infinite"></i></a>\
                                            <a href="{{fi-file}}" class="item-thumb-link" target="_blank" title="Download" download="{{fi-name}}"><i class="icon-jfi-download-o"></i></a>\
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
                                            <li><a href="#" class="icon-jfi-{{fi-lockIcon}} item-lock-action dropdown" title="{{fi-lockTitle}}"></a></li>\
                                            <li><a href="#" class="icon-jfi-trash item-trash-action" title="Remove"></a></li>\
                                        </ul>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>\
                    </li>',
                progressBar: '<div class="bar" style="width: 0"></div>',
                _selectors: {
                    list: '.files-items-list',
                    item: '.files-item',
                    progressBar: '.bar',
                    remove: '.item-trash-action',   
                }
            },
            uploadFile: {
                url: '/flyer/rest/api/json/0/folderuploads/' + folder,
                data: {},
                type: 'POST',
                enctype: 'multipart/form-data',
                beforeSend: function(){},
                success: function(data, el){
                    el.attr("data-file-revisionId", data.Entries[0].id);
                    
                    el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                        $('<ul class="list-inline pull-left"><li><em class="jFiler-upload-success text-success"><i class="icon-jfi-check-circle"></i> Success</em></li><li>|</li><li><a class="ns-underline" style="font-size:13px;">Comment<a></li></ul>').hide().appendTo($(this).parent()).fadeIn('slow');
                        $(this).remove();
                    })
                },
                error: function(el){
                    el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                        $('<em class="jFiler-upload-error text-danger"><i class="icon-jfi-exclamation-circle"></i> Error!</em>').hide().appendTo($(this).parent()).fadeIn('slow');
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
            onSelect: null,
            afterShow: null,
            onRemove: function(el, data){
                $projectile.file.remove(data);   
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
            val.lockIcon = (val.locked ? "unlock" : "lock");
            val.lockTitle = (val.locked ? $projectile.captions.unlock : $projectile.captions.lock);
        }
        $('input#filer1').trigger("filer.append", {data: $projectile.files});


        $(".icon-jfi-unlock.dropdown").dropdown({
			   
           template : function(r){ return "<li><a>"+r.text+"</a></li>"; },
           buttons:[
               {
                   text:'<i class="icon-jfi-unlock"></i> ' + $projectile.captions.unlock, //Inner HTML
                   addClass:'custom-button', //<li> Class 
                   onClick: function(p,e){
                       p.trigger("files-item.lock");
                       return true; //Return true - will close dropdown, false - will keep dropwdown 
                   }
               },
               {}, 
               {
                   text:'<i class="icon-jfi-question-circle"></i> ' + "Show Info", //Inner HTML
                   addClass:'custom-button', //<li> Class 
                   onClick: function(p,e){
                        var id = p.closest(".files-item").attr("data-file-orderKey"),
                            el = p,
                            data = $.grep($projectile.files, function(a,b){
                                return a.orderKey == id;
                            })[0];
                       modal({
                           type: "info",
                           title: "Info",
                           text: "<h5><b>File:</b></h5>" + "<p>" + data.name + "</p><br>" + "<h5><b>Comment:</b></h5>" + "<p>" + data.lockComment + "</p><br>" + "<h5><b>User:</b></h5>" + "<p>" + data.lockedByName + "</p><br>" + "<h5><b>Time:</b></h5>" + "<p>" + $projectile.dateFormat(data.lockTime) + "</p>",
                           center: false,
                           size: "small"
                       });
                       return true;
                   }
               },
           ]
        });
    });
    
});
