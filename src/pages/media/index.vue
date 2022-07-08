<template>
  <div class="videobgcss">
    <!-- <div class="videobgcss-wrap" v-if="state"> -->
    <div class="videobgcss-wrap"
         v-if="state">
      <div :style="{height: statusBarHeight + 'px'}"></div>
      <tabVideo class="videobgcss-tab"
                :tab-list="tabList"
                :tabCur="TabCur"
                @change="tabChange"
                tab-class="text-black"
                :tab-hight="navHeight"
                :tab-style="CustomBar">
      </tabVideo>

      <scroll-view class="dynamic-content"
                   :scroll-y="true"
                   :enable-back-to-top="true"
                   :scroll-anchoring="true"
                   @scrolltoupper='scrolltoupper'
                   @scrolltolower="scrolltolower">

        <!--      <swiper :current="TabCur" class="swiper" duration="300" :circular="true" indicator-color="rgba(255,255,255,0)" indicator-active-color="rgba(255,255,255,0)" @change="swiperChange">-->
        <!--        <swiper-item v-for="(item,index) in tabList" :key="index">-->
        <div v-if="TabCur == 0" style="height:100%">
          <!-- 短视频组件 -->
          <shortVideo :refresh="refresh"
                      ref="video"
                      @showState="showState"
                      @primary="primary"
                      :forwardId="videoId"
                      :companyId="companyId"></shortVideo>
          <!-- 推荐商品组件 -->
          <videoGoodsList ref="chooseImg"
                          :title="title"
                          :isShowImgTitle="true"
                          @toCarmea="toCarmea"
                          @toPhoto="toPhoto"
                          @primary="primary"></videoGoodsList>
        </div>
        <div class="live-com"
             v-if="TabCur == 1">
          <liveCom v-for="(v,k) in lives"
                   :key="k"
                   :liveInfo="v">
          </liveCom>
        </div>
      </scroll-view>
    </div>
    <!--此为过审用的背景图-->
    <div class="video-banner"
         v-else>
      <image :src="maskImg"></image>
    </div>
  </div>
</template>

<script>
import WXAJAX from "../../utils/request";
import tabVideo from "@/components/tabVideo.vue";
import liveCom from "@/components/liveCom";
import {obj2style} from "./index";
import {dateFormat} from "../../utils/index";
import {mapActions, mapGetters} from "vuex";
import shortVideo from "@/components/shortVideo";
import tools from "../../utils/index";
import videoGoodsList from "@/components/videoGoodsList";

