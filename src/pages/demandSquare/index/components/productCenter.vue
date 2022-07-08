<template>
  <div class="posre borderbox wrapper h100p shopping-mall">
    <div class="product"
         v-if="switchType == 1">
      <scroll-view :style="{height: scrollContentHeight  + 'px'}"
                   class="dynamic-content"
                   :scroll-y="true"
                   :enable-back-to-top="true"
                   :scroll-anchoring="true"
                   :upper-threshold="0"
                   :lower-threshold="0"
                   @scrolltoupper='scrolltoupper'
                   @scrolltolower="scrolltolower">
        <div class="w100p swiper-box">
          <SelfSwiper :imgUrls="rightBanner"
                      :swiper_height_class="true"
                      :self_class="'h211'"
                      :isShowMask="true"
                      @swipclick="preview"
                      :isShowDots="false" />
        </div>

        <div class="bgfff">
          <div class="fs18 cfff disflex pl15 pr16 company-title">
            
            <div class="search-goods"
                 @click="toSearchGoods">
              <img :src="searchImg"
                   alt=""
                   class="w15 h15 mr8">
              请输入产品名称搜索
            </div>
            <div class="flex1 disflex flex-end align-cen" @click="versionSwitching">
              <img :src="versionType == 'vertical' ?  icon_list_1 : icon_list_2" class="w15 h15">
            </div>
          </div>
        </div>

        <div class="pt20">
          <div class="disflex jsbet bgf5f6 pl15 pr16 wrap pb23"
               v-if="prod_lists.length">
            <getPhoneNumberGoods v-for="(v,k) in prod_lists"
                                 :key="k"
                                 :type="versionType"
                                 @next="toProdDetail"
                                 @loginGuide="loginGuide"
                                 :goodInfo="v">
            </getPhoneNumberGoods>
            <LoginIntercept @loginSuccess="loginInterceptSuccess"
                            class="login-intercept" />
          </div>
          <div v-else>
            <NoData>暂无商品</NoData>
          </div>
          <!--lists end-->

        </div>
        <!--bottom-->
        <div class="textc lh42 fs12 ca8 bgf5f6"
             v-if="nodata && prod_lists.length">- 到底了，看看其他的吧 -</div>
      </scroll-view>
    </div>
    <!-- <div class="release_btn disflex jscen align-cen" @click="release_tap">
      <img :src="sendIcon" class="w30 h30">
    </div> -->
    <!-- 商城优惠券 -->
    <!-- <shopCoupon ref="shopCoupon"
                @></shopCoupon> -->
  </div>
</template>

<script>
import getPhoneNumberGoods from "@/components/getPhoneNumberGoods"; //
import AuthenticationTag from "@/components/AuthenticationTag"; //
import WXAJAX from "@/utils/request";
import NoData from "@/components/noData";
import utils from "@/utils";
import { authSubscribeOrder, authSubscribeMessage } from "@/utils/auth.js";
import SelfSwiper from "@/components/swipers"; //
import { mapState, mapGetters } from "vuex";
import LoginIntercept from "@/components/LoginIntercept";
import { addShareRecord } from "@/utils/behavior";
import { toMiniProgram } from "@/utils";

