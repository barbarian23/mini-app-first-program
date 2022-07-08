<template>
  <div>
    <scroll-view :style="{height: scrollContentHeight+'px'}"
                 class="dynamic-content"
                 style="background:#252B3B"
                 :scroll-y="true"
                 :enable-back-to-top="true"
                 :scroll-anchoring="true"
                 @scroll="scrollChange">
      <Card_1 v-if="card_type == 0"
              :card_msg="card_msg"
              :isPrev="true"></Card_1>
      <div class="bgfff">
        <Card_2 v-if="card_type == 1"
                :card_msg="card_msg"
                @uploadpic="uploadpic"
                :isPrev="true"></Card_2>
        <!--1.0-->
        <Card_3 v-if="card_type == 2"
                :isPrev="true"
                :card_msg="card_msg"></Card_3>
        <Card_4 v-if="card_type == 3"
                :card_msg="card_msg"></Card_4>
        <!--2.0-->
        <Card_5 v-if="card_type == 4"
                :card_msg="card_msg"></Card_5>
        <Card_6 v-if="card_type == 5"
                :card_msg="card_msg"></Card_6>
        <Card_7 v-if="card_type == 6"
                :card_msg="card_msg"></Card_7>
      </div>
      <div class="bgfff h70 pt20 pl15 pr25 dis">

        <div class="disflex align-cen jsbet">

          <div class="disflex posre">
            <span class="seen_peo_dot"></span>
            <div class="browsing-history" :style="{zIndex:20 - k}" v-for="(v,k) in card_msg.browsePhoto" :key="k">
              <img
                  :src="v"
                  alt
                  mode="aspectFill"
                  class="w30 h30 b6fff bradius50p shadow_grayA"/>
            </div>
            <div class="ml21">
              <div class="newl-added"></div>

              <div class="lh20 fs14 fbold c38 newNub">
                {{card_msg.browseNum ? card_msg.browseNum : 0}}
                <div class="newl-added"
                     :class="todayClass"
                     v-if="dayBrowseNum !== '0' && todayClass">今日+{{dayBrowseNum}}</div>
              </div>
              <div class="fs12 ca8">{{ lang.text_0 }}</div>

            </div>

          </div>

          <div class="disflex align-cen flex-column" @click="doThumbs">
            <div class="disflex w44 h44  mb12 align-cen jscen bradius50p shadow_grayA">
              <img :src="isThumbs ? isLikeIcon: likeIcon" class="w25 h25">
            </div>
            <p class="fs14 fbold lh1">{{ lang.text_19 }}<span class="cblue">{{card_msg.thumbsNum || 0}}</span></p>
          </div>
        </div>


      </div>
      <img :src="img_sawtooth" class="w100p h15 disblock">
      <div class="pt13 pl20 pr20 mb12 ">
        <div class="disflex align-cen jscen w100p">

            <div v-if="type == 0 && isLogin && card_msg"
                  class="disflex align-cen"
                  @click="updateMyCard">
                <img class="w18 h18 mr10" :src="ic_create">
                <P class="lhno cfff">{{ lang.text_1 }}</P>
              </div>
              <div v-else-if="type != 0 && hasCard && !isBind"
                      class="disflex align-cen"
                      @click="SaveToCustomer">
                <img class="w18 h18 mr10" :src="ic_save">
                <P class="cfff">{{ lang.text_2 }}</P>
              </div>
              <div v-else-if="isLogin && isBind"
                      class="disflex align-cen">
                <img class="w20 h20 mr10" :src="ic_attribution">
                <P class="lhno ca8">{{ lang.text_3 }}</P>
              </div>
              <div v-else
                  class="disflex align-cen"
                  @click="createCard">
                  <img :src="ic_create" class="w18 h18 mr10">
                  <p class="fs16 cfff">{{ lang.text_4 }}</p>
            </div>
            <div class="disflex align-cen ml30 pl30 blfff"
                 @click="toShowBill"
                 v-if="isLogin && (type == 0)">
              <img :src="ic_cardimg" class="w18 h18 mr10">
              <p class="fs16 cfff">{{ lang.text_5 }}</p>
            </div>
        </div>
      </div>
      <div class="pt17 pl20  pr20 borderbox " :style="{backgroundImage: 'url(' +  img_bottom + ')', backgroundSize:'contain',backgroundRepeat:'no-repeat'}">
          <div class=" bgfff w100p posre pt25 pb25 pl20 pr20 borderbox mb25 shadowinset" style="border-radius:0rpx 0rpx 80rpx 20rpx;">
            <FormId>
              <img :src="cardCodeImg" class="w75 h75 posab" @click="createCode" style="top:0rpx;right:30rpx">
            </FormId>
            <div class="card-information">
              <FormId>
                <GetPhoneNumber  @next="makePhone" v-if="card_msg.tel">
                  <div class="disflex align-cen mb18">
                    <img :src="ic_phone" class="w30 h30 mr11">
                    <div class="disflex flex-column jsbet ">
                      <p class="fs12 c78">{{ lang.text_6 }}</p>
                      <p class="fs14 c38">{{card_msg.tel}}</p>
                    </div>
                  </div>
                </GetPhoneNumber>
                <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                    class="login-intercept" />
                <GetPhoneNumber  @next="addWx" v-if="card_msg.wx">
                  <div class="disflex align-cen mb18">
                    <img :src="ic_weChat" class="w30 h30 mr11">
                    <div class="disflex flex-column jsbet ">
                      <p class="fs12 c78">{{ lang.text_7 }}</p>
                      <p class="fs14 c38">{{card_msg.wx}}</p>
                    </div>
                  </div>
                </GetPhoneNumber>
                <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                    class="login-intercept" />
                <GetPhoneNumber v-if="card_msg.email">
                  <div class="disflex align-cen mb18">
                    <img :src="ic_e_mail" class="w30 h30 mr11">
                    <div class="disflex flex-column jsbet ">
                      <p class="fs12 c78">{{ lang.text_8 }}</p>
                      <p class="fs14 c38">{{card_msg.email}}</p>
                    </div>
                  </div>
                </GetPhoneNumber>
                <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                    class="login-intercept" />
                <GetPhoneNumber @next="goToMap(card_msg.address)" v-if="card_msg.address">
                  <div class="disflex align-cen mb18" >
                    <img :src="ic_position" class="w30 h30 mr11">
                    <div class="disflex flex-column jsbet ">
                      <p class="fs12 c78">{{ lang.text_9 }}</p>
                      <p class="fs14 c38">{{card_msg.address}}</p>
                    </div>
                  </div>
                </GetPhoneNumber>
                <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                class="login-intercept" />
                <div class="disflex jscen align-cen">
                  <button class="w142 h44 disflex cblue fbold fs18 jscen align-cen ml5 mr5 bradius44"
                       open-type="share"
                       @click.stop=""
                       style="background:rgba(83,260,204,0.15)">
                    转发名片
                  </button>
                    <button open-type="getPhoneNumber"
                            class="w142 h44 disflex cfff fbold fs18 jscen align-cen bg_line_blue ml5 mr5 bradius44 shadow_grayB"
                            @getphonenumber="exchangePhoneNumber"
                    >
                    交换名片
                    </button>
                </div>
              </FormId>

            </div>


          </div>
      </div>
      <!-- 个人简介 -->
      <div class="pl15 pr15 mb25" v-if="introduce || audioArr.src">
        <div class="disflex jscen mb15">
          <div class="disflex jscen align-cen">
            <img :src="ic_left" class="w10 h30">
            <div class="disflex flex-column jsbet align-cen mr10 ml10">
              <p class="fs18 fbold cfff">{{ lang.text_10 }}</p>
              <p class="fs10 cblue">ABOUT ME</p>
            </div>
            <img :src="ic_right" class="w10 h30">
          </div>
        </div>
        <div class="bradius10 bgfff pl20 pr20 pt20" :class="introduce ? 'pb20' : ''">
          <div class="disflex pb20"
               v-if="audioArr.src">
            <img :src="card_msg.picchecked"
                 mode="aspectFill"
                 alt
                 class="w40 h40 bradius5 mr15" />
            <div class="disinblock">
              <div class="output-audio">
                <!-- 默认状态 -->
                <div class="audio"
                     v-if="audioArr.bl==false"
                     @click="audioPlay"
                     :data-id="audioArr.id"
                     :data-bl="audioArr.bl">

                  <img class="ico"
                       src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-stand/card/yuyin-ico.png" />
                </div>
                <!-- 当前正在播放状态 -->
                <div class="audio"
                     v-if="audioArr.bl==true"
                     @click="audioStop"
                     :data-id="audioArr.id"
                     :data-bl="audioArr.bl">
                  <img class="ico"
                       src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-stand/card/yuyin-gif.gif" />
                </div>
              </div>
            </div>
            <span class="fs12 ca8 disflex column-reverse">{{audioArr.time + '"' || 0 + '"'}}</span>
          </div>
          <!-- 简介 -->
          <div id="content" class="fs14 lh24 c38" v-if="introduce">
              {{introduce}}
          </div>
        </div>
      </div>
      <!-- 公司视频 -->
      <div class="pl15 pr15 mb25" v-if="currentCompany && currentCompany.videoList">
        <div class="disflex jsbet align-cen mb15">
          <div class="disflex">
            <img :src="ic_left" class="w10 h35">
            <div class="disflex flex-column jsbet ml10">
              <p class="fs18 fbold cfff lh1">{{ lang.text_11 }}</p>
              <p class="fs10 cblue">VIDEO</p>
            </div>
          </div>
          <div class="disflex align-cen" @click="toMedia" v-if="videoLeg">
            <p class="fs14 cblue mr10">{{ lang.text_12 }}</p>
            <img :src="ic_right2" class="w25 h25">
          </div>
        </div>
        <div class="disflex wrap jsbet">
          <!--<div class="bgfff h211 shadow_gray">{{}}</div>-->
          <div v-for="(videoItem, index) in currentCompany.videoList"
               :key="index"
               class="bgfff overhidden"
               :class=" index === 0 ? 'firstVideo' : 'notFirstVideo'">
            <video :id="'myVideo'+ videoItem.videoId"
                   class="disblock w100p"
                   v-if="playIndex === videoItem.videoId"
                   :title="videoItem.videoTitle"
                   :poster="videoItem.videoCover || ''"
                   :src="videoItem.videoUrl"
                   objectFit="cover"
                   enable-danmu
                   danmu-btn
                   controls
                   :autoplay="true"></video>
            <div class="posre"
                 :class="index === 0 ? 'w100p h194' : 'w168 h94'"
                 @click="showVideo(videoItem.videoId)"
                 v-else>
              <img mode="aspectFill"
                   :src="videoItem.videoCover || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190604/1559619324240.png'"
                   alt
                   :class="index === 0 ? 'w100p h194' : 'w168 h94'" />
              <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190604/1559619365051.png"
                   alt
                   class="w50 h50 posab top0 left0 right0 bottom0 mauto" />
            </div>
            <div class="fs14 pl15 pr15 c38 fbold">{{videoItem.videoTitle}}</div>
          </div>
        </div>
      </div>

      <!-- 热销商品 -->
      <div class="pl15 pr15 mb25" v-if="companyGoodsResponses.length !== 0 ">
        <div class="disflex jsbet align-cen mb15">
          <div class="disflex">
            <img :src="ic_left" class="w10 h35">
            <div class="disflex flex-column jsbet ml10">
              <p class="fs18 fbold cfff lh1">{{ lang.text_13 }}</p>
              <p class="fs10 cblue">PRODUCT</p>
            </div>
          </div>
          <div class="disflex align-cen" @click="toProducts">
            <p class="fs14 cblue mr10">{{ lang.text_12 }}</p>
            <img :src="ic_right2" class="w25 h25">
          </div>
        </div>
          <scroll-view scroll-x
                       scroll-with-animation
                       class="pr20"
                       :scroll-left="scrollLeft">
            <div class="disflex">
              <div class="posre"
                   @click="selectGoods(item)"
                   v-for="item in companyGoodsResponses"
                   :key="item.goodsId">
                <div class="w123 mr10 bgfff bradius10 overhidden">
                  <img :src="item.goodsPhoto" class="w123 h123">
                  <div class="h56 pl10 pr15">
                    <p class="fs12 c38 w1100p over_1 mb4">
                      {{item.goodsName}}
                    </p>
                    <p class="corange fs14">￥{{item.price}}</p>
                  </div>
                </div>
                  <img :src="img_label_1"
                        v-if="item.isDistribution"
                        class="posab"
                        style="width:92rpx;height:34rpx;top:195rpx;left:0rpx;z-index:10">
                  <img :src="img_label_2"
                        class="posab"
                        v-if="item.isKill"
                        style="width:92rpx;height:34rpx;top:200rpx;left:0rpx;z-index:10">
                  <img :src="img_label_3"
                        class="posab"
                        v-if="item.isAssemble"
                        style="width:92rpx;height:34rpx;top:200rpx;left:0rpx;z-index:10">
              </div>
            </div>
          </scroll-view>
      </div>

      <!-- 推荐热文 -->
      <div class="pl15 pr15 mb25" v-if="hotDynamic.length !== 0 ">
        <div class="disflex jsbet align-cen mb15">
          <div class="disflex">
            <img :src="ic_left" class="w10 h35">
            <div class="disflex flex-column jsbet ml10">
              <p class="fs18 fbold cfff lh1">{{ lang.text_14 }}</p>
              <p class="fs10 cblue">ARTICLE</p>
            </div>
          </div>
          <div class="disflex align-cen" @click="toDynamic">
            <p class="fs14 cblue mr10">{{ lang.text_12 }}</p>
            <img :src="ic_right2" class="w25 h25">
          </div>
        </div>
        <div class="bradius10 bgfff pl20 pr20 pt20 pb20">
          <div class="disflex "
               v-for="(item,index) in hotDynamic"
               :key="item.dynamicId"
               :class="(hotDynamic.length-1 == index) ? '' : 'mb15'"
               @click="selectDynamic(item.dynamicId)">
            <img :src="item.photos || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card1_logo.png'"
              alt=""
              mode="aspectFill"
              class="w60 h60 bradius5 mr8">
            <div class="disflex flex-column jsbet">
              <span class="fbold c38 w232 fs16 over_1">{{item.title}}</span>
              <span class="ca8 fs12">{{item.createTime}}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 企业展示 -->
      <div class="pl15 pr15 mb25" v-if="companyinfo.companyIntroduce && (companyinfo.companyIntroduce !== '<p><br></p>')">

        <div class="disflex jscen mb15">
          <div class="disflex jscen align-cen">
            <img :src="ic_left" class="w10 h30">
            <div class="disflex flex-column jsbet align-cen mr10 ml10">
              <p class="fs18 fbold cfff">{{ lang.text_15 }}</p>
              <p class="fs10 cblue">COMPANY</p>
            </div>
            <img :src="ic_right" class="w10 h30">
          </div>
        </div>
        <div class="bradius10 bgfff pl20 borderbox pr20 pt20 pb20 enterprise-profile">
          <!--公司介绍-->
          <div class=""
              id="tab1"
              v-if="companyinfo.companyIntroduce">
            <subhead title="公司介绍" dec="COMPANY" padidng="none"></subhead>

            <div class="bgfff  pl15 pr15 pt20 pb15 borderbox  fs16 bradius5">
              <div v-html="companyinfo.companyIntroduce"></div>
            </div>

          </div>
          <div class="posab textc pb10 pt10 borderbox lucency-bg " @click="toWebSite" style="bottom:0rpx;">
            <div class="borderbox">
              <p class="cblue">{{ lang.text_20 }}<span class="ml8">></span></p>
            </div>
          </div>
        </div>
      </div>

      <!-- 我的图片 -->
      <div class="pl15 pr15 mb25" v-if="self_photos[0] !== '暂无'">

        <div class="disflex jscen mb15">
          <div class="disflex jscen align-cen">
            <img :src="ic_left" class="w10 h30">
            <div class="disflex flex-column jsbet align-cen mr10 ml10">
              <p class="fs18 fbold cfff">{{ lang.text_16 }}</p>
              <p class="fs10 cblue">PHOTOS</p>
            </div>
            <img :src="ic_right" class="w10 h30">
          </div>
        </div>
        <div class="bradius10 bgfff  borderbox overhidden">
          <img :lazy-load="true"
               :src="v"
               alt
               v-for="(v,k) in self_photos"
               :key="k"
               mode="widthFix"
               class="w100p h375 disblock"
               @click="previewImage(v)" />
        </div>
      </div>
      <div class="insert-card"  v-if="!isLogin || !hasCard" @click="updateMyCard">
        <div class="insert">
          <div class="left">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/add.png"/>
            <p class="fs18 cfff">{{ lang.text_17 }}</p>
          </div>
          <p class="right fs18 cfff fbold">{{ lang.text_18 }}</p>
        </div>
      </div>
    </scroll-view>
  </div>
