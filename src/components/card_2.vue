<template>
    <div class="posre bgfff bg-content">
        <img :src="card_msg.picchecked || card1_logo"
             @click="previewImage(card_msg.picchecked || card1_logo)"
             alt=""
             class="w100p bg-img left0 top0"
             mode="aspectFill">

        <div class="pl15 pr15 posab desc-content">
            <div class="shadow_gray bgfff pl25 pt25 pr22 pb21 disflex jsbet ">

                <div>
                    <p class="fs18 c38 fbold pb7">{{card_msg.username || lang.text_0}}</p>
                    <p class="fs14 c78 pb15">{{card_msg.post || lang.text_1}}</p>
                    <p class="disflex align-cen">
                        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/tel_blue.png" alt="" class="w16 h16 mr11">
                        <span class="fs12 ca8" @click="makePhone(card_msg.tel)">{{card_msg.tel || lang.text_2}}</span>
                    </p>
                </div>
                <div class="disflex align-cen">
                    <img :src="card_msg.company_logo || card1_company" alt="" class="w60 h60"
                         mode="aspectFill"
                         @click="previewImage(card_msg.company_logo || card1_company)"
                         ><!--@click.stop="uploadpic('company')"-->
                </div>


            </div>
        </div>
    </div>
</template>

<script>
    import util from "../utils";
    import LangUtils from '../utils/LangUtils';

    export default {
        name: "card_2",
        props:['card_msg', 'isPrev'],
        data(){
            return{
                lang: LangUtils.getLangSrc().components.card_2,
                card1_logo : 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card1_user.png',
                card1_company:'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card1_logo.png'
            }
        },
        methods:{
          makePhone(tel){//拨打电话
            if(tel){
              util.MakePhone(tel);
            }
          },

          previewImage(url){
            if(!this.isPrev) return;

            let urls = [url];

            wx.previewImage({
              current: urls[0],
              urls: urls
              // urls必须是数组 不然会报错
            })
          },
            uploadpic(type){
                this.$emit('uploadpic',type)
            }
        }
    }
</script>

<style>
.bg-content {
    height: 850upx;
}
.bg-img {
    height: 750upx;
}
.desc-content {
    z-index: 20;
    width: 690upx;
    bottom: 0upx;
}
</style>
