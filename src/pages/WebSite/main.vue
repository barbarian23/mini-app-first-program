<template>
  <div class="bgfff" :style="{height: mainHeight || '20' +'px'}">

    <NavBarByUser @cancelLoginGuide="cancelLoginGuide"
                  :isLogin="isLogin"
                  :isShowLoginGuide="isShowLoginGuide"
                  :isShowCardCase="true"
                  @loginSuccess="loginSuccess"
                  @loginFailed="loginFailed"
                  :avatarUrl.sync="avatarUrl" />
    <div class="disflex pl20 pr20 pt15 pb15 bgfff jsbet align-cen">
      <div class="disflex posre flex-column align-cen"
      v-for="(item,index) in tab_top_list"
      @click="tabbar_tag(index,item.scrollId)"
      :key="index">
        <img class="w24 h24 mb7" :src="currentIndex == index ? item.selectIcon : item.icon">
        <p class="fs12 c38" :class="currentIndex == index ? 'cblue' : ''">{{item.name}}</p>
        <img :src="rectangleIcon" class="w10 h10 tab-top-img" v-if="currentIndex == index">
      </div>
    </div>
    <scroll-view :style="{height: scrollContentHeight+'px'}"
                 class="dynamic-content bgfff"
                 :scroll-y="true"
                 :scroll-into-view="select_tab_id"
                 :scroll-top="scrollTop"
                 :enable-back-to-top="true"
                 :scroll-anchoring="true"
                 :scroll-with-animation="true"
                 @scroll="scroll"
                 @scrolltoupper='scrolltoupper'>
      <SelfSwiper v-if="company.photos && company.photos.length"
                  :imgUrls="company.photos"
                  :self_class="'h211'"
                  :swiper_item_class="'website-swiper'"
                  @swiperChange="swiperChange"></SelfSwiper>

      <!--公司介绍-->
      <div class="pl15 pr15"
           id="tab1"
           v-if="company.companyIntroduce">
        <subhead title="公司介绍" dec="COMPANY"></subhead>

        <div class="bgfff   pt20 pb15  fs16 bradius5">
          <div v-html="company.companyIntroduce"></div>
        </div>

      </div>

      <!--产品介绍-->
      <div class="pl15 pr15"
           id="tab2"
           v-if="company.goodsIntroduce">
        <subhead title="产品介绍" dec="PRODUCT"></subhead>

        <div class="shadow_gray overhidden fs16 bradius10">
          <div v-html="company.goodsIntroduce"></div>
        </div>

      </div>

      <!--公司视频-->
      <div class="pl15 pr15"
           id="tab3"
           v-if="company.companyVideoModelList">
        <subhead title="企业视频" dec="VIDEOS"></subhead>
        <div class="disflex wrap  mb40 jsbet">
          <!--<div class="bgfff h211 shadow_gray">{{}}</div>-->
          <div class="top-video">
              <video
                   :id="'myVideo'+ topVideo.videoId"
                   class="disblock first-video"
                   v-if="playIndex === topVideo.videoId"
                   :title="topVideo.describes"
                   :src="topVideo.url"
                   objectFit="cover"
                   enable-danmu
                   danmu-btn
                   controls
                   :autoplay="true"></video>
            <div class="w100p h194 posre"
            @click="showVideo(topVideo.videoId)"
            v-else>
            <img mode="aspectFill"
                  :src="topVideo.cover || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190604/1559619324240.png'"
                  alt=""
                  class="w100p h194">
            <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190604/1559619365051.png"
                  alt=""
                  class="w50 h50 posab top0 left0 right0 bottom0 mauto">
            </div>
            <div class="fs14 pl15 c38 fbold">{{topVideo.describes}}</div>
          </div>
          <div class="w100p disflex jsbet wrap">
            <div v-for="(videoItem, index) in company.companyVideoModelList"
                :key="index"
                class="bgfff overhidden firstVideo w168 mb10">
              <video :id="'myVideo'+ videoItem.videoId"
                    class="disblock"
                    v-if="playIndex === videoItem.videoId"
                    :title="videoItem.describes"
                    :src="videoItem.url"
                    objectFit="cover"
                    enable-danmu
                    danmu-btn
                    controls
                    :autoplay="true"></video>
              <div class="w100p h99 posre"
                  @click="showVideo(videoItem.videoId)"
                  v-else>
                <img mode="aspectFill"
                    :src="videoItem.cover || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190604/1559619324240.png'"
                    alt=""
                    class="w100p h99">
                <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-www/photo/20190604/1559619365051.png"
                    alt=""
                    class="w50 h50 posab top0 left0 right0 bottom0 mauto">
              </div>
              <div class="fs14 pl15 c38 fbold">{{videoItem.describes}}</div>
            </div>
          </div>
        </div>
        <!--src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"-->
        <!--:src="company.videoUrl"-->

      </div>

      <!--企业招聘-->
      <div class="pl15 pr15"
           id="tab4"
           v-if="invites.length">
        <subhead title="企业招聘" dec="INVITES"></subhead>
        <div class="bgfff pt15 pl16 pr15 pb15 mb10 bradius5 bbf5f6"
             @click="page_turn('joinUsDetail' , v.recruitId)"
             v-for="(v,k) in invites"
             :key="k">
          <p class="disflex jsbet fs14">
            <span class="c38 fbold">{{v.position}}</span>
            <span class="cblue fbold">{{v.salary}}</span>
          </p>

          <div class="disflex jsbet fs12 ca8 pt13">
            <div>
              {{v.recruitAddress}} | {{experienceArray[v.experience-1].title}} | {{educatArray[v.education-1].title}}
            </div>
          </div>
        </div>

      </div>

      <!--关于我们-->
      <div
           class="pl15 pr15 mt40"
           id="tab5">
        <subhead title="关于我们" dec="ABOUT"></subhead>
        <div class="bgfff pt15 pl16 pr15 pb19 mb10 bbf5f6"
             v-if="company.phone">
          <p class="fs12 ca8 ">{{ lang.text_0 }}</p>

          <div class="disflex jsbet pt15"
               @click="makePhone">
            <div class="fs14 c38 fbold">{{company.phone}}</div>

            <div class="pl16 left_line disflex column-reverse">
              <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/tel_blue.png"
                   alt=""
                   class="w16 h16">
            </div>

          </div>
        </div>

        <div class="bgfff pt15 pl16 pr15 pb19 bbf5f6"
             v-if="company.address"
             @click="openAddr(company.address)
            ">
          <p class="fs12 ca8">{{ lang.text_1 }}</p>

          <div class="disflex jsbet pt15">
            <div class="fs14 c38 fbold">{{company.address}}</div>
            <div class="pl16 left_line disflex column-reverse">
              <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/addr_2.png"
                   alt=""
                   class="w16 h16">
            </div>
          </div>
        </div>

        <!--联系我们-->
        <div
             class="bgfff bradius5 pt25 pb25 pl25 bf5f6 pr25 mt20"
             >
          <p class="under_line textc fs16 c38 fbold pb27">{{ lang.text_2 }}</p>

          <!-- <input type="text"
                 class="w100p bgf5f6 bradius5 lh39 h39 borderbox  pl10 fs14 ca8 phe8 mb10"
                 placeholder="请填写您的姓名"
                 v-model="form.name">
          <input type="text"
                 class="w100p bgf5f6 bradius5 lh39 h39 borderbox  pl10 fs14 ca8 phe8 mb10"
                 placeholder="请填写您的联系电话"
                 v-model="form.tel">
          <input type="text"
                 class="w100p bgf5f6 bradius5 lh39 h39 borderbox  pl10 fs14 ca8 phe8 mb15"
                 placeholder="请填写您的需求"
                 v-model="form.text"> -->
            <div class="fs14 c38 lh22 mb mb15">{{ lang.text_3 }}</div>

          <div class="w100p bg_line_blue cfff textc fs18 lh44 bradius5"
               @click="toForms_tap">{{ lang.text_4 }}</div>
        </div>

      </div>

      <!--bottom-->
      <div class="textc pb15 fs12 ca8 pt15">{{ lang.text_5 }}</div>
    </scroll-view>
    <FloatButtons class="float-buttons"
                  :isShowTalk="isShowTalk"
                  :avatarUrl="targetAvatarUrl"
                  :isLogin="isLogin"
                  :isBayWindow="isBayWindow"
                  @talk="talk"
                  @loginGuide="loginGuide"></FloatButtons>
    <div v-if="isShowAuthorize">
      <AuthorizeBox @close="isShowAuthorize = false"></AuthorizeBox>
    </div>
        <fromTipsBox :dialog_title="'提示'"
                     @btn_tap="fromBtn_tap"
                     :dialog_ph="tipsTitle"
                     :tipsdec="tipsdec"
                     v-if="showFromTipsBox"
        ></fromTipsBox>
  </div>
