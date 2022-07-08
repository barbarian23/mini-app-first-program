<template>
  <form report-submit @submit="submitOrder">
    <label for="btn">
      <slot></slot>
      <button  form-type="submit" id="btn" style="display: none"></button>
<!--      <button v-else-if="phone == ''" form-type="submit" id="btn" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"  style="display: none"></button>-->
    </label>
  </form>
</template>

<script>
  import WXAJAX from '../utils/request'
  import HandleLogin from '@/utils/handleLogin'
  import { mapMutations, mapState } from 'vuex';

  export default {

    name: "formId",
    data () {
       return {
           isLogin: HandleLogin.returnIsLogin() || '',
           id: Date.now() * Math.random(),
           phone: wx.getStorageSync('phone') || '',
       }
    },
    methods:{
       ...mapMutations(['setPhone']),
      submitOrder(e) {
        console.log('formid', e)
        if ('the formId is a mock one' == e.mp.detail.formId) return;

        WXAJAX.POST({
          formId: e.detail.formId,
          type: 1,
        }, '', '/personal/addFormId');
      },
      getPhoneNumber (e) {
          if(!HandleLogin.returnIsLogin()){
              console.error("必须先登录才能获取电话号码");
              return;
          }
          if (this.phone) return;

          if (!e.target.encryptedData) {
              return;
          }
          WXAJAX.POST({
              phoneData: e.target.encryptedData,
              phoneIv: e.target.iv,
          }, '', '/home/getWxPhone')
              .then(res => {
                  if(res != "weixin_failt"){
                    this.phone = res;
                    wx.setStorageSync('phone', res);
                    this.setPhone(res);
                  }
              }).catch(err => {
                  console.log("获取手机号出错：", err)
          });
      }
    }
  }
</script>

<style scoped>

</style>
