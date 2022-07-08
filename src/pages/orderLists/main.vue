<template>
  <div>

    <!--menu-->
    <div class="disflex jsbet pl16 pr16 lh49 ca8 fs16 ordertype bgfff">
      <span :class="order_type == 1 ? 'active' : '' "
            @click="order_type_tap(1)">{{ lang.text_0 }}</span>
      <span :class="order_type == 2 ? 'active' : '' "
            @click="order_type_tap(2)">{{ lang.text_1 }}</span>
      <span :class="order_type == 3 ? 'active' : '' "
            @click="order_type_tap(3)">{{ lang.text_2 }}</span>
      <span :class="order_type == 4 ? 'active' : '' "
            @click="order_type_tap(4)">{{ lang.text_3 }}</span>
      <span :class="order_type == 5 ? 'active' : '' "
            @click="order_type_tap(5)">{{ lang.text_4 }}</span>
      <!--      <span :class="order_type == 1 ? 'active' : '' "   @click="order_type_tap(1)">{{ lang.text_0 }}</span>-->
      <!--      <span :class="order_type == 2 ? 'active' : '' "   @click="order_type_tap(2)">{{ lang.text_1 }}</span>-->
      <!--      <span :class="order_type == 3 ? 'active' : '' "   @click="order_type_tap(3)">{{ lang.text_2 }}</span>-->
      <!--      <span :class="order_type == 4 ? 'active' : '' "   @click="order_type_tap(4)">{{ lang.text_3 }}</span>-->
      <!--      <span :class="order_type == 5 ? 'active' : '' "   @click="order_type_tap(5)">{{ lang.text_4 }}</span>-->
    </div>

    <!--订单-->
    <div class="pl15 pr15">
      <template v-if="cart_lists.length">
        <div class="mt11 bradius10 overhidden"
             v-for="(cart_item,k) in cart_lists"
             :key="k">
          <OrderItem :orderData="cart_item"
                     :orderIndex="k"
                     :index1="k"
                     :isOrder="true"
                     :order_type="cart_item.refundState == 2?7:order_type"
                     v-if="cart_item.shopcartModelList.length===1"
                     @order_tap="order_tap"></OrderItem>
          <OrderItemRow :orderData="cart_item"
                        :order_type="refundState == 2?7:order_type"
                        @order_tap="order_tap"
                        v-else>
          </OrderItemRow>
          <div class="textr lh44 bgfff pr20"
               v-if="order_type == 1">
            <span class="fs14 c333"> 共{{cart_item.allNum}}件商品 待付款: </span>
            <span class="fs18 c333 pl10 fbold">¥{{cart_item.orderPrice}}</span>
          </div>
          <!--add by willis-->
          <div class="textr lh44 bgfff pr20"
               v-else-if="order_type==2">
            <span class="fs14 c333"> 共{{cart_item.allNum}}件商品 实付款: </span>
            <span class="fs18 c333 pl10 fbold">¥{{cart_item.orderPrice}}</span>
          </div>
          <!--20200319-->
          <div class="textr lh44 bgfff pr20"
               v-else>
            <span class="fs14 c333"> 共{{cart_item.allNum}}件商品 实付款: </span>
            <span class="fs18 c333 pl10 fbold">¥{{cart_item.payPrice}}</span>
          </div>
          <!--退款-->
          <div class="lh44 pl20 bgfff fs14 c38 disflex align-cen"
               v-if="cart_item.refundState == 2">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/refund.png"
                 alt=""
                 class="w16 h16 mr7">
            退款原因：{{cart_item.refundRemark}}
          </div>

          <div class="textr lh30 pt10 pb10 fs14 bgfff pr21">
            <form report-submit
                  @submit="submitOrder">
              <input hidden
                     name="deliverGood"
                     :value='cart_item.ordersId' />
              <span v-if="order_type == 1"
                    class="disinblock textc be8 ca8 bradius20 w90 mr10"
                    @click="showTips(cart_item, 1)">{{ lang.text_5 }}</span>
              <span v-if="order_type == 1"
                    class="disinblock bgblue textc cfff bradius20 w90"
                    @click="toPay(cart_item.ordersId,k)">{{ lang.text_6 }}</span>
              <label class="disinblock textc be8 ca8 bradius20 w90"
                     v-if="cart_item.assembleId? (cart_item.assembleSuccess && order_type == 2): order_type == 2">
                提醒发货
                <button form-type="submit"
                        style="display: none"></button>
              </label>
              <span v-if="order_type == 3"
                    class="disinblock bgblue textc cfff bradius20 w90"
                    @click="showTips(cart_item,4)">{{ lang.text_7 }}</span>
              <span v-if="order_type == 4"
                    class="disinblock textc cblue bradius20 w90 bblue"
                    @click="changeOrder('oneMoreOrder',cart_item.ordersId)">{{ lang.text_8 }}</span>
              <span v-if="cart_item.refundState == 2"
                    class="disinblock textc be8 ca8 bradius20 w90 ml10"
                    @click="changeOrder('cancelRefund',cart_item.ordersId,5)">{{ lang.text_9 }}</span>
              <!-- <span v-if="!cart_item.assembleSuccess && order_type == 2 &&!cart_item.ordersModelList[0].isKill"
                    class="disinblock textc be8 ca8 bradius20 w90 ml10 bgblue cfff"
                    @click="invite(cart_item.assembleId)">{{ lang.text_10 }}</span> -->
              <span v-if="!cart_item.assembleSuccess && order_type == 2 && cart_item.assembleId"
                    class="disinblock textc be8 ca8 bradius20 w90 ml10 bgblue cfff"
                    @click="invite(cart_item.assembleId)">{{ lang.text_10 }}</span>
            </form>
          </div>
        </div>
        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6"
             v-if="nodata">{{ lang.text_11 }}</div>
      </template>
      <div v-else>
        <NoData>{{ lang.text_12 }}</NoData>
      </div>
    </div>
    <div class="textc disflex w60 h60 bradius50p bgblue disinblock goToUserCenter"
         @click="page_turn('usercenter')">
      <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_add.png"
           alt=""
           class="w30 h30 mt15">
    </div>

    <div v-if="isShowCancelOrderBox">
      <DialogBox :dialog_title="'提示'"
                 @btn_tap="cancelOrder"
                 :dialog_ph="tipsTitle"
                 :type="'hint2'"
                 :left="'取消'"
                 :right="'确定'"></DialogBox>
    </div>

  </div>
