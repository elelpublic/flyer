$(function(){
    var filer = {
        list: ".files-items-list",
        item: ".files-item",
        selected: []
    };
    
    /* fixed header */
    $(window).scroll(function(){
        $('#header .header-fixed, .left-side .left-side-bg').css({
            'left': - $(this).scrollLeft()
        });
    });
    
    /*
        Big file info
    */
    $('body').on('click', 'a.item-thumb-info',function(){
        $(this).closest('li.files-item').toggleClass('file-big-info');
    });
    $('body').on('click', '.item-thumb-overlay-info-close',function(){
        $(this).closest('li.files-item').removeClass('file-big-info');
    });
    
    /*
        Sort
    */
    $('body').on('click', '.filter-list-mode li a', function(e){
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
        Type filter
    */
    $('body').on('click', '.filter-list-type li a', function(e){
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
        Lock Action 
    */
    $('body').on('click files-item.lock', filer.item + " .item-lock-action", function(e){
        e.preventDefault();
        var id = $(this).closest(filer.item).attr("data-file-orderKey"),
            el = $(this),
            data = $.grep($projectile.files, function(a,b){
                return a.orderKey == id;
            });
        if(data[0].locked){
            $projectile.file.lock(data[0], null);
            notify({
                title: "Info",
                message: "File was unlocked",
                icon: "<i class=\"icon-jfi-unlock\"></i>",
                theme: "dark-theme",
                closeBtn: false,
                autoHide: true,
                position: {x: "right", y: "top"}
            });
            el.removeClass("icon-jfi-unlock").addClass("icon-jfi-lock");
        }else{
            modal({type: "prompt", title: "Prompt", text: "Please, write a comment why are you locking this file:", callback: function(comment){
                 if(!comment){ modal({type: "warning", title: "Info", text: "Comment can not be empty! Please write a comment!"}); return false}
                $projectile.file.lock(data[0], comment);
                notify({
                    title: "Info",
                    message: "File was locked",
                    icon: "<i class=\"icon-jfi-lock\"></i>",
                    theme: "dark-theme",
                    closeBtn: false,
                    autoHide: true,
                    position: {x: "right", y: "top"}
                });
                el.removeClass("icon-jfi-lock").addClass("icon-jfi-unlock");
            }});
        }
    })
    /* 
        Select Action 
    */
    $('body').on('change', filer.item + " input.file-item-check", function(e){
        var id = $(this).attr("id"),
            ul = ".items-manipulation";
        if(filer.selected.length <= 0 || $.inArray(id, filer.selected) <= -1) {
            filer.selected.push(id);
            $(ul).show();
            $(ul).find("li:first-child i.num").text(filer.selected.length);
        }else{
            filer.selected = $.grep(filer.selected, function(value) {
                return value != id;
            });
            $(ul).find("li:first-child i.num").text(filer.selected.length);
            if(filer.selected.length <= 0){
                $(ul).hide();      
            }
        }
    });
    
    /* items manipulation */
    $('body').on('click', ".items-manipulation li a[class]", function(e){
        e.preventDefault();
        var current = $(this).attr("class");
        if(!filer.selected || filer.selected.length <= 0){return false}
        switch(current){
            case "all-archive-action":
                
            break;
            case "all-lock-action":
                modal({type: "prompt", title: "Prompt", text: "Please, write a comment why are you locking this file:", callback: function(comment){
                    if(!comment){ modal({type: "warning", title: "Info", text: "Comment can not be empty! Please write a comment!"}); return false}
                    for(key in filer.selected){
                        var val = filer.selected[key],
                            data = $.grep($projectile.files, function(a,b){
                                return a.fId == val.substring(11);
                            });
                        
                        $projectile.file.lock(data[0], comment);
                    }
                    
                    location.reload();
                }});
            break;
            case "all-trash-action":
                modal({type: "confirm", title: "Confirm", text: "Are you sure you want to remove selected files?", callback: function(answear){
                    if(answear){
                        for(var key=-1; key<=filer.selected.length; key++){
                            key = key == -1 ? 0 : key - 1;
                            var val = filer.selected[key],
                                data = $.grep($projectile.files, function(a,b){
                                    return a.fId == val.substring(11);
                                }),
                                el = $('[data-file-revisionid="'+data[0].rId+'"]');
                            $('input#filer1').trigger("filer.removeFile", {fileEl: el, fileData: data[0]});
                            
                            var idx = filer.selected[key];
                            if (idx) {
                                filer.selected.splice(key, 1);
                            }
                        }
                        $(".items-manipulation").hide();
                    }
                }});
            break;
        }
    });
});