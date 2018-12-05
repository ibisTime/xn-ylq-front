define([
    'app/controller/base',
    'app/util/ajax',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
], function(base, Ajax, GeneralCtr, UserCtr) {

	var iosUpdateUrl,androidUpdateUrl;

    init();

    function init() {
        base.showLoading();

        $.when(
            getAppInfo(),
            getAndroidUrl(),
            getIosUrl()
        ).then(function(){
            base.hideLoading();

            $("#AndroidBtn").off('click').click(function(){
                if(androidUpdateUrl!=""&&androidUpdateUrl){
                    if(base.is_weixn()){
                        $(".upload-mask").removeClass("hidden")
                    }else{
                        window.location.href = androidUpdateUrl;
                    }
                }else{
                    base.confirm("当前版本尚未上线，敬请期待！","取消","确定").then(function(){},function(){})
                }
            });
            $("#IOSBtn").off('click').click(function(){
                if(iosUpdateUrl!=""&&iosUpdateUrl){
                    if(base.is_mqqbrowser()){
                        $(".upload-mask").removeClass("hidden")
                    }else if(!$(this).hasClass("on")){
                        $(this).addClass("on");
                        window.location.href = iosUpdateUrl;
                    }
                }else{
                    base.confirm("当前版本尚未上线，敬请期待！","取消","确定").then(function(){},function(){})
                }
            })
        });
		addListener();
    }

    // 获取信息
    function getAppInfo(){
        return UserCtr.getCompanyInfo().then(function(data) {

        }, function() {
            base.showMsg("获取信息失败");
        });
    }

	// 获取安卓下载地址
	function getAndroidUrl(){
		return GeneralCtr.getSysConfigType({
            ckey: 'downloadUrl',
            type: 'android-c'
        }).then(function(data) {
		    if(data.list.length > 0) {
                androidUpdateUrl = data.list[0].cvalue;
            }
	    }, function() {
	        base.showMsg("获取下载地址失败");
	    });
	}

	// 获取ios下载地址
	function getIosUrl(){
		return GeneralCtr.getSysConfigType({
            ckey: 'downloadUrl',
            type: 'ios-c'
        }).then(function(data) {
		    if(data.list.length > 0) {
                iosUpdateUrl = data.list[0].cvalue;
            }
	    }, function() {
	        base.showMsg("获取下载地址失败");
	    });
	}

    function addListener(){
    	$(".upload-mask").click(function(){
			$(".upload-mask").addClass("hidden")
		})

    	$("#languagePopup .close").click(function() {
    		$("#languagePopup").addClass("hidden");
    	})

    	$("#language-wrap").click(() => {
    		$("#languagePopup").removeClass("hidden");
    	})
    }
});