</template>

<script>
import OrderItem from "@/components/orderItems"; // 订单项
import OrderItemRow from "@/components/orderItemRow"; // 订单项
import WXAJAX from "../../utils/request";
import DialogBox from "@/components/dialogBox"; // 对话框
import NoData from "@/components/noData";
import LangUtils from '../../utils/LangUtils';

export default {
  name: "",
  components: {
    OrderItem,
    OrderItemRow,
    NoData,
    DialogBox
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().orderLists,
      order_type: 1,
      cart_lists: [],
      page: 1,
      loading: false,
      isLoading: false, //是否在加载
      nodata: true, //是否已经没有数据
      isShowCancelOrderBox: false,
      currentOrder: {},
      tipsTitle: "确定要撤销该订单吗？",
      currentOperationType: 0,
      ispay: ""
    };
  },
  onLoad(options) {
    this.ispay = options.pay;
  },
  onUnload() {
    // if (this.ispay == "ispay") {
    //   uni.navigateBack({
    //     delta: 2
    //   });
    // }
  },
  onShow() {
    let lastOrderType = this.order_type
    this.order_type = this.$root.$mp.query.status || lastOrderType;
    this.page = 1;
    this.cart_lists = [];
    this.inits();
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "订单"
    });
  },
  async onPullDownRefresh() {
    this.page = 1;
    this.cart_lists = [];
    this.inits();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1.5 * 1000);
  },
  methods: {
    showTips(orderInfo, type) {
      if (type == 1) {
        this.tipsTitle = "确定要撤销该订单吗？";
      } else if (type == 4) {
        this.tipsTitle = "是否确认收货？";
      }
      this.currentOperationType = type;
      this.currentOrder = orderInfo;
      this.isShowCancelOrderBox = true;
    },
    cancelOrder(str) {
      if (str == "save") {
        if (this.currentOperationType == 1)
          this.changeOrder("cancel", this.currentOrder.ordersId);
        if (this.currentOperationType == 4) {
          this.changeOrder("getGood", this.currentOrder.ordersId);
        }
      }
      this.isShowCancelOrderBox = false;
    },
    page_turn(url) {
      wx.navigateTo({
        url: "../" + url + "/main"
      });
    },
    //邀请拼团
    invite(assembleId) {
      wx.navigateTo({
        url: "../assembleDetail/main?assembleId=" + assembleId
      });
    },
    inits() {
      //获取订单
      let v = this;
      if (v.isLoading) {
        return;
      }
      v.isLoading = true;
      wx.showLoading();
      WXAJAX.POST(
        {
          orderState: v.order_type,
          pageNum: v.page
        },
        "",
        "/orders/getOrderList"
      )
        .then(data => {
          if (data) {
            let _datas = [];
            data.forEach(i => {
              if (i.ordersModelList) {
                i.ordersModelList.forEach(i2 => {
                  i2.price /= 100;
                  i2.price = i2.price.toFixed(2);
                  i2.killPrice /= 100;
                  i2.killPrice = i2.killPrice.toFixed(2);
                });
                i.cardId = i.companyId;
                i.goodsId = i.ordersModelList[0].goodsId;
                i.goodsName = i.ordersModelList[0].goodsName;
                i.specId = i.ordersModelList[0].specId;
                i.specids = []
                for(var s in i.ordersModelList[0].specModels){
                  i.specids.push(i.ordersModelList[0].specModels[s].specId)
                }
                i.num = i.allNum;

                i.specNum = i.ordersModelList[0].num;
                i.allNum = 0;
                i.ordersModelList.forEach(item => {
                  i.allNum += item.num;
                });
                // i.allNum = i.ordersModelList.length;
                i.shopcartModelList = i.ordersModelList;
                i.orderPrice /= 100;
                i.allPrice = i.orderPrice;
                i.orderPrice = i.orderPrice.toFixed(2);
                i.payPrice /= 100;
                // console.log("当前的orderPrice",i.orderPrice)
                i.price = i.orderPrice / i.num;
                i.payPrice = i.payPrice.toFixed(2);
                _datas.push(i);
              }
            });
            console.log("cart_lists", data);
            v.cart_lists = [...v.cart_lists, ..._datas];
            for(var i in v.cart_lists){
              let arrs = v.cart_lists[i].ordersModelList[0].specModels
              v.cart_lists[i].shopcartModelList[0].specName = ''
              v.cart_lists[i].shopcartModelList[0].killPrice = 0
              v.cart_lists[i].shopcartModelList[0].specPrice = 0
              for(var j in arrs){
                v.cart_lists[i].shopcartModelList[0].specName += arrs[j].specAttribute + ';'
                v.cart_lists[i].shopcartModelList[0].killPrice += arrs[j].killPrice/100
                v.cart_lists[i].shopcartModelList[0].specPrice = v.cart_lists[i].shopcartModelList[0].allPrice/100
              }
              v.cart_lists[i].shopcartModelList[0].killPrice.toFixed(2)
            }
            v.page++;
            setTimeout(function() {
              v.isLoading = false;
            }, 500);
          } else {
            setTimeout(function() {
              v.nodata = true;
              v.isLoading = false;
            }, 500);
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    },
    submitOrder(e) {
      let formId = e.mp.detail.formId;
      let _url = "/orders/doReminder",
        params = {
          ordersId: e.mp.detail.value.deliverGood,
          formId: formId
        };
      wx.showLoading();
      let v = this;
      WXAJAX.POST(params, "", _url)
        .then(data => {
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: "操作成功！",
              icon: "success",
              duration: 1000
            });
            if (type == "oneMoreOrder") {
              v.order_type = 1;
            }
            setTimeout(function() {
              v.reset();
              v.inits();
            }, 800);
          }
        })
        .catch(err => {
          wx.hideLoading();
          console.log(err);
        });
    },
    //递归查找订单每项规格
    getCurrentPart(specAttribute,items){
      let result ;
      for (var i in items){
        let item = items[i];
        if(item.specAttribute == specAttribute){
          result = item.specAttribute
          break
        }else if(item.specModels){
          result = getCurrentPart(items[i],specAttribute)
        }
      }
    },

    order_type_tap(type_id) {
      //选择订单类型
      this.order_type = type_id;
      this.reset();
      this.inits();
    },
    order_tap(orderIds) {
      wx.setStorageSync("orderState", this.order_type);
      this.reset();
      wx.navigateTo({
        url:
          "../orderDetail/main?orderIds=" +
          orderIds +
          "&orderState=" +
          this.order_type
      });
    },
    toPay(orderId, k) {
      console.log(this.cart_lists[k].addressId,)
      console.log([this.cart_lists[k]])
      //订单支付
      WXAJAX.ToPay(
        {
          ordersId: orderId,
          addressId: this.cart_lists[k].addressId,
          orderinfoRequestList: [this.cart_lists[k]]
        },
        "/orders/goTwoPay"
      )
        .then(data => {

          if(data){
            setTimeout(()=>{
              console.log(data)
              this.order_type = 2;
              this.reset();
              this.inits();
            },2000)
          }else{

          }


        })
        .catch(err => {
          console.log(err)
        });
    },
    changeOrder(type, orderId, status) {
      //订单操作
      if (this.loading) return;
      let _url = "",
        params = {};
      switch (type) {
        case "cancel": //撤销订单
          _url = "/orders/updateOrderState";
          params = {
            ordersId: orderId,
            orderState: 5
          };
          break;
        case "payNow": //立即支付
          this.reset();
          wx.navigateTo({
            url: "../orderConfirm/main?orderId=" + orderId
          });
          return;
        case "deliverGood": //提醒发货
          _url = "/orders/doReminder";
          params = {
            ordersId: orderId
          };
          break;
        case "getGood": //确认收货
          _url = "/orders/updateOrderState";
          params = {
            ordersId: orderId,
            orderState: 4
          };
          break;
        case "cancelRefund": //  撤销退款
          _url = "/orders/backRefundState";
          params = {
            ordersId: orderId
          };
          break;
        case "oneMoreOrder": //再来一单
          _url = "/orders/anotherOrder";
          params = {
            ordersId: orderId
          };
          break;
      }
      wx.showLoading();
      let v = this;
      this.loading = true;
      WXAJAX.POST(params, "", _url)
        .then(data => {
          this.loading = false;
          wx.hideLoading();
          if (data) {
            wx.showToast({
              title: "操作成功！",
              icon: "success",
              duration: 1000
            });
            setTimeout(() => {
              if (type == "oneMoreOrder") {
                v.order_type = 1;
              }
              if (type == "getGood") {
                v.order_type = 4;
              }
              v.reset();
              v.inits();
            }, 800);
          }
        })
        .catch(err => {
          this.loading = false;
          wx.hideLoading();
          console.log(err);
          wx.showToast({
            title: err.message,
            duration: 2000,
            icon: "none"
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    reset() {
      this.page = 1;
      this.nodata = false;
      this.isLoading = false;
      this.cart_lists = [];
    }
  },
  onReachBottom() {
    let v = this;
    v.inits();
  }
};
</script>

<style>
.ordertype .active {
  color: #51cdcb;
  border-bottom: 6upx solid #51cdcb;
}

.goToUserCenter {
  position: fixed;
  right: 20upx;
  bottom: 90upx;
  z-index: 99;
  box-sizing: border-box;
  text-align: center;
}
</style>
