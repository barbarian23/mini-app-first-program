<template>
  <div class="bgfff pl15 pt15 pr15 card5">
    <div class="posre h426 overhidden boxshadow">
      <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card5_bg.png"
           alt=""
           class="posab left0 top0  w100p h426 imgborder">

      <div class="align-cen fs10 ce8 card_company disflex">
        <div class="card_line_2"></div>
        <span class="pr14">{{card_msg.company || lang.text_0}}</span>
      </div>

      <div class="cacrd5_header">
        <img :src="card_msg.picchecked || userlogo"
             mode="aspectFill"
             alt=""
             class="imgheader">
      </div>

      <div class="cacrd3_right">
        <p class="fs20 fbold">{{card_msg.username || lang.text_1}}</p>
        <p class="fs12 lh20 ">{{card_msg.post || lang.text_2}}</p>
      </div>

      <div class="cacrd3_telemail ">
        <p class="fs12  pb6" @click="makePhone(card_msg.tel)">{{card_msg.tel || lang.text_3}}</p>

        <p class="fs12 ">{{card_msg.email || lang.text_4}}</p>
      </div>
    </div>
  </div>
</template>

<script>

  import util from "../utils/index";
  import {authSubscribeMessage} from "../utils/auth";
  import LangUtils from '../utils/LangUtils';

export default {
  name: "card_5",
  props: ["card_msg", "type"],
  data() {
    return {
      lang: LangUtils.getLangSrc().components.card_5,
      userlogo:
        "https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png", //头像
      cardMsg: {}
    };
  },
  methods:{
    makePhone(tel) {
      if(tel){
        util.MakePhone(tel);
      }
    }
  },
  created() {}
};
</script>

<style>
div {
  color: #e9dabf;
}
.boxshadow {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 10px 0px rgba(6, 1, 0, 0.35);
  border-radius: 10px;
}

.imgborder {
  border-radius: 10px;
}

.card_line_2 {
  position: relative;
  color: #e9dabf;
  margin-right: 4upx;
}

.card_line_2::before,
.card_line_2::after {
  position: absolute;
  width: 4upx;
  height: 18upx;
  background: #e9dabf;
  top: 0;
  bottom: 0;
  margin: auto;
  font-size: 12px;
  content: "";
}

.card_line_2::before {
  right: 0;
}

.card_line_2::after {
  right: 10upx;
}

.card_company {
  position: relative;
  top: 60upx;
  left: 49upx;
  font-size: 12px;
  letter-spacing: 1px;
}
.card5 .cacrd3_right {
  position: absolute;
  right: 70upx;
  text-align: left;
  top: 185upx;
  width: 250upx;
}

@media screen and (width: 320px) {
  .card5 .cacrd5_header {
    position: absolute;
    right: 221upx;
    top: 65upx;
  }
  .card5 .imgheader {
    width: 94upx;
    height: 94upx;
    border-radius: 5px;

  }

  .card5 .cacrd3_telemail {
    position: absolute;
    text-align: left;
    right: 0upx;
    bottom: 54upx;
    width: 280upx;
  }
}

@media screen and (width: 360px) {
  .card5 .cacrd5_header {
    position: absolute;
    right: 221upx;
    top: 65upx;
  }
  .card5 .imgheader {
    width: 94upx;
    height: 94upx;
    border-radius: 5px;
  }

  .card5 .cacrd3_telemail {
    position: absolute;
    text-align: left;
    right: 0upx;
    bottom: 54upx;
    width: 280upx;
  }
}

@media screen and (min-width: 375px) {
  .card5 .cacrd5_header {
    position: absolute;
    right: 221upx;
    top: 65upx;
  }
  .card5 .imgheader {
    width: 94upx;
    height: 94upx;
    border-radius: 5px;
  }

  .card5 .cacrd3_telemail {
    position: absolute;
    text-align: left;
    right: 0upx;
    bottom: 54upx;
    width: 280upx;
  }
}

@media screen and (min-width: 414px) {
  .card5 .cacrd5_header {
    position: absolute;
    right: 224upx;
    top: 65upx;
  }
  .card5 .imgheader {
    width: 94upx;
    height: 94upx;
    border-radius: 5px;
  }
  .card5 .cacrd3_telemail {
    position: absolute;
    text-align: left;
    right: 0upx;
    bottom: 55upx;
    width: 280rpx;
  }
}
</style>
