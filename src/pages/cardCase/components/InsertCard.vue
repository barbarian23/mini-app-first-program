<template>
  <div class="insert-card">
    <button v-if="!isLogin && canUseGetUserProfile" class="insert" @click="GetUserProfile">
      <div class="left">
        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/add.png" alt />
        <p class="fs18 cfff">{{ lang.text_0 }}</p>
      </div>
      <p class="right fs18 cfff fbold">{{ lang.text_1 }}</p>
    </button>
    <button v-else-if="!isLogin" class="insert" @getuserinfo="GetUserInfo">
      <div class="left">
        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/add.png" alt />
        <p class="fs18 cfff">{{ lang.text_0 }}</p>
      </div>
      <p class="right fs18 cfff fbold">{{ lang.text_1 }}</p>
    </button>
    <div class="insert" v-else  @click="updateMyCard">
      <div class="left">
        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/add.png" alt />
        <p class="fs18 cfff">{{ lang.text_0 }}</p>
      </div>
      <p class="right fs18 cfff fbold">{{ lang.text_1 }}</p>
    </div>
  </div>
</template>
<script>
import HandleLogin from "@/utils/handleLogin";
import HandleWebsocket from "@/utils/websocket";
import LangUtils from '../../../utils/LangUtils';

export default {
  props: {
    isLogin: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().cardCase.components,
      // insertCardImg: require("@/static/card-case-inert.png")
      //是否微信授权获取用户信息
      canIUse: false,
      canUseGetUserProfile: wx.getUserProfile ? true : false
    };
  },
  methods: {
    updateMyCard() {
      // wx.navigateTo({ url: "../editCard/main?type=add" });
      this.toCreatePage();
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
<style scoped>
    .insert-card{
        position: fixed;
        right: 0;
        bottom: 90upx;
        z-index: 299;
        padding-right: 30upx;
        padding-left: 30upx;
        box-sizing: border-box;
        text-align: right;
    }

.insert {
  width: 690upx;
  height: 120upx;
  background: #51cdcb;
  border-radius: 60upx;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.insert:active {
  opacity: 0.8;
}
.insert .left {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 42upx;
}
.insert .left img {
  width: 60upx;
  height: 60upx;
  margin-right: 22upx;
}
.right {
  margin-right: 42upx;
}
</style>
