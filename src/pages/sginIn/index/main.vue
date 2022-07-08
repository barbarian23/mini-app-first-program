<template>
    <div class="pt10 pr15 pl15">
      <div class="bgfff mb10 btf5f6 flex-sb-c bradius5 h60 pl15 pr15" @click="pages_tap('automaticSignIn')">
        <div class="disflex align-cen fs16 fbold">
          <img :src="icon_time" class="w20 h20 mr10">
          自动打卡
        </div>
        <div class="disflex align-cen fs16">
          <p class="fs14 ca8 mr10">{{isAuto ? '允许' : '关闭'}}</p>
          <img :src="icon_right" alt="" class="w10 h10">
        </div>
        
      </div>
      <div class="bgfff mb10 btf5f6 flex-sb-c bradius5 h60 pl15 pr15" @click="pages_tap('sginInWriter')">
        <div class="disflex align-cen fs16 fbold">
          <img :src="icon_copywriter" class="w20 h20 mr10">
          打卡文案
        </div>
        <img :src="icon_right" alt="" class="w10 h10">
      </div>
      <div class="bgfff mb10 btf5f6 flex-sb-c bradius5 h60 pl15 pr15" @click="pages_tap('sginInRecord')">
        <div class="disflex align-cen fs16 fbold">
          <img :src="icon_record" class="w20 h20 mr10">
          打卡记录
        </div>
        <img :src="icon_right" class="w10 h10">
      </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request';
import { mapMutations } from "vuex";
export default {
    data(){
        return{
          icon_time:WXAJAX.imgBackUrl +'yimai_photos/signIn/ic_time@2x.png',
          icon_right:WXAJAX.imgBackUrl +'yimai_photos/signIn/icon_right@2x.png',
          icon_copywriter:WXAJAX.imgBackUrl +'yimai_photos/signIn/icon_copywriter@2x.png',
          icon_record:WXAJAX.imgBackUrl +'yimai_photos/signIn/ic_record@2x.png',
          isAuto:false,
        }
    },
    onShow() {
      this.queryClockSetting()
    },
    methods:{
      ...mapMutations(['setClockSetting']),
      pages_tap(url){
        console.log(url)
        wx.navigateTo({
          url:'../'+ url +'/main'
        })
      },
      //请求自动打卡配置
      queryClockSetting(){
        let data = {
          companyId:uni.getStorageSync('SELFCOMPANYID') || '',
          userId:uni.getStorageSync('userId') || '',
        }
        WXAJAX.POST(data,'','/poster/queryClockSetting')
        .then((res)=>{
          
          this.setClockSetting(res)
          this.isAuto = res.isAuto
        })
        .catch((err)=>{
          console.log(err)
        })
      },
    }
}
</script>
<style scoped>

</style>
