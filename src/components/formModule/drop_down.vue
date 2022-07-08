<template>
  <div class="drop_down bbe8 mb20">
    <div class="disflex mb20">
      <span class="w6 h18 bgblue mr13"></span>
      <p class="fs18 fbold lh1">{{title}}
        <span v-if="required" class="cdeeporange ml6">*</span>
        <span class='ca8 fs18 fb500'>{{ lang.text_0 }}</span>
      </p>
    </div>
    <div class="disflex jsbet align-cen pb15 posre" @click="down_tap">
      <p class="fs16  ml19" :class="text ? 'c38' : 'ce8'">{{text || lang.text_1}}</p>
      <img :src="rightIcon" class="w10 h10">
      <div class="posab w100p bgfff downBox" :class="dropDown ? 'showDropDown' : ''">
        <div class="problemBox bgfff">
          <div class="fs16 c78 mb10" v-for="(item,index) in datas" :class="dropDown ? 'activeDropDown' : ''" :key="index" @click="list_tap(item,index)">
            {{item.title}}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import LangUtils from '../../utils/LangUtils';

export default {
  props:['datas','title','number','required'],
  data(){
    return{
      lang: LangUtils.getLangSrc().components.formModule.drop_down,
      dropDown:false,
      text:'',
      rightIcon:WXAJAX.imgBackUrl + '/yimai_photos/user/right.png',
    }
  },
  methods:{
    down_tap(){
      this.dropDown = !this.dropDown
    },
    list_tap(item,index){
      this.text = item.title

      this.$emit('list_tap',this.text,this.number)
    }
  }
}
</script>

<style scoped>
.downBox{
  transition: all .4s;
  position: absolute;
  overflow: hidden;
  height: 0upx;
  top: 40upx;
}

.showDropDown{
  transition: all .4s;
  height: 300upx;
  display: flex;
  flex-direction: column;
  z-index: 10;
}
.problemBox{
  padding: 38upx;
  box-sizing: border-box;
  flex: 1;
  overflow: auto;
}
</style>
