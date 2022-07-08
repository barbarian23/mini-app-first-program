<template>
    <div class="pt10 pr15 pl15">
      <div class="bgfff mb10 btf5f6 flex-sb-c bradius5 h60 pl15 pr15" @click="pages_tap('address')">
        <div class="disflex align-cen fs16 fbold">
          <img :src="icon_location" alt="" class="w20 h20 mr10">
          我的地址
        </div>
        <img :src="icon_right" alt="" class="w10 h10">
      </div>
      <div class="bgfff mb10 btf5f6 flex-sb-c bradius5 h60 pl15 pr15" @click="pages_tap('sginIn/index')">
        <div class="disflex align-cen fs16 fbold">
          <img :src="icon_signIn" alt="" class="w20 h20 mr10">
          早晚安打卡
        </div>
        <img :src="icon_right" alt="" class="w10 h10">
      </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request';
export default {
    data(){
        return{
          icon_location:WXAJAX.imgBackUrl +'yimai_photos/crmRevision/img-location.png',
          icon_right:WXAJAX.imgBackUrl +'yimai_photos/signIn/icon_right@2x.png',
          icon_signIn:WXAJAX.imgBackUrl +'yimai_photos/signIn/icon_signin@2x.png'
        }
    },
    mounted() {
      
    },
    methods:{
      pages_tap(url){
        console.log(url)
        wx.navigateTo({
          url:'../'+ url +'/main'
        })
      }
    }
}
</script>
<style scoped>

</style>
