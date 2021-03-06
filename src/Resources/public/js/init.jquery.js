/**
 * Initialize standard build of the TinyMCE
 *
 * @param options
 */
function initTinyMCE(options) {
    if (typeof options == 'undefined') options = stfalcon_tinymce_config;
    (function($, undefined) {
        $(function() {
            var textareas = $('textarea');

            if (options.selector) {
                textareas = $('textarea' + options.selector);
            }
            textareas.each(function() {
                var textarea = $(this),
                    theme = textarea.attr('data-theme') || 'simple';

                // Get selected theme options
                var settings = (typeof options.theme[theme] != 'undefined')
                    ? options.theme[theme]
                    : options.theme['simple'];

                settings.script_url = options.jquery_script_url;
                settings.external_plugins = settings.external_plugins || {};
                // workaround for an incompatibility with html5-validation
                if (textarea.is('[required]')) {
                    textarea.prop('required', false);
                }
                settings.setup = function(ed) {
                    // Add custom buttons to current editor
                    $.each(options.tinymce_buttons || {}, function(id, opts) {
                        opts = $.extend({}, opts, {
                            onclick: function() {
                                var callback = window['tinymce_button_' + id];
                                if (typeof callback == 'function') {
                                    callback(ed);
                                } else {
                                    alert('You have to create callback function: "tinymce_button_' + id + '"');
                                }
                            }
                        });
                        ed.addButton(id, opts);
                    });
                    // Load external plugins
                    $.each(options.external_plugins || {}, function(id, opts) {
                        var url = opts.url || null;
                        if (url) {
                            settings.external_plugins[id] = url;
                            tinymce.PluginManager.load(id, url);
                        }
                    });
                    //Init Event
                    if (options.use_callback_tinymce_init) {
                        ed.on('init', function() {
                            var callback = window['callback_tinymce_init'];
                            if (typeof callback == 'function') {
                                callback(ed);
                            } else {
                                alert('You have to create callback function: callback_tinymce_init');
                            }
                        });
                    }
                };
                
                if(typeof options.convert_urls === 'boolean'){
                    settings.convert_urls = options.convert_urls;
                }
                if(typeof options.relative_urls === 'boolean'){
                    settings.relative_urls = options.relative_urls;
                }
                if(typeof options.document_base_url === 'string'){
                    settings.convert_urls = options.document_base_url;
                }
                if(typeof options.file_picker_callback === 'function'){
                    settings.file_picker_callback = options.file_picker_callback;
                }
                if(typeof options.file_browser_callback === 'function'){
                    settings.file_picker_callback = options.file_browser_callback;
                }

                textarea.tinymce(settings);
            });
        });
    }(jQuery));
}