</template>

<script>
import SelfSwiper from "@/components/swiper"; //
import WXAJAX from "../../utils/request";
import amapFile from "../../libs/amap-wx.js";
import util from "../../utils/index";
import { authSubscribeMessage } from "../../utils/auth.js";
import { mapState, mapGetters } from "vuex";
import FloatButtons from "@/components/FloatButtons.vue";
import NavBarByUser from "@/components/NavBarByUser.vue";
import HandleLogin from "@/utils/handleLogin";
import AuthorizeBox from "@/components/AuthorizeBox";
import subhead from "@/components/subhead"
import fromTipsBox from "@/components/fromTipsBox"
import LangUtils from '../../utils/LangUtils';

export default {
  name: "",
  components: { SelfSwiper, NavBarByUser, FloatButtons, AuthorizeBox,subhead,fromTipsBox },
  data() {
    return {
      lang: LangUtils.getLangSrc().WebSite,
      img:
        "https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/food.jpg",
      images: [{ url: this.img }, { url: this.img }],
      playIndex: "",
      imgUrls: [
        {
          img: this.img,
          url:
            "/_pages/common/webview/main?url=https://wechat.benmu-health.com/mobile/app/common/material/render/17"
        },
        {
          img: this.img,
          url: "/pages/checkup/filterPackage/index?category=PARENTS_CHECKUP"
        }
      ],
      COMPANYID: 0,
      myAmapFun: "",
      Mc: "",
      // form: {
      //   name: "",
      //   tel: "",
      //   text: ""
      // },
      company: {
        accuracy: "", //经度
        dimension: "" //维度
      },
      tab_top_lists:[{
        name:'企业介绍',
        icon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_company.png',
        selectIcon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_company_selected.png',
        id:1,
        scrollId:'tab1'
      },{
        name:'产品介绍',
        icon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_product.png',
        selectIcon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_product_selected.png',
        id:2,
        scrollId:'tab2'
      },{
        name:'企业视频',
        icon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_video.png',
        selectIcon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_video_selected.png',
        id:3,
        scrollId:'tab3'
      },{
        name:'企业招聘',
        icon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ ic_ web_invite.png',
        selectIcon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ ic_ web_invite_selected.png',
        id:4,
        scrollId:'tab4'
      },{
        name:'关于我们',
        icon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_about.png',
        selectIcon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_web_about_selected.png',
        id:5,
        scrollId:'tab5'
      }],
      tab_top_list:[],
      select_tab_id:'',
      invites: [],
      locat: {
        lat: 30.5702,
        lng: 104.06476
      },
      rectangleIcon:WXAJAX.imgBackUrl+'yimai_photos/crmRevision/ic_rectangle.png',
      /*学历*/
      educatArray: [
        { title: "全部", id: 1 },
        { title: "初中及以下", id: 2 },
        { title: "中专/中技", id: 3 },
        { title: "高中", id: 4 },
        { title: "大专", id: 5 },
        { title: "本科", id: 6 },
        { title: "硕士", id: 7 },
        { title: "博士", id: 8 }
      ],
      /*经验*/
      experienceArray: [
        { title: "应届生", id: 1 },
        { title: "1年以内", id: 2 },
        { title: "1-3年", id: 3 },
        { title: "3-5年", id: 4 },
        { title: "5-10年", id: 5 },
        { title: "10年以上", id: 6 },
        { title: "全部", id: 7 }
      ],
      videoContext: null,
      currentIndex:0,
      avatarUrl: "", //用户的头像地址,
      isLogin: HandleLogin.returnIsLogin() || false, //是否已经登录
      isBayWindow:false,//飘窗显隐
      isShowTalk: true, //是否显示右边侧边栏的聊一聊
      isShowLoginGuide: true, //是否显示登录引导页,
      targetAvatarUrl: "", //当前目标的人物头像,
      scrollContentHeight: 0, //中间滚动区域的高度
      mainHeight: 0, //整体高度
      isLoading: false,
      isShowAuthorize: false, //控制进入授权界面的开关
      scrollTop: 0,
      topVideo:'',
      old: {
        scrollTop: 0
      },
      showFromTipsBox:false,
      tipsTitle:'此企业尚未发布“反馈表单”',
      tipsdec:'您可以点击聊天窗口或拨打电话联系负责人哦'
    };
  },
  /** tab点击 */
  onTabItemTap(item) {
    authSubscribeMessage(this.subscriptionNew);
  },
  onLoad(){
  },
  onShow() {
    this.currentIndex = 0
    //每次进入自动回滚到顶部
    this.scrollTop = this.old.scrollTop
    this.$nextTick(function() {
      this.scrollTop = 0
    });
    if(!this.isLogin){
      wx.setStorageSync('showLogin',true)
      wx.switchTab({
        url:'/pages/index/main'
      })
    }
    wx.setNavigationBarTitle({
      title: "官网"
    });
    this.playIndex = "";
    let lastCompanyid = this.COMPANYID;
    this.Mc = wx.createMapContext("map");
    this.myAmapFun = new amapFile.AMapWX({
      key: "e11026819b6d300fda6a2c680fbd2fef"
    });
    //获取当前的公司
    this.COMPANYID = wx.getStorageSync("COMPANYID") || 1;
    //获取官网信息
    if (lastCompanyid != this.COMPANYID || !this.COMPANYID) {
      this.inits();
      // this.getInvite();
    }
    this.isLogin = HandleLogin.returnIsLogin() || false;
    this.isBayWindow = wx.getStorageSync("showBayWindow")
    this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    //获取官网招聘信息
    //this.getInvite();
    wx.showShareMenu({
      withShareTicket : true,
      menus:['shareAppMessage','shareTimeline']
    })
  },
  async mounted() {
    this.countHeight();
  },
  async onPullDownRefresh() {
    console.log(111)
    await this.inits();
    //获取官网招聘信息
    await this.getInvite();
    wx.stopPullDownRefresh();

  },
  methods: {
    scroll(e) {
      this.old.scrollTop = e.detail.scrollTop
    },
    async countHeight(){
      let a = await util.systemIfo();
      let navHeight = getApp().globalData.navHeight;
      this.mainHeight = a.windowHeight;
      this.scrollContentHeight = a.windowHeight - navHeight - 77 ;

    },
    //下拉刷新
    async scrolltoupper(e) {
      //获取官网招聘信息
      await this.getInvite();
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
    },
    //头像登录成功的回调
    loginSuccess(url) {
      this.isLogin = true;
      this.hasCard = wx.getStorageSync("hasCard") || false;
      this.avatarUrl = wx.getStorageSync("avatarUrl") || "";
    },
    loginFailed() {
      this.isShowLoginGuide = true;
    },
    cancelLoading() {
      setTimeout(() => {
        this.isLoading = false;
      }, 2000);
    },
    async inits() {
      //获取官网信息
      this.invites = [];
      if (this.isLoading) return;
      this.isLoading = true;
      return new Promise((resolve, reject) => {
        let v = this;
        // wx.showLoading();
        WXAJAX.POST(
          {
            companyId: v.COMPANYID,
            cardId: wx.getStorageSync("CARDID")
          },
          "",
          "/personal/getWebsiteInfo/V2"
        )
          .then(data => {
            this.tab_top_list = []
            if (data) {
              if (data.photos) {
                data.photos = data.photos.split(",");
              } else {
                data.photos = [];
              }
              v.company = data;
              if(v.company.companyVideoModelList){
                v.topVideo = v.company.companyVideoModelList.shift()
              }
              if (data.recruitModelList) {
                data.recruitModelList.forEach(function(i, k) {
                  i.salary =
                    i.minSalary / 100000 + "k - " + i.maxSalary / 100000 + "k";
                });
              }
              v.invites = data.recruitModelList ? data.recruitModelList : [];
            }

              for(var i in v.tab_top_lists){
                if(v.company.companyIntroduce && v.tab_top_lists[i].id == 1){
                  v.tab_top_list.push(v.tab_top_lists[i])
                }
                if(v.company.goodsIntroduce && v.tab_top_lists[i].id == 2){
                  v.tab_top_list.push(v.tab_top_lists[i])
                }
                if(v.company.companyVideoModelList && v.tab_top_lists[i].id == 3){
                  v.tab_top_list.push(v.tab_top_lists[i])
                }
                if(v.company.recruitModelList && v.tab_top_lists[i].id == 4){
                  v.tab_top_list.push(v.tab_top_lists[i])
                }
                if(v.company.address && v.tab_top_lists[i].id == 5){
                  v.tab_top_list.push(v.tab_top_lists[i])
                }
              }
              setTimeout(function(){
                // v.getDomHeight(v.tab_top_list)
              },400)
              wx.hideLoading();
              this.cancelLoading();

          })
          .catch(err => {
            console.log(err);
            this.cancelLoading();
            wx.hideLoading();
          })
          .catch(() => {
            this.cancelLoading();
            resolve();
          });
      });
    },
    async getInvite() {
      if (this.isLoading) return;
      return new Promise((resolve, reject) => {
        let v = this;
        wx.showLoading();
        WXAJAX.POST(
          {
            companyId: v.COMPANYID
          },
          "",
          "/personal/getCompanyRecruit"
        )
          .then(data => {
            data.forEach(function(i, k) {
              i.salary =
                i.minSalary / 100000 + "k - " + i.maxSalary / 100000 + "k";
            });
            v.invites = data;
            wx.hideLoading();
          })
          .catch(err => {
            wx.hideLoading();
          })
          .catch(() => {
            resolve();
          });
      });
    },
    showVideo(index) {
      this.playIndex = index;
    },
    //轮播图的切换事件
    swiperChange(current) {
      // console.log(current)
    },
    page_turn(url, recruitId) {
      wx.navigateTo({ url: "../" + url + "/main?recruitId=" + recruitId });
    },
    openAddr(address) {
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
        console.log(gps)
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
    async toForms_tap() {
      this.getFrom()

    },
    makePhone() {
      //拨打电话
      util.MakePhone(String(this.company.phone));
    },
    tabbar_tag(idx,id){
      this.currentIndex = idx
      this.select_tab_id = id
    },
    getFrom(){
      wx.showLoading() ;
      let data = {
        commitUserId:wx.getStorageSync('userId') || '',
        companyId:wx.getStorageSync('COMPANYID') || ''
      }
      WXAJAX.POST(
        data,'','/advancedForm/queryUserForm'
      )
      .then(data => {
        wx.hideLoading();
        if(data){
          if(data.detailRequests.length <= 0 || false){

            this.showFromTipsBox = true
          }else{
            uni.navigateTo({
              url:'../questionnaire/main'
            })
          }
          //this.datas = data.detailRequests

        }else{
          this.showFromTipsBox = true
        }
      })
      .catch((err) => {
          wx.hideLoading();
          //console.log(err)
          wx.showToast({
            title:err,
            icon:'none'
          })
        })
    },
    fromBtn_tap(){
      this.showFromTipsBox = false
      return false
    }
  },
  computed: {
    ...mapState({
      currentCompany: state => state.currentCompany
    }),
    ...mapGetters(["subscriptionNew"])
  },
  watch: {
    currentCompany: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal) {
          if (newVal.userId === wx.getStorageSync("userId")) {
            this.isShowTalk = false;
          } else {
            this.isShowTalk = true;
            this.targetAvatarUrl = newVal.logo;
          }
        }
      }
    }
  }
};
</script>

