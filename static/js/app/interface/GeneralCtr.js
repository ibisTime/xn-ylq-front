define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
    	//获取七牛Token
    	getQiniuToken() {
    		return Ajax.get("805951",{}, true, true);
    	},
        /*
         * 发送短信
         * @config: {bizType, mobile, interCode, sendCode}
         * */
        sendCaptcha(sendCode, config) {
        	if(sendCode==="805952"){
        		config.email = config.mobile
        	}else{
        		config.mobile = config.mobile
        	}
            return Ajax.post(sendCode, config, true, true);
        },
        // 查询系统参数 type
        getSysConfigType(config) {
            return Ajax.get("623915", {
                ...config,
                start: "1",
                limit: "10",
            }, true, true);
        },
        // 查询系统参数 key
        getSysConfigKey(key) {
            return Ajax.get("623917", {key}, true, true);
    	},
        // 查询数据字典 parentKey
        getDictList(parentKey) {
            return Ajax.get("623907", {parentKey}, true, true);
    	}
    };
})

