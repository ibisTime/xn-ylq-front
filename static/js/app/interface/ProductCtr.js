define([
  'app/controller/base',
  'app/util/ajax'
], function(base, Ajax) {
  return {
    // 详情查产品
    getProductDetail(code) {
      return Ajax.get("623011", {code}, true, true);
    },
    // 分页查产品
    getProducList(data) {
      return Ajax.get("623010", {...data}, true, true);
    },
    // 渠道点击量加1
    read(code) {
      return Ajax.get("623153", {code}, true, true);
    }
  };
})

