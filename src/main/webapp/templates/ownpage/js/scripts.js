/*
 * flyer configurations
 * default options
 */
$projectile._config = {
    input_selector: "input#filer1",
    uploadURL: $projectile.restUrl + 'api/json/' + $projectile.clientId + '/folderuploads/' + $projectile.folder,
    list_selector: ".files-items-list",
    item_selector: ".files-item",
    remove_item_selector: ".item-trash-action",
    requestErrorMessage: function(a, b, c) {
        var text = $projectile.captions.errorText + "!";

        if (a == "lock" && c && c.locked) {
            text = $projectile.captions.lockDenied.replace("$0", c.fileName).replace("$1", c.lockedByName).replace("$2", $projectile.dateFormat(c.lockTime, true)).replace("$3", c.lockComment);
        }

        return modal({
            type: "error",
            title: $projectile.captions.errorTitle,
            text: text,
            buttonText: {
                ok: $projectile.captions.ok,
                yes: $projectile.captions.yes,
                cancel: $projectile.captions.cancel
            },
        });
    },
    lockService: function(data, callback) {
        $projectile.file.lock(data, function(r) {
            if (r._transfered) {
                if (callback) {
                    callback(r);
                } else {
                    return true
                };
            } else {
                $projectile._config.requestErrorMessage("lock", r, data);
            }
        });
    },
	archiveService: function(data, callback) {
        $projectile.file.archive(data, function(r) {
            if (r._transfered) {
                if (callback) {
                    callback(r);
                } else {
                    return true
                };
            } else {
                $projectile._config.requestErrorMessage("archive", r, data);
            }
        });
    },
    editService: function(data, callback) {
        $projectile.file.edit(data, function(r) {
            if (r._transfered) {
                if (callback) {
                    callback(r);
                } else {
                    return true
                };
            } else {
                $projectile._config.requestErrorMessage("lock", r, data);
            }
        });
    },
    removeAction: function(data, callback) {
        modal({
            type: "confirm",
            title: $projectile.captions.tInfo,
            text: $projectile.captions.removeConfirmation,
            buttonText: {
                ok: $projectile.captions.ok,
                yes: $projectile.captions.yes,
                cancel: $projectile.captions.cancel
            },
            callback: function(a) {
              if (a) {
                  //uncheck files-item-all
                  data.el.find('.file-item-check').prop('checked', false).trigger('change');
                  callback(data);
                }
                return true;
            }
        });
    },
    btnLoading: function(el, a) {
        if (!a) {
            el.addClass('disabled animated pulse infinite');
        } else {
            el.removeClass('disabled animated pulse infinite');
        }
    },
    defaultSort: function(a, b) {
        return +new Date(a.created) - +new Date(b.created);
    },
    items_selected: [],
    views: {
        table: {
            rightSide: '<div class="table-container files-items-table">\
                                <div class="table-heading filter-list-mode">\
                                    <div class="table-col" style="width:50px"></div>\
                                    <div class="table-col"><a class="selected" data-sort="name">' + $projectile.captions.tName + '</a></div>\
                                    <div class="table-col"><a data-sort="size">' + $projectile.captions.tSize + '</a></div>\
                                    <div class="table-col"><a data-sort="date">' + $projectile.captions.tDate + '</a></div>\
                                    <div class="table-col"><a data-sort="user">' + $projectile.captions.tUser + '</a></div>\
                                    <div class="table-col">' + $projectile.captions.tComment + '</div>\
                                    <div class="table-col">' + $projectile.captions.tActions + '</div>\
                                </div>\
                                <div class="table-body files-items-list"></div>\
                            </div>\
                            <p class="jFiler-emptyMessage text-center">' + $projectile.captions.noFiles + '</p>'
        },
        grid: {
            rightSide: '<ul class="files-items-list list-table"></ul><p class="jFiler-emptyMessage text-center">' + $projectile.captions.noFiles + '</p>'
        }
    },
    version_page: function() {
        if (!$projectile._location.getParameter("file") || !$projectile.files || $projectile.files.length == 0) return false;

        var id = $projectile._location.getParameter("file"),
            data = $.grep($projectile.files, function(a, b) {
                return a.fId == id;
            });

        if (!data || !data[0] || !data[0].revisions) return false;
        data = data[0].revisions;

        var current = null;
        for (key in data) {
            var val = data[key];
            val.name = val.fileName;
            val.date = $projectile.dateFormat(val.created);
            val.type = val.mimeType;
            val.file = $projectile.restUrl + "api/binary/" + $projectile.clientId + "/filerevisions/" + val.id;
            val.rId = val.id;
            val.lockTitle = (val.locked ? $projectile.captions.unlock : $projectile.captions.lock);
            val.lockIcon = (val.fId ? '<li><a class="icon-jfi-' + (val.locked ? "unlock" : "lock") + ' item-lock-action dropdown" title="' + (val.locked ? $projectile.captions.unlock : $projectile.captions.lock) + '"></a></li>' : '');
            val.forList = true;
            val.versionsButton = '';
            if (current) {
                val.fId = current.fId
            }

            if (val.fId) {
                current = val
            }
        }

        data.callback = function(list) {
            $('.file-verions-right-side').remove();

            var viewMode = $projectile.viewMode,
                html = $('<div class="col-xs-9 _splr30 _sptG right-side file-verions-right-side"><div>' + $projectile._config.views[viewMode].rightSide + '</div>').hide();

            $('.view-path').empty();
            $(".view-path").css('max-width', $('.folder-manipulation').position().left - $('.view-path').position().left - 20);
            $('.view-path').append('<li><a class="versions-back-button" title="' + $projectile.captions.back + '"><i class="icon-jfi-arrow-left"></i></a></li>');
            $('.view-path').append('<li title="' + data[0].name + '">' + data[0].name + '</li>');

            html.find("input.file-item-check").remove();

            for (key in list) {
                var val = list[key];

                if (viewMode == 'grid') {
                    val.find(".item-assets-normal .list-inline.pull-left li:first-child").html("<span class='version-num'><i class='icon-jfi-history'></i> <b>" + (list.length - parseInt(key)) + "</b></span>");
                } else {
                    val.find("._fcli").html(list.length - parseInt(key));
                }

                html.find($projectile._config.list_selector).append(val);
            }

            //			if(viewMode == 'grid'){
            //				html.find(".files-items-list").prepend('<li class="files-item col-xs-4 veryBig-back-button"><div class="files-item-container"><div class="files-item-inner"><div class="item-thumb"><a class="versions-back-button"><i class="icon-jfi-back"></i> '+$projectile.captions.back+'</a></div></div></div></li>');
            //			}else{
            //				html.find($projectile._config.list_selector).prepend('<div class="table-row nsrow row-back-button versions-back-button"><div class="table-col"><i class="icon-jfi-back files-item-icon"></i></div><div class="table-col"><span style="display:block; font-weight: bold;">'+$projectile.captions.back+'</span></div><div class="table-col"></div><div class="table-col"></div><div class="table-col"></div><div class="table-col"></div><div class="table-col"></div></div>');
            //			}

            $('body').on('click', '.versions-back-button', function(e) {
                $projectile._location.redirect_to($projectile._location.removeParameter("file"));
            });

            html.on("click", 'a.item-trash-action', function(e) {
                var id = $(this).closest($projectile._config.item_selector).attr("data-file-revisionid"),
                    el = $(this),
                    send = $.grep(data, function(a, b) {
                        return a.id == id;
                    });
                if (!send || !send[0]) {
                    return false
                }
                send[0].isVersion = true;
                $projectile._config.removeAction({
                    el: el,
                    send: send
                }, function(data) {
                    $projectile._config._filerOpts.onRemove(data.el.closest($projectile._config.item_selector), data.send[0], id, function(el, id) {
                        location.reload();
                        el.fadeOut("fast", function() {
                            $(this).remove();
                        })
                    });
                });
            });

            $('.right-side').hide(0, function() {
                var par = $(this).parent();
                html.hide().appendTo(par).show(0);
                $('.filter-list-type, .filter-list-mode').addClass("disabled");
                $projectile._config._filerOpts.beforeShow();
            });
        }

        $($projectile._config.input_selector).trigger("filer.generateList", {
            data: data
        });
    },
    apply_viewMode: function() {
        var _c = $projectile._config.views,
            mode = $projectile.viewMode;
        if (!_c[mode]) mode = "table";

        $('.view-switcher').find("a." + mode + "-view").addClass("selected");

        /* important */
        $('.projectile-filer').addClass(mode + "-view");
        $('.right-side div:first-child').html(_c[mode].rightSide);
    }
}

