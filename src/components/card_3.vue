<template>
  <div class="bgfff pl15 pt15 pr15 card2">
    <div class="posre h214 overhidden card-list">
      <img :src="card_msg.picchecked || card2_logo" alt=""
           :class="card_msg.picchecked ? 'w225' : 'w100p' "
           @click="previewImage(card_msg.picchecked || card2_logo)"
           mode="aspectFill"
           style="box-sizing:border-box;padding-top:1rpx;padding-bottom:2rpx;"
           class="posab right0 top0 card2_user h100p">

      <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmRevision/img_lefttext.png" alt="" class="posab left0 top0 card_bg">
      <div class="posab h100p w200 top0 left0 zindex-99 card-information">
        <div class="mb25">
          <p class="fs20 lh1 mb8 c38 fbold pb3">{{card_msg.username || lang.text_0}}</p>
          <p class="fs12 lh1 c38">{{card_msg.post || lang.text_1}}</p>
        </div>

        <div class="ca8 mb25 nowrap">
          <div class="disflex align-cen mb8">
            <img :src="iconPhone" class="w12 h12 mr5">
            <p class="fs12" @click="makePhone(card_msg.tel)">{{card_msg.tel || lang.text_2}}</p>
          </div>
          <div class="disflex align-cen">
            <img :src="iconEmail" class="w12 h12 mr5">
            <p class="fs12">{{card_msg.email || lang.text_3}}</p>
          </div>

        </div>
        <span class="pr14 fs14 c38 fbold">{{card_msg.company || lang.text_4}}</span>
      </div>
      <div class="card2_inner nowrap">
      </div>
    </div>
  </div>
</template>

<script>
  import util from "../utils/index";
  import WXAJAX from '../utils/request'
  import LangUtils from '../utils/LangUtils';

  export default {

    name: "card_3",
    props:['card_msg', 'isPrev'],
    data(){
      return{
        lang: LangUtils.getLangSrc().components.card_3,
        card2_logo : 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card2_user.png',
        iconEmail: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/ic_email.png',
        iconPhone: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/ic_phone.png',
      }
    },
    methods:{
      previewImage(url){
        if(!this.isPrev) return;

        let urls = [url];

        wx.previewImage({
          current: urls[0],
          urls: urls
          // urls必须是数组 不然会报错
        })
      },
      makePhone(tel){//拨打电话
        if(tel){
          util.MakePhone(tel);
        }
      },
    }
  }
</script>

<style>
  .card2 .card_bg {
    width: 400upx;
    height: 100%;
  }

  .card2 .card2_inner {
    position: absolute;
    left: 324upx;
    top: 104upx;
  }

  .card_line_2 {
    position: relative;
  }

  .card_line_2::before,.card_line_2::after {
    position: absolute;
    width: 6upx;
    height: 16upx;
    background: #fff;
    top: 0;
    bottom: 0;
    margin: auto;
    content: '';
  }

  .card_line_2::before {
    right: 0;
  }

  .card_line_2::after {
    right: 10upx;
  }

  .card_company {
    position: absolute;
    right: 34upx;
    bottom: 30upx;
  }
</style>
<style  scoped>
.card-information{
  padding:80upx 0 0 30upx;
}
.card-list{
 border-radius:10px;
 box-shadow: 0 0 50rpx rgba(56, 56, 56, 0.1);
}
</style>
