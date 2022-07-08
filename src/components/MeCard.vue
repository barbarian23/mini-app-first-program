<template>
  <div class="out shadow_gray">
    <div class="top_card fs12 mb15 shadow_gray pb25" v-if="type == 'plus'">
      <div class="pl34 pt25 cblue fs12"><span class="before_line_3">{{card_msg.company || lang.text_2}}</span></div>
      <div class="top_msg disflex pt15 jsbet"  @click="page_turn('index')">
        <div>
          <p class="fbold c38 fs18">{{card_msg.username || lang.text_3}}</p>
          <p class="fs14 ca8 pt10 pb25">{{card_msg.post || lang.text_4}}</p>
          <p class="fs12 c78">{{card_msg.tel || lang.text_5}}</p>
          <p class="fs12 c78 pt10">{{card_msg.email || lang.text_6}}</p>
        </div>
        <img :src="card_msg.picchecked || card1_logo" mode="aspectFill" alt="" class="w60 h60 bradius5">

      </div>
      <div class="disflex jsbet pl25 pt25 share_p">
        <span class="w60 lh20 ba8 bradius10 textc fs12 ca8" v-if="hasCard">{{ lang.text_0 }}</span>

          <button class='w16 pl5 h16 bgfff contentbox flex-sa-c share'
                  id="111"
                  :data-companyId="card_msg.companyId"
                  :data-cardId="card_msg.cardId"
                  :data-companyName="card_msg.company"
                  :data-name="card_msg.username"
                  :data-position="card_msg.post"
                  :data-logo="card_msg.company_logo"
                  @click.stop="stopClick"
                  :data-shareSpeech="card_msg.shareSpeech||''"
                  open-type="share">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/icon_share.png" alt="" class="w10 h10">
            <span class="cfff fs12">{{ lang.text_1 }}</span>
          </button>

      </div>
    </div>

  </div>

</template>

<script>
import LangUtils from '../utils/LangUtils';

  export default {
    name: "BusinessCard",
    props:['card_msg','type','hasCard','isdel','index'],
    data(){
      return{
        lang: LangUtils.getLangSrc().components.MeCard,
        card1_logo:'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card1_user.png'
      }
    },
    methods:{
      page_turn(url){
        this.$emit('page_turn',url,this.card_msg.companyId , this.card_msg.cardId)
      },
        stopClick(){
            console.log("do nothing")
        },
      moreTap(){
        this.$emit('moreTap' , this.card_msg.recordId, this.card_msg.cardId, this.isdel);
      },
      makePhone(){//拨打电话
        if(this.card_msg.tel){
          wx.makePhoneCall({
            phoneNumber: this.card_msg.tel,
          })
        }else{
          wx.showToast({
            title: '还没有添加电话呢！',
            duration: 2000,
            icon: 'none'
          });
        }

      },
      share(companyId,cardId){
        this.$emit('shareApp',companyId,cardId);
      }
    }
  }
</script>

<style scoped>
  .out{
    line-height: 1;
    border-radius: 20upx;
    /* box-shadow: 0 0 10upx #383838; */
  }
  button{
    border-radius: 0;
  }
  .share_p {
    position: relative;
  }
  .share {
    width: 100upx;
    background: #51CDCB;
    height: 40upx;
    border-top-left-radius: 20upx;
    border-bottom-left-radius: 20upx;
    padding-right: 0;
    position: absolute;
    right: 0;
  }
</style>
