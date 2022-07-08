<template>
  <div class="posre borderbox wrapper h100p use-coupon" v-if="showUseCouponBox">
    <div class="posab h100p w100p mask" @click="hideCoupon"></div>
    <div class="use-coupon-content">
      <div class="w100p nav-list">
        <div
             v-for="(navItem,idx) in menu"
             :key="idx"
             :class="['nav-item',menu_id == navItem.status ?'active':'']"
             @click="menu_tap(navItem.status)">{{navItem.title}}
        </div>
      </div>
      <scroll-view
                   class="dynamic-content"
                   :scroll-y="true"
                   :enable-back-to-top="true"
                   :scroll-anchoring="true"
                   @scrolltoupper='scrolltoupper'
                   @scrolltolower="scrolltolower">
        <div>
          <div class="bgf5f6 pl15 pr15 pb23 bgfff"
               v-if="couponLists.length">
               <couponBox
                 v-for="(v,k) in couponLists"
                 :key="k"
                 :couponIndex="k"
                 :couponInfo="v"
                 @selectCoup="selectCoup(k,v)"
                 source="use">
               </couponBox>
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
  </div>
</template>

<script>
import couponBox from '@/components/couponBox'
import WXAJAX from '../utils/request'
import NoData from '@/components/noData'
import utils from '@/utils'
import { mapState ,mapGetters} from "vuex";
import HandleLogin from "@/utils/handleLogin";
import LangUtils from '../utils/LangUtils';

export default {
  name: 'useCoupon',
  components: {  NoData, couponBox },
  props: {
    showUseCouponBox: { //
      type: Boolean,
      default: false
    },
    couponLists : {
      type: Array,
      default: false
    },

  },
  data() {
    return {
      lang: LangUtils.getLangSrc().components.useCoupon,
      canClickStar: true, // 是否可以点击star按钮
      menu: [
        { title: '可用优惠券', status: 0 },
        { title: ' 不可用优惠券', status: 1 },
       ],
      menu_id: 0,
      //当前选中
      // coupon_lists:[
      // ],// 优惠券列表
      nodata: false,//是否已经没有数据
      COMPANYID: 0,
      currentPage: 1,
      isCollect: false,//是否收藏
      collectionId: 0,
      page: 1,
      isLoading: false,//是否在加载
      isShow: true,
      isLogin: HandleLogin.returnIsLogin() || false,//是否已经登录
      isShowLoginGuide: true, //是否显示登录引导页,
      scrollContentHeight: 0, //中间滚动区域的高度
    }
  },
  onShow() {
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
    if (e.scrollTop > 200) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ffffff',
        animation: {
          duration: 200,
          timingFunc: 'easeIn'
        }
      });
    }
  },
  async onPullDownRefresh() {
    // to doing..
    // 停止下拉刷新
    wx.showNavigationBarLoading();
    this.page = 1;
    this.nodata = false;
    this.isLoading = false;
    // wx.showLoading();
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
      this.page = 1;
      this.nodata = false;
      this.isLoading = false;
      this.menu_tap(this.menu_id || 0);
    },
    //上拉加载更多
    scrolltolower(e) {
      let v = this;
    },
    //隐藏登录引导
    cancelLoginGuide() {
      this.isShowLoginGuide = false;
    },
    selectCoup (index,item,status) {
      console.log("index:",index)
      console.log("item:",item)
      console.log("status:",status)
      // status 0,1  未选中，选中
      // this.couponLists.forEach((element,i)=>{
      //   if(element.userCouponId == item.userCouponId){
      //     this.$set(this.couponLists[i],'isSelect',1)
      //   } else {
      //     this.$set(this.couponLists[i],'isSelect',0)
      //   }
      // });
      this.$emit('showUserBox',item,index)
    },
    checkCollect() {//
      WXAJAX.checkCollect({
        itemType: 3,
        itemId: this.COMPANYID,
      }).then((data) => {
        this.isCollect = data.status;
        this.collectionId = data.collectionId || 0;
      }).catch((err) => {

      })
    },
    hideCoupon () {
      this.$emit('showUserBox')
    },

    menu_tap(id) {
      this.menu_id = id || '';
      this.page = 1;
      this.nodata = false;
      this.isLoading = false;
      this.$emit('tabSwitch',this.menu_id == "" ? 0 : 1);
    }
  },
}
</script>

<style>
  .use-coupon{
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 99999;
   }
  .use-coupon-content {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 668rpx;
    background-color: #fff;
  }
  .dynamic-content{
    height: 580rpx;
  }
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

.prod_float_right > div {
  bottom: 120upx;
}
.mask{
  background-color: rgba(0,0,0,.7);
}
</style>
