$(document).ready(function(){
    $('input#filer1').filer({
        limit: null,
        maxSize: null,
        extensions: null,
        changeInput: true,
        showThumbs: true,
        appendTo: false,
        theme: 'default',
        templates: {
            thumbs: '<ul class="jFiler-items"></ul>',
            item: '<li class="jFiler-item">\
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
            progressBar: '<div class="bar" style="width: 0"></div>',
            _selectors: {
                list: '.jFiler-items',
                item: '.jFiler-item',
                progressBar: '.bar',
                remove: '.jFiler-item-trash-action',   
            }
        },
        uploadFile: null,		
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
	onEmpty: null,
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

