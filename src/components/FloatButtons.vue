<template>

    <FormId>
      <div class="float-buttons posre flex-sa-c" :class="bayWindow ? 'bay-window' : ''" @click="authSubscribeMessage">
    <!-- 人脉集市 -->
    <!-- <div class="custom-cycle talk" @click="market">
      <div class="market bgblue small-cycle flex-c-c">
        <p class="fs14 cfff market-title">{{ lang.text_0 }}</p>
      </div>
    </div>-->
    <div class="custom-cycle talk" v-if="isShowTalk">
      <div class="posre user_box" @click.stop="talk">
          <img
          class="small-cycle"
          :src="avatarUrl||'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'"
          alt
        />
        <p class="fs10 talkB bgblue cfff">{{ lang.text_1 }}</p>
      </div>
      <div class="w50 h40 mt10 disflex jscen align-cen"  @click="BayWindow_tap">
        <img :src="foldIcon" class="w15 h15 foldIcon">
      </div>

    </div>
      <!-- <span class="Tips" v-if="unreadMessages">{{unreadMessages}}</span> -->
      <PhoneNumberIntercept class="login-intercept"/>
      <LoginIntercept @loginSuccess="loginInterceptSuccess" class="login-intercept"/>
    <div class="bgicon w160 h40" :style="{backgroundImage:'url(' + bgIcon + ')'}"  v-if="!isLogin">
      您有1条未读消息哦
    </div>
   </div>
    </FormId>
</template>
<script>
import HandleLogin from "@/utils/handleLogin";
import LoginIntercept from "@/components/LoginIntercept";
import PhoneNumberIntercept from "@/components/PhoneNumberIntercept";
import {authSubscribeMessage} from '../utils/auth.js'
import {mapGetters,mapMutations} from "vuex";
import WXAJAX from "@/utils/request";
import LangUtils from '../utils/LangUtils';

export default {
  props: {
    avatarUrl: {
      type: String
    },
    isShowTalk: {
      type: Boolean,
      default: true
    },
    isLogin: {
      type: Boolean,
      default: false
    },
    isBayWindow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    LoginIntercept,
    PhoneNumberIntercept
  },
  computed: {
    ...mapGetters(["subscriptionNew"]),
  },
  watch:{
    isBayWindow(v,o){
      this.bayWindow = v
    }
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().components.FloatButtons,
      isShowLogin: false,
      bgIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_bg_message.png',
      foldIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_fold.png',
      bayWindow:wx.getStorageSync('showBayWindow') || false,
      windowSwitch:false,
      unreadMessages:this.$store.state.msgCont.countNum,
    };
  },
  mounted(){

  },
  methods: {
    // 其他监听事件登录 成功回调
    loginInterceptSuccess() {
      this.$emit('loginInterceptSuccess');
    },
    authSubscribeMessage(){
      authSubscribeMessage(this.subscriptionNew);
    },
    //聊一聊
    talk() {
        this.$emit('talk');
    },
    // isLogin(callback) {
    //   if (HandleLogin.returnIsLogin()) {
    //     callback&&callback();
    //   } else {
    //     this.$emit('loginGuide');
    //   }
    // },
    //人脉集市
    BayWindow_tap(){
      this.bayWindow = !this.bayWindow
      wx.setStorageSync('showBayWindow',this.bayWindow)
    },
    market() {
      wx.redirectTo({ url: "../cardCase/main" });
    }
  }
};
</script>
<style scoped>
.float-buttons {
  transition: all 0.2s;
  position: fixed;
  width: 116upx;
  /* height: 100%; */
  bottom: 100upx;
  right: 30upx;
  flex-direction: column;
  z-index: 22;
}
.custom-cycle {
  transition: all 0.2s;
  box-sizing: border-box;
  width: 120upx;
  height: 230upx;
  border-radius: 58upx;
  background: white;
  box-shadow: 0 0 10upx #eee;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 20upx;
  padding-top: 15upx;
}
.small-cycle {
  width: 100upx;
  height: 100upx;
  object-fit: cover;
  border-radius: 58upx;
}
.talkB {
  width: 88upx;
  height: 30upx;
  position: absolute;
  top: 90upx;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 20upx;
  text-align: center;
}
.foldIcon{
  transition: all 0.2s;
  position: absolute;
  left: 45upx;
  bottom: 45upx;
  z-index: 99;
}
.market-title {
  width: 62upx;
}
</style>
<style scoped>
.bgicon{
  transition: all 0.2s;
  opacity: 1;
  position: absolute;
  left: -320upx;
  background-repeat: no-repeat;
  background-size:320upx 80upx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 27upx;
  line-height: 1;
  padding-right: 20upx;
  box-sizing: border-box;
}
.bay-window{
  transition: all 0.2s;
  right: -60upx;
}
.bay-window .custom-cycle{
  transition: all 0.2s;
  height: 120upx;
}
.bay-window .user_box{
  transition: all 0.2s;
  display: none;
}
.bay-window .foldIcon{
  transition: all 0.2s;
  left: 20upx;
  transform: rotate(180deg);
}
.bay-window .bgicon{
  transition: all 0.2s;
  opacity: 0;
}
.Tips{
  position: absolute;
  top: 16upx;
  right: 0;
  width: 30upx;
  height: 30upx;
  border-radius: 50%;
  background: #FD634E;
  font-size: 18upx;
  color: #ffffff;
  line-height: 30upx;
  text-align: center;
}
</style>