export default {
  components: {tabVideo, liveCom, shortVideo,videoGoodsList},
  name: "index",
  data() {
    return {
      navHeight: 0,
      statusBarHeight: 0,
      COMPANYID: 0,
      companyInfo: {}, //公司信息
      start: 1,
      limit: 10,
      lives: [
        // {"companyLogo":"https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-stand/photo/20190509/1557371649618.jpg","companyName":"xxxx","name":"QIXIFUXIN","roomid":3,"liveStatus":107,"coverImg":"http://mmbiz.qpic.cn/mmbiz_png/4ZWrn4No0IZwVq3UibibicKe2nwY133Etvkklb5cnj5tN50EOSO45rzKJAmeOpMH0LSACWyx4oUgByfMYeRbLYgdQ/0"
        // ,"shareImg":"http://mmbiz.qpic.cn/mmbiz_png/4ZWrn4No0IZwVq3UibibicKe2nwY133Etvkklb5cnj5tN50EOSO45rzKJAmeOpMH0LSACWyx4oUgByfMYeRbLYgdQ/0","startTime":1589878800,"endTime":1589904000,
        // "anchorName":"QIXIFUXIN"},
        // {"name":"直播直播","roomid":4,"liveStatus":103,"coverImg":"http://mmbiz.qpic.cn/mmbiz_png/4ZWrn4No0IZwVq3UibibicKe2nwY133Etvkklb5cnj5tN50EOSO45rzKJAmeOpMH0LSACWyx4oUgByfMYeRbLYgdQ/0",
        //   "shareImg":"http://mmbiz.qpic.cn/mmbiz_png/4ZWrn4No0IZwVq3UibibicKe2nwY133Etvkklb5cnj5tN50EOSO45rzKJAmeOpMH0LSACWyx4oUgByfMYeRbLYgdQ/0","startTime":1589860793,"endTime":1589861018,
        //   "anchorName":"直播直播"}
      ],
      TabCur: 0, //0短视频 1直播
      refresh: false,
      state: false,
      //视频数据
      vlist: "",
      companyId: "",
      vcompanyId: "",
      videoId: "",
      maskImg:
        "https://you-one-stand.oss-cn-shanghai.aliyuncs.com/marketing/video_banner.jpg"
    };
  },
  onLoad(options) {
    if (options.companyId) {
      this.companyId = options.companyId;
      this.videoId = options.videoId;
      console.log('options',options);
      wx.setStorageSync("COMPANYID", options.companyId);
      wx.setStorageSync("CARDID", options.cardId);
    }else if(this.$store.state.codeVideoId){
      this.videoId = this.$store.state.codeVideoId
    }
  },
  onShow() {
    this.COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    this.companyId = wx.getStorageSync("COMPANYID");
    let isLogin = wx.getStorageSync("isLogin");
    if (isLogin == true) {

      setTimeout(()=>{
        this.$refs.video.getSmallVideo("1", this.companyId);
        //this.$refs.video.getViedo(this.videoId);
      },1000)



      this.getcompany();
      this.getSwitchVideo();
      this.refresh = true;
    } else {
      wx.setStorageSync('showLogin', true)
      wx.switchTab({
        url: '/pages/index/main'
      })
      this.state = false;
      this.maskImg =
        "https://you-one-stand.oss-cn-shanghai.aliyuncs.com/marketing/video_banner.jpg";
    }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShareAppMessage: function (res) {
    let videoId = this.$store.state.videoId;
    let selfCardId = wx.getStorageSync("SELFCARDID");
    let selfCompanyId  = wx.getStorageSync("SELFCOMPANYID");
    let currentCardId = wx.getStorageSync("CARDID");
    let currentCompanyId = wx.getStorageSync("COMPANYID");
    let companyId = '';
    let cardId = '';
        if(selfCompanyId !== currentCompanyId){
          cardId = currentCardId
          companyId = currentCompanyId
        }else{
          cardId = selfCardId
          companyId = selfCompanyId
        }
    return {
      title: "",
      path: `pages/media/index?companyId=${companyId}&cardId=${cardId}&videoId=${videoId}`
    };
  },
  onShareTimeline() {

  },
  async onPullDownRefresh() {
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    setTimeout(function () {
      wx.hideNavigationBarLoading();
    }, 300);
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "视频"
    });
    this.calculateNavBarHeight();
  },
  methods: {
    //计算高度
    calculateNavBarHeight() {
      let menuButtonBounding = wx.getMenuButtonBoundingClientRect();
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          //console.log(statusBarHeight)
          let navHeight =
            statusBarHeight +
            (menuButtonBounding.top - statusBarHeight) * 2 +
            menuButtonBounding.height; //导航高度

          getApp().globalData.navHeight = navHeight;
          this.statusBarHeight = statusBarHeight;
          this.navHeight = navHeight - statusBarHeight;
          //console.log(this.navHeight)
        },
        fail(err) {
          //console.log(err);
        }
      });
    },
    init() {
      wx.showLoading({
        title: "加载中"
      });
      this.getShortVideo();
    },
    // getSmallVideo(page) {
    //   var than = this;
    //   let data = {
    //     // this.companyId ||
    //     pageNum: page || 1,
    //     companyId: this.companyId || 67
    //   };
    //   WXAJAX.POST(data, "", "/shortVideo/queryPage").then(data => {
    //     if (data.list) {
    //       data.list.forEach(item => {
    //         item.uploadTime = than.getDateConversion(item.uploadTime);
    //         item.uploadTime = tools.getFormatTime(item.uploadTime);
    //       });
    //       if (this.page === 1) {
    //         this.vlist = data.list;
    //       } else {
    //         this.vlist.concat(data.list);
    //       }
    //       //console.log(this.vlist)
    //       this.videoLeg = this.vlist.length;
    //     } else {
    //       this.ispage = false;
    //     }

    //     this.init();
    //   });
    // },
    getShortVideo: function () {
      const data = {
        data: {
          start: this.limit * (this.start - 1),
          limit: this.limit * this.start
        }
      };
      WXAJAX.POST(data, "", "/live/queryLiveList")
        .then(data => {
          if (data && data.roomInfo) {
            data.roomInfo.forEach(item => {
              item.companyLogo = this.companyInfo.companyLogo || "";
              item.companyName = this.companyInfo.companyName || "";
              item.startTime = this.formatStartDate(
                new Date(item.startTime * 1000)
              );
              item.endTime = this.formatEndDate(new Date(item.endTime * 1000));
            });
            this.lives = data.roomInfo;
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.showToast({
            title: err.message,
            icon: "none",
            duration: 2000
          });
          wx.hideLoading();
        });
    },
    getSwitchVideo() {

      if (wx.getStorageSync("COMPANYID")) {
        let data = {
          companyId: wx.getStorageSync("COMPANYID")
        };
        WXAJAX.POST(data, "", "/video/switchVideo")
          .then(res => {
            this.state = res.state;
          })
          .catch(err => {
          });
      }
    },
    formatStartDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return month + "月" + date + "日 " + hour + ":" + minute;
    },
    formatEndDate(now) {
      var year = now.getFullYear();
      var month = now.getMonth() + 1;
      var date = now.getDate();
      var hour = now.getHours();
      var minute = now.getMinutes();
      var second = now.getSeconds();
      return hour + ":" + minute;
    },
    //下拉刷新
    scrolltoupper(e) {
      // this.start = this.start + 1;
      // this.init();
    },
    //上拉加载更多
    scrolltolower(e) {
      this.start = this.start + 1;
      this.init();
    },
    tabChange(index) {
      this.TabCur = index;
      this.cleanTimers();
    },
    swiperChange(e) {
      let {current} = e.target;
      this.TabCur = current;
    },
    // 到达消息页面
    toMSGPage() {
      WXAJAX.ToMSGPage(
        this.userInfo.companyId || wx.getStorageSync("roleId"),
        () => {
        }
      );
    },
    page_tap(url, status) {
      if (status) {
        wx.navigateTo({url: "/pages/" + url + "/main?status=" + status});
      } else {
        wx.navigateTo({url: "/pages/" + url + "/main"});
      }
    },

    getDateConversion(data) {
      let phoneSystem = "";
      wx.getSystemInfo({
        success: function (res) {
          phoneSystem = res.system;
        }
      });
      if (phoneSystem.indexOf("iOS") != -1) {
        data = data.replace(/-/g, "/");
      }
      return Date.parse(data);
    },

    /**
     * 设置当前页面所需要的用户信息
     */
    setUserInfo() {
      //取默认本地名片名称，如果没有则取
      this.userInfo.username = wx.getStorageSync("USERNAME_CARD")
        ? wx.getStorageSync("USERNAME_CARD")
        : wx.getStorageSync("USERNAME");
      this.userInfo.logo = wx.getStorageSync("AVATARURL_CARD")
        ? wx.getStorageSync("AVATARURL_CARD")
        : wx.getStorageSync("avatarUrl");
      this.userInfo.userId = wx.getStorageSync("userId") || "";
      this.userInfo.companyId = wx.getStorageSync("roleId") || "";
    },
    getcompany() {
      //获取公司信息
      let v = this;
      WXAJAX.POST(
        {
          companyId: v.COMPANYID
        },
        "",
        "/goods/getCompanyInfo/V2"
      )
        .then((data, code) => {
          if (data) {
            v.companyInfo = {
              companyLogo: data.companyLogo,
              companyName: data.companyName
            };
            this.init();
          }
        })
        .catch(err => {
          this.company_msg = {};
        });
    },
    primary() {
      this.$refs.chooseImg.show()
    },
    showState() {
      this.state = false;
    },
    //打开相机
    toCarmea() {
      this.$refs.chooseImg.hide()
    },
    toPhoto() {
    //打开相册
    },
    cleanTimers(){
      if(this.$refs.video && this.$refs.video.timer){
        //清理定时器
        clearInterval(this.$refs.video.timer);
        this.$refs.video.timer = null;
        console.log("destroyed",this.$refs.video.timer);
      }
    }
  },
  computed: {
    CustomBar() {
      let style = {};
      // #ifdef MP-WEIXIN
      const systemInfo = uni.getSystemInfoSync();
      let CustomBar =
        systemInfo.platform === "android"
          ? systemInfo.statusBarHeight + 50
          : systemInfo.statusBarHeight + 45;
      style["top"] = CustomBar + "px";
      // #endif
      // #ifdef H5
      style["top"] = 0 + "px";
      // #endif
      return obj2style(style);
    }
  },
  onHide() {
    this.cleanTimers();
  },
};
</script>

<style>
page {
  background-color: #000000;
}

.videobgcss {
  background-color: #000000;
  width: 100%;
  color: white;
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.videobgcss-wrap {
  display: flex;
  height: 100%;
  flex-direction: column;
}

.text-black {
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  text-shadow: 0px 1px 4px rgba(56, 56, 56, 0.3);
}

scroll-view {
  flex: 1;
  overflow: auto;
}

.live-com {
  flex: 1;
  overflow: auto;
}

.video-banner {
  width: 100%;
  height: 100%;
}

.video-banner image {
  width: 100%;
  height: 100%;
}

.short-video-list {
  height: 100vh;
}
</style>