<style>
.left_line {
  position: relative;
  padding-left: 36upx;
}

.left_line::before {
  content: "";
  position: absolute;
  left: 0;
  width: 1upx;
  height: 26upx;
  background: #a8a8a8;
  bottom: 4upx;
}

.under_line {
  position: relative;
}

.under_line::before {
  content: "";
  position: absolute;
  bottom: 30upx;
  width: 50upx;
  height: 4upx;
  background: #51cdcb;
  left: 0;
  right: 0;
  margin: auto;
}

video {
  width: 100%;
  height: 188upx;
  border-radius: 10upx 10upx 0 0;
}
.firstVideo {
  border-radius: 20upx;
  box-shadow:0px 0px 19px 0px rgba(55,55,55,0.08);
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
.website-swiper{
  box-sizing: border-box;
  padding: 30upx;
}
.website-swiper image{
  border-radius: 20upx;
}
</style>
<style scoped>
.tab-top-img{
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  bottom: -20upx;
}
.top-video {
  width: 100%;
  border-radius: 20upx;
  margin-bottom: 20upx;
  box-shadow:0px 0px 19px 0px rgba(55,55,55,0.08);
  overflow: hidden;
}
.top-video div {
  line-height: 84upx;
}
.first-video{
  height: 388upx;
}
</style>
