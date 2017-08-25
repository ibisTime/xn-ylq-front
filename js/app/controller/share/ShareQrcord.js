define([
    'app/controller/base',
    'app/util/ajax',
], function(base, Ajax) {
	
	var updateUrl,ios,android ;
	
    init();
    
    function init() {
    	$(".sq-btn1").click(function(){
    		getUrl("android-c");
    	})
    	
    	$(".sq-btn2").click(function(){
    		getUrl("ios-c");
    	})
    	
    }
	 
	
	function getUrl(t){
		Ajax.get("805915",{
			"type":t,
		    "start": "1",
		    "limit": "20",
			"systemCode":SYSTEM_CODE,
			"companyCode":SYSTEM_CODE
		}).then(function(res) {
	        if (res.success) {
	        	updateUrl = res.data.list;
	        	var androidUrl ,iosUrl,downloadUrl;
	        	
	        	updateUrl.forEach(function(v, i){
	        		
	        		if(v.ckey == "downloadUrl"){
	        			downloadUrl = v.cvalue;
	        		}
	        		
	        	})
				window.location.href= downloadUrl;        	
	        	
	        	// base.getUserBrowser(downloadUrl);//跳转
	        	
	        } else {
	        	base.showMsg(res.msg);
	        }
	    }, function() {
	        base.showMsg("获取下载地址失败");
	    });
	}
});