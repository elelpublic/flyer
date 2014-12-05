$(document).ready(function(){
    $('input#filer1').filer({
        limit: null,
        maxSize: null,
        extensions: null,
        changeInput: true,
        showThumbs: true,
        appendTo: false,
        theme: 'list',
        templates: {
            thumbs: '<ul class="jFiler-items"></ul>',
            item: '<li class="jFiler-item">\
                        <div class="files-item-container">\
			     {{fi-name}}\
                        </div>\
                    </li>',
            progressBar: '<div class="bar" style="width: 0"></div>',
            _selectors: {
                list: '.jFiler-items',
                item: '.jFiler-item',
                progressBar: '.bar',
                remove: '.jFiler-item-trash-action',
            }
        },
        uploadFile: {
            url: '/flyer/rest/api/xml/0/folderuploads/6',
            data: {},
            type: 'POST',
            enctype: 'multipart/form-data',
            beforeSend: function(){},
            success: function(data, el){
                el.find('.jFiler-jProgressBar').fadeOut("slow", function(){
                    $('<em class="jFiler-upload-success text-success"><i class="icon-jfi-check-circle"></i> Success</em>').hide().appendTo($(this).parent()).fadeIn('slow');
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
            remove: {
                url: 'index.html',
                data: {},
                type: 'POST',
                callback: function(){}
            }
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
		onRemove: null,
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
});
