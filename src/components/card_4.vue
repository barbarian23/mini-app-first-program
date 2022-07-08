<template>
    <div class="bgfff pl15 pt15 pr15 card4" @click="makePhone(card_msg.tel)">
        <div class="posre w100p h100p card4-box">
            <img :src="card_msg.picchecked || card2_logo"
                  mode="aspectFill"
                  class="card4_bg">
            <p class="fs20 mt15 mb14 lh1 c38 fbold">{{card_msg.username || lang.text_0}}</p>
            <p class="fs14 mb10 lh1 c78">{{card_msg.post || lang.text_1}}</p>
            <span class="card4-company fs12 cblue">{{card_msg.company || lang.text_2}}</span>
            <!-- <div class="cacrd3_left">
                <p class="fs12 cfff pb6" @click="makePhone(card_msg.tel)">{{card_msg.tel || lang.text_3}}</p>
                <p class="fs12 cfff">{{card_msg.email || lang.text_4}}</p>
            </div>

            <div class="card3_right">

            </div>

            <div class="align-cen fs10 ce8 card_company disflex">

                <div class="card_line_2"></div>
            </div> -->
        </div>
    </div>
</template>

<script>
  import util from "../utils/index";
  import LangUtils from '../utils/LangUtils';
    export default {
        name: "card_4",
        props:['card_msg'],
        data(){
            return{
              lang: LangUtils.getLangSrc().components.card_4,
              card2_logo : 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card2_user.png',
            }
        },
        methods: {
          makePhone(tel) {//拨打电话
          console.log(this.card_msg)
          return
            if (tel) {
              util.MakePhone(tel);
            }
          }
        }
    }
</script>

<style>
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
        right: 68upx;
        bottom: 30upx;
    }

    .card4 .cacrd4_left {
        position: absolute;
        left: 106upx;
        top: 96upx;
    }

    .card4 .card4_right {
        position: absolute;
        left: 414upx;
        top: 98upx;
    }
</style>
<style scoped>
    .card4{
        height: 540upx;
    }
    .card4-box{
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .card4_bg{
        border-radius: 50%;
        width: 250upx;
        height: 250upx;
        border: 10upx solid #fff;
        box-shadow:0px 4px 16px 0px rgba(56,56,56,0.1);
        margin-top: 29upx;
    }
    .card4-company{
        padding:7upx 31upx;
        background:rgba(229,248,247,1);
        border-radius: 30upx;
    }
</style>
