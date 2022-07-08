<template>
  <div class="disflex pt15 pl15 pr15 jsbet">
    <div v-for="item in templateType" 
         :key="item.id" 
         class="posre"
         @click="changeType(item)"
         style="width:330rpx;height:800rpx">
      <img :src="item.img" class="w100p h100p">
      <div class="w40 h40 posab disflex jscen align-cen trans2" 
           style="border-radius: 0px 10rpx 0px 10rpx;top:0rpx;right:0rpx;background:rgba(0,0,0,0.7)">
        <img :src="(currentType == item.type) ? icon_selected : icon_unselected" class="w20 h20">
      </div>
      <div class=" posab disflex jscen align-cen cfff fs116 fbold bradius5 trans2" 
           :style="{background:(currentType == item.type) ?  '#51CDCB' : 'rgba(0,0,0,0.7)'}"
           style="width:100%;height:102rpx;bottom:0rpx;">
        {{item.title}}     
      </div>
    </div>
    <div class="fix_bottom h49 w100p bgblue disflex jscen align-cen fs18 cfff"
         @click="confirm_tap">确定</div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import { mapMutations } from 'vuex';

export default {
  name: "",
  data() {
    return {
      templateType:[
        {
          id:1,
          img:WXAJAX.imgBackUrl + '/yimai_photos/newTemplate/bg_img1.png',
          type:'DEFAULT',
          title:'基础默认版'
        },
        {
          id:2,
          img:WXAJAX.imgBackUrl + '/yimai_photos/newTemplate/bg_img2.png',
          type:'LUXURY',
          title:'豪华升级版'
        }
      ],
      icon_selected:WXAJAX.imgBackUrl + '/yimai_photos/newTemplate/ic_selected_wl@2x.png',
      icon_unselected:WXAJAX.imgBackUrl + '/yimai_photos/newTemplate/ic_unselected_wl@2x.png',
      currentType:this.$store.state.CardTemplateEnums || 'DEFAULT',
    };
  },
  methods: {
    ...mapMutations(['setCardTemplateEnums']),
    confirm_tap(){
      this.setCardTemplateEnums(this.currentType)
      uni.navigateBack({
        delta:1
      })
    },
    changeType(item){
      console.log(item)
      this.currentType = item.type;
    }
  },
};
</script>

<style>

</style>
