<template>
  <div class="pb50">
    <div class="mt10 mb10">
      <AddressItem :addr="default_addr"
                   :ismore="true"></AddressItem>
    </div>

    <!--商品-->
    <div class="mb10"
         v-for="(cart_item,k) in cart_lists"
         :key="k">
      <OrderItem :orderData="cart_item"
                 :orderIndex="k"
                 :key="k"
                 :index1="k"
                 :isorder="true"
                 order_type="1"></OrderItem>
      <!--小计-->
      <div class="textr lh44 pr15 fs14 c333 bgfff">
        <span> 共{{cart_item.allNum}}件商品</span>
        <span>{{ lang.text_6 }}<span class="corange fs16 fbold">￥{{cart_item.orderPrice.toFixed(2)}}</span></span>
      </div>
    </div>

    <!--留言-->
    <div class="pl16 pr16 fs16 c38 lh44 bgfff disflex bbf5f6">
      <label for="mark">{{ lang.text_0 }}</label>
      <input id="mark"
             class="fs14 phe8 lh44 h44 pl16 flex1"
             type="text"
             v-model="remark"
             placeholder="选填:填写内容已和卖家协商确认">
    </div>
    <!-- 商品金额 -->
    <div class="pl16 pr16 fs16 c38 lh44 bgfff disflex bbf5f6 disflex jsbet">
      <label for="mark">{{ lang.text_1 }}</label>
      <div class="order-price">￥{{total_money}}</div>
    </div>
    <!-- 优惠券 -->
    <div v-if="showCoupon"
         class="pl16 pr16 fs16 c38 lh44 bgfff disflex bbf5f6 disflex jsbet"
         @click="selectCoupon">
      <div class="disflex coupon-info align-cen">
        <div class="coupon-title">{{ lang.text_2 }}</div>
        <div class="fs12 px15 coupon-btn">{{ lang.text_3 }}</div>
      </div>
      <div class="coupon-right disflex align-cen">
        <div class="coupon-price">-￥{{currentCoupon.price ? currentCoupon.price : 0}}</div>
        <img src="/static/images/right.png"
             alt="">
      </div>
    </div>

    <!--提交-->
    <div class="disflex row-reverse fix_bottom pt5 pb5 lh39 bgfff">
      <span class="bg_line_blue textc cfff fs18 fbold bradius20 w110 mr16"
            @click="toPay">{{ lang.text_4 }}</span>
      <div class="fs16 c38 pr26">
        <span>{{ lang.text_5 }}</span>
        <span class="corange fbold">￥{{actuallyPaid}}</span>
      </div>
    </div>
    <useCoupon :couponLists="couponLists"
               :couponInfo="couponInfo"
               :coupon_lists="coupon_lists"
               :showUseCouponBox="showUseCouponBox"
               @showUserBox="selectCoupon"
               @tabSwitch="tabSwitch"></useCoupon>
  </div>
</template>

<script>
import AddressItem from "@/components/addressItem"; // 订单项
import useCoupon from "@/components/useCoupon"; // 使用优惠券弹窗
import OrderItem from "@/components/orderItem"; // 订单项
import WXAJAX from "../../utils/request";
import LangUtils from '../../utils/LangUtils';

