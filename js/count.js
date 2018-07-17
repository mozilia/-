console.log(123)
define([],
function() {
    var MT = window.MT || {};
    MT.TimeTracker = MT.TimeTracker || {};
    var PERFORMANCE_TIMING_KEYS = ["navigationStart", "unloadEventStart", "unloadEventEnd", "redirectStart", "redirectEnd", "fetchStart", "domainLookupStart", "domainLookupEnd", "connectStart", "connectEnd", "secureConnectionStart", "requestStart", "responseStart", "responseEnd", "domLoading", "domInteractive", "domContentLoadedEventStart", "domContentLoadedEventEnd", "domComplete", "loadEventStart", "loadEventEnd"];
    return MT.count = {
        BLog: function() {
            "use strict";
            function a() {
                l._gat && l._gat._getTracker ? MT.TimeTracker && MT.TimeTracker.lt ? b() : l.setTimeout(function() {
                    a()
                },
                i) : j > h ? b(f) : (l.setTimeout(function() {
                    a()
                },
                g), j += g)
            }
            function b(a) {
                if (!k) {
                    var b = MT.TimeTracker || {},
                    f = l["_" + Date.now()] = new Image;
                    window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
                    MT.HTTP_REFERER && (b.r = MT.HTTP_REFERER),
                    b.expire = a || 0,
                    d(b),
                    c(b),
                    "i.meituan.com" == location.host && (f.src = location.protocol + "//b.meituan.com/_.gif?" + e(b)),
                    k = !0
                }
            }
            function c(a) {
                var b, c, d, e = [],
                f = Number.POSITIVE_INFINITY,
                g = l.performance;
                if (g) {
                    if (g.timing) {
                        for (d = g.timing, b = 0; b < PERFORMANCE_TIMING_KEYS.length; b++) d[PERFORMANCE_TIMING_KEYS[b]] ? (e[b] = d[PERFORMANCE_TIMING_KEYS[b]], e[b] < f && (f = e[b])) : e[b] = -1;
                        for (b = 0; b < PERFORMANCE_TIMING_KEYS.length; b++)"connectEnd" === PERFORMANCE_TIMING_KEYS[b] ? e[b] = MT.TimeTracker.rt - f: e[b] > 0 && (e[b] -= f);
                        a.pt_start = f,
                        a.pt_index = e.join(",")
                    }
                    g.navigation && (c = g.navigation, a.pn_redirect = c.redirectCount, a.pn_type = c.type)
                }
            }
            function d(a) {
                var b = 0,
                c = MT.pageData || {};
                a = a || {},
                a.page = c.pid,
                a.page || (a.page = b)
            }
            function e(a) {
                var b = [];
                for (var c in a) a && b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                return b.join("&")
            }
            var f = 1,
            g = 100,
            h = 35e3,
            i = 50,
            j = 0,
            k = !1,
            l = window;
            document;
            a()
        },
        Mlog: {
            ls: function() {
                try {
                    return localStorage
                } catch(a) {
                    return ! 1
                }
            } (),
            url: "i.meituan.com" !== location.host ? "": "//apimobile.meituan.com/data/collect.json",
            getCookie: function(a, b) {
                return b = document.cookie.match("(?:;|^)\\s*" + a + "\\s*=\\s*([^;]+)\\s*(?:;|$)"),
                b && b[1]
            },
            getUrlKV: function(a, b) {
                return b = location.href.toLowerCase().match("([?]|&)" + a + "=([^&]+)(&|$)"),
                b && b[2]
            },
            getPageData: function(a) {
                return MT && MT.pageData && MT.pageData[a]
            },
            getConnection: function(a) {
                return a = navigator.connection || navigator.webkitConnection || {
                    type: 6
                },
                a.type || (a.type = 6),
                ["unknown", "ethernet", "wifi", "2g", "3g", "4g", "none"][a.type] || a.type.toLowerCase()
            },
            getOS: function(a) {
                return a = window.navigator.userAgent.match(/Macintosh|iPod|iPhone|iPad|Android|Windows Phone|Windows/i),
                a && a[0] || "other"
            },
            logs: {},
            sendTimer: null,
            postDate: function() {
                if (0 == this.logs.evs.length || 0 == this.url.length) return ! 1;
                var a = this,
                b = "?t=" + Date.now(),
                c = new XMLHttpRequest;
                c.open("POST", this.url + b, !0),
                c.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8"),
                c.onreadystatechange = function() {
                    4 == c.readyState && ((c.status >= 200 && c.status < 300 || 413 == c.status || 0 == c.status) && (a.logs.evs = [], a.ls && a.ls.removeItem("l~~")), c.onreadystatechange = null)
                },
                c.send("type=i_stat&content=" + JSON.stringify(a.logs))
            },
            sampling: function(a) {
                if (!this.getCookie("iuuid")) return ! 1;
                var b = this.getCookie("iuuid").substr(0, 1).toUpperCase(),
                c = Math.abs(a) < 1 ? a: 1,
                d = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
                e = d.length,
                f = Math.ceil(e * c),
                g = Math.floor(Date.now() / 864e5) % e * f % e;
                return new RegExp(b).test(d.substr(g, f))
            },
            send: function(a, b) {
                if (a && (!b || this.sampling(b))) {
                    var c = this;
                    if (a.nm = a.nm.toUpperCase(), a.url && (a.url = encodeURIComponent(a.url)), "ERROR" == a.nm && (a.sid = c.getPageData("sid")), "MGE" == a.nm && c.getPageData("pid") && (a.val.cid || (a.val.cid = c.getPageData("pid")), !a.val.val && c.getPageData("pc") && (a.val.val = encodeURIComponent(c.getPageData("pc")))), a.tm = Math.floor(Date.now() / 1e3), Date.now() > 0 && (a.seq = Date.now()), c.logs.evs.push(a), c.ls) try {
                        c.ls.setItem("l~~", JSON.stringify(c.logs.evs))
                    } catch(d) {}
                    clearTimeout(this.sendTimer),
                    this.sendTimer = setTimeout(function() {
                        navigator.onLine && c.postDate()
                    },
                    c.ls ? 1e3: 0)
                }
            },
            translate: function(a, b, c) {
                "[object Object]" == Object.prototype.toString.call(b) ? b.nm = a: b = {
                    nm: a,
                    value: b
                },
                this.send(b, c)
            },
            sendPV: function(a, b) {
                if (!a && !this.getPageData("pid")) return ! 1;
                var c = {
                    nm: "MPT",
                    val: {
                        type: "page",
                        name: a ? a: this.getPageData("pid"),
                        content: encodeURIComponent(b ? b: this.getPageData("pc"))
                    }
                };
                this.getUrlKV("utm_source") && (c.utm_source = this.getUrlKV("utm_source"), c.utm_medium = this.getUrlKV("utm_medium")),
                this.getUrlKV("stid") && (c.val.content += encodeURIComponent("&stid=" + this.getUrlKV("stid"))),
                this.send(c)
            },
            sendPerf: function() {
                var a = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance;
                if (a) {
                    for (var b = a.timing,
                    c = [], d = 0; d < PERFORMANCE_TIMING_KEYS.length; d++) c.push(b[PERFORMANCE_TIMING_KEYS[d]]);
                    this.send({
                        nm: "perf",
                        newuser: MT.pageData.newUser,
                        timing: c.join(",")
                    },
                    .05)
                }
            },
            splitUtmz: function(a) {
                var b, c, d = [];
                if (b = a || this.getCookie("__utmz")) {
                    b = b.split("|");
                    for (var e in b) {
                        var f = b[e],
                        g = f.indexOf("utmc");
                        b[e] = f.substring(g)
                    }
                    for (var e in b) c = b[e].split("="),
                    d[c[0]] = c[1]
                }
                return d
            },
            checkBaiduSource: function() {
                var a = this.splitUtmz(),
                b = !1,
                c = a.utmcsr || this.getUrlKV("utm_source"),
                d = a.utmcmd || this.getUrlKV("utm_medium");
                return ("baidu.com" === c && "referral" === d || "m.baidu.com" === c && "referral" === d || "baidu" === c && "organic" === d || "m.baidu" === c && "organic" === d || "seo_baidu" === c && "android" === d) && (b = !0),
                b
            },
            init: function() {
                var a = this,
                b = a.splitUtmz();
                if (this.logs = {
                    appnm: "group",
                    ct: "i",
                    ua: window.navigator.userAgent,
                    app: 0,
                    msid: a.getCookie("IJSESSIONID"),
                    did: a.getCookie("iuuid"),
                    uid: a.getCookie("u"),
                    uuid: a.getCookie("iuuid"),
                    cityid: a.getCookie("ci"),
                    ch: a.getUrlKV("f") || "touch",
                    lch: a.getUrlKV("utm_source"),
                    utmccn: b.utmccn || "NULL",
                    utmcsr: b.utmcsr || "NULL",
                    utmcmd: b.utmcmd || "NULL",
                    utmcct: b.utmcct || "NULL",
                    utmctr: b.utmctr || "NULL",
                    os: a.getOS(),
                    sc: window.screen.height + "*" + window.screen.width,
                    net: a.getConnection(),
                    ip: a.getPageData("cip"),
                    evs: []
                },
                this.ls) {
                    var c = this.ls.getItem("l~~");
                    c && (this.logs.evs = JSON.parse(c))
                }
                if (MT.log && MT.log._logs.length > 0) for (var d in MT.log._logs) this.translate(MT.log._logs[d].type, MT.log._logs[d].value);
                this.sendPerf(),
                MT.log && (MT.log.send = function(b, c, d) {
                    a.translate(b, c, d || 1)
                })
            }
        },
        parseDeclareString: function(declareString) {
            var str = declareString,
            e = new RegExp("\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'|/(?:[^/\\\\]|\\\\.)*/w*|[^\\s:,/][^,\"'{}()/:[\\]]*[^\\s,\"'{}()/:[\\]]|[^\\s]", "g"),
            d = str.match(e),
            k,
            n,
            t = 0,
            c = {};
            try {
                if (d) {
                    d.push(",");
                    for (var z = 0,
                    u; u = d[z]; ++z) {
                        var r = u.charCodeAt(0);
                        if (44 === r) {
                            if (0 >= t) {
                                if (k) try {
                                    "id" == k ? c[k] = n.join("").replace(/'/g, "") : c[k] = eval(n.join(""))
                                } catch(e) {
                                    c[k] = n.join("")
                                }
                                k = n = t = 0;
                                continue
                            }
                        } else if (58 === r) {
                            if (!n) continue
                        } else if (47 === r && z && 1 < u.length)(r = d[z - 1].match(g)) && !h[r[0]] && (str = str.sustrstr(str.indexOf(u) + 1), d = str.match(e), d.push(","), z = -1, u = "/");
                        else if (40 === r || 123 === r || 91 === r)++t;
                        else if (41 === r || 125 === r || 93 === r)--t;
                        else if (!k && !n) {
                            k = 34 === r || 39 === r ? u.slice(1, -1) : u;
                            continue
                        }
                        n ? n.push(u) : n = [u]
                    }
                }
                return c
            } catch(e) {
                return ""
            }
        },
        trackEvent: function() {
            var a = "gaevent",
            b = this,
            c = this.Mlog;
            document.body.addEventListener("click",
            function(d) {
                for (var e = d.target || d.srcElement; e && e != this;) {
                    if (e.hasAttribute(a)) {
                        var f = e.getAttribute(a).split("|");
                        if (b.sendEvent.apply(null, f), MT.pageData && MT.pageData.pid && "" != MT.pageData.pid) {
                            var g, h = e.getAttribute(a);
                            g = ~h.indexOf(":") ? {
                                nm: "MGE",
                                uid: c.getCookie("u"),
                                val: b.parseDeclareString(h)
                            }: {
                                nm: "MGE",
                                uid: c.getCookie("u"),
                                val: {
                                    act: encodeURIComponent(e.getAttribute(a))
                                }
                            }
                        }
                        return c.send(g),
                        !1
                    }
                    e = e.parentNode
                }
            })
        },
        sendEvent: function() {
            var a = ["_trackEvent"],
            b = [].slice.call(arguments),
            c = window._gaq || [];
            1 === b.length ? a.push("InnerLink", "Click", b[0]) : a = a.concat(b),
            c.push(a)
        }
    },
    MT.count.BLog(),
    MT.count.Mlog.init(),
    MT.count.trackEvent(),
    MT.count
});