export default {
  name: "",
  components: {
    NoData,
    getPhoneNumberGoods,
    SelfSwiper,
    AuthenticationTag,
    LoginIntercept,
  },
  props:['goodsMenu','prod_lists','rightBanner'],
  data() {
    return {
      canClickStar: true, // 是否可以点击star按钮
      menu_id: -10,
      nodata: false, //是否已经没有数据
      COMPANYID: 0,
      company_msg: {
        admin_logo: "",
        company_logo: "",
        company_name: ""
      },
      currentPage: 1,
      isCollect: false, //是否收藏
      collectionId: 0,
      page: 1,
      isLoading: false, //是否在加载
      right_float_show: false, //右边悬浮框
      nav_top: false,
      banners: [
        "http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png"
      ],
      isShow: true,
      avatarUrl: "", //用户的头像地址,
      
      isShowLoginGuide: true, //是否显示登录引导页,
      targetAvatarUrl: "", //当前目标的人物头像
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0, //整体高度
      versionType:wx.getStorageSync('version') || 'vertical',//商品列表横竖切换
     
      switchType: 1,
      collectImg: WXAJAX.imgBackUrl + "one-stand/products/icon_collect.png",
      slectedImg: WXAJAX.imgBackUrl + "one-stand/products/icon_collect_slected.png",
      discountImg: WXAJAX.imgBackUrl + "one-stand/products/icon_discount.png",
      searchImg: WXAJAX.imgBackUrl + "one-stand/products/icon_search.png",
      shareImg: WXAJAX.imgBackUrl + "one-stand/products/share_gray.png",
      icon_list_1:WXAJAX.imgBackUrl + "yimai_photos/crmRevision/icon_list_1.png",
      icon_list_2:WXAJAX.imgBackUrl + "yimai_photos/crmRevision/icon_list_2.png",
      sendIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/ic_send%402x.png',
      isCollected:wx.getStorageSync('showBayWindow') || '',
      isBayWindow:false,//飘窗显隐
    };
  },
  onLoad(options){
    console.log(options)
  },
  /** tab点击 */
  onTabItemTap(item) {
    //订阅授权 信息相关
    authSubscribeOrder(this.subscriptionNew);
  },
  mounted() {

  },
  async mounted() {
    let a = await utils.systemIfo();
    let navHeight = getApp().globalData.navHeight;
    this.mainHeight = a.windowHeight;
    this.scrollContentHeight = a.windowHeight - navHeight;
  },
  computed: {
    ...mapState({
      currentCompany: state => state.currentCompany
    }),
    ...mapGetters(["subscriptionNew"])
  },
  watch: {
    currentCompany: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (newVal.userId === wx.getStorageSync("userId")) {
            this.isShowTalk = false;
          } else {
            this.isShowTalk = true;
            this.targetAvatarUrl = newVal.logo;
          }
        }
      }
    }
  },

  onShareAppMessage(e) {
    let COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    let CARDID = wx.getStorageSync("CARDID") || 0;

    this.addGoodsForwardRecord(CARDID);
    let uuid = CARDID + "" + new Date().getTime();
    addShareRecord(COMPANYID, 2, "", uuid).then(
      res => {},
      err => {}
    );
    return {
      path:
        "/pages/Products/main?cardId=" +
        CARDID +
        "&companyId=" +
        COMPANYID +
        "&goType=1&shareId=" +
        uuid,
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        });
      },
      fail(e) {
        console.log("失败分享名片--- ", e);
      }
    };
  },
  onPageScroll(e) {
   
  },
  // async onPullDownRefresh() {
  //   wx.showNavigationBarLoading();
  //   this.page = 1;
  //   this.nodata = false;
  //   this.isLoading = false;
  //   //this.getProds();
  //   //this.getMeuns();
  //   this.getcompany();
  //   this.getAd();
  //   this.menu_tap(this.menu_id || "-10");
  //   wx.showLoading();
  //   wx.stopPullDownRefresh();
  //   setTimeout(function() {
  //     wx.hideLoading();
  //     wx.hideNavigationBarLoading();
  //   }, 300);
  // },
  methods: {
    scrolltoupper(e) {
      this.$emit('scrolltoupper')
    },
    // release_tap(){
    //   toMiniProgram(`/pages/companyPack/prodDetail/main`);
    // },
   
    
    //上拉加载更多

    scrolltolower(e) {
      this.$emit('scrolltolower',this.menu_id)
    },
    toSearchGoods() {
      console.log("toSearchGoods");
      wx.navigateTo({ url: "../searchGoods/main?companyId=" + this.COMPANYID });
    },
    preview(idx) {
      this.previewImages(this.banners, this.banners[idx]);
    },
    menu_tap(id) {
      this.menu_id = id || "";
      wx.showLoading();
      this.$emit('getProds',1,id,this.page)
    },
    toProdDetail: utils.throttle(function(id,companyId,goodInfo) {
      wx.setStorageSync('CARDID',goodInfo.cardId)
      wx.setStorageSync('COMPANYID',goodInfo.companyId)
      let prod = this.prod_lists.filter(prod => {
        return prod.goodsId === id;
      })[0];
      wx.setStorageSync("prod", prod);
      wx.navigateTo({ url: "../../prodDetail/main?goodId=" + id + '&companyId=' + companyId + '&type=' + 'demand'});
    }, 1000),
    versionSwitching(){
      if(this.versionType == 'vertical'){
        this.versionType =  'transverse'
        wx.setStorageSync('version','transverse')
      }else{
        this.versionType = 'vertical'
        wx.setStorageSync('version','vertical')
      }

    }
  }
};
</script>

