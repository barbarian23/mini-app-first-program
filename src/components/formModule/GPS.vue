<template>
  <div class="imgChoice bbe8 mb20">
    <div class="disflex mb20">
      <span class="w6 h18 bgblue mr13"></span>
      <p class="fs18 fbold lh1">{{title}}<span v-if="required" class="cdeeporange ml6">*</span></p>
    </div>
    <div class="disflex jsbet mb20 align-cen" @click="position_tap">
      <p class="fs16 ca7">{{address || lang.text_0}}</p>
      <img :src="rightIcon" class="w10 h10">
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import LangUtils from '../../utils/LangUtils';

export default {
  props:['datas','title','address','required'],
  data(){
    return{
      lang: LangUtils.getLangSrc().components.formModule.GPS
    }
  },
  created() {
    console.log(this.address)
  },
  methods:{
    position_tap(){
      wx.navigateTo({
        url:"../companyAddr/main"
      })
    },
  }
}
</script>

<style scoped>

</style>
