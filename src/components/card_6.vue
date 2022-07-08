<template>
  <div class="bgfff pl15 pt15 pr15 card3">
    <div class="posre h426 overhidden boxshadow">
      <img :src="card_msg.picchecked || userlogo"
           alt=""
           mode="aspectFill"
           class="posab left0 top0 card3_bg w100p h426 ">
      <div class="posab information">
        <div class="information-top borderbox h50p">
          <div>
            <img :src="iconDown" class="w8 h7">
          </div>
          <span class="lh1 fs12 cfff">{{card_msg.company || lang.text_0}}</span>
        </div>
        <div class="information-bottom borderbox h50p pt40">
          <p class="fs20 lh1 mb10 cfff fbold ">{{card_msg.username || lang.text_1}}</p>
          <p class="fs14 lh1 cfff">{{card_msg.post || lang.text_2}}</p>
        </div>

      </div>
      <!-- <div class="card5_right">

      </div>

      <div class="cacrd5_left">

      </div> -->
    </div>
  </div>
</template>

<script>
import util from "../utils";
import WXAJAX from '../utils/request';
import LangUtils from '../utils/LangUtils';

export default {
  name: "card_6",
  props: ["card_msg"],
  data() {
    return {
      lang: LangUtils.getLangSrc().components.card_6,
      userlogo:"https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png", //头像
      iconDown: WXAJAX.imgBackUrl +'yimai_photos/crmRevision/ic_down.png',
    };
  },
  methods: {
    makePhone(tel) {
      //拨打电话
      if (tel) {
        util.MakePhone(tel);
      }
    }
  }
};
</script>

<style>
    div{
      color: #383838;
    }
    .boxshadow{
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 10px 0px rgba(6, 1, 0, 0.35);
      border-radius:10px;
    }

    .card3_bg{
      border-radius:10px;
    }


      .card3 .cacrd5_header{
        position: absolute;
        left: 120upx;
        top: 91upx;
      }

      .card3 .cacrd5_left {
        position: absolute;
        right :120upx;
        top:158upx;
        width: 200upx;
      }
      .card3 .card5_right {
        position: absolute;
        right: 160upx;
        top: 50upx;
        width: 200upx;
      }

      .card3 .imgheader{
        width:98upx;
        height:98upx;
        border-radius:50%;
      }

</style>
<style scoped>
.information{
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

}
.information-top{
  padding-top: 20upx;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7));
}
.information-bottom{
  padding-bottom: 40upx;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
}
</style>
