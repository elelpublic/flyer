/*
    .projectile-filer
        | [data-filer-theme]
            | 1 : inline tabble-view
            | 2 : own page
        | [data-filer-set-]
            | custom parameters for jquery.filer
*/
(function(){
    var bsm = window.top && window.top.bsm || window.bsm;
    var f = {
        version: "0.1.24",
        u: window.self !== window.top || true ? "/projectile/apps/flyer/" : "/flyer/", // source directory
        restUrl: window.self !== window.top || true ? "/projectile/restapps/flyer/" : "/flyer/rest/", // rest request url
        clientId: bsm ? bsm.clientId : '0',
        folder: null,
        s: [],
        captions: {
            Flyer: "Flyer|Flyer",
			home: "Flyer|Homedir",
            file: "Flyer|File",
            files: "Flyer|Files",
            lock: "Tooltip|Lock",
            unlock: "Tooltip|Unlock",
            sortBy: "Tooltip|Sort",
            listView: "Flyer|ListView",
            gridView: "Flyer|GridView",
            filesSelected: "Flyer|Files selected",
            selectAll: "Document|Select all",
            remove: "Tooltip|Delete",
            tName: "Document|Title",
            tSize: "Document|Size",
            tDate: "Document|Date",
            tUser: "Document|User",
            tComment: "Document|Comment",
            tActions: "Document.Plural|Action",
            commentLeave: "Flyer|Please enter a comment",
            filter: "Default|Filter",
            errorTitle: "System|Error",
            errorText: "Access|Access denied",
            removeConfirmation: "${Phrases:Really delete $0 ?}:::${Flyer:File}",
            noFiles: "Flyer|No files available",
            noFilesSelected: "Flyer|No file selected",
            dragDropFiles: "Flyer|Drag and Drop Files Here",
            or: "Application|or",
            browseFiles: "Flyer|Browse Files",
            tPrompt: "System|Hint",
            lockText: "Flyer|Please enter a reason for locking",
            tInfo: "System|Hint",
            lockCommentEmpty: "Flyer|Please enter a comment",
            lockDenied: "${Flyer:File '$0' is locked by $1 at $2. Comment was '$3'}",
            tConfirm: "System|Hint",
            archive: "Action|Archive",
            download: "Defaulft|Download",
            success: "Document|Success",
            versions: "Document|History",
            infoShow: "Default|Info",
            back: "System|Back",
            unlockMessage: "Flyer|File was unlocked",
            lockMessage: "Flyer|File was locked",
            change_comment: "Application|Comment",
            ok: "Document|OK",
            yes: "Document|Yes",
            no: "Tooltip|No",
            cancel: "Document|Cancel",
            openFile: "Document|Open",
			uploading: "Flyer|Uploading",
            today: "System|Today",
            yesterday: "System|Yesterday",
            day_0: "WeekdayShort|0",
            day_1: "WeekdayShort|1",
            day_2: "WeekdayShort|2",
            day_3: "WeekdayShort|3",
            day_4: "WeekdayShort|4",
            day_5: "WeekdayShort|5",
            day_6: "WeekdayShort|6"
        },

        init: function(){
            var element = document.querySelectorAll("[class^='projectile-filer']");
            if(!element || element.length <= 0){
                return false;
            }else{
                f.s.push( {t: "filer", el: element[0]} );
            }

            f.load();

            f.getCaptions(function(){
                f.customize();
            });
        },

        customize: function() {
            var el = f.s[0].el,
                attr = function(name) {
                    var a = el.getAttribute(name);
                    if(!a || typeof a == "undefined") { return false; } else { return a.toString(); }
                };

            f.folder = (f.s[0].el.getAttribute('data-filer-folderid') ? f.s[0].el.getAttribute('data-filer-folderid') : f._location.getParameter('list'));

            if(attr("data-filer-theme")){
                switch(attr("data-filer-theme")){
                    case "1":
                        f.load("inline");
                    break;
                    case "2":
                        f.load("ownpage");
                    break;
                }
            }
        },

        getStyles: function(href) {
            var link = document.createElement("link"),
                src = f.u + href,
                head = document.head || document.getElementsByTagName('head')[0];
            link.href = src;
            link.rel = "stylesheet";
            link.type = "text/css";
            head.appendChild(link);
        },

        getScript: function(href) {
            var script = document.createElement('script'),
            	head = document.head || document.getElementsByTagName('head')[0];
            script.type = "text/javascript";
            script.src = f.u + href + "?v=" + f.version;
            script.async = false;
            head.appendChild(script);
        },

        _location: {
            addParameter: function(key, value, sourceURL){
                var sourceURL = (sourceURL ? sourceURL : location.href),
                    separator = (sourceURL.indexOf('?') > -1 ? "&" : "?");
                if(f._location.getParameter(key)){
                    sourceURL = f._location.removeParameter(key)
                }
                return sourceURL + separator + key + "=" + value;
            },
            removeParameter: function(key, sourceURL){
                var sourceURL = (sourceURL ? sourceURL : location.href),
                    rtn = sourceURL.split("?")[0],
                    param,
                    params_arr = [],
                    queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
                if (queryString !== "") {
                    params_arr = queryString.split("&");
                    for (var i = params_arr.length - 1; i >= 0; i -= 1) {
                        param = params_arr[i].split("=")[0];
                        if (param === key) {
                            params_arr.splice(i, 1);
                        }
                    }
                    rtn = rtn + "?" + params_arr.join("&");
                }
                return rtn;
            },
            getParameter: function(name, hash){
                if(!name){ return; }
                name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
                var regexS = "[\\?&\/]"+name+"[=\/]([^&#]*)",
                    regex = new RegExp( regexS ),
                    results = regex.exec( (!hash ? location.href : location.hash) );
                if( results == null )
                    return false;
                else
                    return decodeURIComponent(results[1].replace(/\+/g, " "));
            },
            redirect_to: function(url){
                location.href = url;
            }
        },

        preloader: function(event) {
            event = (!event ? "show" : "hide");
            var preloader = document.body.getElementsByClassName('preloader');

            if (preloader && preloader.length > 0) {
                preloader[0].parentNode.removeChild(preloader[0]);
            }

            if(event == "hide") { return; }
            document.body.innerHTML = document.body.innerHTML + '<div class="preloader"><span><img src="images/icons/loading.gif"></span></div>';
        },

        load: function(type) {
            if(!type){
                if (typeof jQuery == "undefined") { f.getScript("bower_components/jquery/jquery.min.js"); }
                f.getScript("js/jquery.filer.js");
				f.getStyles("css/plugins/jquery.filer.css");
                if(typeof modal == "undefined") { f.getStyles("bower_components/jquery.modal/css/jquery.modal.css"); f.getScript("bower_components/jquery.modal/js/jquery.modal.min.js"); }
                if(typeof notify == "undefined") { f.getStyles("bower_components/jquery.notify/css/jquery.notify.css"); f.getScript("bower_components/jquery.notify/js/jquery.notify.min.js"); }
                f.getStyles("bower_components/jquery.dropdown/css/jquery.dropdown.css"); f.getScript("bower_components/jquery.dropdown/js/jquery.dropdown.min.js");
            }
            if(type == "inline") {
                f.getStyles("templates/inline/css/jquery.filer-inline.css");
                f._ajax(f.u + "templates/inline/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/inline/js/scripts.js");
                    f.getScript("templates/inline/js/custom.js");
                });
            }
            if(type == "ownpage") {
                f.getStyles("templates/ownpage/css/jquery.filer-ownpage.css");
                f._ajax(f.u + "templates/ownpage/index.html", 'GET', {}, function(r){
                    f.s[0].el.innerHTML = r;
                    f.getScript("templates/ownpage/js/scripts.js");
                    if(f.storage("ViewMode") && f.storage("ViewMode") == "grid"){
						f.getStyles("templates/ownpage/css/custom-view-grid.css");
                        f.getScript("templates/ownpage/js/custom-grid-view.js");
                        $projectile.viewMode = "grid";
                    }else{
						f.getStyles("templates/ownpage/css/custom-view-table.css");
                        f.getScript("templates/ownpage/js/custom-table-view.js");
                        $projectile.viewMode = "table";
                    }
                });
            }
        },

        file: {
            lock: function(data, callback){
                if(!data.locked){
                    var params = {
                        locked: true,
                        lockComment: data._lockComment
                    }
                    f._ajax(f.restUrl + "api/json/" + f.clientId + "/filehistories/" + data.fId, 'PUT', params, function(r){
                        if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
                            data.locked = true
                            r._transfered = true;
                        }else{
                            if(typeof(r) != "object"){r = new Object()}
                            r._transfered = false;
                        }
                        callback(r);

                    }, "json");
                }else{
                    var params = {
                        locked: false,
                    }
                    f._ajax(f.restUrl + "api/json/" + f.clientId + "/filehistories/" + data.fId, 'PUT', params, function(r){
                        if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
                            data.locked = false
                            r._transfered = true;
                        }else{
                            if(typeof(r) != "object"){r = new Object()}
                            r._transfered = false;
                        }
                        callback(r);

                    }, "json");
                }
            },
            edit: function(data, callback){
                var params = {
                    comment: data.comment,
                }
                f._ajax(f.restUrl + "api/json/" + f.clientId + "/filerevisions/" + data.rId, 'PUT', params, function(r){
                    if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
                        r._transfered = true;
                    }else{
                        if(typeof(r) != "object"){r = new Object()}
                        r._transfered = false;
                    }
                    callback(r);

                }, "json");
            },
            remove: function(data, callback){
                var url = "api/json/" + f.clientId + "/filerevisions/" + data.rId;
                if(data.fId && (!data.isVersion || data.revisions)){ url = "api/json/" + f.clientId + "/filehistories/" + data.fId; }
                f._ajax(f.restUrl + url, 'DELETE', null, function(r){
                    if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
                        data.locked = true
                        r._transfered = true;
                    }else{
                        if(typeof(r) != "object"){r = new Object()}
                        r._transfered = false;
                    }
                    callback(r);

                }, "json");
            },
            archive: function(data, callback){
				f._ajax(f.restUrl + "api/json/" + f.clientId + "/filearchives", 'POST', {fileHistoryId: data.fId}, function(r){
					if(r && r.StatusCode && r.StatusCode.CodeNumber.toString()=="0"){
						data.locked = true
						r._transfered = true;
					}else{
						if(typeof(r) != "object"){r = new Object()}
						r._transfered = false;
					}
					callback(r);

				}, "json");
            },
        },

        getFiles: function(folder, callback) {
            var files = [],
                id = (folder && typeof folder == "string" ? folder : f.folder);
            f.files = [];
            f._ajax(f.restUrl + "api/json/" + f.clientId + "/filehistories?folder=" + id, 'GET', {}, function(r){
                if(r.Entries && r.Entries.length > 0 && r.Entries[0]){
                    var total = r.Entries.length,
                        s = 0;
                    for(key in r.Entries){
                        if(!r.Entries[key]){break;}
                        var val = r.Entries[key];
                        val.orderKey = key;
                        f._ajax(f.restUrl + "api/json/" + f.clientId + "/filerevisions?fileHistory=" + val.id, 'GET', {a: val}, function(r2, b){
                            if(r2 && r2.Entries && r2.Entries[0]){
                                r2.Entries[0].fId = b.id;
                                r2.Entries[0].locked = b.locked;
                                r2.Entries[0].lockComment = b.lockComment || null;
                                r2.Entries[0].lockedBy = b.lockedBy || null;
                                r2.Entries[0].lockedByName = b.lockedByName || null;
                                r2.Entries[0].lockTime = b.lockTime || null;
                                r2.Entries[0].revisions = b.revisions;
                                r2.Entries[0].orderKey = b.orderKey;
                                r2.Entries[0].revisions = [];

                                if(r2.Entries.length > 1){
                                    for(var i = 0; i<r2.Entries.length; i++){
                                        r2.Entries[0].revisions.push(r2.Entries[i]);
                                    }
                                }

                                files.push(r2.Entries[0]);
                            }
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

            f._ajax(f.restUrl + "api/json/" + f.clientId + "/captions" + data, 'GET', {}, function(r){
                var i = 0;
                for(key in captions){
                    if(r.Entries && r.Entries[i]){
                        captions[key] = r.Entries[i].translation.replace(/:\s*$/, ""); //removes last :
                    }
                    i++;
                }
                f.captions = captions;
                callback(captions);
            }, "json");
        },

        changeCaptions: function() {
            f.s[0].el.innerHTML = f.s[0].el.innerHTML.replace(/\%captions-(.*?)\%/g, function(match, a){return f.captions[a]});
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
                    if(dataType && dataType == "json" && resp.substr(0,1)!="<"){
                        resp = JSON.parse(resp);
                    }else{
                        if(resp.substr(0, 12) == "<html><head>"){
                            resp = false;
                        }
                    }
                    if(callback && typeof callback == "function"){
                        callback(resp, data.a);
                    }
                }
            };

            request.onerror = function() {
                console.error("Failed to load response data!", arguments);
            };

            if(data){
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            }

            request.send((data ? serialize(data) : ""));
        },

        ready: function(callback) {
            var isFinished = [];
            //f.getCaptions(function(){isFinished.push("getCaptions"); allDone()});
            f.getFiles(function(){isFinished.push("getFiles"); allDone()});

            function allDone() {
                if(isFinished.length < 1) return;
                f.preloader("hide");
                f.changeCaptions();
                callback(f);
            }
        },

        storage: function(name, value){
            if(typeof(Storage) == "undefined") { return false }

            if(name && !value){
                return localStorage.getItem("jFiler-" + name);
            }else if(name && value){
                localStorage.setItem("jFiler-" + name, value);
                return true;
            }else{
                return true;
            }
        },

        dateFormat: function(date, strict) {
			if(!date)
				return '';

            var parts = date.split('T'),
                day = new Date(parts[0]),
                dateParts = parts[0].split('-'),
                timeParts = parts[1].split(':'),
                dateformat = "";

            var d = {
                dayName: f.captions["day_" + day.getDay()],
                day: dateParts[2],
                month: dateParts[1],
                year: dateParts[0],
                hours: timeParts[0],
                minutes: timeParts[1],
                seconds: timeParts[2]
            };

            //date
            if (strict) {
                dateformat = d.dayName + " " + d.day + "." + d.month + "." + d.year;
            } else {
                var today = new Date(),
                    yesterday = new Date(new Date().setDate(today.getDate() - 1));
                if (f.dateEqual(today, day)) {
                    dateformat = f.captions.today;
                } else if (f.dateEqual(yesterday, day)) {
                    dateformat = f.captions.yesterday;
                } else {
                    dateformat = d.dayName + " " + d.day + "." + d.month + "." + d.year;
                }
            }

            return dateformat + " " + d.hours + ":" + d.minutes + ":" + d.seconds;
        },

        dateEqual: function( date1, date2 ) {
        	return date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth() && date1.getDate() == date2.getDate();
        },

        sizeFormat: function(bytes){
            if(bytes == 0) return '0 Byte';
            var k = 1000;
            var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            var i = Math.floor(Math.log(bytes) / Math.log(k));
            return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        },

        isEmptyObj: function (obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        supportDownload : typeof document.createElement('a').download != 'undefined'
        	&& !( navigator.userAgent.indexOf('Linux') != -1
        	&& navigator.userAgent.indexOf('Firefox') != -1 ), // download does not work with linux firefox

        errorReport: function(msg) {
            console.log(msg);
        }
    };

    f.init();
    window.$projectile = f;
})();
