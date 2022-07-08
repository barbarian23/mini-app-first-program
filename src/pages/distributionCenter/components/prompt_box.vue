<template>
  <div class="center_mask" v-if="applyForShow" @click="applyFor">
      <div class="w290 bgfff bradius5 disflex flex-column align-cen" @click.stop="">
        <div class="felx1 textc pt25 pb28">
          <p class="fs18 fbold c38 mb20">提示</p>
          <p class="fs14 c78 lh22" v-if="type == 1">您已通过申请，<br>快去分享商品给小伙伴吧！</p>
          <p class="fs14 c78 lh22" v-else-if="type == 2">
            暂无余额可提现，快去分享赚佣金吧！
          </p>
        </div>
        <div class="w100p h44 bgblue lh44 textc fs18 cfff" v-if="type == 1"  @click.stop="confirm_tap('back')">确认</div> 
        <div  v-else-if="type == 2" class="w100p disflex h44 lh44 fs18">
          <div class="w50p h100p textc ca8 border_bottom_left" @click="applyFor">取消</div> 
          <div class="w50p h100p bgblue lh44 textc cfff border_bottom_right" @click.stop="confirm_tap">确认</div> 
        </div>
      </div>
    </div>  
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
export default {
  props: {
    applyForShow: {
      type: Boolean
    },
    type:{
      type:Number
    }
  },
  created() {
    

  },
  mounted() {
    
  },
  methods:{
    applyFor(){
      this.$emit('prompt_box_tap')
    },
    confirm_tap(type){
      console.log(type)
      this.$emit('confirm_tap',type)
    }
  }
};
</script>
<style scoped>
.border_bottom_left{
  border-radius: 0 0 0 10upx;
}
.border_bottom_right{
  border-radius: 0 0 10upx 0;
}
</style>
