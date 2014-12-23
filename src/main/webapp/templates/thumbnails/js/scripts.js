$projectile._config = {
    input_selector: "input#filer1",
    uploadURL: $projectile.u + 'rest/api/json/0/folderuploads/' + $projectile.folder,
    list_selector: ".files-items-list",
    item_selector: ".files-item",
    remove_item_selector: ".item-trash-action",
    requestErrorMessage: function(a, b){
        return modal({
            type: "error",
            title: "Error",
            text: "Sorry, something is wrong, please try again later"
        });
    },
    lockService: function(data, callback){
        $projectile.file.lock(data, function(r){
            if(r._transfered){
                if(callback){callback(r);}else{return true};
            }else{
                $projectile._config.requestErrorMessage("lock", r);   
            }
        });
    },
    btnLoading: function(el, a){
        if(!a){
            el.addClass('disabled animated pulse infinite'); 
        }else{
            el.removeClass('disabled animated pulse infinite'); 
        }
    },
    items_selected: []
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
    $('body').on('click', '.filter-list-mode:not(.disabled) li a', function(e){
        e.preventDefault();
        $('.filter-list-mode li').removeClass('selected');
        $(this).closest('li').addClass('selected');
        var el = $(this),
            attr = el.attr("data-type"),
            sortBy = function(a, b){
                var attr = el.attr("data-sort");
                switch(attr){
                    case "name":
                        return $(a).attr("data-file-name").toUpperCase().localeCompare($(b).attr("data-file-name").toUpperCase());
                    break;
                    case "size":
                        return +$(a).attr("data-file-size") - +$(b).attr("data-file-size");
                    break;
                    case "user":
                        return $(a).attr("data-file-user").toUpperCase().localeCompare($(b).attr("data-file-user").toUpperCase());
                    break;
                    case "date":
                        return +new Date($(a).attr("data-file-date")) - +new Date($(b).attr("data-file-date"));
                    break;

                }
            },
            sort = $('ul.files-items-list li.files-item').sort(function(a,b){
                return sortBy(a, b);
            });
        $('ul.files-items-list').stop(true,true).fadeOut(250, function(){
            $('ul.files-items-list li.files-item').remove();
            
            $('ul.files-items-list').append(sort);
            
            $(this).fadeIn(250);  
        });
    });
    
    /* 
        Filter Items
    */
    $('body').on('click', '.filter-list-type:not(.disabled) li a', function(e){
        e.preventDefault();
        $('.filter-list-type li').removeClass('selected');
        $(this).closest('li').addClass('selected');
        
        var el = $(this),
            attr = el.attr("data-type");
        $('ul.files-items-list').stop(true,true).fadeOut(250, function(){
            var sort = $.grep($('ul.files-items-list li.files-item'), function(a, b){
                    if(attr == "*"){return true;}
                    return $(a).attr("data-file-type") == attr; 
            });
            $('ul.files-items-list li.files-item').hide();
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
                modal({type: "prompt", title: "Prompt", text: "Please, write a comment why are you locking this file:", callback: function(comment){
                    if(!comment){ modal({type: "warning", title: "Info", text: "Comment can not be empty! Please write a comment!"}); return false }
                    for(key in $projectile._config.items_selected){
                        var val = $projectile._config.items_selected[key],
                            data = $.grep($projectile.files, function(a,b){
                                return a.fId == val.substring(11);
                            });
                        data[0]._lockComment = comment;
                        
                        $projectile._config.lockService(data[0]);
                    }
                    
                    location.reload();
                    
                }});
            break;
            case "all-trash-action":
                modal({type: "confirm", title: "Confirm", text: "Are you sure you want to remove selected files?", callback: function(answear){
                    if(answear){
                        for(var key=-1; key<=$projectile._config.items_selected.length; key++){
                            key = key == -1 ? 0 : key - 1;
                            var val = $projectile._config.items_selected[key],
                                data = $.grep($projectile.files, function(a,b){
                                    return a.fId == val.substring(11);
                                }),
                                el = $('[data-file-revisionid="'+data[0].rId+'"]');
                            $('input#filer1').trigger("filer.removeFile", {fileEl: el, fileData: data[0]});
                            
                            var idx = $projectile._config.items_selected[key];
                            if (idx) {
                                $projectile._config.items_selected.splice(key, 1);
                            }
                        }
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
                    title: "Info",
                    message: "File was unlocked",
                    icon: "<i class=\"icon-jfi-unlock\"></i>",
                    theme: "dark-theme",
                    closeBtn: false,
                    autoHide: true,
                    position: {x: "right", y: "top"}
                });
                $projectile._config.btnLoading(el,true);
                el.removeClass("icon-jfi-unlock").addClass("icon-jfi-lock");
            });
        }else{
            modal({type: "prompt", title: "Prompt", text: "Please, write a comment why are you locking this file:", callback: function(comment){
                    if(!comment){ $projectile._config.btnLoading(el,true); modal({type: "warning", title: "Info", text: "Comment can not be empty! Please write a comment!"}); return false }
                data[0]._lockComment = comment;
                $projectile._config.btnLoading(el);        
                $projectile._config.lockService(data[0], function(){
                    notify({
                        title: "Info",
                        message: "File was locked",
                        icon: "<i class=\"icon-jfi-lock\"></i>",
                        theme: "dark-theme",
                        closeBtn: false,
                        autoHide: true,
                        position: {x: "right", y: "top"}
                    });
                    $projectile._config.btnLoading(el,true);
                    el.removeClass("icon-jfi-lock").addClass("icon-jfi-unlock");
                });
            }});
        }
    });
});