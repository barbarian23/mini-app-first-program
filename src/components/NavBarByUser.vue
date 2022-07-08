<template>
  <div class="navbar"
       :style="{height: navHeight}">
    <FormId>
      <img @click="dismissLoginGuide"
           v-if="!cancelLoginGuide && !isLogin"
           :style="{height: loginImgHeight, top: navTop}"
           class="login-img"
           src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/land-s.gif" />
      <div class="navbar-user "
           :style="{width: navbarWidth, top: navTop, height: navBarUserHeight}">
        <button v-if="!isLogin && canUseGetUserProfile"
                class="user-info user-open-data"
                @click="GetUserProfile">
          <div  style="height:100%;display:flex;align-items:center;">
            <img :src="mainIcon" style="width:54rpx;height:54rpx">
          </div>
          <span class="user_line"></span>
          <div  style="height:100%;display:flex;align-items:center;">
            <img :src="cartIcon" style="width:54rpx;height:54rpx">
          </div>
          <img class="notLogged" v-if="!isLogin" :src="notLoggedIcon">
        </button>
        <button v-else-if="!isLogin"
                class="user-info user-open-data"
                open-type="getUserInfo"
                @getuserinfo="GetUserInfo">
          <div  style="height:100%;display:flex;align-items:center;">
            <img :src="mainIcon" style="width:54rpx;height:54rpx">
          </div>
          <span class="user_line"></span>
          <div  style="height:100%;display:flex;align-items:center;">
            <img :src="cartIcon" style="width:54rpx;height:54rpx">
          </div>
          <img class="notLogged" v-if="!isLogin" :src="notLoggedIcon">
        </button>
        <div v-else
             class="user-info"
             >
          <div style="height:100%;display:flex;align-items:center;" @click="sidebarShow_tag">
            <img :src="mainIcon" style="width:54rpx;height:54rpx">
          </div>
          <span class="user_line"></span>
          <div style="height:100%;display:flex;align-items:center;" @click="page_turn('shopCart')">
            <img :src="cartIcon" style="width:54rpx;height:54rpx">
          </div>
        </div>
        <div class="posre" @click.stop="increment_tap" v-if="modelSwtich">
          <img :src="incrementIcon"  class="w28 disblock h28">
          <img :src="incrementIcon2" class="w50 h18 increment-img">
        </div>
        <div class="menus">
          <!-- 名片夹 -->
          <div v-if="isShowCardCase"
               class="menus-item">
            <div class="cycle "
                 @click="toCardCase">
              <img :src="cardcaseIcon"
                   class="w28 disblock h28"/>
              <img :src="cardcaseIcon2" class="w40 h16  disblock cardcase">
            </div>
          </div>
          <!--        <GetPhoneNumber-->
          <!--          class="menus-item"-->
          <!--          v-if="isShowCardCase"-->
          <!--          @next="toCardCase"-->
          <!--          isFromUserCenter="true"-->
          <!--        >-->
          <!--        </GetPhoneNumber>-->
          <!-- 购物车 -->
          <!-- <div v-if="isShowShopCar"
               class="menus-item">
            <div class="cycle"
                 @click="page_turn('shopCart')">
              <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/shopping-trolley2.png"
                   alt
                   class="w30 h30" />
            </div>
          </div> -->
        </div>
      </div>
    </FormId>
    <div class="posab" v-if="showIncrement">
      <div class="fixed-mask" @click="closeIncrement"  :style="{marginTop:navHeight}">
        <div class="bgfff h164 bra_bottom_10 pl15 pr15 pt20"  @click.stop="">
          <div class="disflex jsbet">
            <p class="c38 fbold fs15">{{ lang.text_0 }}</p>
            <img :src="closeIcon" class="w15 h15" @click="closeIncrement">
          </div>
          <div class="pl15 pr15 pt25 disflex jsbet">
            <div class="w80 h80 border bradius10 bgf5f6 disflex jscen align-cen flex-column"
                 v-for="(item,index) in incrementTab"
                 :key="index"
                 @click="pages_tap(item.url,item.type)"
                 >
              <img :src="item.icon" class="w20 h20 mb10">
              <p class="c38 fs12">{{item.title}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <sidebar
    :sidebarShow="sidebarShow"
    :navTop="navTop"
    :currentPage="currentPage"
    @sidebar_close="sidebar_close"
    @sginRecord="sginRecord"
    ></sidebar>

  </div>
</template>

<script>
import FormId from "@/components/formId";
import sidebar from "@/components/sidebar"; //
import { mapGetters, mapState, mapMutations } from "vuex";
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import HandleLogin from "@/utils/handleLogin";
import HandleWebsocket from "@/utils/websocket";
import { authSubscribeMessage } from "../utils/auth.js";
import WXAJAX from "../utils/request";
import LangUtils from '../utils/LangUtils';

export default {
  props: {
    isShowCardCase: {
      type: Boolean,
      default: false
    },
    isShowShopCar: {
      type: Boolean,
      default: true
    },
    headPortrait: {
      type: String,
      default: ""
    },
    currentPage:{
      type: String,
      default: ""
    }
    // avatarUrl: {
    //   type: String
    // },
  },
  components: {
    FormId,
    GetPhoneNumber,
    sidebar
  },
  computed: {
    ...mapState({
      isLogin: state => state.isLoginStatus,
      userInfo: state => state.userInfo
    }),
    ...mapGetters(["currentCompany", "subscriptionNew"]),
    isSelf() {
      return this.currentCompany.userId == wx.getStorageSync("userId");
    }
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().components.NavBarByUser,
      navHeight: "", // 导航高度
      navTop: "", // 导航距离顶部的距离
      navbarWidth: "", // 导航宽度
      navBarUserHeight: "", // 顶部菜单和胶囊空间同高
      //是否微信授权获取用户信息
      canIUse: false,
      //用户手动拒绝给予用户权限
      noPermission: false,
      loginImgHeight: "",
      //取消登录引导
      cancelLoginGuide: true,
      mainIcon: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/ic_tab_user.png',
      cartIcon: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/ic_tab_Cart.png',
      notLoggedIcon: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/img_tag_login.png',
      cardcaseIcon: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/ic_tab_cardcase.png',
      cardcaseIcon2: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/img_tag_cardcase.png',
      incrementIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/ic_tab_cardcase@2x.png',
      incrementIcon2:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/img_tag_cardcase@2x.png',
      closeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/ic_close@2x.png',
      sidebarShow: false,
      incrementTab:[{
        title:'需求广场',
        icon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/ic_ demand@2x.png',
        type:1,
        url:'demandSquare'
      },{
        title:'产品中心',
        icon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/ic_shop@2x.png',
        type:2,
        url:'demandSquare'
      },{
        title:'人脉集市',
        icon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/ic_Contacts@2x.png',
        type:1,
        url:'contactsMarket',

        COMPANYID:uni.getStorageSync('')
     }],
      modelSwtich:false, //需求广场开关
      showIncrement:false,
      canUseGetUserProfile: wx.getUserProfile ? true : false
    };
  },
  created(){
    this.getCompanyModelSwtich()
  },
  async mounted() {
    this.authUserInfo();
    this.calculateNavBarHeight();
  },
  methods: {
    ...mapMutations(["setAvatarUrl"]),
    dismissLoginGuide() {
      authSubscribeMessage(this.subscriptionNew);
      // this.$emit('cancelLoginGuide');
      this.cancelLoginGuide = true;
    },
    /**
     * 去用户的个人中心
     */
    goUserCenter() {
      authSubscribeMessage(this.subscriptionNew);
      wx.navigateTo({ url: "../usercenter/main" });
    },
    /**
     * 计算navbar的高度
     */
    calculateNavBarHeight() {
      if (getApp().globalData.menuButtonBounding === 0) {
        getApp().globalData.menuButtonBounding = wx.getMenuButtonBoundingClientRect();
      }
      let menuButtonBounding = getApp().globalData.menuButtonBounding;
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          let navHeight =
            statusBarHeight +
            (menuButtonBounding.top - statusBarHeight) * 2 +
            menuButtonBounding.height; //导航高度
          let navBarUserHeight = navHeight - statusBarHeight;

          this.navHeight = navHeight + "px";
          this.navTop = statusBarHeight + "px";
          wx.setStorageSync('navTop',this.navTop)
          this.navBarUserHeight = navBarUserHeight + "px";
          this.navbarWidth =
            menuButtonBounding.right - menuButtonBounding.width - 20 + "px";
          // 特此说明: 由于动态提示图片的框框部分在原图中的比例为0.36，由此计算出同比例放大缩小的图片大小为一下数据
          this.loginImgHeight = navBarUserHeight / 0.36 + "px";
          getApp().globalData.navHeight = navHeight;
        },
        fail(err) {
          console.log(err);
        }
      });
    },
    /**
     * 获取用户是否已经进行了微信用户授权
     */
    authUserInfo() {

      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.userInfo"]) {
            this.canIUse = true;
          } else {
            this.canIUse = false;
          }
        }
      });
    },
    toCardCase() {
      authSubscribeMessage(this.subscriptionNew);
      //名片夹
      wx.navigateTo({ url: "../cardCase/main" });
    },

    /**
     * 获取用户信息 低版本
     * @param e
     * @constructor
     */
    GetUserInfo(e) {
      const msg = e.target;
      if (!msg.rawData || !msg.signature || !msg.encryptedData || !msg.iv) {
        HandleLogin.showToast();
        return;
      }
      HandleLogin.login(data => {
        HandleLogin.setLoginMessageInStorage(data, false);
        // 进入首页，则需要连接websocket
        HandleWebsocket.connectWebsocket();

        this.$emit("loginSuccess");
      });
    },

    /**
     * 获取用户信息 新版本
     * @param e
     * @constructor
     */
    GetUserProfile(e) {
      let _v = this;
      console.log(this.canUseGetUserProfile)
      wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            HandleLogin.login(
              data => {
                HandleLogin.setLoginMessageInStorage(data, false);
                // 进入首页，则需要连接websocket
                HandleWebsocket.connectWebsocket();
                this.$emit("loginSuccess");
              },
              () => {
                this.loginFailed();
              },res
            );
          }
        })

    },
    //需求广场开关
    getCompanyModelSwtich() {
      var v = this
      WXAJAX.POST(
        {
          companyId: WXAJAX.smartMainId
        },
        "",
        "/businessCard/queryCompanyModelSwtich"
      )
        .then(data => {
          if(data){
            console.log(data)
            for(var i in data){
              if(data[i].modelType == 1){

                v.modelSwtich = data[i].switchState
                console.log(v.modelSwtich)
              }else{
                v.modelSwtich = false
              }
            }
            // if(data[0].modelType == 1){
            //     v.modelSwtich = data[0].switchState
            //     console.log(v.modelSwtich)
            //   }else{
            //     v.modelSwtich = false
            //   }
          }
        })
        .catch(err => {
          ////console.log("获取手机号出错：", err);
        });
    },
    page_turn(url) {
      authSubscribeMessage(this.subscriptionNew);
      wx.navigateTo({
        url:
          "/pages/" +
          url +
          "/main?type=" +
          this.intoType +
          "&cardId=" +
          this.currentCompany.cardId +
          "&userId=" +
          this.currentCompany.userId +
          "&logo=" +
          (this.currentCompany.logo || "") +
          "&wxCode=" +
          (this.currentCompany.personalWx || "") +
          "&phone=" +
          (this.currentCompany.phone || "") +
          "&specId=" +
          (this.specId || "") +
          "&name=" +
          (this.currentCompany.name || "")
      });
    },
    getSelfCard(carid){
      console.log(carid)
      let than = this;
      if(!carid){
        return
      }
      WXAJAX.POST(
        {
          cardId: carid,
        },
        "",
        "/businessCard/cardDetails",
        "1"
      )
        .then(data => {
          if (data) {
            let avatarUrl = data.logo;
            if (avatarUrl) {
              wx.setStorageSync("avatarUrl", avatarUrl);
              than.setAvatarUrl(avatarUrl);
            }
          }
        })
        .catch(err => {
          if (err.code == 401) {
            this.islogin = false;
          }
        });
    },
    loginSuccess() {
      // let avatarUrl = wx.getStorageSync("avatarUrl");
      // this.$emit("update:avatarUrl", avatarUrl);
      this.$emit("loginSuccess");
      this.authUserInfo();
    },
    loginFailed() {
      this.$emit("loginFailed");
    },
    sidebarShow_tag(){
      this.sidebarShow = true
    },
    sidebar_close(){
      this.sidebarShow = false
    },
    increment_tap(){
      this.showIncrement = !this.showIncrement
    },
    closeIncrement(){
      this.showIncrement = false
    },
    pages_tap(url,type){
      if(type == 1){
        wx.navigateTo({
          url:'../'+ url + '/index/main'
        })
      }else{
        wx.navigateTo({
          url:'../'+ url + '/index/main?type=2'
        })
      }
      this.showIncrement = false
    },
    //打卡签到
    sginRecord(){
      this.$emit('sginRecord',false)
    }
  },
  onLaunch() {}
};
</script>
<style scoped>
.navbar {
  width: 100%;
  background-color: #ffffff;
  position: relative;
}
.navbar-user {
  position: absolute;
  width: 100%;
  /*height: 32px;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20upx;
  padding-right: 50upx;
  overflow: hidden;
}
.user-info {
  display: flex;
  /* justify-content: center; */
  align-items: center;
  background: none;
  border: 1upx solid rgba(0,0,0,0.2);
  border-radius: 50upx;
  width: 175upx;
  height: 62upx;
  box-sizing: border-box;
  padding:0 20upx;
  justify-content: space-between;
  position: relative;
  overflow: visible;
}
.user-header {
  width: 70upx;
  height: 70upx;
  margin-right: 20upx;
  overflow: hidden;
  margin-left: 20upx;
  border-radius: 35upx;
}
.user-open-data {
  margin-left: 0 !important;
  margin-right: 25upx;

}
.user_line{
  display: block;
  height: 37upx;
  width: 2upx;
  background:rgba(0,0,0,0.2);
}
.user-header img {
  width: 70upx;
  height: 70upx;
}
.notLogged{
  position: absolute;
  width: 80upx;
  height: 34upx;
  top: -10upx;
  left: 0;
  right: 0;
  margin: auto;
}
.menus {
  width: 25%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.menus-item {
  margin-left: 40upx;
  margin-right:30upx
}
.cycle {
  width: 56upx;
  height: 56upx;
  text-align: center;
  text-align: center;
  position: relative;
}
.cardcase{
  position: relative;
  top: -64upx;
  left: 22upx;
}

.login-img {
  width: 64%;
  position: absolute;
  left: 0;
  z-index: 1000;
}
.increment-img {
  position: absolute;
  top:-10rpx;
  left: 22rpx;
}
.increment_mask{
  transition: all 0.4s;
  height:100vh;

}
.increment_mask_hide{
  transition: all 0.4s;
  height:0vh;

}
</style>
