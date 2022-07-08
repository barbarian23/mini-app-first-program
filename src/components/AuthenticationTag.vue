<template>
  <div class="auth-tag disflex align-cen jscen mb10">
    <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/icon-authentication.png"
         class="w10 h10 mr5"
         alt="">
    <span>{{ lang.text_0 }}</span>
  </div>
</template>

<script>
import LangUtils from '../utils/LangUtils';
  export default {
    name: "AuthenticationTag",
    data() {
      return {
        lang: LangUtils.getLangSrc().components.AuthenticationTag
      };
    }
  }
</script>

<style scoped>
  .auth-tag {
    width: 70px;
    height: 20px;
    background:rgba(0,0,0,.3);
    border:.5px solid rgba(255,255,255,.3);
    border-radius: 20upx;
    font-size: 20upx;
    color: white;
  }
</style>
