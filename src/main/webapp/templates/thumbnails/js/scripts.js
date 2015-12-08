$projectile._config = {
    input_selector: "input#filer1",
    uploadURL: $projectile.restUrl + 'api/json/' + $projectile.clientId + '/folderuploads/' + $projectile.folder,
    list_selector: ".files-items-list",
    item_selector: ".files-item",
    remove_item_selector: ".item-trash-action",
    requestErrorMessage: function(a, b, c){
        var text = $projectile.captions.errorText + "!";
        
        if(a == "lock" && c && c.locked){
            text = $projectile.captions.lockDenied.replace("$0", c.fileName).replace("$1", c.lockedByName).replace("$2", $projectile.dateFormat(c.lockTime, true)).replace("$3",c.lockComment);
        }
        
        return modal({
            type: "error",
            title: $projectile.captions.errorTitle,
            text: text,
            buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel},
        });
    },
    lockService: function(data, callback){
        $projectile.file.lock(data, function(r){
            if(r._transfered){
                if(callback){callback(r);}else{return true};
            }else{
                $projectile._config.requestErrorMessage("lock", r, data);
            }
        });
    },
    editService: function(data, callback){
        $projectile.file.edit(data, function(r){
            if(r._transfered){
                if(callback){callback(r);}else{return true};
            }else{
                $projectile._config.requestErrorMessage("lock", r, data);
            }  
        });
    },
    removeAction: function(data, callback){
        modal({type: "confirm", title: $projectile.captions.tInfo, text: $projectile.captions.removeConfirmation, buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel}, callback: function(a){
            if(a){
                callback(data);
            }
            return true;
        }});
    },
    btnLoading: function(el, a){
        if(!a){
            el.addClass('disabled animated pulse infinite'); 
        }else{
            el.removeClass('disabled animated pulse infinite'); 
        }
    },
    defaultSort: function(a, b){
        return +new Date(a.created) - +new Date(b.created);
    },
    items_selected: [],
    views: {
        list: {
                rightSide: '<div class="table-container files-items-table">\
                                <div class="table-heading filter-list-mode">\
                                    <div class="table-col" style="width:1px"><input type="checkbox" class="file-item-check" id="files-item-all" disabled><label for="files-item-all"></label></div>\
                                    <div class="table-col"><a class="selected" data-sort="name">'+$projectile.captions.tName+'</a></div>\
                                    <div class="table-col"><a data-sort="size">'+$projectile.captions.tSize+'</a></div>\
                                    <div class="table-col"><a data-sort="date">'+$projectile.captions.tDate+'</a></div>\
                                    <div class="table-col"><a data-sort="user">'+$projectile.captions.tUser+'</a></div>\
                                    <div class="table-col">'+$projectile.captions.tComment+'</div>\
                                    <div class="table-col">'+$projectile.captions.tActions+'</div>\
                                </div>\
                                <div class="table-body files-items-list"></div>\
                            </div>\
                            <p class="jFiler-emptyMessage" align="center">- '+$projectile.captions.noFiles+' -</p>'
            },
            grid: {
                rightSide: '<ul class="files-items-list list-inline"><p class="jFiler-emptyMessage" align="center">- '+$projectile.captions.noFiles+' -</p></ul>'
            }   
    }
}

$projectile._config._filerOpts = {
        limit: null,
        maxSize: null,
        extensions: null,
        changeInput: '<div class="jFiler-input-dropDown"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>'+$projectile.captions.dragDropFiles+'</h3> <span class="margin15">'+$projectile.captions.or+'</span></div><a class="jFiler-input-choose-btn blue">'+$projectile.captions.browseFiles+'</a></div></div>',
        showThumbs: true,
        appendTo: '.right-side',
        theme: 'thumbnails',
        templates: {
            thumbs: null,
            item: '',
            itemAppended: '',
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
            success: function(data, el, l, o, p, s){},
            error: function(el){},
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
            //$('.files-items-list').after('<p class="jFiler-emptyMessage" align="center">- No files Uploaded -</p>');
        },
        captions: {
            button: $projectile.captions.browseFiles,
            feedback: $projectile.captions.noFilesSelected,
            feedback2: $projectile.captions.files,
            drop: "Drop file here to Upload",
            errors: {
                filesLimit: "Only {{fi-limit}} files are allowed to be uploaded.",
                filesType: "Only Images are allowed to be uploaded.",
                filesSize: "{{fi-name}} is too large! Please upload file up to {{fi-maxSize}} MB.",
                filesSizeAll: "Files you've choosed are too large! Please upload files up to {{fi-maxSize}} MB."
            }
        }
}

