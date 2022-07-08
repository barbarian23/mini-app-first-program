<template>
    <!-- //1满减，2折扣 -->
   <view class="bgfff coupon-detail disflex">
     <div class="coupon-img-box">
       <!-- 未过期优惠券 -->
       <img src="../static/images/coupon-bg.png" alt="" v-if="couponInfo.couponState == 1">
       <!-- 已过期优惠券 灰色底图 -->
       <img src="../static/images/coupon-bg-out.png" v-if="couponInfo.couponState != 1">
       <div class="fs16 cfff disflex flex-column align-cen coupon-price">
         <div class="disflex align-end mb15">
           <div class="fs28 mr3">
           {{couponInfo.couponType == 1 ? couponInfo.couponFaceValue : couponInfo.couponDiscount}}
           </div>
           <div class="fs13">{{couponInfo.couponType == 1?"元":"折"}}</div>
         </div>
         <div class="fs13 over_1">满{{couponInfo.minAmount}}元可用</div>
       </div>
     </div>
    <div class="ml13 disflex flex-column pr15 flex1 borderbox jsaround coupon-content">
      <div class="disflex jsbet  coupon-top">
        <div class="c38 fs14 over_1 coupon-name">{{couponInfo.name}}</div>
        <!-- 优惠券展示 -->
        <block v-if="!source">
          <!-- 未过期 -->
          <block v-if="couponInfo.couponState == 1">
            <div class="fs12 coupon-button" v-if="couponInfo.receidved != true"
            @click="nowReceive(couponInfo)">{{ lang.text_0 }}</div>
            <div class="fs12 coupon-button coupon-button1"
            v-if="couponInfo.receidved == true" @click="useCoupon(couponInfo)">{{ lang.text_1 }}</div>
          </block>
        </block>
        <block v-if="source">
          <img src="../static/images/noselect.png" alt="" class="select-icon"
          @click="seletCoupon(couponInfo)" v-show="couponInfo.isSelect != 1">
          <img src="../static/images/selected.png" alt="" class="select-icon"
          @click="seletCoupon(couponInfo)" v-show="couponInfo.isSelect == 1">
        </block>
      </div>
      <div class="c78 coupon-info">
        <div class="fs12 mb10 over_1 coupon-time">{{couponInfo.effectiveStartTime}}
        -{{couponInfo.effectiveEndTime}}</div>
        <div class="fs12 over_1 coupon-limit">限:{{couponInfo.companyName || ''}}可用</div>
      </div>
     </div>
     <block>
      <!-- 已过期 -->
      <img src="/static/images/outtime-icon.png" alt=""
      class="sign-icon" v-if="couponInfo.couponState == 3">
      <!-- 已使用 -->
      <img src="/static/images/used-icon.png" alt=""
      class="sign-icon" v-if="couponInfo.couponState == 2">
     </block>
   </view>
</template>

<script>
  const querystring = require("querystring");
  import httpclient from '../utils/request'
  import LangUtils from '../utils/LangUtils';

  export default {
    name: "couponBox",
    props: {
      couponInfo: { // 图数组
        type: Object,
        default: {}
      },
      source:{
       type: String,
       default: ""
      },
      couponIndex:{
       type: String||Number,
       default: ""
      },
    },
    data() {
      return {
        lang: LangUtils.getLangSrc().components.couponBox
      }
    },
    mounted() {
      console.log("当前的couponINfo",this.couponInfo);
    },
    onUnload() {
      this.cur = 0;
    },
    onHide() {
      this.cur = 0;
    },
    methods: {
      nowReceive(couponInfo) {
        console.log("立即领取按钮:",couponInfo);
        httpclient.POST({
          couponId: couponInfo.couponId,
          companyId: wx.getStorageSync('COMPANYID'),
          userId: wx.getStorageSync('userId')
        },'','/user/coupon/receiveCoupon').then((data)=>{
          wx.showToast({
            title: "领取成功,请到个人中心查看",
            duration: 1000,
            icon: "none",
            mask: true
          });
          this.$emit("refresh",);
        }).catch(err=>{
          console.log('立即领取按钮错误返回',err)
        })
      },
      useCoupon(couponInfo) {
        wx.setStorageSync('CARDID',couponInfo.cardId)
        wx.setStorageSync('COMPANYID',couponInfo.companyId)

        wx.switchTab({
          url: '/pages/Products/main'
        })
      },
      seletCoupon (couponInfo){
        this.$emit("selectCoup",couponInfo)
      },
    }
  }
</script>

<style>
  .coupon-detail{
    width: 100%;
    margin: 30rpx 0;
    border-radius: 10rpx;
    background-color: #fff;
    position: relative;
    box-shadow:0px 0px 20px 0px rgba(56,56,56,0.08);
  }

  .coupon-img-box{
    width: 240rpx;
    height: 220rpx;
    position: relative;
  }

  .coupon-img-box img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .coupon-price{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    color: #fff;
  }

  .coupon-name{
    font-weight: bold;
  }

  .coupon-content{
    width: calc(100% - 270rpx);
  }

  .coupon-button{
    width:130rpx;
    height: 40rpx;
    color: #fff;
    line-height: 40rpx;
    text-align: center;
    border-radius: 10rpx;
    background-color: #FCAD3D;
  }

  .coupon-button1{
    color: #FCAD3D;
    background-color: #fff;
    border: 1rpx solid #FCAD3D;
   }

   .sign-icon{
     width: 100rpx;
     height: 100rpx;
     position: absolute;
     bottom: 21rpx;
     right: 21rpx;
   }

   .select-icon{
     width: 40rpx;
     height: 40rpx;
   }
</style>