export default {
  name: "",
  components: { AddressItem, OrderItem, useCoupon },
  data() {
    return {
      lang: LangUtils.getLangSrc().orderConfirm,
      showUseCouponBox: false, //是否显示优惠券弹窗
      remark: "",
      showCoupon: false, //默认隐藏优惠券
      cart_lists: [],
      couponLists: [],
      coupon_lists: [], //可以使用的优惠券
      currentCoupon: { price: 0 }, //当前页面优惠券
      couponInfo: {},
      total_money: 0,
      //实付 金额
      actuallyPaid: 0,
      default_addr: {
        name: "",
        tel: "",
        address: ""
      },
      orderId: 0, //订单id
      isLoading: false
    };
  },
  onShow() {
    //获取默认地址
    this.getOrderAddr();
    //查询优惠券
    this.selectUserCouponNotUsed();
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "订单确认"
    });
    let v = this;
    this.total_money = 0;
    v.orderId = this.$root.$mp.query.orderId || 0;
    this.cart_lists = wx.getStorageSync("orderInfo");
    console.log(this.cart_lists);
    this.cart_lists[0].shopcartModelList.map(val=> {
      v.total_money += Number(val.allPrice);
    });
    v.total_money = v.total_money.toFixed(2);
    //实际金额
    v.actuallyPaid = v.total_money;
  },
  methods: {
    selectCoupon(item, index) {
      const result = this.countPrice(item);
      if (index >= 0 && item && result) {
        this.couponLists.forEach((element, i) => {
          if (i == index) {
            this.$set(this.couponLists[i], "isSelect", 1);
          } else {
            this.$set(this.couponLists[i], "isSelect", 0);
          }
        });
      }
      this.showUseCouponBox = !this.showUseCouponBox;
    },
    tabSwitch(id) {
      this.filterCouponTab(id);
    },
    filterCouponTab(id) {
      console.log("优惠券", this.coupon_lists);
      if (this.coupon_lists) {
        const order = wx.getStorageSync("orderInfo");
        if (
          order &&
          order.length > 0 &&
          order[0].shopcartModelList &&
          order[0].shopcartModelList.length > 0
        ) {
          const orderInfo = order[0].shopcartModelList[0];
          if (id == 0) {
            this.couponLists = this.coupon_lists.filter(item => {
              return item.minAmount <= this.total_money;
            });
          } else {
            this.couponLists = this.coupon_lists.filter(item => {
              return item.minAmount > this.total_money;
            });
          }
        }
      }
    },
    selectUserCouponNotUsed() {
      let v = this;
      console.log(
        "COMPANYID--userId",
        wx.getStorageSync("COMPANYID"),
        wx.getStorageSync("userId")
      );
      WXAJAX.POST(
        {
          companyId: wx.getStorageSync("COMPANYID"),
          userId: wx.getStorageSync("userId")
        },
        "",
        "/user/coupon/selectUserCouponNotUsed"
      )
        .then(data => {
          console.log("返回优惠券列表", data);
          if (data && data.length > 0) {
            //计算可以使用的优惠券  有效日期没有开始不能使用
            this.filterCoupon(data);
            this.filterCouponTab(0);
            if (this.couponLists) {
              //默认取第0个折扣
              this.currentCoupon = this.couponLists[0];
              if(this.currentCoupon){
                this.couponInfo = this.currentCoupon;
                this.couponInfo.isSelect = 1;
                this.countPrice(this.currentCoupon);
              }
              this.showCoupon = true;
            }
          } else {
            this.showCoupon = false;
          }
        })
        .catch(err => {
          console.log("优惠券错误返回", err);
          this.showCoupon = false;
        });
    },
    filterCoupon(currentCoupon) {
      const order = wx.getStorageSync("orderInfo");
      if (
        currentCoupon &&
        order &&
        order.length > 0 &&
        order[0].shopcartModelList &&
        order[0].shopcartModelList.length > 0
      ) {
        const orderInfo = order[0].shopcartModelList[0];
        this.coupon_lists = currentCoupon.filter(item => {
          return item.goodstypeId == 0 || orderInfo.goodsId == item.goodsId;
        });
      }
      this.coupon_lists.forEach(item => {
        //可使用优惠券默认状态未可用
        item.couponState = 1;
      });
    },
    //优惠券计算
    countPrice(item) {
      if (item) {
        // 优惠类型1满减，2折扣
        if (item.couponType == 1 && item.couponFaceValue) {
          //计算满减优惠  actuallyPaid
          item.price = item.couponFaceValue;
          if (this.total_money - item.couponFaceValue < 0) {
            wx.showToast({
              title: "不能使用此优惠券",
              icon: "none"
            });
            return null;
          }
          this.actuallyPaid = (this.total_money - item.couponFaceValue).toFixed(
            2
          );
          if(this.actuallyPaid <= 0){
            this.actuallyPaid = 0.01
          }
          this.currentCoupon.price = item.price;
        } else if (item.couponType == 2 && item.couponDiscount) {
          item.price = parseFloat(
            (this.total_money * item.couponDiscount) / 10
          ).toFixed(2);
          if (this.total_money - item.price < 0) {
            wx.showToast({
              title: "不能使用此优惠券",
              icon: "none"
            });
            return null;
          }
          this.actuallyPaid = (this.total_money - item.price).toFixed(2);
          this.currentCoupon.price = item.price;
        }
        return 1;
      }
    },
    getOrderAddr() {
      let v = this;
      WXAJAX.POST({}, "", "/personal/getAddress")
        .then(data => {
          wx.hideLoading();
          for (let i of data) {
            if (i.isdefault == 1) {
              v.default_addr = {
                name: i.receiveName,
                tel: i.receivePhone,
                address: i.locationAddress + i.detailedAddress,
                addressId: i.addressId
              };
              break;
            }
            console.log("default_addr -- ", v.default_addr);
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    getOrderDetail() {
      //获取订单信息
      let v = this;
      WXAJAX.POST(
        {
          ordersIds: v.orderId
        },
        "",
        "/orders/getOrderInfo"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            v.total_money = 0;
            data.forEach(function(item, index1) {
              item.ordersModelList.forEach(function(item2, index2) {
                item2.price /= 100;
                item2.price = item2.price.toFixed(2);
                item2.allPrice /= 100;
                item2.allPrice = item2.allPrice.toFixed(2);
                // let money = item2.price * item2.num;
                // v.count_money.push(money); // 这个变量没有使用
              });
              item.shopcartModelList = item.ordersModelList;
              item.orderPrice /= 100;
              item.orderPrice = item.orderPrice.toFixed(2);
              v.total_money += Number(item.orderPrice);
              v.total_money = v.total_money.toFixed(2);
            });
            v.cart_lists = data;
          }
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    toPay() {
      //订单支付
      if (this.isLoading) return;
      let v = this;
      if (!v.default_addr.addressId || undefined == v.default_addr.addressId) {
        wx.showToast({
          title: "请先添加地址！",
          icon: "none"
        });
        return;
      }

      let list = JSON.parse(JSON.stringify(v.cart_lists));

      list.map(val => {
        val.orderPrice = val.orderPrice * 100;

        val.shopcartModelList.map(item => {
          item.price = item.price * 100;
          item.allPrice = item.allPrice * 100;
        });
      });

      this.isLoading = true;
      // 拼团id  尝试获取拼团的id
      let assembleId = "";
      if (list[0].shopcartModelList && list[0].shopcartModelList.length > 0) {
        assembleId = list[0].shopcartModelList[0].assembleId;
      }
      let params = {}
      if(this.currentCoupon){
        params = {
          orderinfoRequestList: list[0].shopcartModelList,
          addressId: v.default_addr.addressId,
          assembleId,
          remark: v.remark,
          cardId:uni.getStorageSync('CARDID'),
          userCouponId: this.currentCoupon ?  this.currentCoupon.userCouponId : ''
        };
      }else{
        params = {
          orderinfoRequestList: list[0].shopcartModelList,
          addressId: v.default_addr.addressId,
          assembleId,
          cardId:uni.getStorageSync('CARDID'),
          remark: v.remark,
        };
      }

      let level = 1;
      let forwardId = wx.getStorageSync("forwardId");
      let shareInfo = { level, forwardId };
      if (forwardId) {
        params.orderinfoRequestList.forEach(element => {
          element = Object.assign(element, shareInfo);
        });
      }
      WXAJAX.ToPay(params)
        .then(data => {
          console.log(data);
          if(data == true){
            setTimeout(function() {
              this.isLoading = false;
              wx.navigateTo({ url: `../orderLists/main?status=1&pay=ispay` });
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.isLoading = false;
          // setTimeout(function() {
          //   wx.navigateTo({ url: `../orderLists/main?status=1&pay=ispay` });
          // });
        })
    }
  }
};
</script>

<style>
.order-price {
  color: #383838;
}

.coupon-right img {
  width: 20rpx;
  height: 20rpx;
  margin-left: 17rpx;
}

.coupon-info .coupon-btn {
  color: #ffa133;
  border-radius: 10rpx;
  border: 1rpx solid #ffa133;
  height: 50rpx;
  line-height: 50rpx;
  margin-left: 20rpx;
}

.coupon-price {
  color: #fd634e;
}
</style>
