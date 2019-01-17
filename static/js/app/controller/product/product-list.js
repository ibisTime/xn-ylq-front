define([
  'app/controller/base',
  'app/interface/ProductCtr'
], function(base, ProductCtr) {
  var code = base.getUrlParam("code") || '';
  var userRefereeKind = base.getUrlParam("userRefereeKind") || '';
  var companyCode = base.getUrlParam("companyCode") || '';
  var config = {
    start: 1,
    limit: 10,
    orderDir: '1',
    companyCode: companyCode,
    status: 1
  }, isEnd = false, canScrolling = false;

    init();

  function init(){
    ProductCtr.read({
      code: code,
      type: 0
    });
    getPageProduct();
    addListener();
  }
//分页查询产品
  function getPageProduct(refresh) {
    base.showLoading();
    return ProductCtr.getProducList(config, refresh).then((data) => {
      var lists = data.list;
      var totalCount = +data.totalCount;
      if (totalCount <= config.limit || lists.length < config.limit) {
        isEnd = true;
      } else {
        isEnd = false;
      }
      if(data.list.length) {
        var html = '';
        lists.forEach(item => {
          html += buildHtml(item);
        })
        $(".product-list-container")[refresh || config.start == 1 ? "html" : "append"](html);
        isEnd && $("#loadAll").removeClass("hidden");
        config.start++;
      } else if(config.start == 1) {
        base.gohref(`./../user/register.html?code=${code}&userRefereeKind=${userRefereeKind}&companyCode=${companyCode}`);
        $(".product-list-container").html('<div class="no-data-img"><p>暂未发布产品</p></div>');
        $("#loadAll").addClass("hidden");
      } else {
        base.gohref(`./../user/register.html?code=${code}&userRefereeKind=${userRefereeKind}&companyCode=${companyCode}`);
        $("#loadAll").removeClass("hidden");
      }
      !isEnd && $("#loadAll").addClass("hidden");
      canScrolling = true;
      base.hideLoading()
    }, () => base.hideLoading());
  }

  function buildHtml(item){
    return `<div class="product-item" style="background: ${item.color}" data-code="${item.code}">
        <div class="item-content">
            <div class="amount">
                <span class="amount-top">借款金额</span>
                <span class="amount-bottom">¥${base.formatMoney(item.amount)}</span>
            </div>
            <div class="level">
                LV.${item.level}
            </div>
            <div class="time">
                <span class="time-top">借款期限</span>
                <span class="time-bottom">${item.duration}天</span>
            </div>
        </div>
        <div class="more">
            <img src="/static/images/more.png">
        </div>
    </div>`
  }

    function addListener(){
      // 产品项点击事件
      $(".product-list-container").on("click", ".product-item", function (){
        location.href="../product/product-detail.html?productCcode="+$(this).attr("data-code") + '&code=' + code + '&userRefereeKind=' + userRefereeKind + '&companyCode=' + companyCode;
      })

    }
});
