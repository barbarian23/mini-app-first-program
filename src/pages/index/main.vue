<template>
  <div class="index"
       :style="{height: mainHeight+'px'}">
    <NavBarByUser @cancelLoginGuide="cancelLoginGuide"
                  :isLogin="isLogin"
                  :isShowLoginGuide="isShowLoginGuide"
                  :isShowCardCase="true"
                  @loginSuccess="loginSuccess"
                  @loginFailed="loginFailed"
                  @sginRecord="sginRecord"
                  :currentPage="'index'"
                  :avatarUrl.sync="avatarUrl" />

    <scroll-view :style="{height: scrollContentHeight+'px'}"
                 class="dynamic-content"
                 :scroll-y="true"
                 :enable-back-to-top="true"
                 :scroll-anchoring="true"
                 @scroll="scrollChange"
                 v-if="card_msg.cardTemplate == 'DEFAULT'">

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
      <!-- <div class="pt15 card-case" @click.native="toCardCase">
                    <div class="disflex h30 bra_left_15 bg_line_blue cfff fs12 pl15 pr10 lh30 align-cen">
                        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/cardlist.png" alt class="w24 h24" />
                        <span class="pl7">{{ lang.text_0 }}</span>
                    </div>
                </div> -->
      <view>
        <div class="card_menu posre fs12 ca8 bgfff borderbox pl10 pr10">
          <div class="clearfix disflex operation-box">
            <FormId>
              <div class="shadow_grayA h65 mr10 business_card"
                   @click="createCode">
                <!-- <p class="pb3">{{ lang.text_1 }}</p>
                <div class="w20">
                  <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/ercode.png"
                       alt=" "
                       class="w20 h20" />
                </div> -->
                <img :src="cardCodeImg" alt="" class="w65 h65">
              </div>
            </FormId>
            <FormId>
              <scroll-view scroll-x
                           scroll-with-animation
                           class="scroll-list h99a"
                           :scroll-left="scrollLeft">
                <div class="disflex align-cen h99a">
                  <div class="shadow_grayA textc pt15 pl15 pr15 h55 mr10"
                       v-if="type == 0"
                       @click="toShowBill">
                    <p class="pb7">{{ lang.text_2 }}</p>
                    <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/wx_timeline.png"
                         alt=" "
                         class="w20 h20" />
                  </div>
                  <div class="posre shadow_grayA textc bradius5 pt15 pl15 pr15 h55 mr10">
                    <GetPhoneNumber @next="addToAddressBook">
                      <p class="pb7">{{ lang.text_3 }}</p>
                      <p>{{ lang.text_4 }}</p>

                    </GetPhoneNumber>
                    <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                    class="login-intercept" />
                  </div>
                  <div class="posre shadow_grayA textc bradius5 pt15 pl15 pr15 h55 mr10">
                    <GetPhoneNumber @next="makePhone">
                      <p class="disflex align-cen">
                        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/tel.png"
                             alt
                             class="w16 h16" />
                        <span class="pl9">{{ lang.text_5 }}</span>
                      </p>
                      <p class="c78 fbold pt7">{{card_msg.tel || lang.text_16}}</p>
                    </GetPhoneNumber>
                    <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                    class="login-intercept" />
                  </div>
                  <div class="posre shadow_grayA textc bradius5 pt15 pl15 pr15 h55 mr10">
                    <GetPhoneNumber @next="addWx">
                      <p class="disflex align-cen">
                        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/msg.png"
                             alt
                             class="w16 h16" />
                        <span class="pl9">{{ lang.text_6 }}</span>
                      </p>
                      <p class="c78 fbold pt7">{{card_msg.wx || lang.text_16}}</p>
                    </GetPhoneNumber>
                    <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                    class="login-intercept" />

                  </div>
                  <div class="posre shadow_grayA textc bradius5 pt15 pl15 pr15 h55 mr10"
                       @click.stop="goToMap(card_msg.address)">

                      <p class="disflex align-cen">
                        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190425164542.png"
                             alt
                             class="w16 h16" />
                        <span class="pl9">{{ lang.text_7 }}</span>
                      </p>
                      <p class="c78 fbold pt7">{{card_msg.address || lang.text_16}}</p>

                    <LoginIntercept @loginSuccess="loginInterceptSuccess"
                                    class="login-intercept" />
                  </div>
                </div>
              </scroll-view>
            </FormId>
             <img  class="w150 h29 first-login-img"
                        :src="firstLoginIcon"
                        v-if="isFirstLogin">
          </div>
          <!-- <div class="more-info"
               @click="scrollviewRight">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190514143457.png"
                 alt
                 class="left-img" />
          </div> -->
        </div>
      </view>
      <div class="seen_peo disflex pl15 pr26 fs10 pb20 ca8 jsbet bgfff">
        <span class="seen_peo_dot" v-if="todayNumber"></span>
        <div class="disflex">
          <div class="disflex">
            <div class="browsing-history" :style="{zIndex:20 - k}" v-for="(v,k) in card_msg.browsePhoto" :key="k">
              <img
                 :src="v"
                 alt
                 mode="aspectFill"
                 class="w30 h30 b6fff bradius50p shadow_grayA"/>
            </div>

          </div>
          <div class="ml21 newNub">
            <p class="newl-added" v-if="dayBrowseNum !== '0'">今日+{{dayBrowseNum}}</p>
            <p class="lh20 fs14 fbold c38">{{card_msg.browseNum ? card_msg.browseNum : 0}}</p>
            <p class="fs12 ca8">{{ lang.text_8 }}</p>
          </div>
        </div>
        <view>
          <div class="disflex fs18 lh44 textc jsbet bgfff user-btn-group">
            <!-- <div>
              <button class="share_card w165 bradius5 cblue bblue bgfff"
                      open-type="share"
                      hover-class="other-button-hover"
                      style="margin: 0">
                分享名片
              </button>
            </div> -->
            <div v-if="type == 0 && isLogin && card_msg"
                 class="disflex shadow_grayB bgblue jscen align-cen borderbox bradius44 cfff w165 h44 edit-btn"
                 @click="updateMyCard"
                 style="margin: 0">
              <img class="w20 h20 mr10" :src="editIcon">
              <P class="lhno">{{ lang.text_9 }}</P>
            </div>
            <button v-else-if="type != 0 && hasCard && !isBind"
                    class="disflex shadow_grayB bgblue jscen align-cen borderbox bradius44 cfff w165 h44"
                    hover-class="other-button-hover"
                    @click="SaveToCustomer"
                    style="margin: 0">
              <img class="w20 h20 mr10" :src="saveIcon">
              <P class="lhno">{{ lang.text_10 }}</P>
            </button>
            <button v-else-if="isLogin && isBind"
                    class="disflex bgf8 jscen align-cen borderbox bradius44 cfff w165 b2e8 h44"
                    hover-class="other-button-hover"
                    style="margin: 0">
              <img class="w20 h20 mr10" :src="lockIcon">
              <P class="lhno ca8">{{ lang.text_11 }}</P>
            </button>
            <div v-else
                 class="posre bgblue bradius44 cfff w165 flex-c-c create-card"
                 style="margin: 0">
              <button class="share_card borderbox w165 bradius44 cfff bgblue"
                      open-type="getPhoneNumber"
                      @getphonenumber="getPhoneNumber"
                      @click="createCard"
                      style="margin: 0">

                创建名片
              </button>
              <LoginIntercept @loginSuccess="loginInterceptSuccess"
                              class="login-intercept" />
            </div>
          </div>
      </view>

      </div>

      <div class="disflex forward align-cen mb12 jsbet">
        <div>
          <button
                open-type="share"
                hover-class="other-button-hover"
                class="disflex bgfff align-cen flex-column">
            <div class="disflex w44 mb12 h44 align-cen jscen bradius50p shadow_grayA">
              <img :src="weixinIcon" class="w25 h25">
            </div>
            <p class="fs14 fbold lh1">{{ lang.text_12 }}</p>
          </button>
        </div>
        <div class="disflex align-cen flex-column" @click="doThumbs">
          <div class="disflex w44 h44  mb12 align-cen jscen bradius50p shadow_grayA">
            <img :src="isThumbs ? isLikeIcon: likeIcon" class="w25 h25">
          </div>
          <p class="fs14 fbold lh1">{{ lang.text_13 }}<span class="cblue">{{card_msg.thumbsNum || 0}}</span></p>
        </div>
      </div>

      <!--introduce begin-->
      <div class="c38 fs16 pl15 pr15"   v-if="audioArr.src || introduce">
        <subhead title="个人简介" dec="ONESELF"></subhead>
        <div class="shadow_gray pl15 pr15 bradius5">
          <div class="pt15 disflex pb20"
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
          <div class="fs14 self_introduce lh22"
               :style="{height:seemore?introHeight : '' }"
               v-if="introduce">
            <div class="introduce pb20"
                 :style="{'padding-top': audioArr.src ? '0' : '40rpx'}">{{introduce}}
            </div>
          </div>
          <div class="more fs12 ca8 lh40 textc"
               @click="seemore = !seemore"
               v-if="moreshow">{{ lang.text_14 }}</div>
        </div>
      </div>

      <!--热销商品-->
      <div class="fs16 bgfff pl16 pb15 mb4" v-if="companyGoodsResponses && companyGoodsResponses.length > 0">
        <p class="lh47 fbold pt17 pb10">{{ lang.text_15 }}</p>
        <div class="disflex wrap">
          <div class="btf5f6 bbf5f6" style="width: 96%;">
            <div class="list h85 pt10 pb15 pl10 pr15 bgf5f6" style="border-radius: 20px;display: flex;margin-top: 10px;"
                 v-for="(data) in companyGoodsResponses"
                 :key="data.goodsId"
                 @click="selectGoods(data)"
            >
              <image class="w60 h60" :src="data.goodsPhoto"></image>
              <div class="list-right" style="margin-left: 10px;">
                <p>{{data.goodsName ? data.goodsName : ''}}</p>
                <div class="delete" style="margin-top: 19px;" >
                  <span class="fs12 corange ">￥{{data.price}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--公司视频-->
      <div class="pl15 pr15"
           v-if="currentCompany.videoList">
        <subhead title="视频展示" dec="VIDEOS"></subhead>
        <div class="disflex wrap jsbet">
          <!--<div class="bgfff h211 shadow_gray">{{}}</div>-->
          <div v-for="(videoItem, index) in currentCompany.videoList"
               :key="index"
               class="bgfff overhidden"
               :class=" index === 0 ? 'firstVideo' : 'notFirstVideo'">
            <video :id="'myVideo'+ videoItem.videoId"
                   class="disblock"
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
            <div class="fs14 pl15 c38 fbold">{{videoItem.videoTitle}}</div>
          </div>
        </div>
      </div>
      <!--introduce end-->
      <!--pic begin-->
      <div class="c38 fs16" v-if="self_photos[0] !== '暂无'">
        <div class="pl15 pr15">
          <subhead title="我的照片" dec="PHOTOS"></subhead>
        </div>
        <p class="lh44 fs16 pl15 fbold"></p>
        <!-- 没有照片直接不显示此模块，此处不要 -->
        <!-- <div class="textc shadow_gray pl15 pr15 bgfff bradius5"
             style="height: 104px"
             v-if="self_photos.length == 0">
          暂无图片
        </div> -->
        <div>
          <img :lazy-load="true"
               :src="v"
               alt
               v-for="(v,k) in self_photos"
               :key="k"
               mode="widthFix"
               class="w100p h375"
               @click="previewImage(v)" />
        </div>
      </div>
      <!--pic end-->
      <!--bottom-->
      <div class="textc lh42 fs12 ca8 bgf5f6">{{ lang.text_17 }}</div>
      <!--右边悬浮框-->
      <!-- <div class="index_float_right trans2 overhidden">
                <RightFloat :isShow="isShow" @clickRightRowEvent="clickRightRowEvent"></RightFloat>
                <div :class="{fadeInRight: !isShow, fadeOutRight: isShow}" style="width: 40rpx;right: 0;border-top-left-radius: 10rpx;border-bottom-left-radius: 10rpx" class="animated posfix fs10 ca8 textc floats trans2 bottom30 shadow_gray bgfff pb15" >
                    <div class="pt16" @click="clickRightRowEvent">
                        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/right_row.png" alt style="width: 30rpx;transform: rotate(180deg);height: 30rpx;" />
                    </div>
                </div>
            </div> -->
    </scroll-view>

    <templateStyle :scrollContentHeight="scrollContentHeight"
                   :card_type="card_type"
                   :card_msg="card_msg"
                   :dayBrowseNum="dayBrowseNum"
                   :isThumbs="isThumbs"
                   :audioArr="audioArr"
                   :introduce="introduce"
                   :currentCompany="currentCompany"
                   :playIndex="playIndex"
                   :companyGoodsResponses="companyGoodsResponses"
                   :hotDynamic="hotDynamic"
                   :companyinfo="companyinfo"
                   :self_photos="self_photos"
                   :hasCard="hasCard"
                   :isLogin="isLogin"
                   :isBind="isBind"
                   :type="type"
                   :videoLeg="videoLeg"
                   :todayClass="todayClass"
                   @doThumbs="doThumbs"
                   @scrolltoupper="scrolltoupper"
                   @makePhone="makePhone"
                   @addWx="addWx"
                   @goToMap="goToMap"
                   @loginInterceptSuccess="loginInterceptSuccess"
                   @setAudioArr="setAudioArr"
                   @showVideo="showVideo"
                   @toMedia="toMedia"
                   @toProducts="toProducts"
                   @toDynamic="toDynamic"
                   @selectGoods="selectGoods"
                   @loginSuccess="loginSuccess"
                   @showloginBox="showloginBox"
                   @createCode="createCode"
                   @updateMyCard="updateMyCard"
                   @SaveToCustomer="SaveToCustomer"
                   @createCard="createCard"
                   @toShowBill="toShowBill"
                   @addToAddressBook="addToAddressBook"
                   @scrollChange="scrollChangeA"
                   v-else>

    </templateStyle>
    <div v-if="isShowCourse">
        <addWxCourse top='136rpx'
                     :isShow="isShowCourse"
                     @close="isShowCourse=false" />
      </div>
    <FloatButtons class="index_float_right trans2 overhidden"
                  :isShowTalk="isShowTalk"
                  :avatarUrl="targetAvatarUrl"
                  :isLogin="isLogin"
                  :isBayWindow="isBayWindow"
                  @talk="talk"
                  @loginInterceptSuccess="loginInterceptSuccess"></FloatButtons>
    <div v-if="isShowAuthorize">
      <AuthorizeBox @close="isShowAuthorize = false"></AuthorizeBox>
    </div>
    <login
      :isShow="loginShow"
      :avatarUrl="targetAvatarUrl"
      :userInfo="userInfo"
      :hint="hint"
      @cancelLogin="cancelLogin"
      @loginSuccess="loginSuccess"
      ></login>
      <posterCanvas @toChooseText="toChooseText"
                    @close_canvas_tap="close_canvas_tap"
                    @toGalleryPhotos="toGalleryPhotos"
                    :signInSucceed="signInSucceed"
                    :clockRecord="clockRecord"
                    :wxTwoCode="currentCompany.wxTwoCode"
                    :avatarUrl="avatarUrl"></posterCanvas>
      <div v-if="showSetClock">
        <dialogBox dialog_title="未到打卡时间"
                 type='hint5'
                 dialog_ph="还未到打卡时间哦，您可以在“"
                 dialog_ph_2="”中的“"
                 dialog_ph_3="”里面设置打卡时间"
                 default_1="设置中心"
                 default_2="早晚安打卡"
                 left="取消"
                 right="去设置"
                 @btn_tap="clock_set_tap"
                >
        </dialogBox>
      </div>

  </div>
</template>
<script>
import {sendSocketJSON} from "../../utils/websocket";

let myaudio = wx.createInnerAudioContext();
myaudio.obeyMuteSwitch = false;

import RightFloat from "@/components/rightFloat"; //
import FloatButtons from "@/components/FloatButtons.vue";
import GetPhoneNumber from "@/components/getPhoneNumber"; //
import AddWxCourse from "@/components/addWxCourse";
import Card_1 from "@/components/card_1"; //
import Card_2 from "@/components/card_2"; //
import Card_3 from "@/components/card_3"; //
import Card_4 from "@/components/card_4"; //
import Card_5 from "@/components/card_5"; //
import Card_6 from "@/components/card_6"; //
import Card_7 from "@/components/card_7"; //
import FormId from "@/components/formId";
import NavBarByUser from "@/components/NavBarByUser.vue";
import AuthorizeBox from "@/components/AuthorizeBox";
import login from "@/components/login";
import dialogBox from "@/components/dialogBox";

import posterCanvas from "@/components/posterCanvas"
import { mapActions, mapGetters, mapMutations } from "vuex";
import WXAJAX from "../../utils/request";
import util from "../../utils/index";
import { authSubscribeMessage } from "../../utils/auth.js";
import HandleLogin from "@/utils/handleLogin";
import LoginIntercept from "@/components/LoginIntercept";
import querystring from "querystring";
import subhead from "@/components/subhead"
import websocket from "@/utils/websocket";
import templateStyle from "@/components/templateStyle"
import LangUtils from '../../utils/LangUtils'



export default {
  data() {
    return {
      lang: LangUtils.getLangSrc().index,
      introduce: "", //介绍
      seemore: false,
      introHeight: "",

      //音频列表
      audioArr: {
        id: "0",
        src: "",
        time: "",
        bl: false,
        startTime: 0
      },
      card_type: 1, //名片样式
      type: 0, //0我的名片，1别人名片
      card_msg: {
        //名片信息
        username: "",
        post: "",
        tel: "",
        company_logo: "",
        picchecked: "",
        company: ""
      },
      COMPANYID: 0,
      CARDID: 0,
      playIndex: "",
      moreShow: false,
      self_photos:[],
      isThumbs: 0, //是否点赞
      right_float_show: false, //右边悬浮框
      goType: 0, // 0小程序进入，1分享进入
      hasCard: false, //  是否有名片
      isShowCourse: false,
      isShow: true,
      avatarUrl: "", //用户的头像地址,
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      isShowTalk: true, //是否显示右边侧边栏的聊一聊
      isShowLoginGuide: true, //是否显示登录引导页,
      targetAvatarUrl: "", //当前目标的人物头像
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0, //整体高度
      scrollLeft: 0,
      loginShow:false, // 登录弹框显隐
      showLogin:'',
      // headPortrait: "" //获取更改名片后的头像
      isShowAuthorize: false,
      companyGoodsResponses:[],
      cardCodeImg:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_card_code.png',
      saveIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/icon_save.png',
      weixinIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_weixin.png',
      likeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_like.png',
      isLikeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_select_like.png',
      editIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/icon_ edit.png',
      firstLoginIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/img_viewmore.png',
      lockIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_lock.png',
      dayBrowseNum:0,
      isFirstLogin:wx.getStorageSync('isFirstLogin') || '',
      isCollected:wx.getStorageSync('showBayWindow') || '',
      isBayWindow:false,//飘窗显隐
      hint:'',
      isBind:false,
      show:true,
      clockRecord:'', //打卡数据
      signInSucceed:false, // 打卡组件显隐
      showSetClock:false, //打卡弹框显隐
      templateType:false,
      hotDynamic:'' ,//热文
      companyinfo:'',
      videoLeg:"",
      isLoginShow:'',
      todayClass:'', // 今日新增间距
    };
  },

  components: {
    RightFloat,
    Card_1,
    Card_2,
    Card_3,
    Card_4,
    Card_5,
    Card_6,
    Card_7,
    FormId,
    GetPhoneNumber,
    AddWxCourse,
    NavBarByUser,
    FloatButtons,
    LoginIntercept,
    AuthorizeBox,
    subhead,
    login,
    posterCanvas,
    dialogBox,
    templateStyle
  },
  watch:{
    showLogin(val,old){
      //////console.log(111)
      if(val == true){
        this.loginShow = true
      }
    },
    isLoginShow(val){
      if(val == true){
        this.loginShow = true
      }
    },
    dayBrowseNum(val){
      this.todayClass = val.length == 2 ? 'newl-positionR2' : val.length == 3 ? 'newl-positionR3' : 'newl-positionR1'
    }
  },
  onShareTimeline(e) {
    this.COMPANYID = wx.getStorageSync("COMPANYID")
    let carId = wx.getStorageSync("CARDID")
    const { name, companyName, position } = this.currentCompany;
    let query = "cardId=" +
        carId +
        "&companyId=" +
        this.COMPANYID +
        "&goType=1"
    //console.log('name:'+name)
    //console.log('companyName:'+companyName)
    //console.log('position:'+position)
    let shareSpeech = (this.currentCompany || "").shareSpeech || "";
    try {

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

      query: query,
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
  async onLoad(options) {
    ////console.log(options);
    options = {cardId: 16240, companyId: 2, goType: 1}
    console.log('options11111',JSON.stringify(options));
    if (options.cardId) {
      console.log('indexOptions',options);
      //从分享的名片页面进入
      this.CARDID = options.cardId
      wx.setStorageSync("COMPANYID", options.companyId);
      wx.setStorageSync("CARDID", options.cardId);
      ////console.log(options.cardId);
      this.goType = options.goType;
    }else if ( !wx.getStorageSync("CARDID")) {
      // 在缓存中存在COMPANYID和CARDID标识 通过太阳码扫码进入，在APP.vue中已经设置了COMPANYID和CARDID，则直接查询太阳码扫码进入的名片详情
      // 如果没有，则需要查询默认名片
      this.getAllCard();
    }else if(options.scene){ //分销邀请
      let param = util.formatParams(decodeURIComponent(options.scene));
      if(param.card){
        wx.setStorageSync('CARDID', param.card)
        wx.setStorageSync('COMPANYID',param.c)
      }
      if(param.i){
        this.inviteJump(param);
      }
    }
    //查询自动打卡设置
    this.queryClockSetting()
    //查询订阅消息
  },

  /** tab点击 */
  onTabItemTap(item) {
    //订阅授权 信息相关
    authSubscribeMessage(this.subscriptionNew);
  },
  onShow() {
    //console.log(1)

    this.showLogin = wx.getStorageSync('showLogin')
    //获取名片的公司
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = `/${currentPage.route}`;
    wx.setStorageSync('pages',url)
    let lastCardId = this.CARDID || '';
    this.COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    this.CARDID = wx.getStorageSync("CARDID") || 0;
    ////console.log(wx.getStorageSync("CARDID"));
    this.hasCard = wx.getStorageSync("hasCard");
    this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.isBayWindow = wx.getStorageSync("showBayWindow") || false

    //缓存存储的cardid和当前页面的cardid不相等，或者 当前的card_msg 不存在，或者编辑卡片后返回
    let refreshCard = wx.getStorageSync("refreshCard") || false;
    if (lastCardId !== this.CARDID || refreshCard  || this.card_msg.username == '') {
      wx.removeStorageSync("refreshCard");
      this.inits(0)
    }



    wx.showShareMenu({
      withShareTicket : true,
      menus:['shareAppMessage','shareTimeline']
    })
    // if(){
    //   this.getMyCard()
    // }
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
  onHide() {
    myaudio.stop();
    this.showLogin = ''
    wx.setStorageSync('pages','')
    wx.setStorageSync('showLogin','')
    this.isLoginShow = false
  },

  onPageScroll() {
    this.right_float_show = false;
  },
  computed: {
    ...mapGetters(["currentCompany", "subscriptionNew"])
  },
  async mounted() {
    let a = await util.systemIfo();
    this.mainHeight = a.windowHeight;
    this.scrollContentHeight = a.windowHeight - getApp().globalData.navHeight;
  },
  methods: {
    ...mapActions(["setCurrentCompany", "setSubscriptionNew"]),
    ...mapMutations(["setEditStatus", "setAvatarUrl"]),
  async getAllCard() {
      WXAJAX.POST(
        {
          name: "",
          pageNum: 1
        },
        "",
        "/businessCard/seeDetail",
        "1"
        )
        .then(data => {
          let selfCard = null;
          let defaultCard = null;
          // state : 1 -- 默认 ， 2 -- 浏览记录 ， 3 -- 自己的
          if(data){

            for (let index = 0; index < data.list.length; index++) {
                if(selfCard || defaultCard){
                    break;
                }
                const i = data.list[index];
                const cardData = {
                    picchecked: i.logo || '',
                    username: i.name || '',
                    tel: i.phone || '',
                    wx: i.personalWx || '',
                    company_wx: i.companyWx || '',
                    email: i.email || '',
                    post: i.position || '',
                    company: i.companyName,
                    company_logo: i.companyLogo ,
                    cardId : i.cardId,
                    companyId:i.companyId ,
                    recordId:i.recordId,
                    shareSpeech: i.shareSpeech || '',
                };
                if( i.state === 3){
                    selfCard = cardData;
                }else if(i.state === 1){ //默认名片
                    if(defaultCard == null){
                        defaultCard = cardData;
                    }
                }
            }
            if(selfCard){
                // console.log('selfCard',selfCard);
                // this.CARDID = selfCard.cardId;
                // this.COMPANYID = selfCard.companyId
                // wx.setStorageSync("CARDID", selfCard.cardId) ;
                // wx.setStorageSync("COMPANYID", selfCard.companyId) ;
                wx.setStorageSync("SELFCARDID", selfCard.cardId);
                wx.setStorageSync("SELFCOMPANYID", selfCard.companyId);
            } else if(defaultCard){
                this.CARDID = defaultCard.cardId;
                this.COMPANYID = defaultCard.companyId;
                wx.setStorageSync("CARDID", defaultCard.cardId) ;
                wx.setStorageSync("COMPANYID", defaultCard.companyId) ;
            }

            if (this.CARDID) {
                this.inits();
            }
        }
        })
        .catch(err => {
          //console.log(33333333333333)
          if (err.code == 401) {
            this.islogin = false;
          }
        });
    },
    scrollviewRight() {
      this.scrollLeft += 280;
    },
    scrollChange(){
      if(this.isLogin){
        return
      }
      this.isLoginShow = true
    },
    scrollChangeA(){
      if(this.isLogin){
        return
      }
      this.isLoginShow = true
    },
    //获取手机号
    getPhoneNumber(e) {
      if (this.phone) return;

      if (!e.target.encryptedData) {
        return;
      }
      WXAJAX.POST(
        {
          phoneData: e.target.encryptedData,
          phoneIv: e.target.iv
        },
        "",
        "/home/getWxPhone"
      )
        .then(res => {
          wx.setStorageSync("phone", res);
          this.setPhone(res);
          this.phone = res;
          this.makePhone();
        })
        .catch(err => {
          ////console.log("获取手机号出错：", err);
        });
    },
    //查询订阅消息
    getSubscription() {
      //固定公司主体查询 解决订阅消息没有按小程序主体设计的bug
      WXAJAX.POST(
        { companyId: WXAJAX.smartMainId },
        "",
        "/subscription/getComanySub"
      ).then(data => {
        //存放到store
        this.setSubscriptionNew(data);
      });
    },
    //下拉刷新
    scrolltoupper(e) {
      //console.log(this.isLogin)
      // if(!this.isLogin){
      //   this.loginShow = true
      // }
      // wx.showLoading({
      // title: '获取最新数据中',
      // });
      // this.inits();
    },
    clickOne() {
      ////console.log("click");
    },
    clickRightRowEvent() {
      this.isShow = !this.isShow;
    },
    //隐藏登录引导
    cancelLoginGuide() {
      this.isShowLoginGuide = false;
    },
    //需要登录引导的回调
    loginGuide() {
      this.isShowLoginGuide = true;
    },
    //聊一聊
    talk() {
      authSubscribeMessage(this.subscriptionNew);
      if(this.currentCompany.userId && this.currentCompany.cardId){
        wx.navigateTo({
          url:
            "../IM/main?userId=" +
            this.currentCompany.userId +
            "&logo=" +
            this.currentCompany.logo +
            "&type=2&cardId=" +
            this.currentCompany.cardId +
            "&name=" +
            this.currentCompany.name +
            "&wxCode=" +
            (this.currentCompany.personalWx || "") +
            "&phone=" +
            this.currentCompany.phone
        });
      }

    },
    //头像登录成功的回调
    loginSuccess(url) {
      this.loginShow= false
      this.loginInterceptSuccess();
      this.findCardDetail(1);
      this.isLogin = HandleLogin.returnIsLogin() || false;
      if(this.hasCard){
        //查询自动打卡设置
        this.queryClockSetting()
      }
    },
    // 其他监听事件登录 成功回调
    loginInterceptSuccess() {
      this.isLogin = HandleLogin.returnIsLogin() || false;
      this.hasCard = wx.getStorageSync("hasCard") || false;
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
      let SELFCOMPANYID = wx.getStorageSync("SELFCOMPANYID") || '';
      if(!SELFCOMPANYID){
        this.getSelfCard()
      }
      ////console.log(this.avatarUrl)
    },
    getSelfCard(){
      WXAJAX.POST('','','/businessCard/getUserCard')
      .then(data=>{
        if(data.cardId && data.companyId){
          wx.setStorageSync("SELFCARDID", data.cardId);
          wx.setStorageSync("SELFCOMPANYID", data.companyId);
        }
      })
      .catch(err => {
        //console.log("名片错误：", err);
      });
    },
    loginFailed() {
      this.isShowLoginGuide = true;
    },
    toShowBill() {
      authSubscribeMessage(this.subscriptionNew);
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }

      wx.navigateTo({
        url: "/pages/showBill/main?cardId=" + this.CARDID
      });
    },
    showVideo(index) {
      authSubscribeMessage(this.subscriptionNew);
      this.playIndex = index;
    },
    inits(refresh) {
      this.findCardDetail(refresh);
    },
    findCardDetail(refresh) {
      let url = "/businessCard/cardDetails";
      // if(!this.CARDID || this.CARDID == 0){
      //   return console.log('this.CARDID',this.CARDID)
      // }
      //获取数据
      console.log('this.CARDID',this.CARDID)
      console.log('getStorageSync',wx.getStorageSync('CARDID'))
      wx.showLoading({
        mask:true
      });
      WXAJAX.POST(
        {
          cardId: this.CARDID || wx.getStorageSync('CARDID'),
          refresh: refresh
        },
        "",
        url
      )
        .then((data, code) => {
          wx.hideLoading();
          if (data) {
            if (data.soundRecording) {
              this.audioArr = {
                bl: false,
                time: data.soundTime || 0,
                id: 1,
                src: data.soundRecording
              };
            } else {
              this.audioArr = {
                bl: false,
                time: 0,
                id: 1,
                src: ""
              };
            }
            //切换更换头像
            this.dayBrowseNum = (data.dayBrowseNum + '')
            this.card_msg = {
              cardId: data.cardId,
              companyId: data.companyId,
              picchecked: data.logo || "",
              username: data.name || "",
              tel: data.phone || "",
              wx: data.personalWx || "",
              company_wx: data.companyWx || "",
              email: data.email || "",
              post: data.position || "",
              company: data.companyName,
              company_logo: data.companyLogo,
              browseNum: data.browseNum || 0,
              thumbsNum: data.thumbsNum,
              address: data.address || "",
              browsePhoto: data.browsePhoto ? data.browsePhoto.split(",") : [],
              cardTemplate: data.cardTemplate ? data.cardTemplate : 'DEFAULT',
              userId:data.userId
            };
            wx.setStorageSync("currentUserId", data.userId);
            wx.setStorageSync("CARDTEL", data.phone);
            wx.setStorageSync("personalWx", data.personalWx);
            wx.setStorageSync("userLogo", data.logo);

            //查询热销商品
            this.queryHotGoods(data.cardId);
            this.getHotDynamic()
            this.getWebsiteInfo()
            this.getSmallVideo()
            this.hint = data.hint || ''
            this.isBind = data.isBind || ''
            this.introduce = data.briefIntroduction || "";
            this.self_photos = data.photo ? data.photo.split(",") : [];
            //console.log(this.self_photos)
            this.card_msg.browsePhoto.splice(2,2)
            this.card_type = data.style;
            this.type = data.cardType;
            this.isThumbs = data.isThumbs;
            ////console.log()
            this.getSubscription();
            this.setCurrentCompany(data);
            if (this.currentCompany.userId === wx.getStorageSync("userId")) {
              this.isShowTalk = false;
            } else {
              this.isShowTalk = true;
              this.targetAvatarUrl = this.currentCompany.logo;
            }
            this.$nextTick(() => {
              this.getIntroHeight();
            });
          }
        }
        )
        .catch(err => {
          //this.card_msg = {};
          //console.log(err);
          wx.hideLoading();
        });
    },
    toCardCase() {
      authSubscribeMessage(this.subscriptionNew);
      //名片夹
      wx.redirectTo({ url: "../cardCase/main" });
    },
    getIntroHeight() {
      let v = this;
      wx.createSelectorQuery()
        .select(".introduce")
        .boundingClientRect(function(rect) {
          if (!rect) return;

          if (rect.height < 107) {
            v.moreShow = false;
          } else {
            v.moreShow = true;
          }
          v.introHeight = rect.height + "px";
        })
        .exec();
    },
    //音频播放
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
      that.$set(that.audioArr, "bl", true);
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
        that.$set(that.audioArr, "bl", false);
      });
    },
    // 音频停止
    audioStop(e) {
      var that = this,
        key = e.currentTarget.dataset.key,
        audioArr = that.audioArr;
      //切换显示状态
      audioArr.bl = false;

      myaudio.stop();
      myaudio.destroy();
      myaudio = wx.createInnerAudioContext();
      myaudio.obeyMuteSwitch = false;
    },
    createCode() {
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      WXAJAX.POST(
        {
          cardId: this.CARDID
        },
        "",
        "/businessCard/getWxTwoCode"
      )
        .then(data => {
          wx.navigateTo({ url: "/pages/cardCode/main?code=" + data });
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    page_turn(url) {
      authSubscribeMessage(this.subscriptionNew);
      //名片夹
      if (url === "cardCode") {
        wx.setStorageSync({
          wxCodeMsg: {
            name: this.card_msg.name,
            logo: this.card_msg.logo,
            company_logo: this.card_msg.company_logo,
            post: this.card_msg.post
          }
        });
        wx.navigateTo({
          url:
            "../" +
            url +
            "/main?companyId=" +
            this.COMPANYID +
            "&cardId=" +
            this.CARDID
        });
      } else {
        wx.navigateTo({ url: "../" + url + "/main" });
      }
      // wx.redirectTo({url:'../'+url+'/main'})
    },
    uploadpic(type) {
      //card2 选择公司图片
    },
    createCard() {
      authSubscribeMessage(this.subscriptionNew);
      // if(!HandleLogin.returnIsLogin()){
      //     this.loginGuide();
      //     return ;
      // }
      this.toCreatePage();
    },
    SaveToCustomer() {
      authSubscribeMessage(this.subscriptionNew);
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      //存为客户
      util.toMiniProgram(
        `/pages/clientAdd/main?type=userAdd&goType=1&cardId=${this
          .currentCompany.cardId || ""}&userId=${this.currentCompany.userId ||
          ""}`
      );
    },
    updateMyCard() {
      authSubscribeMessage(this.subscriptionNew);
      if (!HandleLogin.returnIsLogin()) {
        this.loginGuide();
        return;
      }
      let type = "edit";
      this.setEditStatus(type);
      wx.navigateTo({ url: "../editCard/main?type=edit" });
    },
    addToAddressBook() {
      //添加到通讯录
      authSubscribeMessage(this.subscriptionNew);
      wx.addPhoneContact({
        firstName: this.card_msg.username,
        mobilePhoneNumber: this.card_msg.tel,
        organization: this.card_msg.company,
        email:this.card_msg.email,
        success: function(res) {
          ////console.log("success", res);
        },
        fail: function(err) {
          ////console.log(err);
        }
      });
    },
    makePhone() {
      //拨打电话
      authSubscribeMessage(this.subscriptionNew);
      this.addCallsPhoneRecord(this.card_msg.cardId); // 好像没用，是underfind
      util.MakePhone(this.card_msg.tel || "");
    },
    addWx() {
      //添加微信
      authSubscribeMessage(this.subscriptionNew);
      let v = this;
      if (v.card_msg.wx) {
        wx.setClipboardData({
          data: v.card_msg.wx,
          success: function(res) {
            wx.getClipboardData({
              success: function(res) {
                v.isShowCourse = true;
                wx.showToast({
                  title: "复制成功"
                });
              }
            });
          }
        });
      } else {
        wx.showToast({
          title: "还没有添加微信呢！",
          duration: 2000,
          icon: "none"
        });
      }
    },
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
    doThumbs() {
      //点赞
      authSubscribeMessage(this.subscriptionNew);
      util.isLogin({
        isLogin: this.isLogin,
        success: res => {
          wx.showLoading();
          WXAJAX.POST(
            {
              cardId: this.CARDID
            },
            "",
            "/businessCard/doThumbs"
          ).then(data => {
            this.isThumbs = data;
            wx.hideLoading();
            //this.$set(this.card_msg, "thumbsNum", ++this.card_msg.thumbsNum);
            //出现负数 bug 因此只能增加点赞数量 不能取消
            if (!this.isThumbs) {
              if (this.card_msg.thumbsNum > 0) {
                this.$set(
                  this.card_msg,
                  "thumbsNum",
                  --this.card_msg.thumbsNum
                );
              } else {
                this.$set(this.card_msg, "thumbsNum", 0);
              }
            } else {
              this.$set(this.card_msg, "thumbsNum", ++this.card_msg.thumbsNum);
            }
          });
        }
      });
    },
    //导航地图
    goToMap(address) {
      let than = this;
      let author = ''
      wx.showLoading({
        title: "定位中...",
        mask: true
      });
      if (address == "" || !address) {
        wx.showToast({
          title: "请先添加公司地址",
          icon: "none"
        });
        return false;
      }
      WXAJAX.POST(
        {
          address: address
        },
        "",
        "/businessCard/getGps"
      ).then(data => {
        wx.hideLoading();
        let gps = JSON.parse(data).result.location
        //console.log(gps)
        let latitude = gps.lat
        let longitude = gps.lng
        wx.openLocation({
          latitude,
          longitude,
          name: address,
          scale: 18,
          success(data) {
            wx.hideLoading();
          },
          fail: function(res) {
            //进入授权页面重新开启定位授权
            wx.hideLoading();
            wx.getSetting({
              success(e){
                author = e.authSetting['scope.userLocation']
                if(author == false){
                  than.isShowAuthorize = true;
                  return false
                }
              }
              })
            },
          });
      })
      .catch(err=>{
        wx.hideLoading();
        uni.showToast({
          title:err,
          icon:'none'
        })
      })
    },
    //取消登录
    cancelLogin(){
      this.loginShow = false
    },
    showloginBox(){
      this.loginShow = true
    },
    collected_tap(v){
      let data = !v

    },
    async queryHotGoods(){
      if(this.card_msg && this.card_msg.cardId != 0 && this.card_msg.cardId){
        //关闭热销商品查询
        let data = await WXAJAX.POST(
          {cardId : this.card_msg.cardId,isPutOn:true},//isPutOn上架商品
          "",
          "/businessCard/getCardHotGoods"
        );
        if (data ) {
          this.companyGoodsResponses = data;
          //处理金额 保留2位小数
        //.toFixed(2)
          this.companyGoodsResponses.forEach( item =>{
            var price = item.price / 100 ;
            item.price = price.toFixed(2);
          })
        }else {
          this.companyGoodsResponses = [];
        }
      }
    },
    selectGoods(goods){
      if(goods.goodsId){
        wx.navigateTo({ url: "../prodDetail/main?goodId=" +  goods.goodsId });
      }
    },
    //isAuto： Boolean true 是自动打卡 false 不是自动打卡

    sginRecord(type){
      //return console.log(this.currentCompany)
      let isLogin = uni.getStorageSync('isLogin')
      if(!isLogin){
        return
      }
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      let data = {
        companyId:uni.getStorageSync('SELFCOMPANYID') || '',
        isAuto:type
      }
      WXAJAX.POST(data,'','/poster/addClockRecord')
      .then((res)=>{

        uni.hideLoading()
        if(res.clockRecords){

          if(res.amState == '下午'){
           res.time = this.getDateConversion(res.clockRecords[0].amEnd)
           res.time = util.getdateA(res.time,'hour'),
           res.greetings = '晚安。'
          }else{
           res.time = this.getDateConversion(res.clockRecords[0].amStart)
           res.time = util.getdateA(res.time,'hour')
           res.greetings = '早安。'
          }
          this.clockRecord = res
          if(this.clockRecord.clockRecords[0].isAuto == true && this.clockRecord.isFirstClock == false){
            this.signInSucceed = true
          }else if(!type){
            this.signInSucceed = true
          }
        }else if( res == 'beforeTheTime'){
          if(!type){
            this.showSetClock = true
          }
        }
      })
      .catch((err)=>{
        //console.log(err)
      })
    },
    // 关闭打卡组件
    close_canvas_tap(){
      this.signInSucceed = false
    },
    //选择文案
    toChooseText(timeTyep){
      uni.navigateTo({url:`../sginIn/choose/main?timeTyep=${timeTyep}`})
    },
    //选择海报
    toGalleryPhotos(type){
      uni.navigateTo({url:`../galleryPhotos/index/main?type=${type}`})
    },
    //查询我的自动打开设置
    //ruguo shi dizhi
    queryClockSetting() {
      //获取数据
      //
      let isLogin = uni.getStorageSync('isLogin')
      if(!isLogin){
        return
      }
      wx.showLoading({
        mask:true
      });
      WXAJAX.POST({
        userId:uni.getStorageSync('userIds')
      },"","/poster/queryClockSetting")
        .then((data, code) => {
          //console.log(data)
          if(data.isAuto){
            this.sginRecord(true)
          }
          wx.hideLoading();
          }
        )
        .catch(err => {
          //this.card_msg = {};
          //console.log(err);
          wx.hideLoading();
        });
    },
    //未到打卡时间
    clock_set_tap(type){
      //console.log(type)
      if(type == 'cancel'){
        this.showSetClock = false
      }else{
        this.showSetClock = false
        uni.navigateTo({
          url:'../sginIn/automaticSignIn/main'
        })
      }
    },
    //解决ios时间格式兼容问题
    getDateConversion(data) {
      let phoneSystem = "";
      wx.getSystemInfo({
        success: function(res) {
          phoneSystem = res.system;
        }
      });
      if (phoneSystem.indexOf("iOS") != -1) {
        data = data.replace(/-/g, "/");
      }
      return Date.parse(data);
    },
    //分销跳转
    inviteJump(param){
      let url = '../distributionCenter/applyFor/main'
      //定义用户邀请其他用户的唯一key
      // card=名片id c=公司id i=邀请人id
      let inviteArr = {}
      inviteArr.companyId = param.c
      inviteArr.cardId = param.card
      inviteArr.userId = param.i
      wx.setStorageSync('COMPANYID', param.c);
      wx.setStorageSync('CARDID', param.card);
      wx.setStorageSync('inviteArr',inviteArr)
      if (HandleLogin.returnIsLogin()) {
        //wx.navigateTo({ url: url + `?companyId=${param.c}&cardId=${param.card}&userId=${param.i}` });
        wx.navigateTo({ url: url });
      } else {
        wx.setStorageSync('redirectPage', url);
      }
    },
    //设置录音
    setAudioArr(type){
      this.$set(this.audioArr, "bl", type);
    },
    //更多视频
    toMedia(){
      uni.switchTab({
        url: '/pages/media/index'
      });
    },
    toProducts(){
      uni.switchTab({
        url: '/pages/Products/main'
      });
    },
    toDynamic(){
      uni.switchTab({
        url: '/pages/Dynamic/main'
      });
    },
    //获取热文
    async getHotDynamic(){
      let companyId = uni.getStorageSync('COMPANYID')
        let data = await WXAJAX.POST(
          {companyId : companyId},//isPutOn上架商品
          "",
          "/businessCard/getHotDynamic"
        );
        if (data ) {
          this.hotDynamic = data;
          this.hotDynamic.forEach(v=>{
            let arr = v.photos.split(',')
            v.photos = arr[0]
            v.createTime = util.getFormatTime(v.createTime)
          })
          console.log(this.hotDynamic,'this.hotDynamic')
        }else {
          this.companyGoodsResponses = '';
        }
    },
    async getWebsiteInfo(){
      let data = {
        companyId:  wx.getStorageSync("COMPANYID") || '',
        cardId: wx.getStorageSync("CARDID") || ''
      }
      let result = await WXAJAX.POST(
          data,
          "",
          "/personal/getWebsiteInfo/V2"
        )
      console.log('result',result)
      this.companyinfo = result

    },
    getSmallVideo() {
      console.log('this.card_msg.companyId',this.card_msg.companyId)
      let data = {
        // this.companyId ||
        pageNum:1,
        companyId: this.card_msg.companyId
      }

      WXAJAX.POST(data, "", "/shortVideo/queryPage").then(data => {
        if (data.list) {
          this.videoLeg = data.list.length
          console.log('data.list', this.videoLeg )
        }else{
          this.videoLeg = ''
          console.log('data.list', this.videoLeg )
        }
      });
    }
  },
  created() {}
};
</script>
<style scoped>
.more-info {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  height: 262upx;
  width: 30upx;
  background: white;
  /* box-shadow: 0px 0px 20upx 0px rgba(56, 56, 56, 0.1); */
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-info .left-img {
  width: 10upx;
  height: 20upx;
}

.operation-box {
  margin-left: 130upx;
  margin-right: 20upx;
}

.business_card {
  position: absolute;
  box-sizing: border-box;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  padding-top: 0;
  width: 132upx;
}

.business_card p {
  writing-mode: tb-rl;
}

.index {
  position: relative;
}

.user-btn-group > * {
  margin: 0;
}

.card_menu {
  position: relative;
}

.scroll-list {
  width: 567upx;
  white-space: nowrap;
  padding: 20upx 40upx 20upx 20upx;
}

.scroll-list > div {
  white-space: nowrap;
  box-sizing: border-box;
}

.self_introduce {
  min-height: 214upx;
  transition: 0.1s;
  overflow: hidden;
}

.self_introduce.higher {
  height: auto;
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

scroll-view {
  background: #fff;
}

.edit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-case {
  position: fixed;
  right: 0;
  top: 40upx;
  z-index: 999;
}

/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 0px;
  height: 0px;
  background-color: transparent;
}

/*定义滚动条轨道 内阴影+圆角*/
/* ::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 20upx transparent;
  border-radius: 20upx;
  background-color: transparent;
} */

/*定义滑块 内阴影+圆角*/
/* ::-webkit-scrollbar-thumb {
  border-radius: 20upx;
  -webkit-box-shadow: inset 0 0 20upx transparent;
  background-color: transparent;
} */

video {
  width: 100%;
  height: 388upx;
  border-radius: 10upx 10upx 0 0;
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
  border-radius: 10upx 10upx 0 0;
}

.notFirstVideo video {
  height: 188upx;
}

.notFirstVideo div {
  line-height: 48upx;
}
.create-card {
  align-items: stretch;
}
.browsing-history{
  width: 36upx;
}

.newNub{
  position: relative;
}
.newl-added{
  position: absolute;
  color:#51CDCB;
  top: -10upx;
  right: -85upx;
}
.seen_peo{
  position: relative;
}
.seen_peo_dot{
  display: block;
  position: absolute;
  top: -12upx;
  left: 40upx;
  background-color: #FD634E;
  width: 17upx;
  height: 17upx;
  z-index:106;
  border-radius: 50%;
}
</style>
<style scoped>
.forward{
  padding:0 185upx 0 185upx;
}
.first-login-img{
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
</style>
