<template>
    <div class="fix_top h100p dialog_box">
        <div class="dialog_con bgfff bradius5" >
            <p class="textc fs18 c38 pt25 pb25 ">{{dialog_title}}</p>
            <div class="fs14 c78 textc  pb36">
              <p class="lh18">{{dialog_ph}}</p>
              <p>{{tipsdec}}</p>
            </div>
              <div class="disflex fs18 textc lh44 btf5f6 dialog_bottom">
                 <div class="btn cfff w100p" @click="btn_tap">{{ lang.text_0 }}</div>
              </div>
          </div>
    </div>
</template>

<script>
import LangUtils from '../utils/LangUtils';

    export default {
        name: '',
        props:['dialog_title','dialog_ph','tipsdec'],
        data() {
            return{
               lang: LangUtils.getLangSrc().components.FloatButtons
            }
        },
        methods: {
            btn_tap(){
                this.$emit('btn_tap');
            }
        },
    }
</script>

<style scoped>
    .dialog_box {
        background: rgba(0, 0, 0, .5);
        z-index: 100;
    }
    .btn{
        background:  #51CDCC;
    }
    .dialog_con {
        width: 580upx;
        position: absolute;
        left: 0;
        right: 0;
        top: 30%;
        margin: auto;
        overflow: hidden;
    }
    .dialog_bottom{
        border-radius: 0 0 10upx 10upx;
    }
</style>























