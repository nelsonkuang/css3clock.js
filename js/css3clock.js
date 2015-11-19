// AMD with global, Node, or global
; (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['css3Clock'], function (css3Clock) {
            // Also create a global in case some scripts
            // that are loaded still are looking for
            // a global even when an AMD loader is in use.
            return (root.css3Clock = factory(css3Clock));
        });
    } else {
        // Browser globals (root is window)
        root.css3Clock = factory(root.css3Clock);
    }
}(this, function (css3Clock) {
    // Baseline
    /* -------------------------------------------------------------------------- */
    var root = this || global;
    var previouscss3Clock = root.css3Clock;

    css3Clock = {};
    css3Clock.VERSION = "0.1.0";
    //the second hand, minute hand and hour hand of the clock
    var hands = function (date, animateCss) {
        var h = {},
            d = date || new Date();
        h.hour = d.getHours() >= 12 ? d.getHours() - 12 : d.getHours();
        h.minute = d.getMinutes();
        h.second = d.getSeconds();
        h.hourHandRotate = (h.hour + h.minute / 60 + h.second / 3600) * 30 - 90;
        h.minuteHandRotate = (h.minute + h.second / 60) * 6 - 90;
        h.secondHandRotate = (h.second) * 6 - 90;
        h.secondHandAnimateClass = animateCss ? animateCss.secondHandAnimateClass || "rotateSecond" : "rotateSecond";
        h.minuteHandAnimateClass = animateCss ? animateCss.minuteHandAnimateClass || "rotateMinute" : "rotateMinute";
        h.hourHandAnimateClass = animateCss ? animateCss.hourHandAnimateClass || "rotateHour" : "rotateHour";
        return h;
    };
    //update the css animation keyframes for clock hands initialization
    //var updateRotateRule = function (cssRules, handRotate) {
    function updateRotateRule(cssRules, handRotate) {
        var from = cssRules.findRule("from").cssText.replace("(0deg)", "(" + handRotate + "deg)").replace("(0deg)", "(" + handRotate + "deg)").replace("(0deg)", "(" + handRotate + "deg)"),
            to = cssRules.findRule("to").cssText.replace("360", handRotate + 360).replace("360", handRotate + 360).replace("360", handRotate + 360);
        cssRules.deleteRule("from");
        cssRules.deleteRule("to");
        if (cssRules.insertRule) {
            cssRules.insertRule(from);
            cssRules.insertRule(to);
        } else if (cssRules.appendRule) {//Firefox supported
            cssRules.appendRule(from);
            cssRules.appendRule(to);
        }
    };
    //the dates all over the world 
    var worldDates = css3Clock.worldDates = {
        UTC: function () {
            var date = new Date();
            date.setTime(date.getTime() + date.getTimezoneOffset() * 60000);
            return date;
        },
        BeiJingDate: function () {
            var date = new Date(),
                offset = 8,
                utc = worldDates.UTC();
            date.setTime(utc.getTime() + (3600000 * offset));
            return date;
        },
        NewYorkDate: function () {
            var utc = worldDates.UTC(),
                offset = -5,
                date = new Date(),
                summerDateStart = new Date(date.getFullYear(), 3, 8, 2, 0, 0, 0),
                summerDateEnd = new Date(date.getFullYear(), 11, 1, 2, 0, 0, 0),
                nonSummerTime = utc.getTime() + (3600000 * offset);
            date.setTime((nonSummerTime >= summerDateStart.getTime() && nonSummerTime <= summerDateEnd.getTime()) ? (nonSummerTime + 3600000) : nonSummerTime);
            return date;
        },
        VancouverDate: function () {
            var utc = worldDates.UTC(),
                offset = -8,
                date = new Date(),
                summerDateStart = new Date(date.getFullYear(), 3, 8, 2, 0, 0, 0),
                summerDateEnd = new Date(date.getFullYear(), 11, 1, 2, 0, 0, 0),
                nonSummerTime = utc.getTime() + (3600000 * offset);
            date.setTime((nonSummerTime >= summerDateStart.getTime() && nonSummerTime <= summerDateEnd.getTime()) ? (nonSummerTime + 3600000) : nonSummerTime);
            return date;
        },
        TokyoDate: function () {
            var date = new Date(),
                offset = 9,
                utc = worldDates.UTC();
            date.setTime(utc.getTime() + (3600000 * offset));
            return date;
        },
        MoscowDate: function () {
            var date = new Date(),
                offset = 3,
                utc = worldDates.UTC();
            date.setTime(utc.getTime() + (3600000 * offset));
            return date;
        },
        LondonDate: function () {
            var utc = worldDates.UTC(),
                offset = 0,
                date = new Date(),
                summerDateStart = new Date(date.getFullYear(), 3, 29, 1, 0, 0, 0),
                summerDateEnd = new Date(date.getFullYear(), 10, 25, 2, 0, 0, 0),
                nonSummerTime = utc.getTime() + (3600000 * offset);
            date.setTime((nonSummerTime >= summerDateStart.getTime() && nonSummerTime <= summerDateEnd.getTime()) ? (nonSummerTime + 3600000) : nonSummerTime);
            return date;
        },
        ParisDate: function () {
            var utc = worldDates.UTC(),
                offset = 1,
                date = new Date(),
                summerDateStart = new Date(date.getFullYear(), 3, 29, 1, 0, 0, 0),
                summerDateEnd = new Date(date.getFullYear(), 10, 25, 2, 0, 0, 0),
                nonSummerTime = utc.getTime() + (3600000 * offset);
            date.setTime((nonSummerTime >= summerDateStart.getTime() && nonSummerTime <= summerDateEnd.getTime()) ? (nonSummerTime + 3600000) : nonSummerTime);
            return date;
        },
        SydneyDate: function () {
            var date = new Date(),
                offset = 10,
                utc = worldDates.UTC();
            date.setTime(utc.getTime() + (3600000 * offset));
            return date;
        }

    };
    //start the clock
    css3Clock.start = function (el,date,hands) {
        var s = getElementsByClassName(el, "secondHand")[0],
            m = getElementsByClassName(el, "minuteHand")[0],
            h = getElementsByClassName(el, "hourHand")[0],
            daysEn = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            daysCn = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
            dayTimeEn = ["AM","PM"],
            dayTimeCn=["零晨","早上","中午","下午","晚上"],
            getDayTimeCn = function () {
                var d = date.getHours();
                if (d >= 0 && d < 5) {
                    return dayTimeCn[0];
                } else if (d >= 5 && d < 11) {
                    return dayTimeCn[1];
                } else if (d >= 11 && d < 13) {
                    return dayTimeCn[2];
                } else if (d >= 13 && d < 18) {
                    return dayTimeCn[3];
                } else if (d >= 18 && d <= 23) {
                    return dayTimeCn[4];
                }
            };
        /*removeClass(s, hands.secondHandAnimateClass);
        removeClass(m, hands.minuteHandAnimateClass);
        removeClass(h, hands.hourHandAnimateClass);*/
        addClass(s, hands.secondHandAnimateClass);
        addClass(m, hands.minuteHandAnimateClass);
        addClass(h, hands.hourHandAnimateClass);
        var elEn = getElementsByClassName(el, "dateEN")[0],
            elCn = getElementsByClassName(el, "dateCN")[0];
        elEn.innerText = elEn.textContent = date.getFullYear().toString() + "/"
            + (date.getMonth() + 1).toString() + "/"
            + date.getDate().toString() + " "
            + (date.getHours() >= 12 ? dayTimeEn[1] : dayTimeEn[0]) + " "
            + daysEn[date.getDay()];
        elCn.innerText = elCn.textContent = date.getFullYear().toString() + "年"
            + (date.getMonth() + 1).toString() + "月"
            + date.getDate().toString() + "日"
            + getDayTimeCn() + " "
            + daysCn[date.getDay()];
    }
    //clock initialization
    css3Clock.init = function (el, date, animateCss) {
        var ss = document.styleSheets,
            h = hands(date, animateCss);
        for (var i = ss.length - 1; i >= 0; i--) {
            try {
                var s = ss[i],
                    rs = s.cssRules ? s.cssRules :
                         s.rules ? s.rules :
                         [];
                for (var j = rs.length - 1; j >= 0; j--) {
                    if ((rs[j].type === window.CSSRule.WEBKIT_KEYFRAMES_RULE || rs[j].type === window.CSSRule.MOZ_KEYFRAMES_RULE)) {
                        switch (rs[j].name) {
                            case h.secondHandAnimateClass:
                                updateRotateRule(rs[j], h.secondHandRotate);
                                break;
                            case h.minuteHandAnimateClass:
                                updateRotateRule(rs[j], h.minuteHandRotate);
                                break;
                            case h.hourHandAnimateClass:
                                updateRotateRule(rs[j], h.hourHandRotate);
                                break;
                        }
                    }
                }
            }
            catch (e) { }
        }
        css3Clock.start(el,date, h);
    }
    //like jQuery $(document)ready(fn)
    css3Clock.ready = function (fn) {
        if (document.addEventListener) {
            document.addEventListener("DOMContentLoaded", function () {
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                fn();
            }, false);
        } else if (document.attachEvent) {
            document.attachEvent("onreadystatechange", function () {
                if (document.readyState === "complete") {
                    document.detachEvent("onreadystatechange", arguments.callee);
                    fn();
                }
            });
        }
    };
    /***Utility*******/
    function hasClass(obj, cls) {
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }

    function addClass(obj, cls) {
        if (!hasClass(obj, cls)) {
            obj.className = obj.className.replace(/(^\s*)|(\s*$)/g, "");
            obj.className += " " + cls;
        }
    }

    function removeClass(obj, cls) {
        if (hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    }
    function getElementsByClassName(obj, cls) {
        if (obj.getElementsByClassName) {
            return obj.getElementsByClassName(cls);
        }
        else {
            var objs = obj.getElementsByTagName("*"),
                resultsArr = [];
            for (var o in objs) {
                if (hasClass(objs[o], cls)) {
                    resultsArr.push(objs[o]);
                }
            }
            return resultsArr;
        }
    }
    /********************/
    return css3Clock;
}))