</template>

<script>
let myaudio = wx.createInnerAudioContext();
myaudio.obeyMuteSwitch = false;
import Card_1 from "@/components/card_1"; //
import Card_2 from "@/components/card_2"; //
import Card_3 from "@/components/card_3"; //
import Card_4 from "@/components/card_4"; //
import Card_5 from "@/components/card_5"; //
import Card_6 from "@/components/card_6"; //
import Card_7 from "@/components/card_7"; //
import FormId from "@/components/formId";
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import WXAJAX from "@/utils/request";
import LoginIntercept from "@/components/LoginIntercept";
import subhead from "@/components/subhead"
import HandleLogin from "@/utils/handleLogin";
import {mapMutations} from 'vuex';
import WebSocket from '@/utils/websocket'
import LangUtils from '../utils/LangUtils';

export default {
  props:['scrollContentHeight',
         'card_type',
         'card_msg',
         'dayBrowseNum',
         'isThumbs',
         'audioArr',
         'introduce',
         'currentCompany',
         'playIndex',
         'companyGoodsResponses',
         'hotDynamic',
         'companyinfo',
         'self_photos',
         'hasCard',
         'isLogin',
         'isBind',
         'type',
         'isLogin',
         'todayClass',
         "videoLeg"],
  data(){
    return{
      lang: LangUtils.getLangSrc().components.templateStyle,
      cardCodeImg:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/img_card_code2x.png',
      img_bottom:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/img_bottom@2x.png',
      img_sawtooth:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/img_sawtooth@2x.png',
      likeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_like.png',
      isLikeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_select_like.png',
      ic_create:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/ic_create@2x.png',
      ic_add:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/icon_add.png',
      ic_e_mail:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/icon_e_mail@2x.png',
      ic_phone:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/icon_phone@2x.png',
      ic_position:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/icon_position@2x.png',
      ic_weChat:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/icon_weChat@2x.png',
      ic_left:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/img_left@2x.png',
      ic_right:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/img_right@2x.png',
      ic_right2:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/icon_right2@2x.png',
      img_label_1:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_label_1.png',
      img_label_2:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_label_2.png',
      img_label_3:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_label_3.png',

      ic_attribution:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/ic_attribution@2x.png',
      ic_cardimg:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/ic_cardimg@2x.png',
      ic_save:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/ic_save@2x.png',
      ic_saved:WXAJAX.imgBackUrl + 'yimai_photos/newTemplate/ic_saved@2x.png',
      moreIntroduce:false,
      isMore:false, // 是否显示更多
      videoLeg:'',
    }
  },
  components: {
    Card_1,
    Card_2,
    Card_3,
    Card_4,
    Card_5,
    Card_6,
    Card_7,
    FormId,
    GetPhoneNumber,
    LoginIntercept,
    subhead
  },

  onShareAppMessage(e) {
    this.COMPANYID = wx.getStorageSync("COMPANYID")
    let carId = wx.getStorageSync("CARDID")
    const { name, companyName, position } = this.currentCompany;
    let path = "/pages/index/main?cardId=" +
        carId +
        "&companyId=" +
        this.COMPANYID +
        "&goType=1"
    //console.log('name:'+name)
    //console.log('companyName:'+companyName)
    //console.log('position:'+position)
    let shareSpeech = (this.currentCompany || "").shareSpeech || "";
    try {

      console.log(path)
      shareSpeech = shareSpeech
        .replace("#name#", name)
        .replace("#company#", companyName);
    } catch (e) {
      console.error("获取分享语出现错误");

    }

    return {
      title:
        shareSpeech ||
        `您好，我是${companyName || ""}的${position || ""}${name || ""}，敬请惠存!`,
      path:
        "/pages/index/main?cardId=" +
        this.CARDID +
        "&companyId=" +
        this.COMPANYID +
        "&goType=1",
      // success(e) {
      //   wx.showShareMenu({
      //     // withShareTicket: true
      //   });
      // },
      // fail(e) {
      //   ////console.log("失败分享名片--- ", e);
      // }
    };
  },
  mounted(){
    // setTimeout(()=>{// 获取简介高度
    //   const query = uni.createSelectorQuery().in(this);
    //   query.select('#content').boundingClientRect(data => {
    //     console.log('data',data)
    //     if(data.height == 130){
    //       this.isMore = true
    //     }
    //   }).exec();
    // },500)
  },
  methods:{
    ...mapMutations(['setPhone']),
    previewImage(src) {
      authSubscribeMessage(this.subscriptionNew);
      if(src){
        //点击图片放大
        var v = this;
        wx.previewImage({
          current: src,
          urls: v.self_photos
          // urls必须是数组 不然会报错
        });
      }
    },
    //滑动到顶部
    scrollChange(){
      this.$emit('scrollChange');
    },

    //点赞
    doThumbs(){
      if(this.isLogin){
        this.$emit('doThumbs')
      }else{
        this.$emit('showloginBox')
      }
    },
    //拨打电话
    makePhone(){
      this.$emit('makePhone');
    },
    //添加微信
    addWx(){
      this.$emit('addWx');
    },
    showVideo(index){
      this.$emit('showVideo',index);
    },
    //地址导航
    goToMap(address){
      this.$emit('goToMap',address);
    },
    //登录
    loginInterceptSuccess(){
      this.$emit('loginInterceptSuccess');
    },

    audioPlay(e) {
      var that = this,
        id = e.currentTarget.dataset.id,
        key = e.currentTarget.dataset.key,
        audioArr = that.audioArr,
        vidSrc = audioArr.src;

      if (!vidSrc) {
        return;
      }
      myaudio.src = vidSrc;
      myaudio.autoplay = true;
      myaudio.startTime = 0;

      //切换显示状态
      this.$emit('setAudioArr',true);
      // audioArr.bl = true;

      //开始监听
      myaudio.onPlay(() => {
        that.audioArr = audioArr;
      });

      //结束监听
      myaudio.onEnded(() => {
        audioArr.bl = false;
        myaudio.stop();
        myaudio.destroy();
        myaudio = wx.createInnerAudioContext();
        myaudio.obeyMuteSwitch = false;
        this.$emit('setAudioArr',false);
      });
    },
    // 音频停止
    audioStop(e) {
      var that = this,
        key = e.currentTarget.dataset.key,
        audioArr = that.audioArr;
      //切换显示状态
      this.$emit('setAudioArr',false);
      myaudio.stop();
      myaudio.destroy();
      myaudio = wx.createInnerAudioContext();
      myaudio.obeyMuteSwitch = false;
    },
    //更多视频
    toMedia(){
      this.$emit('toMedia')
    },
    //更多商品
    toProducts(){
      this.$emit('toProducts')
    },
    //选择商品
    selectGoods(data){
      this.$emit('selectGoods',data)
    },
    //更多热文
    toDynamic(){
      this.$emit('toDynamic')
    },
    //选择文章
    selectDynamic(id){
      const { companyId, cardId } = this.currentCompany;
      let url = '../dynamicDetail/main?dynamicId=' + id + '&companyId=' + companyId + '&cardId=' + cardId;
      wx.navigateTo({ url: url })
    },
    toWebSite(){
      wx.switchTab({ url: '/pages/WebSite/main' })
    },
    //创建名片
    updateMyCard() {

      if(this.isLogin){
       this.$emit('updateMyCard')
      }else{
        this.$emit('showloginBox')
      }

    },
    //查看名片码
    createCode(){
      this.$emit('createCode')
    },
    //存为客户
    SaveToCustomer(){
      this.$emit('SaveToCustomer')
    },
    //创建名片
    createCard(){
      if(this.isLogin){
        this.$emit('createCard')
      }else{
        this.$emit('showloginBox')
      }

    },
    //名片海报
    toShowBill(){
      this.$emit('toShowBill')
    },
    //交换名片
    addToAddressBook(){
      if(this.isLogin){
        this.$emit('addToAddressBook')
      }else{
        this.$emit('showloginBox')
      }
    },
    exchangePhoneNumber(e){
      console.log(e);
        let {encryptedData, iv} = e.target;

        if (!encryptedData || !iv) {
          wx.showToast({
            title: '手机号未授权，请绑定手机号后再次发送',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        WXAJAX.POST({
          phoneData:  e.target.encryptedData,
          phoneIv: e.target.iv,
        }, '', '/home/getWxPhone')
          .then(res=>{
            if(res != "weixin_failt"){
              wx.setStorageSync('phone',res) ;
              this.setPhone(res);
              WebSocket.sendMessage({
                code: 103,
                message: res,
                messageType: 4,
                targetId: this.card_msg.userId
              })
              uni.showToast({
                title:this.card_msg.username + '已经收到你的联系方式',
                icon:'none'
              })
              setTimeout(()=>{
                this.$emit('addToAddressBook')
              },500)
            }else{
              uni.showToast({
                title:'授权失败请稍后再试',
                icon:'none'
              })
            }
          });
    }
  }
}
</script>

<style scoped>
.top_card{
  position: relative;
}
.browsing-history{
  width: 36upx;
}
.seen_peo_dot{
  display: block;
  position: absolute;
  top: 0upx;
  left: 0upx;
  background-color: #FD634E;
  width: 17upx;
  height: 17upx;
  z-index:106;
  border-radius: 50%;
}
.newNub{
  position: relative;
}
.newl-added{
  position: absolute;
  color:#51CDCB;
  font-size: 20upx;
  top: -15upx;
}
.newl-positionR1{
  right: -65upx;
}
.newl-positionR2{
  right: -85upx;
}
.newl-positionR3{
  right: -95upx;
}
.card-information{
  min-height: 150rpx;
}
.output-audio {
  width: 334upx;
  height: 80upx;
  position: relative;
  margin-right: 22upx;
}

.audio::before {
  content: "";
  display: block;
  width: 20upx;
  height: 20upx;
  background: #f5f5f6;
  position: absolute;
  border: 1upx solid #e8e8e8;
  border-radius: 8upx;
  transform: rotate(45deg);
  border-right-width: 0;
  border-top-width: 0;
  top: 0px;
  bottom: 0;
  left: -12upx;
  margin: auto;
}

.output-audio .audio {
  padding: 24upx 0 24upx 34upx;
  background: #f5f5f6;
  border: 1upx solid #e8e8e8;
  position: relative;
  height: 30upx;
  border-radius: 10upx;
}

.output-audio .audio .ico {
  width: 24upx;
  height: 34upx;
  float: left;
}
.maxHight{
  max-height: 236upx;
  overflow: hidden;
}
.firstVideo {
  width: 100%;
  border-radius: 10upx;
}

.firstVideo div {
  line-height: 84upx;
}

.notFirstVideo {
  width: 336upx;
  margin-top: 20upx;
  border-radius: 10upx;
}

.notFirstVideo video {
  height: 188upx;
}

.notFirstVideo div {
  line-height: 48upx;
}
.enterprise-profile{
  overflow: hidden;
  max-height: 700rpx;
  position: relative;
}
.lucency-bg{
  background: #FFFFFF ;
  width: 90%;
  box-sizing: border-box;
}
.insert-card{
  padding-right: 30upx;
  padding-left: 30upx;
  box-sizing: border-box;
  text-align: right;
  padding-bottom: 40rpx;
}

.insert {
  width: 690upx;
  height: 120upx;
  background: #51cdcb;
  border-radius: 60upx;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.insert:active {
  opacity: 0.8;
}
.insert .left {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 42upx;
}
.insert .left img {
  width: 60upx;
  height: 60upx;
  margin-right: 22upx;
}
.right {
  margin-right: 42upx;
}
</style>
