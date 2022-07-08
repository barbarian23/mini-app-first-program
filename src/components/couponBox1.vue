<template>
    <!-- //1满减，2折扣 -->
   <view class="coupon-detail disflex">
    <img src="/static/images/shop-coupon1.png" alt=""
     class="sign-icon" >
     <div class="c333 coupon-img-box">
       <div class="fs16 disflex flex-column align-cen coupon-price">
         <div class="disflex align-end mb5 cdeeporange">
           <div  v-if="couponInfo.couponType == 1">
             <div class="fs13" style="float: left">￥</div>
             <div class="fs28 mr3 " style="float: left">
               {{  couponInfo.couponFaceValue ? couponInfo.couponFaceValue : ''}}
             </div>
           </div>
           <div class="disflex flex-column " style="float: left"  v-if="couponInfo.couponType == 2">
             <div class="fs28 mr3" style="float: left">
               {{ couponInfo.couponDiscount ?  couponInfo.couponDiscount : ''}}
             </div>
             <div class="fs13">{{ lang.text_0 }}</div>
           </div>
         </div>
         <div  class="fs10 ca8 over_1">满{{couponInfo.minAmount}}元可用</div>
       </div>

     </div>
    <div class="pl15 disflex flex-column pr15 flex1 borderbox jscen coupon-content">
      <div class="disflex jsbet c38 fs14 over_1  coupon-top mb12">
        {{couponInfo.name}}
      </div>
      <div class="c78 coupon-info fs12  over_1 over_1">
        {{couponInfo.effectiveStartTime}}
        -{{couponInfo.effectiveEndTime}}
      </div>
     </div>
   </view>
</template>

<script>
import LangUtils from '../utils/LangUtils';

  export default {
    name: "couponBox1",
    props: {
      couponInfo: { // 图数组
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        lang: LangUtils.getLangSrc().components.couponBox1
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
      nowReceive() {
        console.log("立即领取按钮");
      },
      useCoupon() {
        console.log("去使用");
      }
    }
  }
</script>

<style>
  .coupon-detail{
    width: 100%;
    height: 138rpx;
    margin: 30rpx 0;
    border-radius: 10rpx;
    position: relative;
  }

  .coupon-img-box{
    width: 150rpx;
    height: 100%;
    position: absolute;
    top: 0;
    left:0;
  }

  .coupon-img-box img{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }

  .coupon-price{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    justify-content: center;
  }

  .coupon-name{
    font-weight: bold;
  }

  .coupon-content{
    width: calc(100% - 150rpx);
    height: 100%;
    position: absolute;
    left: 150rpx;
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
     width: 100%;
     height: 138rpx;
     position: absolute;
     bottom: 0;
     right: 0;
   }

   .coupon-top{
     font-weight: bold;
   }
</style>
