<template>
  <div class="posre borderbox wrapper h100p">
    <div class="w100p nav-list">
      <div
           v-for="(navItem,idx) in menu"
           :key="idx"
           :class="['nav-item',menu_id == navItem.status ?'active':'']"
           @click="menu_tap(navItem.status)">{{navItem.title}}
      </div>
    </div>
    <scroll-view :style="{height: scrollContentHeight+'px'}"
                 class="dynamic-content"
                 :scroll-y="true"
                 :enable-back-to-top="true"
                 :scroll-anchoring="true"
                 @scrolltoupper='scrolltoupper'
                 @scrolltolower="scrolltolower">
      <div>
        <div class="bgf5f6 pl15 pr15 pb23"
             v-if="coupon_lists.length">
             <couponBox
               v-for="(v,k) in coupon_lists"
               :key="k"
               @refresh="menu_tap"
               :couponInfo="v">
             </couponBox>
             <!-- coupon_lists -->
        </div>
        <div v-else>
          <NoData>{{ lang.text_0 }}</NoData>
        </div>
      </div>
      <!--bottom-->
      <div class="textc lh42 fs12 ca8 bgf5f6"
           v-if="nodata && prod_lists.length">{{ lang.text_1 }}</div>
    </scroll-view>
  </div>
</template>

<script>
import couponBox from '@/components/couponBox'
import httpclient from '../../../utils/request'
import NoData from '@/components/noData'
import utils from '@/utils'
import { mapState ,mapGetters} from "vuex";
import HandleLogin from "@/utils/handleLogin";
import LangUtils from '../../../utils/LangUtils';

export default {
  name: '',
  components: {  NoData, couponBox },
  data() {
    return {
      lang: LangUtils.getLangSrc().coupon.couponlist,
      canClickStar: true, // 是否可以点击star按钮
      menu: [
        { title: '满减券', status: 0 },
        { title: '折扣券', status: 1 },
       ],
      menu_id: 0,
      prod_lists: [],
      coupon_lists:[

      ],// 优惠券列表
      nodata: false,//是否已经没有数据
      COMPANYID: 0,
      company_msg: {
        admin_logo: '',
        company_logo: '',
        company_name: ''
      },
      currentPage: 1,
      collectionId: 0,
      page: 1,
      isLoading: false,//是否在加载
      avatarUrl: '',//用户的头像地址,
      scrollContentHeight: 0, //中间滚动区域的高度
    }
  },
  onShow() {
    //获取当前的公司
    let lastCompanyid = this.COMPANYID;
    this.COMPANYID = wx.getStorageSync('COMPANYID') || 0;
    if (lastCompanyid != this.COMPANYID || !this.COMPANYID) {
      this.prod_lists = [];
      this.page = 1;
    }
    this.menu_tap('0');
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.avatarUrl = wx.getStorageSync('avatarUrl') || '';
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
        }
      }
    }
  },
  onPageScroll(e) {
    if (e.scrollTop > 200) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })
    }
  },
  async onPullDownRefresh() {
    // 停止下拉刷新
    wx.showNavigationBarLoading();
    this.page = 1;
    this.prod_lists = [];
    this.nodata = false;
    this.isLoading = false;
    this.menu_tap(this.menu_id || 0);
    wx.stopPullDownRefresh();
    setTimeout(function () {
      wx.hideNavigationBarLoading();
    }, 300)
  },
  async mounted() {
    let a = await utils.systemIfo();
    let navHeight = getApp().globalData.navHeight;
    this.scrollContentHeight = a.windowHeight - navHeight;
  },
  methods: {
    //下拉刷新
    scrolltoupper(e) {
    },
    //上拉加载更多
    scrolltolower(e) {
    },
    //隐藏登录引导
    cancelLoginGuide() {
    },
    //头像登录成功的回调
    loginSuccess(url) {
      this.isLogin = true;
      this.hasCard = wx.getStorageSync('hasCard') || false;
      this.avatarUrl = wx.getStorageSync('avatarUrl') || '';
    },
    loginFailed() {
    },
    clickRightRowEvent() {
    },
    checkCollect() {//
      httpclient.checkCollect({
        itemType: 3,
        itemId: this.COMPANYID,
      }).then((data) => {
        this.isCollect = data.status;
        this.collectionId = data.collectionId || 0;
      }).catch((err) => {

      })
    },
    getProds(couponType) {//获取产品
      let v = this;
      if (v.isLoading) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;
      console.log("userId--companyId",wx.getStorageSync('COMPANYID'),wx.getStorageSync('userId'))
      httpclient.POST({
        couponType:couponType,//1满减，2折扣
        // couponState:1,//1待使用，2已使用 3 已过期,
        companyId: wx.getStorageSync('COMPANYID'),
        userId: wx.getStorageSync('userId') || 0,
      },'','/company/coupon/getCompanyCouponList').then((data)=>{
        console.log("返回优惠券列表",data)
        if(data && data.length > 0){
          data.forEach(da =>{
            da.isSelect = 0;
            //公司优惠券默认未使用
            da.couponState = 1;
          })

          this.coupon_lists = data;
          if( this.coupon_lists.length == 0){
            wx.showToast({
              title: "该企业还未发放优惠券!",
              duration: 1000,
              icon: "none",
              mask: true
            });
          }
        }else{
          this.coupon_lists = [];
        }
      }).catch(err=>{
        console.log('优惠券错误返回',err)
      })
    },
    menu_tap(id) {
      this.menu_id = id || '';
      this.page = 1;
      this.nodata = false;
      this.isLoading = false;
      this.prod_lists = [];
      //1满减，2折扣
      this.getProds(this.menu_id == 0 ? 1 : 2);
    },
  },
}
</script>

<style>
.nav-list{
  height:88rpx;
  background: #fff;
  line-height: 88rpx;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
}

.nav {
  height: 90upx;
  width: 100%;
  line-height: 88upx;
  font-size: 28upx;
  white-space: nowrap;
}
.nav_top {
  position: sticky;
  background: white;
  top: 0;
}

.nav-list .active {
  border-bottom: 4rpx solid #51cdcb;
  color: #51cdcb;
  /* font-weight: bold; */
}

/* .nav-item {
  display: inline-block;
  text-align: center;
} */


.prod_float_right > div {
  bottom: 120upx;
}
</style>
