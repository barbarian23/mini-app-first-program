<template>
   <view class="w100p posre h100p shop-coupon" v-if="showCouponModel">
    <div class="w100p h100p posab mask"></div>
    <div class="posab shop-coupon-content">
      <img src="/static/images/shop-coupon-bg.png" alt=""
      class="w100p h100p posab shop-coupon-bg">
      <img src="/static/images/close.png" alt="" class="posab close" @click="hiddenShopCoupon">
      <div class="shop-coupon-list">
        <couponBox1 v-if="coupon_lists && coupon_lists.length > 0"
          v-for="(item,index) of coupon_lists"
          :couponInfo="item"
          :key="index">
        </couponBox1>
      </div>
      <div class="fs12 tips">{{ lang.text_0 }}</div>
    </div>
   </view>
</template>

<script>

  import couponBox1 from '@/components/couponBox1'
  import WXAJAX from "../utils/request"; // 商城优惠券
  import LangUtils from '../utils/LangUtils';

  export default {
    name: "shopCoupon",
    components: { couponBox1 },
    props: {
      couponInfo: { // 图数组
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        lang: LangUtils.getLangSrc().components.shopCoupon,
        showCouponModel:false,
        coupon_lists:[
        ],// 优惠券列表
      }
    },
    onLoad(){
    },
    onShow() {
    },
    mounted() {
    },
    onUnload() {
      this.cur = 0;
      this.showCouponModel = false
    },
    onHide() {
      this.cur = 0;
      this.showCouponModel = false
    },
    methods: {
      hiddenShopCoupon () {
        this.showCouponModel = false
      },
      getCompanyCoupon(companyId){
        if(companyId){
          WXAJAX.POST({
            companyId: companyId,
          },'','/user/coupon/grantCoupon').then((data)=>{
            console.log("返回优惠券列表",data)

            if(data && data.length > 0){
              this.showCouponModel = true;
              data.forEach(da =>{
                da.isSelect = 0;
                da.receidved = true;
              })
              this.coupon_lists = data;
            }else{
              this.coupon_lists = [];
            }

          }).catch(err=>{
            console.log('优惠券错误返回',err)
          })
        }
      }
    }
  }
</script>

<style>
  .shop-coupon{
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
  }
  .mask{
    top:0;
    left: 0;
    background: rgba(0,0,0,.7);
  }

  .shop-coupon-content{
    width: 600rpx;
    height: 841rpx;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }

  .shop-coupon-bg{
    top: 0;
    left: 0;
  }

  .close{
    width: 112rpx;
    height: 100rpx;
    top: 0;
    right: 0;
    /* z-index: -1; */
  }

  .shop-coupon-list{
    width: 100%;
    margin-top: 279rpx;
    box-sizing: border-box;
    padding: 0 30rpx 0 40rpx;
  }

  .tips{
    color: #fff;
    position: absolute;
    left: 50%;
    top: 780rpx;
    white-space: nowrap;
    transform: translateX(-50%);
  }
</style>
