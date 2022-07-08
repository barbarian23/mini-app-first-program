<template>
  <div class="login-slots" v-if="!isLogin">
    <!-- <div class="masks" @click.stop.prevent.self="{}" >  -->
      <button v-if="canUseGetUserProfile" class="login-button button textc fs18 cfff"
              @click="GetUserProfile">
      </button>
      
      <button v-else  
              open-type="getUserInfo"
              class="login-button button textc fs18 cfff"
              @getuserinfo="GetUserInfo">
      </button>
    <!-- </div> -->
   </div>
</template>
<script>
import HandleLogin from "@/utils/handleLogin";
import HandleWebsocket from "@/utils/websocket";
import { mapState } from "vuex";
export default {
  data() {
    return {
    //   isLogin: wx.getStorageSync("isLogin")
    canUseGetUserProfile: wx.getUserProfile ? true : false
    };
  },
  computed: {
      ...mapState({
          isLogin: state=>state.isLoginStatus
      })
  },
  methods: {
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
.masks {
  position: relative;
}
.login-slots {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  /* background: rgba(0,0,0,0.1); */
}
.user-info {
  width: 100%;
  height: 100%;
  background: transparent;
}

</style>