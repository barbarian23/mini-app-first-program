<template>
  <div class="checkChoice bbe8 mb20">
    <div class="disflex mb20">
      <span class="w6 h18 bgblue mr13"></span>
      <p class="fs18 fbold lh1">{{title}}
        <span v-if="required" class="cdeeporange ml6">*</span>
        <span class='ca8 fs18 fb500'>{{ lang.text_0 }}</span>
      </p>
    </div>
    <div class="disflex mb15 ml19"
          v-for="(item,index) in item"
          :key="index" @click="checkChoice(item,index)">
      <div class="w20 h20 bradius3 b2e8 disflex jscen align-cen mr8 "
            style="transition: all .4s"
            :class="item.checked ? 'active' : ''">
        <span class="disblock w10 h10 bradius2" style="transition: all .4s"></span>
      </div>
      <p class="fs16 w250" :class="item.checked ? 'c38' : 'c78' ">{{item.title}}</p>
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
      lang: LangUtils.getLangSrc().components.formModule.multiple,
      singleCurrent:0,
      item:this.datas
    }
  },
  methods:{
    checkChoice(item,index){
      item.checked = !item.checked
      this.datas.forEach((v,k)=> {
        if(index == k){
          v.content = !v.content
        }
      });
      console.log(this.datas)
      this.$emit('check_choice',this.datas,this.number)
    }
  }
}
</script>

<style scoped>
.active{
  transition: all .4s;
  border:2upx solid #51CDCB;
}
.active span{
  transition: all .4s;
  background: #51CDCB;
}
</style>
