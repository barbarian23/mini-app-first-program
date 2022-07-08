<template>
  <div class="w100p h100p bggray_5 fix_top login-dialog"
       v-if="isShow">
    <div class="login-content">
      <div class="login-top">
        <img class="login-top-img"
             :src="avatarUrl"
             alt="" />
      </div>
      <div class="login-bottom">
        <div >
          <img :src="upIcon" class="w25 disblock h8 ml50">
          <div class="Tips">
              {{hint || lang.text_2 + '  ' + lang.text_3}}
          </div>
        </div>
          <div class="login-box pt25">
            <div class="textc button pt12 ">
              <span class="fs16 cblue"
                    @click="cancel">{{ lang.text_0 }}</span>
            </div>

            <button v-if="canUseGetUserProfile" class="login-button button textc fs18 cfff"
                    @click="GetUserProfile">{{ lang.text_4 }}</button>

            <button v-else
                    open-type="getUserInfo"
                    class="login-button button textc fs18 cfff"
                    @getuserinfo="GetUserInfo">{{ lang.text_1 }}</button>
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
import WXAJAX from "@/utils/request";
import LangUtils from '../utils/LangUtils';

export default {
  name: "login",
  //type是外界调用者给出的类型,只做接收和回调,调用者自行判断是哪个功能触发的登录弹框,会在登录成功和失败后回调给调用者
  props: ["phoneMsg", "isShow", "loginType","avatarUrl","hint"],
  data() {
    return {
      lang: LangUtils.getLangSrc().components.login,
      logo: utils.extJSON.headImg,
      upIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_img_up.png',
      canUseGetUserProfile: wx.getUserProfile ? true : false
    };
  },

  methods: {
    ...mapMutations(["setPhone"]),

    /**
     * 取消登录
     */
    cancel() {
      this.$emit("cancelLogin", this.loginType);
    },

    /**
     * 获取用户信息 低版本
     * @param e
     * @constructor
     */
    GetUserInfo(e) {
      console.log(this.canUseGetUserProfile)
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

  }
};
</script>

<style>
.ml5 {
  margin-left: 5upx;
}
.ml5 {
  margin-left: 5upx;
}
.login-dialog {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99999;
}
.login-content {
  width: 580upx;
  background: #ffffff;
  border-radius: 10upx;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.login-top {
  width: 580upx;
  height: 96upx;
  background: #ffffff;
  position: relative;
  border-radius:10upx 10upx 0 0;
}
.login-top-img {
  width: 146upx;
  height: 146upx;
  position: absolute;
  top:-77upx;
  left: 50upx;
  border: 6upx solid #ffffff;
  border-radius: 50%;
  box-shadow: 0px 4px 15px 0px rgba(55, 55, 55, 0.1);
}
.login-bottom {
  width: 580upx;
  background: #ffffff;
  padding-bottom: 40upx;
  border-bottom-left-radius: 10upx;
  border-bottom-right-radius: 10upx;
}
.login-bottom .login-title {
  font-weight: bold;
  text-align: center;
}
.login-bottom .login-button {
  display: inline-block;
  width: 374upx;
  height: 88upx;
  background: linear-gradient(
    90deg,
    rgba(118, 218, 217, 1),
    rgba(81, 205, 203, 1)
  );
  border-radius: 10upx;
  line-height: 88upx;
  margin: 0;
}

</style>
<style scoped>
.Tips{
  padding: 40upx 40upx 40upx 40upx;
  border-radius: 10rpx;
  line-height: 48upx;
  background: #F5F5F6;
  color: #383838;
  font-size: 32upx;
  margin:0 auto;
  width: 500upx;
  box-sizing: border-box;
}
.login-box{
  display: flex;
  justify-content: space-between;
  width: 500upx;
  margin:0 auto;
}
.button{
  width: 232upx;
  height: 88upx;
  border:2upx solid #51CDCB;
  text-align: center;
  line-height: 88upx;
  font-size: 32upx;
  border-radius: 10upx;
}
</style>
