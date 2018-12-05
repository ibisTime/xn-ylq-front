define([
    'app/controller/base',
    'app/interface/UserCtr',
    'app/module/validate',
    'app/module/smsCaptcha',
    'app/interface/GeneralCtr'
], function(base, UserCtr, Validate, smsCaptcha, GeneralCtr) {
    var companyCode = base.getUrlParam("companyCode") || '';
    var userReferee = base.getUrlParam("userReferee") || '';
    var userRefereeKind = base.getUrlParam("userRefereeKind") || '';
    var timer;
    var dprovince ;
    var dcity ;
    var darea ;
    var dstreet ;

    // 保存链接带的companyCode
    if (!!companyCode) {
        sessionStorage.setItem('companyCode', companyCode);
    }

    init();

    function init(){
    	base.showLoading();
        base.getInitLocation(function(res){
            dprovince = sessionStorage.getItem("province");
            dcity = sessionStorage.getItem("city");
            darea = sessionStorage.getItem("area");
            dstreet = sessionStorage.getItem("street");
            base.hideLoading();

            addListener();
        },function(){
            base.hideLoading();
            addListener();
            // base.showMsg("定位地址失败",1000);
        })
    }

    // 登录
    function register(params){
    	return UserCtr.register(params).then((data) => {
    		base.hideLoading();
    		var msg = "注册成功，请下载APP！";

            base.confirm(msg, "取消","前往下载").then(function(){
                window.location.href = DOWNLOADLINK+'.html';
    		},function(){})

        }, () => {
            $("#getVerification").text('获取验证码').prop("disabled", false);
            clearInterval(timer);
        });
    }

    function addListener(){
    	var _formWrapper = $("#formWrapper");
        _formWrapper.validate({
            'rules': {
                interCode: {
                    required: true,
                },
                mobile: {
                    required: true,
                    mobile: true
                },
                loginPwd: {
                    required: true
                },
                smsCaptcha: {
                    required: true,
                    "sms": true
                },
                address: {}
            },
            onkeyup: false
        });

        timer = smsCaptcha.init({
            bizType: '805041',
            mobile: 'mobile'
        });

        // 注册
    	$("#subBtn").click(function(){
    		if(_formWrapper.valid()) {
    			var params = _formWrapper.serializeObject();

                params = {
                    ...params,
                    "loginPwdStrength": base.calculateSecurityLevel(params.loginPwd),
                    "userReferee": userReferee,
                    "userRefereeKind": userRefereeKind,
                    "kind": "C",
                    "isRegHx": "0",
                    "province": dprovince,
                    "city": dcity,
                    "area": darea,
                    "address": dstreet,
                    "companyCode": companyCode
                };

    			base.showLoading();
    			register(params);
    		}
    	});

        //注册协议
        $(".r-popup-close").click(function(){
            $(".r-popup").fadeOut(500);
        });

        $(".r-protocol").click(function(){
            $(".popup-protocol").fadeIn(500);
            GeneralCtr.getSysConfigKey('regProtocol').then(function(data) {
                $(".r-popup-tit").html(data.remark)
                $(".r-popup-conten").html(data.cvalue)
            }, function() {
                base.showMsg("获取注册协议失败");
            });
        });

        $(".goDownload").click(function(){
            window.location.href= DOWNLOADLINK + '.html';
        });

    }
});
