define([
  'app/controller/base',
  'app/interface/ProductCtr'
], function(base, ProductCtr) {
    var code = base.getUrlParam("code") || '';
    var userRefereeKind = base.getUrlParam("userRefereeKind") || '';
    var companyCode = base.getUrlParam("companyCode") || 'GSModelCode';
    var productCode = base.getUrlParam("productCcode") || '';
    var detail;
    init();

    function init(){
    	base.showLoading();
      ProductCtr.getProductDetail(productCode).then((res) => {
        base.hideLoading();
        detail = res;
        $(".amount-bottom").html(`${base.formatMoney(detail.amount)}元`);
        $(".time-bottom").html(`${detail.duration}天`);
        $(".first").html(`<span>快速信审费：${base.formatMoney(detail.xsAmount)}元</span><span>利息：${base.formatMoney(detail.lxAmount)}元</span>`);
        $(".second").html(`<span>账户管理费费：${base.formatMoney(detail.glAmount)}元</span><span>服务费：${base.formatMoney(detail.fwAmount)}元</span>`);
        $(".primary-color").html(`${base.formatMoney(detail.amount-detail.xsAmount-detail.lxAmount-detail.glAmount-detail.fwAmount)}元`);
        $(".return-amount-final").html(`${base.formatMoney(detail.amount)}元`);
        addListener();
        ProductCtr.read(code);
      }).catch(() => {
        base.hideLoading();

      });
    }

    function addListener(){
        // 去注册
    	$(".button").click(function(){
        base.gohref(`./../user/register.html?code=${code}&userRefereeKind=${userRefereeKind}&companyCode=${companyCode}`);
      });
    }
});
