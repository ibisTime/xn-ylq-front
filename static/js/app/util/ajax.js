define([
    "jquery",
    'app/util/cookie',
    'app/util/dialog',
    'app/module/loading'
], function($, CookieUtil, dialog, loading) {
    var cache = {};

    function getUrl(code) {
        return "/api";
    }

    function clearSessionUser() {
        sessionStorage.removeItem("userId"); //userId
        sessionStorage.removeItem("token"); //token
    }

    function showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
        return d;
    }
    return {
        get: function(code, json, reload, noToken) {
            if (typeof json == "undefined" || typeof json == "boolean") {
                reload = json;
                json = {};
            }
            return this.post(code, json, !!reload, noToken);
        },
        post: function(code, json, reload, noToken) {
            reload = typeof reload == "undefined" ? true : reload;
            noToken = typeof noToken == "undefined" ? false : reload;

            var token = sessionStorage.getItem("token") || "";
            var commonParams = {};

            if(!noToken){
                token && (commonParams["token"] = token);
            }
            commonParams["systemCode"] = SYSTEM_CODE;
            if (sessionStorage.getItem('companyCode') != '' && sessionStorage.getItem('companyCode')) {
                commonParams["companyCode"] = sessionStorage.getItem('companyCode');
            } else {
                commonParams["companyCode"] = COMPANY_CODE;
            }

            json = $.extend(commonParams, json);
            var sendUrl = getUrl(code);
            var sendParam = {
                code: code,
                json: json
            };
            var cache_url = sendUrl + JSON.stringify(sendParam);
            if (reload) {
                delete cache[code];
            }
            cache[code] = cache[code] || {};
            if (!cache[code][cache_url]) {
                sendParam.json = JSON.stringify(json);
                cache[code][cache_url] = $.ajax({
                    type: 'post',
                    url: sendUrl,
                    data: sendParam
                });
            }
            return cache[code][cache_url].pipe(function(res) {

//              if (res.errorCode == "4") {
//                  clearSessionUser();
//                  sessionStorage.setItem("l-return", location.pathname + location.search);
//                  loading.hideLoading();
//                  setTimeout(function() {
//                      location.replace("../user/login.html");
//                  }, 800);
//                  return $.Deferred().reject("登录超时，请重新登录");
//              }
                if(res.errorInfo == "用户状态异常"){
    				location.replace("../user/isRock.html?isRock=1");
                }
//              if(res.errorBizCode == "xn100001"){
//                  clearSessionUser();
//                  sessionStorage.setItem("l-return", location.pathname + location.search);
//                  loading.hideLoading();
//                  setTimeout(function() {
//                      location.replace("../user/login.html");
//                  }, 800);
//                  return $.Deferred().reject("登录异常，请重新登录");
//              }
                if(res.errorCode != "0"){
                    loading.hideLoading();
                    return $.Deferred().reject(res.errorBizCode, res.errorInfo);
                }
                return res.data;
            }).fail(function(error, errorInfo){
                error && showMsg(errorInfo);
            });
        }
    };
});
