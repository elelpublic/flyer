/*
    .projectile-filer
        | [data-filer-type]
            | 0 : not defined
            | 1 : used for iframe (default)
            | 2 : used for custom html, which supports {{}} tags
        | [data-filer-theme]
            | 0 : list view (default)
            | 1 : tablew view
            | 2 : all in {drag&drop, thumbnails, filters...}
        | [data-filer-set-]
            | custom parameters for jquery.filer
*/
(function(){
    var f = {
        u: "/flyer/",
        restUrl: "/flyer/",
        folder: null,
        s: [],
        captions: {
            newEntry: "Flyer|New entry",
            lock: "System|Lock",
            unlock: "System|Unlock",
        },
        
        init: function(){
            var element = document.querySelectorAll("[class^='projectile-filer']");
            if(!element || element.length <= 0){
                return false;
            }else{
                f.s.push( {t: "filer", el: element[0]} );  
            }
            
            f.load();
            f.customize();
        },
        
        customize: function() {
            var el = f.s[0].el,
                attr = function(name) {
                    var a = el.getAttribute(name);
                    if(!a || typeof a == "undefined") { return false; } else { return a.toString(); } 
                };
            if(attr("data-filer-type")){
                switch(attr("data-filer-type")){
                    case "1":
                        f.load("1");
                    break;
                    case "2":
                        f.load("2");
                    break;
                }
            }
            if(attr("data-filer-theme")){
                switch(attr("data-filer-theme")){
                    case "0":
                        f.load("list");
                    break;
                    case "1":
                        f.load("table");
                    break;
                    case "2":
                        f.load("thumbs");
                    break;
                }
            }
            
            f.folder = (f.s[0].el.getAttribute('data-filer-folderId') ? f.s[0].el.getAttribute('data-filer-folderId') : f.getParameterByName('list', true));
        },
        
        check: function() {
            
        },

        getStyles: function(href) {
            var headHTML = document.getElementsByTagName('head')[0].innerHTML,
                src = f.u + href;
            headHTML += '<link type="text/css" rel="stylesheet" href="'+ src +'">';
            document.getElementsByTagName('head')[0].innerHTML = headHTML;
        },

        getScript: function(href) {
            var script = document.createElement('script');
            script.type = "text/javascript";
            script.src = f.u + href;
            script.async = false;
            document.getElementsByTagName('head')[0].appendChild(script);
        },

        getParameterByName: function(name, hash) {
            if(!name){ return; }
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&\/]" + name + "/([^&#\/]*)"),
                results = regex.exec((!hash ? location.search : location.hash));
            return results === null ? false : decodeURIComponent(results[1].replace(/\+/g, " "));
        },
        
        preloader: function(event) {
            event = (!event ? "show" : "hide");
            var preloader = document.body.getElementsByClassName('preloader');
            
            if (preloader && preloader.length > 0) {
                function fadeOut(el) {
                    el.style.opacity = 1;
                    var last = +new Date();
                    var tick = function() {
                        el.style.opacity = +el.style.opacity - (new Date() - last) / 400;
                        last = +new Date();
                        if (+el.style.opacity > 0) {
                            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                        } else {
                            preloader[0].parentNode.removeChild(preloader[0]);
                        }
                    };
                    tick();
                }
                fadeOut(preloader[0]);
            }
            
            if(event == "hide") { return; }
            document.body.innerHTML = document.body.innerHTML + '<div class="preloader"><span><img src="images/icons/loading.gif"></span></div>';
        },

        load: function(type) {
            if(!type){
                if (typeof jQuery == "undefined") { f.getScript("bower_components/jquery/jquery.min.js"); }
                f.getScript("js/jquery.filer.js");
                if(typeof modal == "undefined") { f.getStyles("css/plugins/jquery.modal.css"); f.getScript("js/jquery.modal.min.js"); }
                if(typeof notify == "undefined") { f.getStyles("css/plugins/jquery.notify.css"); f.getScript("js/jquery.notify.min.js"); }
                f.getStyles("css/plugins/jquery.dropdown.css"); f.getScript("js/jquery.dropdown.min.js");
            }
            if(type == "1") {
                f.getStyles("css/plugins/jquery.filer.css");
            }
            if(type == "2") {
                f.getStyles("css/plugins/jquery.filer.css");
            }
            if(type == "list") {
                f.getStyles("templates/list/css/jquery.filer-table.css");
                f._ajax(f.u + "templates/list/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/list/js/scripts.js");
                    f.getScript("templates/list/js/custom.js");
                });    
            }
            if(type == "table") {
                f.getStyles("templates/table/css/jquery.filer-table.css");
                f._ajax(f.u + "templates/table/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/table/js/scripts.js");
                    f.getScript("templates/table/js/custom.js");
                });
            }
            if(type == "thumbs") {
                f.getStyles("templates/thumbnails/css/jquery.filer-thumbnails.css");
                f._ajax(f.u + "templates/thumbnails/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/thumbnails/js/scripts.js");
                    f.getScript("templates/thumbnails/js/custom.js");
                });
            }
        },
        
        file: {
            lock: function(data, comment){
                if(!data.locked){
                    var params = {
                        locked: true,
                        lockComment: comment
                    }
                    f._ajax(f.restUrl + "rest/api/json/0/filehistories/" + data.fId, 'PUT', params, function(r){
                        data.locked = true
                    });
                }else{
                    var params = {
                        locked: false,
                    }
                    f._ajax(f.restUrl + "rest/api/json/0/filehistories/" + data.fId, 'PUT', params, function(r){
                        data.locked = false
                    });   
                }
            },
            remove: function(data){
                f._ajax(f.restUrl + "rest/api/json/0/filerevisions/" + data.rId, 'DELETE');
            },
            archive: function(){
                
            },
        },
        
        getFiles: function(folder, callback) {
            var files = [],
                id = (folder && typeof folder == "string" ? folder : f.folder);
            f._ajax(f.restUrl + "rest/api/json/0/filehistories?folder=" + id, 'GET', {}, function(r){
                if(r.Entries && r.Entries.length > 0){
                    var total = r.Entries.length,
                        s = 0;
                    for(key in r.Entries){
                        var val = r.Entries[key];
                        val.orderKey = key;
                        f._ajax(f.restUrl + "rest/api/json/0/filerevisions?fileHistory=" + val.id, 'GET', {a: val}, function(r2, b){
                            r2.Entries[0].fId = b.id;
                            r2.Entries[0].locked = b.locked;
                            r2.Entries[0].lockComment = b.lockComment || null;
                            r2.Entries[0].lockedBy = b.lockedBy || null;
                            r2.Entries[0].lockedByName = b.lockedByName || null;
                            r2.Entries[0].lockTime = b.lockTime || null;
                            r2.Entries[0].revisions = b.revisions;
                            r2.Entries[0].orderKey = b.orderKey;
                            
                            files.push(r2.Entries[0]);
                            s++;
                            if(s>=total){
                                files = files.sort(function(a,b){
                                    return +b.orderKey - +a.orderKey;
                                });
                                f.files = files;
                                (folder && typeof folder == "function" ? folder(files) : (callback && typeof callback == "function" ? callback(files) : null));
                            }
                        }, "json");  
                    }    
                }else{
                    (folder && typeof folder == "function" ? folder(files) : (callback && typeof callback == "function" ? callback(files) : null));
                }
            }, "json");
        },
        
        getCaptions: function(callback) {
            var captions = f.captions,
                data = "",
                first = true;
            for(key in captions){
                var value = captions[key],
                    param = (first ? '?' : '&');
                data += param + 'id=' + value;
                first = false;
            }
            
            f._ajax(f.restUrl + "rest/api/json/0/captions" + data, 'GET', {}, function(r){
                var i = 0;
                for(key in captions){
                    captions[key] = r.Entries[i].translation.replace(/:\s*$/, ""); //removes last :
                    i++;
                }
                f.captions = captions;
                callback(captions);
            }, "json");
        },
        
        _ajax: function(url, type, data, callback, dataType) {
            var request = new XMLHttpRequest(),
                data = (!data || f.isEmptyObj(data) ? false : data),
                serialize = function(obj) {
                  var str = [];
                  for(var p in obj)
                    if (obj.hasOwnProperty(p)) {
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                  return str.join("&");
                };
            
            request.open(type, url, true);

            request.onload = function() {
                if (request.status >= 200 && request.status < 400){
                    resp = request.responseText;
                    if(dataType && dataType == "json"){
                        resp = JSON.parse(resp);   
                    }
                    if(callback && typeof callback == "function"){
                        callback(resp, data.a);   
                    }
                }
            };

            request.onerror = function() {
                location.href = f.u + "404.html";
            };
            
            if(data){
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }
            
            request.send((data ? serialize(data) : ""));   
        },
        
        ready: function(callback) {
            var isFinished = [];
            f.getFiles(function(){isFinished.push("getFiles"); allDone()});
            f.getCaptions(function(){isFinished.push("getCaptions"); allDone()});
            
            function allDone() {
                if(isFinished.length < 2) return;
                f.preloader("hide");
                callback(f);
            }
        },
        
        dateFormat: function(date) {
            date = !date ? new Date() : new Date(date);
            var d = {
                day: date.getDay(),
                month: date.getMonth(),
                year: date.getFullYear(),
                hours: date.getHours(),
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
            };
            for(key in d){
                if(parseInt(d[key]) <= 9){
                    d[key] = "0" + d[key].toString();    
                }
            }
            return d.hours+":"+d.minutes+":"+d.seconds+" "+d.day+"."+d.month+"."+d.year;
        },
        
        isEmptyObj: function (obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        errorReport: function(msg) {
            console.log(msg);
        }
    };

    f.init();
    window.$projectile = f;
})();