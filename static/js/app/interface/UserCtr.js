define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
    	// 注册
        register(config) {
    		return Ajax.get("805041", config, true, true);
    	},
    	// 获取公司信息
    	getCompanyInfo(){
    		return Ajax.get("630307", {
    			code: COMPANY_CODE
    		}, true);
    	},
    };
})
