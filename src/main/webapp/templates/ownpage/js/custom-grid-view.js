$(document).ready(function(){$projectile.ready(function(){
	
	//jQuery.filer options
	var _filerOpts = $projectile._config._filerOpts;
	_filerOpts.theme = 'thumbnails';
	_filerOpts.templates.item = '<li class="files-item uploading animated zoomIn col-xs-4">\
									<div class="files-item-container">\
										<div class="files-item-inner">\
											<div class="item-thumb">\
												{{fi-image}}\
												<div class="item-thumb-overlay">\
													<div class="item-thumb-overlay-info">\
														<div style="display:table-cell;vertical-align: middle;">\
															<div class="item-progress">\
																<p class="text-center progress-num">0%</p>\
																{{fi-progressBar}}\
															</div>\
														</div>\
													</div>\
												</div>\
											</div>\
											<div class="item-assets">\
												<div class="item-info">\
													<h4 class="item-title" title="{{fi-name}}">{{fi-name | limitTo: 45}}</h4>\
													<ul class="item-others list-inline">\
														<li>{{fi-icon}} {{fi-size2}}</li>\
													</ul>\
												</div>\
												<div class="item-assets-normal row">\
													<ul class="list-inline pull-left">\
														<li><span class="item-uploading-status">'+$projectile.captions.uploading+'...</span></li>\
													</ul>\
													<ul class="list-inline pull-right">\
														<li><a class="icon-jfi-ban item-trash-action"></a></li>\
													</ul>\
												</div>\
											</div>\
										</div>\
									</div>\
								</li>';
	_filerOpts.templates.itemAppended = '<li class="files-item col-xs-4" data-file-id="{{fi-fId}}" data-file-revisionId="{{fi-rId}}" data-file-type="{{fi-type}}" data-file-extension="{{fi-extension}}" data-file-name="{{fi-name}}" data-file-user="{{fi-createdByName}}" data-file-size="{{fi-size}}" data-file-date="{{fi-created}}" data-file-orderKey="{{fi-orderKey}}">\
									<div class="files-item-container">\
										<div class="files-item-inner">\
											<div class="item-thumb">\
												{{fi-image}}\
												<div class="item-thumb-overlay">\
													<div class="item-thumb-overlay-info animated fadeIn">\
														<div style="display:table-cell;vertical-align: middle;">\
															<br>\
															<a href="{{fi-file}}" target="_blank" title="'+$projectile.captions.download+'" class="download-button-blue"'+($projectile.supportDownload?' download="{{fi-name}}"':'')+'><i class="icon-jfi-download-o"></i></a>\
															<a href="{{fi-file}}" target="_blank" title="'+$projectile.captions.openFile+'" class="download-button-red"><i class="icon-jfi-external-link"></i></a>\
															<br><br>\
															<b>{{fi-name}}</b>\
															<br>\
															<span class="others">{{fi-size2}} | {{fi-createdByName}} | {{fi-date}}</span>\
															<br><br>\
															<p class="comment file-comment">{{fi-comment}}</p>\
														</div>\
													</div>\
												</div>\
											</div>\
											<div class="item-assets">\
												<div class="item-info">\
													<a href="{{fi-file}}" target="_blank">\
														<h4 class="item-title" title="{{fi-name}}">{{fi-name | limitTo: 45}}</h4>\
														<ul class="item-others list-inline">\
															<li>{{fi-icon}} {{fi-size2}}</li>\
															<li><i class="icon-jfi-calendar"></i> {{fi-date}}</li>\
														</ul>\
													</a>\
												</div>\
												<div class="item-assets-normal row">\
													<ul class="list-inline pull-left">\
														<li><input type="checkbox" class="file-item-check" id="files-item-{{fi-fId}}"><label for="files-item-{{fi-fId}}">&nbsp;</label></li>\
													</ul>\
													<ul class="list-inline pull-right">\
														<!--<li style="padding-left:0;"><a href="{{fi-file}}" target="_blank" class="icon-jfi-external-link item-open-action" title="'+$projectile.captions.openFile+'"></a></li>-->\
														{{fi-versionsButton}}\
														{{fi-lockIcon}}\
														<li><a class="icon-jfi-pencil-alt item-change-comment-action" title="'+$projectile.captions.change_comment+'"></a></li>\
														<li><a class="icon-jfi-trash item-trash-action" title="'+$projectile.captions.remove+'"></a></li>\
													</ul>\
												</div>\
											</div>\
										</div>\
									</div>\
								</li>';
	_filerOpts.uploadFile.success = function(data, el, l, o, p, s){
		if( !data || !data.Entries ) {
			_filerOpts.uploadFile.error( el );
			modal( { type: 'error', title: $projectile.captions.errorTitle, text: data.Message } );
			return false;
		}
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
		val.file = $projectile.restUrl + "api/binary/" + $projectile.clientId + "/filerevisions/" + val.id;
		val.rId = val.id;
		val.orderKey = $projectile.files.length.toString();
		val.fId = val.fileHistory;
		val.locked = lockFind(val.fId);
		val.lockIcon = '<li><a class="icon-jfi-'+(val.locked ? "unlock" : "lock")+' item-lock-action dropdown" title="'+(val.locked ? $projectile.captions.unlock : $projectile.captions.lock)+'"></a></li>';
		val.revisions = revisionsFind(val.fId);
		val.versionsButton = (val.revisions.length > 0 ? '<li style="padding-right:0"><a href="'+$projectile._location.addParameter("file",val.fId)+'" class="item-versions-show dropdown" title="'+$projectile.captions.versions+'"><i class="icon-jfi-history"></i></a></li>' : '');
		val.forList = true;

		data.push(val);
		$projectile.files.push(val);

		data.callback = function(list){
			el.find('.item-progress').html('<div class="item-progress-result"><i class="icon-jfi-check-circle animated zoomIn"></i></div>'); el.find('.item-uploading-status').remove();

			setTimeout(function(){
				el.removeClass("animated").find('.item-thumb-overlay').fadeOut("slow", function(){
					var parent = el,
						inner = parent.find(".files-item-inner"),
						newItem = $(list[0]);

					parent.html(newItem.html());

					for (i = 0; i < newItem[0].attributes.length; i++){
						var a = newItem[0].attributes[i];
						if(a.name == "data-jfiler-index"){continue}
						parent.attr(a.name, a.value);
					}

					$(this).remove();

					inner.fadeIn("slow");
				});
			}, 1500);
		}

		$($projectile._config.input_selector).trigger("filer.generateList", {data: data});
	}
	_filerOpts.uploadFile.error = function(el){
		el.find('.item-progress').html('<div class="item-progress-result"><i class="icon-jfi-ban animated zoomIn"></i><br>'+$projectile.captions.errorText+'</div>');
		el.attr('data-jfiler-upload-error', 'true');
		el.find('.item-uploading-status').remove();
	}
	_filerOpts.uploadFile.onProgress = function(percent, el, s){
		el.find('.progress-num').text(percent + '%');
	}

	// run jQuery.filer plugin
	$($projectile._config.input_selector).filer(_filerOpts);

	// modify files
	for(key in $projectile.files){
		var val = $projectile.files[key];
		val.name = val.fileName;
		val.date = $projectile.dateFormat(val.created);
		val.type = val.mimeType;
		val.file = $projectile.restUrl + "api/binary/" + $projectile.clientId + "/filerevisions/" + val.id;
		val.rId = val.id;
		val.lockIcon = '<li><a class="icon-jfi-'+(val.locked ? "unlock" : "lock")+' item-lock-action dropdown" title="'+(val.locked ? $projectile.captions.unlock : $projectile.captions.lock)+'"></a></li>';
		val.versionsButton = (val.revisions.length > 0 ? '<li style="padding-right:0"><a href="'+$projectile._location.addParameter("file",val.fId)+'" class="item-versions-show dropdown" title="'+$projectile.captions.versions+'"><i class="icon-jfi-history"></i></a></li>' : '');
	}

	// append files
	$projectile.files.sort($projectile._config.defaultSort);
	$($projectile._config.input_selector).trigger("filer.append", {data: $projectile.files});
	
	// lock action
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
					   text: "<b>"+$projectile.captions.file+":</b><br>" + "<p>" + data.name + "</p>" + "<b>"+$projectile.captions.tUser+":</b><br>" + "<p>" + data.lockedByName + "</p>" + "<b>"+$projectile.captions.tDate+":</b><br>" + "<p>" + $projectile.dateFormat(data.lockTime, true) + "</p>" + "<b>"+$projectile.captions.tComment+":</b><br>" + "<p>" + data.lockComment + "</p>",
					   center: false,
					   size: "small",
					   buttonText: {ok:$projectile.captions.ok,yes:$projectile.captions.yes,cancel:$projectile.captions.cancel},
				   });
				   return true;
			   }
		   },
	   ]
	});

	// run revisions page
	$projectile._config.version_page();

})});