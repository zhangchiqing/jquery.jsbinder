//= require jQuery
;(function($) {
    function getHandlerByWhen(when) {
        switch (when) {
            case 'change-to':
                return function(elm, thens, elsethens) {
                    elm.change && elm.change(function(e) {
                        var changeto = elm.attr('when-change-to');
                        var cur_thens = elm.val() === changeto ? thens : elsethens;
                        $.map(cur_thens, function(then) {
                            var action = getActionByThen(then),
                                target = $(elm).attr(then[0]);
                            action(elm, $(target));
                        });
                    });
                };
            case 'click':
            case 'focus':
            case 'blur':
            case 'change':
            default:
                return function(elm, thens) {
                    elm[when] && elm[when](function(e) {
                        $.map(thens, function(then) {
                            var action = getActionByThen(then),
                                target = $(elm).attr(then[0]);
                            action(elm, $(target));
                        });
                    });
                };
        }
    };

    function getActionByThen(then_info) {
        var then_tag = then_info[0],
            then = then_info[1];
        switch (then) {
            case 'clear':
                return function(elm, target) {
                    $(target).val('');
                };
            case 'val':
                return function(elm, target) {
                    var value = elm.attr(then_tag + '-value');
                    value = value || '';
                    target.val(value);
                };
            case 'addclass':
            case 'removeclass':
                return function(elm, target) {
                    var classname = elm.attr(then_tag + '-classname');
                    var jqFunc = {
                        'addclass': 'addClass',
                        'removeclass': 'removeClass'
                    };
                    var func = jqFunc[then];
                    if (classname === void 0) { return; }
                    target.length || (target = $(elm));
                    target[func](classname);

                }
            case 'replaceclass':
                return function(elm, target) {
                    var classname = elm.attr(then_tag + '-classname');
                    if (classname === void 0) { return; }
                    target.length || (target = $(elm));
                    target.attr('class', classname);
                }
            case 'setattr':
            case 'removeattr':
                return function(elm, target) {
                    var attr = elm.attr(then_tag + '-attr');
                    var value = elm.attr(then_tag + '-value') || attr || '';
                    var jqFunc = {
                        'setattr': 'attr',
                        'removeattr': 'removeAttr'
                    };
                    var func = jqFunc[then];
                    if (func === void 0) { return; }
                    target.length || (target = $(elm));
                    target[func](attr, value);
                }
            case 'show':
            case 'hide':
            case 'blur':
            case 'focus':
            default:
                return function(elm, target) {
                    target[then] && target[then]();
                };
        }
    };

    var WHENS = ['click', 'change', 'change-to', 'focus', 'blur'];
    var THENS = ['show', 'hide', 'val', 'clear', 'addclass', 'removeclass', 'replaceclass', 'setattr', 'removeattr', 'blur', 'focus'];

    var jbinded = function(index, item) {
        var elm = $(item);
        for (var i = 0, when; when = WHENS[i]; i++) {
            if (elm.attr('when-' + when) !== void 0) {
                break;
            }
        }
        if (!when) return;

        var thenactions = [];
        var elseactions = [];
        for (var i = 0, then; then = THENS[i]; i++) {
            if (elm.attr('then-' + then) !== void 0) {
                thenactions.push(['then-' + then, then]);
            }
            if (elm.attr('elsethen-' + then) !== void 0) {
                elseactions.push(['elsethen-' + then, then]);
            }
        }

        var handler = getHandlerByWhen(when);
        handler && handler(elm, thenactions, elseactions);

        if (elm.attr('when-change-to') !== void 0) {
            elm.change();
        }
    };
    

    // jQuery plugin
    $.fn.jbinded = function() {
        this.each(jbinded);
        return this;
    };

    $(function() {
        if (document.getElementsByTagName('body')[0].getAttribute('jbinder') === void 0) { return; }
        $('[jbinded]').each(jbinded);
    })
})(jQuery);
