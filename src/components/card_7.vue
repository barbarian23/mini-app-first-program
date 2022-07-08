<template>
    <div class="bgfff pb15 card7">
        <div class="posre h426 boxshadow ">
            <img v-if='src' :src="card_msg.picchecked || userlogo" alt=""
                 mode="aspectFill"
                 class="posab left0 top0 card7_bg w100p h426">
          <div class="card7-mark">

          </div>
          <div class="card7_information">
            <div class="card7_right cblk">
              <span class="fs12 cblk">{{card_msg.company || lang.text_0}}</span>
            </div>
            <div class="cacrd7_left mb12 ml-12">
              <p class="fs20 cfff fbold">{{card_msg.username || lang.text_1}}</p>
              <p class="fs14 cfff lh15 mt5">{{card_msg.post || lang.text_2}}</p>
            </div>
          </div>
           <div>
            <img :src="card_msg.picchecked || userlogo" alt="" mode="aspectFill"
                 class="imgheader7 cacrd7_header">
           </div>
        </div>
    </div>
</template>

<script>
  import util from "../utils";
  import LangUtils from '../utils/LangUtils';

    export default {
        name: "card_7",
        props:['card_msg'],
        data(){
            return {
              lang: LangUtils.getLangSrc().components.card_7,
              userlogo:"https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png", //头像
              src:'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card7_bg.png'
            }
        },
      methods:{
        makePhone(tel) {//拨打电话
          if (tel) {
            util.MakePhone(tel);
          }
        }
      }

    }
</script>

<style>

  .card7_bg{

  }
  .boxshadow{
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 10px 0px rgba(6, 1, 0, 0.35);

  }
  .card7_right {

  }
/*
  @media screen and (max-width: 375px) {
    .cacrd7_header{
      position: absolute;
      top:260upx;
      left: 86upx;
    }
    .imgheader7{
      width:95upx;
      height:92upx;
      border-radius:5px;
    }
    .cacrd7_left {
      line-height: 38upx;
      position: absolute;
      right:140upx;
      text-align: right;
      bottom:65upx;
    }
  }

  @media screen and (min-width: 414px) {
    .cacrd7_header{
      position: absolute;
      top: 260upx;
      left: 87upx;
    }
    .imgheader7{
      width:94upx;
      height:94upx;
      border-radius:5px;
    }
    .cacrd7_left {
      text-align: right;
      line-height: 38upx;
      position: absolute;
      right: 140upx;
      bottom:70upx;
    }
  }
  @media screen and (min-width: 411px) {
    .cacrd7_header{
      position: absolute;
      top: 260upx;
      left: 87upx;
    }
    .imgheader7{
      width:94upx;
      height:94upx;
      border-radius:5px;
    }
    .cacrd7_left {
      text-align: right;
      line-height: 38upx;
      position: absolute;
      right: 140upx;
      bottom:70upx;
    }
  } */

</style>
<style scoped>
.cacrd7_header{
  position: absolute;
  bottom: -30upx;
  left: 34upx;
  width:152rpx;
  height:152rpx;
  background:rgba(191,191,191,1);
  border:3px solid rgba(255,255,255,1);
  box-shadow:0px 4px 16px 0px rgba(56,56,56,0.1);
  border-radius:50%;
}
.card7_information{
  position: absolute;
  width: 480upx;
  height: 100%;
  left: 210upx;
  display:flex;
  flex-direction: column;
  justify-content: space-between;
}
.card7_right span{
  display: block;
  margin: 40upx 30upx 0 0;
  padding:0 30upx;
  background: rgba(0,0,0,0.7);
  border-radius: 44upx;
  color: #ffffff;
  text-align: center;
  line-height: 44upx;
  float: right;
}
.card7-mark{
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0));
}
</style>
