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
               :couponInfo="v">
             </couponBox>
        </div>
        <div v-else>
          <NoData>{{ lang.text_0 }}</NoData>
        </div>
      </div>
      <!--bottom-->
      <div class="textc lh42 fs12 ca8 bgf5f6"
           v-if="nodata && coupon_lists.length">{{ lang.text_1 }}</div>
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
      lang: LangUtils.getLangSrc().coupon.mycoupon,
      canClickStar: true, // 是否可以点击star按钮
      menu: [
        { title: '未使用', status: 0 },
        { title: '已使用', status: 1 },
       ],
      menu_id: 0,
      coupon_lists:[],// 优惠券列表
      nodata: false,//是否已经没有数据
      COMPANYID: 0,
      company_msg: {
        admin_logo: '',
        company_logo: '',
        company_name: ''
      },
      currentPage: 1,
      pageSize : 10,
      pageNum : 1,
      avatarUrl: '',//用户的头像地址,
      scrollContentHeight: 0, //中间滚动区域的高度
      isLoading : false,
    }
  },
  onShow() {
    //获取当前的公司
    let lastCompanyid = this.COMPANYID;
    this.COMPANYID = wx.getStorageSync('COMPANYID') || 0;
    if (lastCompanyid != this.COMPANYID || !this.COMPANYID) {
      this.page = 1;
      this.menu_tap(this.menu_id);
    }
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
          if (newVal.userId === wx.getStorageSync('userId')) {
          } else {
          }
        }
      }
    }
  },
  onPageScroll(e) {

  },
  async onPullDownRefresh() {
    // 停止下拉刷新
    wx.showNavigationBarLoading();
    this.nodata = false;
    this.isLoading = false;
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
      this.nodata = false;
      this.isLoading = false;
    },
    scrolltolower(e) {
      let v = this;
      this.pageNum = this.pageNum + 1;
      if(!this.isLoading){
        // v.getProds();
      }
    },
    getProds(couponState) {//获取产品
      let v = this;
      if (v.isLoading) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;
      httpclient.POST({
        couponState: couponState,//1满减，2折扣
        // couponState:1,//1待使用，2已使用 3 已过期,
        companyId: wx.getStorageSync('COMPANYID'),
        userId: wx.getStorageSync('userId'),
        pageSize : this.pageSize,
        pageNum : this.pageNum
      },'','/user/coupon/myList').then((data)=>{
        console.log("返回优惠券列表",data)
        if(data && data.list && data.list.length > 0){
          data.list.forEach(da =>{
            da.receidved = true;
          })
          this.coupon_lists = data.list;
        }else{
          //表示切换tab查询
          if(this.pageNum == 0){
            this.coupon_lists = [];
          }
        }
        v.isLoading = false;
      }).catch(err=>{
        v.isLoading = false;
        console.log('优惠券错误返回',err)
      })
    },
    menu_tap(id) {
      this.menu_id = id;
      this.pageNum = 0;
      this.nodata = false;
      this.isLoading = false;
      console.log("id:",id)
      this.getProds((id == 0 )  ? 1 : 2);

    }
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
