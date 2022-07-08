<template>
  <div class="h100p bggray_5 fix_topA"
      :class="isShow ? 'toTop-enter-active' : 'toTop-enter'"
      @click="bg_tap">
    <div
    :style="{paddingTop:navTop}"
    @click.stop=""
    class="w250 h100p bgfff borderbox pl25 pb20"
    >
      <div class="main" >
        <div class="fs20 c38 fbold mb40 flex-sb-c pr22">
          <div class="disflex flex-c-c"  @click="posters_tap">
            <img :src="icon_sginIn1" class="w15 h15 mr3">
            <p class="fs14 cblue bradius15">
              海报图集
            </p>
          </div>
          <div class="h30 borderbox flex-c-c bgblue bradius15 pl12 pr12" @click="sginRecord" v-if="currentPage">
            <img :src="icon_sginIn2" class="w15 h15 mr3">
            <p class="fs14 fbold cfff">{{ lang.text_0 }}</p>
          </div>
        </div>
        <div class="disflex mb40">
          <img class="w60 h60 bradius50p mr20" :src="mainImg" mode="aspectFill">
          <div class="disflex flex-column jsbet">
            <p class="fs18 c38 fbold">{{userName}}</p>
            <p class="fs12 ca7 ">用户id：{{userId || lang.text_9}}</p>
            <p class="fs12 ca7 ">企业id：{{companyId || lang.text_9}}</p>
          </div>
        </div>
        <ul class="pb20">
          <li class="pages_list" @click="page_tap('shopCart')">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/img-shop-cat.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_1 }}</p>
          </li>
          <li class="pages_list" @click="toMSGPage()">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/icon-message.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_2 }}</p>
            <div class="count"
                 v-if="countNum">{{countNum}}</div>
          </li>
          <li class="pages_list" @click="page_tap('orderLists')">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/img-order.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_3 }}</p>
            <div class="count"
                 v-if="orderNum">{{orderNum}}</div>
          </li>
           <li class="pages_list" @click="page_tap('appointmentPack/orderList')">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/img-appointment.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_4 }}</p>

          </li>
          <li class="pages_list" @click="page_tap('distributionCenter/index')">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/img-distribution.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_5 }}</p>
            <img :src="icon_hot" class="h24 w24 ml15">
          </li>
          <li class="pages_list" @click="myCoupon">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/img-card-roll.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_6 }}</p>

          </li>
           <li class="pages_list" @click="page_tap('collect')">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/img-collect.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_7 }}</p>

          </li>
          <li class="pages_list" @click="page_tap('setCenter')">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/signIn/icon_set@2x.png"
               class="w20 h20">
            <p class="ml16">{{ lang.text_8 }}</p>
          </li>
        </ul>
        <div @click="toCrmAPP" class="to_crm w200 h44 bg-gradient-green bradius44 textc lh44 fs18 cblue" style='background:#E5F7F8'>
          前往CRM
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import HandleLogin from "@/utils/handleLogin";
import { mapMutations } from "vuex";
import HandleWebsocket from "@/utils/websocket";
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import WXAJAX from "@/utils/request";
import { authSubscribeOrder } from "@/utils/auth.js";
import { toMiniProgram } from "@/utils";
import { mapActions, mapGetters,mapState } from "vuex";
import LangUtils from '../utils/LangUtils';

export default {
  props:{
    sidebarShow:{
      type:Boolean,
      default: false,
    },
    navTop:{
      type:String,
      default:'',
    },
    currentPage:{
      type:String,
      default:'',
    }
  },
  watch:{
    sidebarShow(val,old){
      if(val){
        this.isShow = true
        this.init()
        this.mainImg = wx.getStorageSync('avatarUrl')
        this.userName = wx.getStorageSync('USERNAME')
        this.userId = wx.getStorageSync('userId')
        this.companyId = wx.getStorageSync('SELFCOMPANYID')
      }else{
        this.isShow = false
      }
    }
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().components.sidebar,
      isShow:false,

      mainImg:'',
      userName:'',
      userId:'',
      companyId:'',
      // userInfo: {
      //   username: "",
      //   logo:
      //     "https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png",
      //   userId: "",
      //   companyId: ""
      // },
      orderNum:0,
      icon_sginIn1:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_poster@2x.png',
      icon_sginIn2:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_signin@2x.png',
      icon_hot:WXAJAX.imgBackUrl + 'yimai_photos/signIn/icon_hot@2x.png'
    };
  },
  computed: {
    ...mapState([
      "countNum",  
    ]),
  },
  methods: {
   bg_tap(){
     this.$emit('sidebar_close')
   },
   init(){
     let hight = getApp().globalData.navHeight
     console.log(hight)
     this.getOrderListCount()
   },
   getOrderListCount: function() {
      // var v = this;
      WXAJAX.POST({}, "", "/orders/getOrderListCount")
        .then(data => {
          if (data) {
            // // 数组过滤处理得到目标值
            // let waitPayOrderNum =
            //   data.filter(item => {
            //     return item.orderState === 1;
            //   }).length > 0
            //     ? data.filter(item => {
            //         return item.orderState === 1;
            //       })[0].num
            //     : 0; // 订单状态（1待付款，2待发货，3待收货，4已完成，5交易取消，6退款成功，0已过期）
            // let waitSendOrderNum =
            //   data.filter(item => {
            //     return item.orderState === 2;
            //   }).length > 0
            //     ? data.filter(item => {
            //         return item.orderState === 2;
            //       })[0].num
            //     : 0;
            // let waitGetPayOrderNum =
            //   data.filter(item => {
            //     return item.orderState === 3;
            //   }).length > 0
            //     ? data.filter(item => {
            //         return item.orderState === 3;
            //       })[0].num
            //     : 0;
            this.orderNum = 0
            for(var i in data){
              if(data[i].orderState !==0 ){
                this.orderNum += data[i].num
              }
            }
          }
        })
        .catch(err => {
          wx.showToast({
            title: err.message,
            icon: "none",
            duration: 2000
          });
        });
    },
    myCoupon() {
      wx.navigateTo({ url: "/pages/coupon/mycoupon/main" });
    },
    // 到达消息页面
    toMSGPage() {
      this.$emit('sidebar_close')
      WXAJAX.ToMSGPage(
        this.companyId || wx.getStorageSync("COMPANYID"),
        () => {}
      );
    },
    page_tap(url, status) {
      this.$emit('sidebar_close')
      authSubscribeOrder(this.subscriptionNew);
      wx.navigateTo({ url: "/pages/" + url + "/main" });
    },
    toCrmAPP() {
      toMiniProgram(`/pages/index/main`);
    },
    sginRecord(){
      this.$emit('sginRecord')
    },
    posters_tap(){
      wx.navigateTo({ url:'../galleryPhotos/index/main' });
    }
  },
  computed: {
    ...mapGetters(["countNum", "subscriptionNew"])
  }
};
</script>

<style scoped>
.toTop-enter{
  transition: all 0.4s;
  width: 0%;
  overflow: hidden;
}
.toTop-enter-active {
  transition: all 0.4s;
  width: 100%;
  overflow: hidden;
}
.pages_list{
  display: flex;
  color: 36upx;
  align-items: center;
  color: #383838;
  position: relative;
}
.count{
  position: absolute;
  bottom:  0upx;
  left: 20upx;
  width: 30upx;
  height: 30upx;
  border-radius: 50%;
  background: #FD634E;
  font-size: 20upx;
  color: #ffffff;
  text-align: center;
  line-height: 30upx;
}
.main{
  display: flex;
  flex-direction: column;
  height: 100%;
}
ul{
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