$(function(){
    
    /* fix <header> */
    $(window).scroll(function(){
        $('#header .header-fixed, .left-side .left-side-bg').css({
            'left': - $(this).scrollLeft()
        });
    });
    
    /*
        Sort Items
    */
    $('body').on('click', '.filter-list-mode:not(.disabled) a[data-sort]', function(e){
        e.preventDefault();
        
        var inverted = false;
        
        if($(this).hasClass("inverted")){ inverted = true; $(this).removeClass('inverted'); }else{ $(this).addClass('inverted') }
        $('.filter-list-mode a[data-sort]').removeClass('selected');
        
        var el = $(this),
            attr = el.attr("data-sort"),
            sortBy = function(a, b){
                switch(attr){
                    case "name":
                        return $(a).attr("data-file-name").toUpperCase().localeCompare($(b).attr("data-file-name").toUpperCase());
                    break;
                    case "size":
                        return $(a).attr("data-file-size") - +$(b).attr("data-file-size")
                    break;
                    case "user":
                        return $(a).attr("data-file-user").toUpperCase().localeCompare($(b).attr("data-file-user").toUpperCase());
                    break;
                    case "date":
                        return +new Date($(a).attr("data-file-date")) - +new Date($(b).attr("data-file-date"));
                    break;

                }
            },
            sort = $($projectile._config.list_selector + " " + $projectile._config.item_selector).sort(function(a,b){
                return sortBy(a, b);
            });
        
        if(inverted){
            sort = sort.toArray().reverse();   
        }
        
        $($projectile._config.list_selector).stop(true,true).fadeOut(250, function(){
            $($projectile._config.list_selector + " " + $projectile._config.item_selector).remove();
            
            $($projectile._config.list_selector).append(sort);
            
            $(this).fadeIn(250);  
        });
        
        $(".filter-list-mode a[data-sort='"+attr+"']").addClass('selected');
    });
    
    /* 
        Filter Items
    */
    $('body').on('click', '.filter-list-type:not(.disabled) li a[data-type]', function(e){
        e.preventDefault();
        $('.filter-list-type li').removeClass('selected');
        $(this).closest('li').addClass('selected');
        
        var el = $(this),
            attr = el.attr("data-type");
        $($projectile._config.list_selector).stop(true,true).fadeOut(250, function(){
            var sort = $.grep($($projectile._config.list_selector + " " + $projectile._config.item_selector), function(a, b){
                    if(attr == "*"){return true;}
                    return $(a).attr("data-file-type") == attr; 
            });
            $($projectile._config.list_selector + " " + $projectile._config.item_selector).hide();
            $(sort).show();
            $(this).fadeIn(250);  
        });
    });
    
    /* 
        Item Select Action 
    */
    $('body').on('change', $projectile._config.item_selector + " input.file-item-check", function(e){
        var id = $(this).attr("id"),
            el = $(this).closest($projectile._config.item_selector),
            ul = ".items-manipulation";
        if($projectile._config.items_selected.length <= 0 || $.inArray(id, $projectile._config.items_selected) <= -1) {
            $projectile._config.items_selected.push(id);
            $(ul).show();
            $(ul).find("li:first-child i.num").text($projectile._config.items_selected.length);
        }else{
            $projectile._config.items_selected = $.grep($projectile._config.items_selected, function(value) {
                return value != id;
            });
            $(ul).find("li:first-child i.num").text($projectile._config.items_selected.length);
            if($projectile._config.items_selected.length <= 0){
                $(ul).hide();      
            }
        }
    });
    
    /* 
        Selected items Manipulation 
    */
    $('body').on('click', ".items-manipulation li a[class]", function(e){
        e.preventDefault();
        var current = $(this).attr("class");
        if(!$projectile._config.items_selected || $projectile._config.items_selected.length <= 0){return false}
        switch(current){
            case "all-archive-action":
                
            break;
            case "all-lock-action":
                modal({type: "prompt", title: $projectile.captions.tPrompt, text: $projectile.captions.lockText+":", buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel}, callback: function(comment){
                    if(!comment){ modal({type: "warning", title: $projectile.captions.tInfo, text: $projectile.captions.lockCommentEmpty+"!", buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel},}); return true }
                    for(key in $projectile._config.items_selected){
                        var val = $projectile._config.items_selected[key],
                            data = $.grep($projectile.files, function(a,b){
                                return a.fId == val.substring(11);
                            });
                        data[0]._lockComment = comment;
                        
                        $projectile._config.lockService(data[0]);
                    }
                    
                    location.reload();
                    return true;
                }});
            break;
            case "all-trash-action":
                modal({type: "confirm", title: $projectile.captions.tConfirm, text: $projectile.captions.removeConfirmation, buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel}, callback: function(answear){
                    if(answear){
                        for(var key=0; key<$projectile._config.items_selected.length; key++){
                            var val = $projectile._config.items_selected[key],
                                data = $.grep($projectile.files, function(a,b){
                                    return a.fId == val.substring(11);
                                }),
                                el = $('[data-file-revisionid="'+data[0].rId+'"]');
                            $('input#filer1').trigger("filer.removeFile", {fileEl: el, fileData: data[0]});
                            
                            if($projectile._config.items_selected.length-(key+1) <= 0){
                                $(".items-manipulation").hide();
                            }else{
                                $(".items-manipulation").find("li:first-child i.num").text($projectile._config.items_selected.length-(key+1));
                            }
                        }
                        
                        $projectile._config.items_selected = [];
						$('.file-item-check').prop('checked', false);
                        $(".items-manipulation").hide();
                    }
                }});
            break;
        }
    });
    
    /* 
        Item lock Action 
    */
    $('body').on('click files-item.lock', $projectile._config.item_selector + " .item-lock-action", function(e){
        e.preventDefault();
        var id = $(this).closest($projectile._config.item_selector).attr("data-file-orderKey"),
            el = $(this),
            data = $.grep($projectile.files, function(a,b){
                return a.orderKey == id;
            });
        if(!data[0]){return false}
        $projectile._config.btnLoading(el);
        if(data[0].locked){
            data[0]._lockComment = null;
            
            $projectile._config.lockService(data[0],function(){
                notify({
                    title: $projectile.captions.tInfo,
                    message: $projectile.captions.unlockMessage,
                    icon: "<i class=\"icon-jfi-unlock\"></i>",
                    theme: "dark-theme",
                    closeBtn: false,
                    autoHide: true,
                    position: {x: "right", y: "top"}
                });
                $projectile._config.btnLoading(el,true);
                el.off('click').removeClass("icon-jfi-unlock").addClass("icon-jfi-lock").attr("title", $projectile.captions.lock);
            });
        }else{
            modal({type: "prompt", title: $projectile.captions.tPrompt, text: $projectile.captions.lockText+":", buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel}, callback: function(comment){
                    if(!comment){ $projectile._config.btnLoading(el,true); modal({type: "warning", title: $projectile.captions.tInfo, text: $projectile.captions.lockCommentEmpty+"!", buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel}}); return true }
                data[0]._lockComment = comment;
                $projectile._config.btnLoading(el);        
                $projectile._config.lockService(data[0], function(){
                    notify({
                        title: $projectile.captions.tInfo,
                        message: $projectile.captions.lockMessage,
                        icon: "<i class=\"icon-jfi-lock\"></i>",
                        theme: "dark-theme",
                        closeBtn: false,
                        autoHide: true,
                        position: {x: "right", y: "top"}
                    });
                    $projectile._config.btnLoading(el,true);
                    el.removeClass("icon-jfi-lock").addClass("icon-jfi-unlock").attr("title", $projectile.captions.unlock);
                });
                return true;
            }});
        }
    });
    
    /* Item comment change Action */
    $("body").on("click", $projectile._config.item_selector + " a.item-change-comment-action", function(e){
        e.preventDefault();
        var id = $(this).closest($projectile._config.item_selector).attr("data-file-revisionid"),
            fId = $(this).closest($projectile._config.item_selector).attr("data-file-id"),
            el = $(this),
            isRevision = null,
            data = $.grep($projectile.files, function(a,b){
                if(a.fId == fId && a.rId != id){
                    isRevision = b;
                }else{
                    return a.rId == id;
                }
            });
        if(isRevision != null){
            data = $.grep($projectile.files[isRevision].revisions, function(a,b){
                return a.rId == id;
            });
        }
        
        data = data[0];
        
        if(!data){return false}
        modal({
            title: $projectile.captions.change_comment,
            text: "<label>"+$projectile.captions.tComment+"</label><textarea class='form-control' rows='6' id='file_comment_field_9'>"+(data.comment ? data.comment : "")+"</textarea>",
            center: false,
            buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel},
            callback: function(a, b){
                if(a){
                    data.comment = b.find("textarea#file_comment_field_9").val();
                    $projectile._config.editService(data, function(){
                        el.closest($projectile._config.item_selector).find(".file-comment").html(data.comment);
                    });
                }
                return true;
            }
        });
    });
    
    /* 
        View Swither
    */
    $('body').on('click', ".view-switcher li a[class]", function(e){
        e.preventDefault();
        var current = $(this).attr("class");
        if($(this).hasClass("selected")){return true}
        switch(current){
            case 'list-view':
                $projectile.storage("ViewMode", "list");
            break;
            case 'grid-view':
                $projectile.storage("ViewMode", "grid");
            break;
        }
        location.reload();
    });
    
    var viewMode = function(){
        var _c = $projectile._config.views,
            mode = $projectile.viewMode;
        if(!_c[mode]){ mode = "list"}
        
        $('.view-switcher').find("a."+mode+"-view").addClass("selected");
        
        /* important */
        $('.projectile-filer').addClass(mode + "-view");
        $('.right-side div:first-child').html(_c[mode].rightSide);
    }
    
    viewMode();
    
    /*
        List View - Thumbnail
    */
    if($projectile.viewMode == 'list'){
        $('body').on('mouseenter mousemove blur mouseout', $projectile._config.item_selector + '[data-file-type="image"] a.files-item-title', function(e){
            var title = $(this),
                parent = title.closest($projectile._config.item_selector),
                tooltip = parent.find('div.files-item-tooltip-image'),
                isVisible = tooltip.is(':visible'),
                id = parseInt(parent.attr("data-file-orderkey"));
            
            title.removeAttr("title");
            
            e.offsetX = e.offsetX==undefined?e.pageX - title.offset().left:e.offsetX;
            e.offsetY = e.offsetY==undefined?e.pageY - title.offset().top:e.offsetY;
            
            var setPosition = function(e, title, tooltip){
                tooltip.css({
                    left: title.offset().left + e.offsetX - $(window).scrollLeft(),
                    top: title.offset().top + e.offsetY - $(window).scrollTop()
                });
                
                //fix top
                if(tooltip.offset().top+tooltip.outerHeight() > $(window).height()){
                    tooltip.css({
                        top: title.offset().top + e.offsetY/2 - 3 - title.outerHeight() - tooltip.outerHeight() - $(window).scrollTop()
                    });
                }                
                if(tooltip.offset().top - $(window).scrollTop() < 0){
                    tooltip.css({
                        top: 3
                    });
                }
                
                //fix left
                if(tooltip.offset().left+tooltip.outerWidth() > $(window).width()){
                    tooltip.css({
                        left: title.offset().left + e.offsetX/2 - 3 - tooltip.outerWidth() - $(window).scrollLeft()
                    });
                }                
                if(tooltip.offset().left - $(window).scrollLeft() < 0){
                    tooltip.css({
                        left: 3
                    });
                }
            };
            
            switch(e.type){
                case 'mouseenter':
                    if(!isVisible){
                        window['lsvto42'+id] = setTimeout(function(title, tooltip){
                            $.each($(".files-item-tooltip-image"), function(a, b){
                                 $(b).hide();
                            });
                            if(title.is(':hover')){
                                tooltip.show();
                                setPosition(e, title, tooltip);
                            }
                        }, 540, title, tooltip);
                    }
                break;
                case 'mousemove':
                    setPosition(e, title, tooltip);
                break;
                case 'blur':
                case 'mouseout':
                    clearTimeout(window['lsvto42'+id]);
                    tooltip.hide();
                break;
            }
        });
    }
});