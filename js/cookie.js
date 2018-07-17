define(function() {
    "use strict";
    var a = "cookie",
    b = "; expires=",
    c = "; domain=",
    d = document;
    return {
        get: function(b, c) {
            return c = d[a].match("(?:;|^)\\s*" + b + "\\s*=\\s*([^;]+)\\s*(?:;|$)"),
            c && c[1]
        },
        set: function(e, f, g, h) {
            location.host.indexOf("meituan.com") == -1 || h || (h = "meituan.com"),
            f = d[a] = e + "=" + f + (g ? b + new Date((new Date).getTime() + 1e3 * g).toGMTString() : "") + (h ? c + h: "") + "; path=/"
        },
        remove: function(c) {
            d[a] = c + "=" + b + (new Date).toGMTString()
        }
    }
});