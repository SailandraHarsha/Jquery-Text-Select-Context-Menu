﻿(function ($) {
    $.fn.selectText = function () {
        var obj = this[0];
        if ($.browser.msie) {
            var range = obj.offsetParent.createTextRange();
            range.moveToElementText(obj);
            range.select();
        } else if ($.browser.mozilla || $.browser.opera) {
            var selection = obj.ownerDocument.defaultView.getSelection();
            var range = obj.ownerDocument.createRange();
            range.selectNodeContents(obj);
            selection.removeAllRanges();
            selection.addRange(range);
        } else if ($.browser.safari) {
            var selection = obj.ownerDocument.defaultView.getSelection();
            selection.setBaseAndExtent(obj, 0, obj, 1);
        }
        return this;
    };

    $.event.special.textselect = {
        setup: function (data, namespaces) {
            $(this).data("textselected", false);
            $(this).bind('mouseup', $.event.special.textselect.handler);
        },
        teardown: function (data) {
            $(this).unbind('mouseup', $.event.special.textselect.handler);
        },
        handler: function (event) {
            var text = $.event.special.textselect.getSelectedText().toString();
            if (text != '') {
                $(this).data("textselected", true);
                event.type = "textselect";
                event.text = text;
                $.event.dispatch.apply(this, arguments);
            }
        },
        getSelectedText: function () {
            var text = '';
            if (window.getSelection) {
                text = window.getSelection();
            } else if (document.getSelection) {
                text = document.getSelection();
            } else if (document.selection) {
                text = document.selection.createRange().text;
            }
            return text;
        }
    };

    $.event.special.textunselect = {
        setup: function (data, namespaces) {
            $(this).data("textselected", false);
            $(this).bind('mouseup', $.event.special.textunselect.handler);
            $(this).bind('keyup', $.event.special.textunselect.handlerKey)
        },
        teardown: function (data) {
            $(this).unbind('mouseup', $.event.special.textunselect.handler);
        },
        handler: function (event) {
            if ($(this).data("textselected")) {
                var text = $.event.special.textselect.getSelectedText().toString();
                if (text == '') {
                    $(this).data("textselected", false);
                    event.type = "textunselect";
                    $.event.dispatch.apply(this, arguments);
                }
            }
        },
        handlerKey: function (event) {
            if ($(this).data("textselected")) {
                var text = $.event.special.textselect.getSelectedText().toString();
                if ((event.keyCode == 27) && (text == '')) {
                    $(this).data("textselected", false);
                    event.type = "textunselect";
                    $.event.dispatch.apply(this, arguments);
                }
            }
        }
    };

})(jQuery);
function getSelectedHTML() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
function SwitchHTMLtoTEXT(Required) {
    if (Required == "HTML") { $("#TextSelectedRe").html(HarshaSelectedHTML); }
    else { $("#TextSelectedRe").html(HarshaSlectedText); }
}
var HideFirst = true;
var HarshaSlectedText = "";
var HarshaSelectedHTML = "";
$(function () {
    $(document).bind('textselect', function (e) {
        HarshaSlectedText = e.text;
        HarshaSelectedHTML = getSelectedHTML();
        var ele = document.getElementById('Quotediv');
        //Code Working Fine for only text -- Start -- 15-08-2021--
        //if ($.trim(e.text) != "") {
        //    var sel = window.getSelection();
        //    var rel1 = document.createRange();
        //    rel1.selectNode(document.getElementById('cal1'));
        //    var rel2 = document.createRange();
        //    rel2.selectNode(document.getElementById('cal2'));
        //    var r = sel.getRangeAt(0).getBoundingClientRect();
        //    var rb1 = rel1.getBoundingClientRect();
        //    var rb2 = rel2.getBoundingClientRect();
        //    ele.style.top = (r.bottom - rb2.top) * 100 / (rb1.top - rb2.top) + 'px'; //this will place ele below the selection
        //    ele.style.left = (r.left - rb2.left) * 100 / (rb1.left - rb2.left) + 'px'; //this will align the right edges together
        //    ele.style.display = 'block';
        //    debugger;
        //    $("#TextSelectedRe").html(e.text);
        //    if (HideFirst) { 
        //        $("#divAddAnnoText, #divFolderSelect, #divReportSelect").hide(200);
        //        HideFirst = false;
        //    }
        //}
        //else {
        //    ele.style.display = 'none';
        //    HideFirst = true;
        //}
        //Code Working Fine for only text -- End -- 15-08-2021--

        var sel = window.getSelection();
        var rel1 = document.createRange();
        rel1.selectNode(document.getElementById('cal1'));
        var rel2 = document.createRange();
        rel2.selectNode(document.getElementById('cal2'));
        var r = sel.getRangeAt(0).getBoundingClientRect();
        var rb1 = rel1.getBoundingClientRect();
        var rb2 = rel2.getBoundingClientRect();
        ele.style.top = (r.bottom - rb2.top) * 100 / (rb1.top - rb2.top) + 'px'; //this will place ele below the selection
        ele.style.left = (r.left - rb2.left) * 100 / (rb1.left - rb2.left) + 'px'; //this will align the right edges together
        ele.style.display = 'block';
        if (HarshaSelectedHTML != "") {
            $("#TextSelectedRe").html(HarshaSelectedHTML);
            if (HideFirst) { 
                $("#divAddAnnoText, #divFolderSelect, #divReportSelect").hide(200);
                HideFirst = false;
            }
        }
        else {
            ele.style.display = 'none';
            HideFirst = true;
        }
    });
});