/*
 * jQuery.filer configuration
 *
 * Doc: https://github.com/CreativeDream/jQuery.filer
 */
$projectile._config._filerOpts = {
    limit: null,
    maxSize: null,
    extensions: null,
    changeInput: '<div class="jFiler-input-dropDown"><div class="jFiler-input-inner"><div class="jFiler-input-icon"><i class="icon-jfi-cloud-up-o"></i></div><div class="jFiler-input-text"><h3>' + $projectile.captions.dragDropFiles + '</h3> <span class="margin15">' + $projectile.captions.or + '</span></div><a class="jFiler-input-choose-btn blue">' + $projectile.captions.browseFiles + '</a></div></div>',
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
        data: null,
        type: 'POST',
        enctype: 'multipart/form-data',
        beforeSend: function() {
            //uncheck files-item-all
            $('.files-item-all').prop('checked', false).trigger('change');
        },
        success: null,
        error: null,
        statusCode: null,
        onProgress: null,
        onComplete: function(l, p, o, s) {
            s.val("");
            $("#filerComment").find("textarea").val("");
        },
    },
    dragDrop: {
        dragEnter: null,
        dragLeave: null,
        drop: null,
    },
    beforeShow: function() {
        $('.jFiler-emptyMessage').remove();
        return true;
    },
    onSelect: function() {

        //remove revision window
        $('.file-verions-right-side').fadeOut("slow", function() {
            $(this).remove();
            $(".right-side").fadeIn("slow");
            $(".view-path").empty();
            history.pushState({}, "Flyer", $projectile._location.removeParameter("file"));
        });
    },
    onRemove: function(el, data, id, callback) {
        //remove upload-failed files
        if (el.attr('data-jfiler-upload-error') != null) {
            callback(el, id);
            return;
        }

        //remove files
        $projectile._config.btnLoading(el.find(".item-trash-action"));
        $projectile.file.remove(data, function(r) {
            if (r._transfered) {
                callback(el, id);
            } else {
                $projectile._config.requestErrorMessage();
            }
            $projectile._config.btnLoading(el.find(".item-trash-action"), true);
        });
    },
    onEmpty: function() {
        $('.jFiler-emptyMessage').remove();
        $('.right-side').append('<p class="jFiler-emptyMessage text-center">' + $projectile.captions.noFiles + '</p>');
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

/*
 * page scripts
 */
$(function() {

    // open page
    $projectile._config.apply_viewMode();

    // fix header
    $(window).scroll(function() {
        $('#header .header-fixed, .left-side .left-side-bg').css({
            'left': -$(this).scrollLeft()
        });
    }).resize(function() {
        $(".view-path").css('max-width', $('.folder-manipulation').position().left - $('.view-path').position().left - 31);
    });

    // view swither
    $('body').on('click', ".view-switcher li a[class]", function(e) {
        e.preventDefault();

        var current = $(this).attr("class");

        if ($(this).hasClass("selected")) return true;
        switch (current) {
            case 'table-view':
                $projectile.storage("ViewMode", "table");
                break;
            case 'grid-view':
                $projectile.storage("ViewMode", "grid");
                break;
        }
        location.reload();
    });

    // selected items manipulation
    if(!(window.top && window.top.BSM) || !window.top.BSM.Views.view.viewProperties.archiveFeature) {
    	$('.all-archive-action').closest('li').hide();
    }
    $('body').on('click change', ".items-manipulation li a[class], .items-manipulation li input.file-items-check", function(e) {
        var current = $(this).attr("class"),
            reset_selected = function() {
                $projectile._config.items_selected = [];
                $('#files-item-all').prop('checked', false);
                $('.file-item-check').prop('checked', false).trigger('change');
                $(".items-manipulation").hide();
            }
        if (!$projectile._config.items_selected || $projectile._config.items_selected.length <= 0) return false;
        switch (current) {
            case "file-items-check":
                var checked = $(this).prop('checked');
                $($projectile._config.list_selector).children().find('.file-item-check').prop('checked', checked).trigger('change');
                break;
            case "all-download-action":
                e.preventDefault();

                for (key in $projectile._config.items_selected) {
                    var val = $projectile._config.items_selected[key].substring(11),
                        el = $($projectile._config.item_selector + '[data-file-id="' + val + '"]');

                    el.find('[download]').get(0).click();
                }

                reset_selected();
                break;
			case "all-archive-action":
				for (key in $projectile._config.items_selected) {
					var val = $projectile._config.items_selected[key],
						data = $.grep($projectile.files, function(a, b) {
							return a.fId == val.substring(11);
						}),
						el = $('[data-file-revisionid="' + data[0].fId + '"]')

					$projectile._config.archiveService(data[0]);
					el.remove();
				}

				reset_selected();
				location.reload();
				break;
            case "all-lock-action":
                e.preventDefault();
                modal({
                    type: "prompt",
                    title: $projectile.captions.tPrompt,
                    text: $projectile.captions.lockText + ":",
                    buttonText: {
                        ok: $projectile.captions.ok,
                        yes: $projectile.captions.yes,
                        cancel: $projectile.captions.cancel
                    },
                    callback: function(comment) {
                        if (!comment) {
                            modal({
                                type: "warning",
                                title: $projectile.captions.tInfo,
                                text: $projectile.captions.lockCommentEmpty + "!",
                                buttonText: {
                                    ok: $projectile.captions.ok,
                                    yes: $projectile.captions.yes,
                                    cancel: $projectile.captions.cancel
                                },
                            });
                            return true
                        }
                        for (key in $projectile._config.items_selected) {
                            var val = $projectile._config.items_selected[key],
                                data = $.grep($projectile.files, function(a, b) {
                                    return a.fId == val.substring(11);
                                });
                            data[0]._lockComment = comment;

                            $projectile._config.lockService(data[0]);
                        }

                        reset_selected();
                        location.reload();
                    }
                });
                break;
            case "all-trash-action":
                e.preventDefault();
                modal({
                    type: "confirm",
                    title: $projectile.captions.tConfirm,
                    text: $projectile.captions.removeConfirmation,
                    buttonText: {
                        ok: $projectile.captions.ok,
                        yes: $projectile.captions.yes,
                        cancel: $projectile.captions.cancel
                    },
                    callback: function(answear) {
                        if (answear) {
                            for (var key = 0; key < $projectile._config.items_selected.length; key++) {
                                var val = $projectile._config.items_selected[key],
                                    data = $.grep($projectile.files, function(a, b) {
                                        return a.fId == val.substring(11);
                                    }),
                                    el = $('[data-file-revisionid="' + data[0].rId + '"]'),
                                    filerKit = $('input#filer1').prop("jFiler");

                                filerKit.remove({
                                    fileEl: el,
                                    fileData: data[0]
                                });
                            }

                            reset_selected();
                        }
                    }
                });
                break;
        }
    });

    // filter items
    $('body').on('click', '.filter-mode:not(.disabled)', function(e) {
        e.preventDefault();

        var $target = e.target ? $(e.target) : null,
            $filterEl = $('.filter-mode');

        if ($target.is($filterEl) || $target.parent().is($filterEl)) {
            $(this).toggleClass('active');
        }
    }).on('click', function(e) {
        var $target = e.target ? $(e.target) : null,
            $filterEl = $('.filter-mode');

        if (!$target || !$filterEl) return;
        if ($target.is($filterEl) || $target.closest($filterEl).size() > 0) return;

        $('.filter-mode').removeClass('active');
    }).on('click', '.filter-list-mode:not(.disabled) a[data-sort]', function(e) {
        e.preventDefault();

        var el = $(this),
            isInverted = el.hasClass("inverted");
        inverted = false;

        $('.filter-list-mode a[data-sort]').removeClass('selected').removeClass('inverted');
        if (isInverted) {
            inverted = true;
            el.removeClass('inverted');
        } else {
            el.addClass('inverted');
        }

        var attr = el.attr("data-sort"),
            sortBy = function(a, b) {
                switch (attr) {
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
            sort = $($projectile._config.list_selector + " " + $projectile._config.item_selector).sort(function(a, b) {
                return sortBy(a, b);
            });

        if (inverted) {
            sort = sort.toArray().reverse();
        }

        $($projectile._config.list_selector).stop(true, true).fadeOut(250, function() {
            $($projectile._config.list_selector + " " + $projectile._config.item_selector).remove();
            $($projectile._config.list_selector).append(sort);
            $(this).fadeIn(250);
        });

        $(".filter-list-mode a[data-sort='" + attr + "']").addClass('selected');
    });

    // item selectbox
    $('body').on('change', $projectile._config.item_selector + " input.file-item-check", function(e) {
        var id = $(this).attr("id"),
            el = $(this).closest($projectile._config.item_selector),
            checked = $(this).prop('checked'),
            ul = ".items-manipulation";

        if (checked) {
            if ($.inArray(id, $projectile._config.items_selected) > -1) return;

            $projectile._config.items_selected.push(id);
            $(ul).show().find("li:first-child i.num").text($projectile._config.items_selected.length);
            el.addClass('file-item-checked');

            if ($projectile._config.items_selected.length == $('.files-items-list').children().size()) {
                $('#files-item-all').prop('checked', true);
            }
        } else {
            $projectile._config.items_selected = $.grep($projectile._config.items_selected, function(value) {
                return value != id;
            });

            $(ul).find("li:first-child i.num").text($projectile._config.items_selected.length);
            if ($projectile._config.items_selected.length <= 0) $(ul).hide();
            el.removeClass('file-item-checked');

            $('#files-item-all').prop('checked', false);
        }
    });

    //item trash action
    $('body').on('click files-item.trash', $projectile._config.item_selector + " .item-trash-action", function(e) {

    });

    //item lock action
    $('body').on('click files-item.lock', $projectile._config.item_selector + " .item-lock-action", function(e) {
        e.preventDefault();

        var el = $(this),
            id = el.closest($projectile._config.item_selector).attr("data-file-orderKey"),
            data = $.grep($projectile.files, function(a, b) {
                return a.orderKey == id;
            });

        if (!data[0]) return false;
        $projectile._config.btnLoading(el);

        if (data[0].locked) {
            data[0]._lockComment = null;

            $projectile._config.lockService(data[0], function() {
                notify({
                    title: $projectile.captions.tInfo,
                    message: $projectile.captions.unlockMessage,
                    icon: "<i class=\"icon-jfi-unlock\"></i>",
                    theme: "dark-theme",
                    closeBtn: false,
                    autoHide: true,
                    position: {
                        x: "right",
                        y: "top"
                    }
                });
                $projectile._config.btnLoading(el, true);
                el.off('click').removeClass("icon-jfi-unlock").addClass("icon-jfi-lock").attr("title", $projectile.captions.lock);
            });
        } else {
            modal({
                type: "prompt",
                title: $projectile.captions.tPrompt,
                text: $projectile.captions.lockText + ":",
                buttonText: {
                    ok: $projectile.captions.ok,
                    yes: $projectile.captions.yes,
                    cancel: $projectile.captions.cancel
                },
                callback: function(comment) {
                    if (!comment) {
                        $projectile._config.btnLoading(el, true);
                        modal({
                            type: "warning",
                            title: $projectile.captions.tInfo,
                            text: $projectile.captions.lockCommentEmpty + "!",
                            buttonText: {
                                ok: $projectile.captions.ok,
                                yes: $projectile.captions.yes,
                                cancel: $projectile.captions.cancel
                            }
                        });
                        return true
                    }
                    data[0]._lockComment = comment;
                    $projectile._config.btnLoading(el);
                    $projectile._config.lockService(data[0], function() {
                        notify({
                            title: $projectile.captions.tInfo,
                            message: $projectile.captions.lockMessage,
                            icon: "<i class=\"icon-jfi-lock\"></i>",
                            theme: "dark-theme",
                            closeBtn: false,
                            autoHide: true,
                            position: {
                                x: "right",
                                y: "top"
                            }
                        });
                        $projectile._config.btnLoading(el, true);
                        el.removeClass("icon-jfi-lock").addClass("icon-jfi-unlock").attr("title", $projectile.captions.unlock);
                    });
                    return true;
                }
            });
        }
    });

    // item comment change
    $("body").on("click", $projectile._config.item_selector + " a.item-change-comment-action", function(e) {
        e.preventDefault();

        var el = $(this),
            id = el.closest($projectile._config.item_selector).attr("data-file-revisionid"),
            fId = el.closest($projectile._config.item_selector).attr("data-file-id"),
            isRevision = null,
            data = $.grep($projectile.files, function(a, b) {
                if (a.fId == fId && a.rId != id) {
                    isRevision = b;
                } else {
                    return a.rId == id;
                }
            });

        if (isRevision != null) {
            data = $.grep($projectile.files[isRevision].revisions, function(a, b) {
                return a.rId == id;
            });
        }

        data = data[0];

        if (!data) return false;

        modal({
            title: $projectile.captions.change_comment,
            text: "<label>" + $projectile.captions.tComment + "</label><textarea class='form-control' rows='6' id='file_comment_field_9'>" + (data.comment ? data.comment : "") + "</textarea>",
            center: false,
            buttonText: {
                ok: $projectile.captions.ok,
                yes: $projectile.captions.yes,
                cancel: $projectile.captions.cancel
            },
            callback: function(a, b) {
                if (a) {
                    data.comment = b.find("textarea#file_comment_field_9").val();
                    $projectile._config.editService(data, function() {
                        el.closest($projectile._config.item_selector).find(".file-comment").html(data.comment);
                    });
                }
                return true;
            }
        });
    });
});