<style scoped>
.shopping-mall {
  position: relative;
}
.company-title {
  height: 70rpx;
  align-items: center;
  display: flex;
}
.menu_more {
  right: 32upx;
  top: 0;
  bottom: 0;
  margin: auto;
}
.nav {
  height: 90upx;
  width: 90%;
  line-height: 88upx;
  font-size: 28upx;
  white-space: nowrap;
  /* position: sticky;
    top: 0; */
  /*   position: fixed;
       top: 0;
       left: 0;
       z-index: 99;*/
}
.nav_top {
  position: sticky;
  background: white;
  /* padding-top: 140upx; */
  /* margin-top: -140upx; */
  top: 0;
  z-index: 100;
}
.nav-item {
  /*width: 20%;*/
  display: inline-block;
  text-align: center;
  margin-right: 48upx;
}

.nav-item.active {
  border-bottom: 4upx solid #51cdcb;
  color: #51cdcb;
  font-weight: bold;
}

.prod_float_right > div {
  bottom: 120upx;
}

/* 商城头部切换 */
.title-tabbar {
  height: 88upx;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  box-sizing: border-box;
  align-items: center;
  padding: 0 30upx;
}
.column-title-box {
  box-sizing: border-box;
  width: 448upx;
  height: 78upx;
  display: flex;
  background-color: #f8f8f8;
  border: 1upx solid #e8e8e8;
  border-radius: 39upx;
}
.column-title {
  transition: all 0.4s;
  width: 224px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a2a0a0;
  border-radius: 39upx;
}
/* .column-title p{
  font-size: 36upx;
  color:#D1D1D1;
  font-weight:bold;
} */
.title-active {
  transition: all 0.4s;
  color: #ffffff !important;
  background-color: #51cdcb;
}
.column-title span {
  display: block;
  position: absolute;
  width: 60upx;
  height: 6upx;
  border-radius: 3upx;
  background-color: #51cdcb;
  bottom: 0;
  margin: 0 auto;
}
.swiper-box {
  box-sizing: border-box;
  padding: 20upx 30upx;
  background-color: #ffffff;
  color: #a8a8a8;
  font-size: 28rpx;
  align-items: center;
}
.search-goods {
  margin-right: 21upx;
  box-sizing: border-box;
  width: 630upx;
  height: 68upx;
  border-radius: 34upx;
  background-color: #f5f5f6;
  color: rgba(168, 168, 168, 1);
  display: flex;
  font-size: 28upx;
  align-items: center;
  padding: 0 41upx 0 41upx;
}
.share-btn {
  position: fixed;
  border-top-left-radius: 20upx;
  border-bottom-left-radius: 20upx;
  line-height: 1;
  top: 300upx;
  right: -6upx;
  width: 118upx;
  height: 40upx;
  background: rgba(245, 245, 246, 1);
  color: rgba(168, 168, 168, 1);
  display: flex;
  font-size: 24upx;
  justify-content: space-between;
  padding: 0upx 21upx;
  align-items: center;
  z-index: 99;
}
.release_btn{
  border-radius: 50%;
  width: 120upx;
  height: 120upx;
  position: fixed;
  bottom: 10%;
  right: 30upx;
  background: rgba(245, 154, 35, 1);
}
</style>
