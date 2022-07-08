<template>
  <div class="textChoice bbe8 mb20">
    <div class="disflex mb20">
      <span class="w6 h18 bgblue mr13"></span> 
      <p class="fs18 fbold lh1">{{title}}<span v-if="required" class="cdeeporange ml6">*</span></p>
    </div>
    <div class="pl20 pr20 posre">
      <textarea class="w100p pb28" 
                maxlength="500" 
                @blur="text_tap"
                placeholder="请输入内容"></textarea>
      <p class="c78 textLength">{{text.length}}/500</p>
    </div> 
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";

export default {
  props:['datas','title','number','required'],
  data(){
    return{ 
      text:'',
      
    }
  },
  methods:{
    text_tap(e){
      this.text = e.detail.value

      this.$emit('text_tap',this.text,this.number)
    },
  }
}
</script>

<style scoped>
.textLength{
  position: absolute;
  right: 0;
  bottom: 20upx;
}
</style>
