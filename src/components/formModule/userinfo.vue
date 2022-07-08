<template>
  <div class="information bbe8 mb20">
    <div class="disflex mb20">
      <span class="w6 h18 bgblue mr13"></span> 
      <p class="fs18 fbold lh1">{{title}}<span v-if="required" class="cdeeporange ml6">*</span></p>
    </div>
    <div class="disflex flex-column mb20">
      <input class="bradius5 bgf5f6 h39 mb10 pl15 pr15 fs16 ca7" 
             v-for="(item,index) in datas" 
             :key="index" 
             :placeholder="item.title"  
             @blur="input_tap($event,index)"
             type="text">
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

    }
  },
  methods:{
    input_tap(e,index){
      this.datas[index].content = e.detail.value
      this.$emit('input_tap',this.datas,this.number)
    }
  }
}
</script>

<style scoped>

</style>
