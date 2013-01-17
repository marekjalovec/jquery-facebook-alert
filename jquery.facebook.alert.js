function fbalert(content, callback, title, buttons) {
    // get alert object; create if missing
    var _alert = $('#fbalert');
    if (!_alert.size()) {
        _alert = $('<div id="fbalert"><div id="fbalert-header" /><div id="fbalert-content"><div id="fbalert-body" /><div id="fbalert-footer" /></div></div>').appendTo($('body'));
    }
    // set content
    if (content instanceof $) {
        $('#fbalert-body').html('').css('padding', '0').append(content);
    } else {
        $('#fbalert-body').html(content);
    }
    // set title
    $('#fbalert-header').text(title ? title : document.title);
    // reset buttons
    var footer = $('#fbalert-footer').html('');
    // custom buttons?
    if (buttons) {
        var keys = []; // revert order -- float: right;
        for (var k in buttons) {
            keys.unshift(k);
        }
        for (var k in keys) {
            var i = keys[k];
            // create button
            var button = $(document.createElement('div')).attr('id', 'fbalert-' + i).addClass('fbalert-button');
            // custom button skin - default = blue, <empty type> = white
            if ('type' in buttons[i] && buttons[i]['type'] && buttons[i]['type'] != 'normal') {
                button.addClass('fbalert-button-' + buttons[i]['type']);
            }
            // custom callback for button
            if ('callback' in buttons[i] && buttons[i]['callback']) {
                button.click(function(config, button) { return function() { config['callback']($(button).attr('id').replace('fbalert-', ''), $('#fbalert')) } }(buttons[i], button));
            }
            // default callback, gets button name as parameter
            else if (callback) {
                button.click(function() { callback($(this).attr('id').replace('fbalert-', ''), $('#fbalert')); });
            }
            // no callback? -> <close>
            else {
                button.click(function() { fbalert_close(); });
            }
            button.text(buttons[i]['name']);
            footer.append(button);
        }
    }
    // default button -> OK.click(<close>)
    else {
        var button = $(document.createElement('div')).attr('id', 'fbalert-ok').attr('class', 'fbalert-button fbalert-button-primary').text('OK');
        // custom callback?
        if (callback) {
            button.click(function() { callback($(this).attr('id').replace('fbalert-', ''), $('#fbalert')); });
        }
        // no callback? -> <close>
        else {
            button.click(function() { fbalert_close(); });
        }
        footer.append(button);
    }
    var fbalert_show = function(info) {
        var top = 0;
        var left = ($(window).innerWidth() - _alert.width()) / 2 - parseInt(_alert.css('paddingLeft'));
        if (typeof info == 'undefined') {
            top = document.body.scrollTop + ($(window).innerHeight() / 2) - (_alert.height() / 2) - parseInt(_alert.css('paddingTop'));
        } else {
            top = info.scrollTop - info.offsetTop + (info.clientHeight / 2) - (_alert.height() / 2) - parseInt(_alert.css('paddingTop'))
        }
        _alert.css('top', top + 'px');
        _alert.css('left', left + 'px');
        _alert.fadeIn('fast');
    }
    // show alert
    if (typeof FB == 'undefined' || _alert.hasClass('no-fb')) {
        fbalert_show();
    }
    // fb environment or first occurrence
    else {
        // FB.Canvas.getPageInfo callback not called outside of FB iframe
        window.fbalert_timeout = setTimeout(function() {
            fbalert_show();
            _alert.addClass('no-fb');
        }, 200);
        FB.Canvas.getPageInfo(
            function(info) {
                clearTimeout(window.fbalert_timeout);
                fbalert_show(info);
            }
        );
    }
}
function fbalert_close() {
    $('#fbalert').fadeOut('fast');
}