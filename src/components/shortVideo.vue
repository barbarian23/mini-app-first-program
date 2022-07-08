<template>
  <div class="short-video">
    <swiper class="short-video-list"
            :style="{'height':videoHight}"
            :current="videoIndex"
            @animationfinish="handleSlider"
            @change="videoChange"
            :indicator-dots="false"
            :vertical="true">
      <swiper-item class="h100p video-list"
                   v-for="(item,index) in vlist"
                   :key="index">
        <!-- <image class="stop" :class=" isActive ? 'active' : '' " :src="stopImg" mode=""></image> -->
        <ul class="operation">
          <li class="follow-box"
              @click="follow_tag(item)">
            <div class="headPortrait">
              <image :src="item.logo"
                     v-if="item.logo"></image>
              <image :src="logoImg"
                     v-else></image>

            </div>
            <span class="follow"
                  v-if="item.attention == false ">{{ lang.text_0 }}</span>
            <span class="follow"
                  v-else>{{ lang.text_1 }}</span>
          </li>
          <li @click="likes_tag(item)">
            <image class="w25 h25 mb5"
                   :src="likedImg"
                   v-if="item.like"></image>
            <image class="w25 h25 mb5"
                   :src="noLikeImg"
                   v-else></image>
            <span class="fs12">{{item.likesNum}}</span>
          </li>
          <li @click="forward_tag(item)">
            <div class="forward" >
              <image class="w25 h25 mb5"
                     :src="transpondImg"></image>
              <span class="forwardNum fs12">{{item.forwardNum}}</span>
            </div>
          </li>
          <li class="haveChat"
              @click="talk_tag(item.cardId)">
            <image class=" w25 h25 mb5"
                   :src="talkImg"></image>
            <span class="fs12">{{ lang.text_2 }}</span>
          </li>
          <button class="forwarda"
                  @click="GetUserProfile"
                  v-if="isLogin == false && canUseGetUserProfile">
          </button>
          <button v-else-if="isLogin == false"
                  open-type="getUserInfo"
                  class="forwarda"
                  @getuserinfo="GetUserInfo">
            立即登录
          </button>
        </ul>
        <div class="information">
          <div>
            <div class="disflex align-cen h30 bradius20 bggray_5 pl15 float-left pr15 mb15" v-if="item.suggestions" @click="chooseImg_tap(item.videoGoods)">
              <img :src="goodsIcon" class="w20 h20 mr8 ">
              <p>{{item.suggestions}}</p>
            </div>
          </div>

          <div class="title">@{{item.userName || ''}}<span class="fs14 title-time ml10"
                  v-if="item.uploadTime">{{item.uploadTime  || ''}}</span></div>
          <div class="introduce">{{item.title  || ''}}</div>
          <div class="position">
            <image :src="locationImg"
                   class="w12 h12"></image>
            <p class="position-word">{{item.address  || ''}}</p>
          </div>
        </div>
        <block v-if="item.url !== '' && index == videoIndex">
          <video :src="item.url"
                 :id="'myVideo' + index"
                 :controls="true"
                 :enable-play-gesture="true"
                 :loop="true"
                 :autoplay="index == videoIndex"
                 :show-fullscreen-btn="false"
                 @error="videoErrorCallback"
                 @loadedmetadata="loadedmetadata"
                 @waiting="videoWaiting"
                 @pause="pauseCallback"
                 objectFit="contain">
          </video>
        </block>
      </swiper-item>

    </swiper>
    <!-- 分享弹窗 @play="playVideo(item)" -->
    <cover-view class="w100p h100p prod_choose_class borderbox disflex column-reverse"
                :class="{show : isShowShare} "
                @click.stop="isShowShare = false">
      <cover-view class="bgfff inner textc pt20">
        <cover-view class="fs18 c38 fbold textc mb20">{{ lang.text_3 }}</cover-view>
        <cover-view class="share-box">
          <button style="margin-right: 60upx;margin-left: 0;background: #fff;"
                  class="flex-c-c flex-column"
                  open-type="share">
            <cover-image class="share-img mauto"
                         src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/weixin_share.png"></cover-image>
            <cover-view class="fs12 ca2">{{ lang.text_4 }}</cover-view>
          </button>
          <cover-view style="margin-left: 60upx;"
                      class="disflex align-cen flex-column"
                      @click="save">
            <cover-image class="share-img mb8"
                         src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/weixin_share2.png"></cover-image>
            <cover-view class="fs12 ca2">{{ lang.text_5 }}</cover-view>
          </cover-view>
        </cover-view>
      </cover-view>
    </cover-view>
    <div class="position_center" v-if="isShowPoster">
      <div class="flex-c-c flex-column "  style="width:464rpx;" v-if="posterImg">
        <div class="disflex flex-end w100p mb20">
          <img :src="closeIcon" class="w40 h40" @click="isShowPoster = false">
        </div>
        <img :src="posterImg" class="bradius3" style="height:826rpx;width:464rpx; ">
        <div class="bg_line_blue bradius5 fs18 fbold cfff textc lh44 mt30 "
             @click="savePoster"
             style="width:464rpx;height:88rpx;">{{ lang.text_6 }}</div>
      </div>

    </div>
  </div>
</template>

<script>
import WXAJAX from "../utils/request";
import tools from "../utils/index";
import HandleLogin from "@/utils/handleLogin";
import HandleWebsocket from "@/utils/websocket";
import { mapMutations } from "vuex";
import LangUtils from '../utils/LangUtils';

export default {
  props: {
    refresh: {
      type: Boolean,
      default: false
    },
    companyId: {
      type: Number,
      default: wx.getStorageSync("COMPANYID")
    },
    forwardId: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().components.shortVideo,
      url:"",//ios播放兼容
      statusBarHeight: "",
      videoHight: "",
      navHeight: "",
      stopImg: WXAJAX.imgBackUrl + "/one-product/video-icon/icon_play%402x.png",
      //未点赞
      noLikeImg:
        WXAJAX.imgBackUrl + "/one-product/video-icon/icon_like%402x.png",
      //已点赞
      likedImg:
        WXAJAX.imgBackUrl +
        "/one-product/video-icon/icon_like_selected%402x.png",
      //聊一聊
      talkImg: WXAJAX.imgBackUrl + "/one-product/video-icon/icon_talk%402x.png",
      //转发
      transpondImg:
        WXAJAX.imgBackUrl + "/one-product/video-icon/icon_transpond%402x.png",
      //定位
      locationImg:
        WXAJAX.imgBackUrl + "/one-product/video-icon/icon_location_w%402x.png",
      //默认头像
      logoImg: WXAJAX.imgBackUrl + "/one-product/video-icon/logo.png",
      goodsIcon: WXAJAX.imgBackUrl + "/yimai_photos/videoGoods/icon_goods.png",
      closeIcon: WXAJAX.imgBackUrl + "/yimai_photos/videoGoods/ic_close@2x.png",
      isActive: false,
      videoContext: [],
      isPlay: false,
      clickCount: 0,
      videoIndex: 0,
      islikes: false,
      vlist: [],
      //currentCompany:wx.getStorageSync('CURRENT_COMPANY') || {},
      isLogin: wx.getStorageSync("isLogin"),
      currentCompany: "",
      videoContextList: [],
      //为true时是点赞 为false时是取消
      videoLeg: "",
      page: 1,
      cardId: wx.getStorageSync("CARDID") || {},
      //判断page是否需要加1
      ispage: true,
      videoId: [],
      wVideo: "",
      //防止swiper抖动
      current2: "",
      userId: wx.getStorageSync("userId") || {},
      videoC: 0,
      isShowShare:false ,//分享显隐
      isShowPoster:false ,//海报显隐
      posterImg:'',
      timer:{},
      canUseGetUserProfile: wx.getUserProfile ? true : false
    };
  },
  watch: {
    vlist(newVal, old) {
      ////console.log()
      for (var i in newVal) {
        if (newVal[i].videoId !== this.wVideo.videoId) {
          //var list = list.push(newVal[i])
        }
      }
      // newVal = newVal.unshift(this.wVideo)
      //console.log(newVal)
    },

  },


  mounted() {
    let isLogin = wx.getStorageSync("isLogin");
    if (isLogin == true) {
      this.calculateNavBarHeight();
      this.getTextMessage();
      this.getSmallVideo(1, this.companyId);
    } else {
      wx.showToast({
        title: "该功能需用户登录后才能使用",
        icon: "none"
      });
    }

    //console.log(this.watchingVideo)
  },
  methods: {

    loadedmetadata(res) {
      //console.log('加载视频1', res)
    },
    videoErrorCallback: function(e) {
      //console.log(e)
      uni.showModal({
        content: e.target.errMsg,
        showCancel: false
      })
    },
    videoWaiting(res){
      //console.log('加载视频2', res)
    },
    pauseCallback(res){
     // console.log(res)
    },
    //视频赋值
    setPage() {
      this.page = 1;
      this.v;
      this.vlist = [];
      //this.videoIndex = 0
     // console.log(this.videoIndex);
      //console.log(this.page);
    },
    getViedo(forwardId) {
     // console.log(this.wVideo);

    },
    // setVideo: 保存当前观看的视频
    // setGoodslist: 给推荐商品数据赋值
    ...mapMutations(["setVideo",'setGoodslist']),
    calculateNavBarHeight() {
      let menuButtonBounding = wx.getMenuButtonBoundingClientRect();
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          //console.log(statusBarHeight)
          let navHeight =
            statusBarHeight +
            (menuButtonBounding.top - statusBarHeight) * 2 +
            menuButtonBounding.height; //导航高度
          this.statusBarHeight = statusBarHeight;
          this.navHeight = navHeight - statusBarHeight;
          //console.log(this.navHeight)
        },
        fail(err) {
          //console.log(err);
        }
      });
    },
    videoChange(event) {
      this.videoC = event.detail.current;
    },
    init() {
      //console.log(this.vlist.length)
      for (var i = 0; i < this.vlist.length; i++) {
        const video = uni.createVideoContext("myVideo" + i,this);
        this.videoContextList.push(video);
      }
    },
    getSmallVideo(page, companyId) {
      var than = this;
      let data = {
        // this.companyId ||
        userId: this.userId,
        pageNum: page || 1,
        companyId: companyId || 67
      };
      WXAJAX.POST(data, "", "/shortVideo/queryPage").then(data => {
        if (data.list) {
          data.list.forEach(item => {
            item.uploadTime = than.getDateConversion(item.uploadTime);
            item.uploadTime = tools.getFormatTime(item.uploadTime);
          });

          if (this.page == 1) {
            this.vlist = data.list;
            if(!this.videoId ){
              this.videoId = this.vlist[0].videoId;
            }
            this.setVideo(this.videoId);
          } else {
            this.vlist = this.vlist.concat(data.list);
          }
          //console.log(this.vlist);
          this.videoLeg = this.vlist.length;
          if(this.forwardId){
            this.getShortVideoQuery(this.forwardId)
          }
          this.playVideo(this.vlist[0])
        } else {
          this.ispage = false;
          debugger
          this.$emit('showState');
        }
        this.init();
      });
    },
    async getCurrentCompany(id) {
      WXAJAX.POST(
        {
          cardId: id
        },
        "",
        "/businessCard/cardDetails"
      ).then(data => {
        if (data) {
          this.currentCompany = data;
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
      });
    },
    getShortVideoQuery(id) {
      this.videoId = id
      WXAJAX.POST(
        {
          companyId: uni.getStorageSync('COMPANYID') || '',
          videoId: id
        },
        "",
        "/shortVideo/queryById"
      ).then(data => {
        data.uploadTime = this.getDateConversion(data.uploadTime);
        data.uploadTime = tools.getFormatTime(data.uploadTime);
        this.vlist.forEach((i,k)=>{
          if(i.videoId == data.videoId){
            this.vlist.splice(k,1)
          }
        })

        this.vlist.unshift(data)
      });
    },
    //获取swiper高度
    getTextMessage() {
      var than = this;
      uni.getSystemInfo({
        success(res) {
          than.videoHight =
            res.windowHeight - than.statusBarHeight - than.navHeight + 5 + "px";
          //console.log(res.windowHeight)
        }
      });
    },
    updateBrowsingData(data, item, type) {
      console.log('data',data)
      clearInterval(this.timer);
      this.timer = null;
      console.log("清理上一次的定时器:",this.timer);
      var than = this;
      WXAJAX.POST(data, "", "/shortVideo/updateData").then(() => {
        if (type == "likes") {
          //console.log(item)
          if (item.like == true) {
            //console.log(item)
            item.likesNum += 1;
            wx.showToast({
              title: "点赞成功！",
              duration: 1000,
              mask: true
            });
          } else {
            wx.showToast({
              title: "取消点赞",
              duration: 1000,
              icon: "none",
              mask: true
            });
            item.likesNum -= 1;
          }
        } else if (type == "forward") {
          item.forwardNum++;
        }

        const that = this;
        if(data && data.videoId){
          this.timer = setInterval(function(){
            that.recordPlayTime(data);
          },1000)
        }

      });
    },
    recordPlayTime(data){
      console.log('data',data)
      WXAJAX.POST(data, "", "/shortVideo/recordPlayTime").then((res) => {
        console.log('res:',res)
      });
    },
    stop_tag() {
      this.isActive = !this.isActive;
    },
    //swiper切换事件
    handleSlider(e) {
      if (e.target.source == "autoplay" || e.target.source == "touch") {
        this.current2 = e.detail.current;
      }
      if (this.videoIndex >= 0 && this.videoIndex !== this.current2) {
        this.videoContextList[this.videoIndex].pause();
        this.videoContextList[this.videoIndex].seek(0);
        this.videoContextList[this.videoIndex].pause();
        this.videoContextList[this.videoIndex].stop();
      }
      //console.log(this.videoContextList)
      let curIndex = this.current2;
      if (curIndex === this.videoIndex + 1) {
        //console.log('向下滑动')
        this.videoContextList[this.videoIndex + 1].play();
      } else if (curIndex === this.videoIndex - 1) {
        //console.log('向上滑动')
        this.videoContextList[this.videoIndex - 1].play();
      }

      this.videoIndex = curIndex;
      //console.log(this.videoLeg)
      var vlength = this.videoLeg,
        idx = this.videoIndex;
      if (vlength == idx + 1) {
        if (this.ispage == true && vlength > 1) {
          this.page++;
          this.getSmallVideo(this.page, this.companyId);
        }
      }
      this.videoId = this.vlist[this.videoIndex].videoId;
      this.playVideo(this.vlist[this.videoIndex])
      this.setVideo(this.videoId);
    },
    // 播放
    play(index) {
      this.videoContextList[index].play();
    },
    // 暂停
    pause(index) {
      this.videoContextList[index].pause();
    },
    //关注
    follow_tag(item) {
      let attentionNum = "";
      //(item.attention);
      if (item.attention == false) {
        attentionNum = 1;
      } else if (item.attention == true) {
        attentionNum = 0;
      }
      wx.showLoading({
        mask: true
      });
      WXAJAX.POST(
        {
          attention: attentionNum,
          userId: wx.getStorageSync("userId"),
          videoId: item.videoId
        },
        "",
        "/shortVideo/addAttentionUser"
      ).then(data => {
        wx.hideLoading();
        if (item.attention == false) {
          for (var i in this.vlist) {
            if (this.vlist[i].userId == item.userId) {
              this.vlist[i].attention = true;
            }
          }
          wx.showToast({
            title: "关注成功",
            duration: 1000,
            mask: true
          });
        } else {
          for (var i in this.vlist) {
            if (this.vlist[i].userId == item.userId) {
              this.vlist[i].attention = false;
            }
          }
          wx.showToast({
            title: "取消关注",
            icon: "none",
            duration: 1000,
            mask: true
          });
        }
      });
    },
    //点赞
    likes_tag(item) {
      let likes = "";
      //(item.like);
      if (item.like == false) {
        likes = true;
      } else if (item.like == true) {
        likes = false;
      }
      wx.showLoading({
        mask: true
      });
      WXAJAX.POST(
        {
          like: likes,
          userId: wx.getStorageSync("userId"),
          videoId: item.videoId
        },
        "",
        "/shortVideo/addAttentionUser"
      ).then(data => {
        wx.hideLoading();
        if (item.like == false) {
          item.like = true;
          item.likesNum += 1;
          wx.showToast({
            title: "点赞成功",
            duration: 1000,
            mask: true
          });
        } else {
          item.like = false;
          item.likesNum -= 1;
          wx.showToast({
            title: "取消点赞",
            icon: "none",
            duration: 1000,
            mask: true
          });
        }
      });
    },
    //转发
    forward_tag(item) {
      this.isShowShare = true
      this.posterImg  = ''
      let data = {
        forwardNum: 1,
        state: item.state,
        videoId: item.videoId
      };
      var type = "forward";
      this.updateBrowsingData(data, item, type);
    },
    //聊一聊
    talk_tag(cardId) {
      if (cardId == 0 || "") {
        wx.showToast({
          title: "该用户暂无聊天权限",
          icon: "none"
        });
        return false;
      }
      this.getCurrentCompany(cardId);
    },

    //增加播放次数
    playVideo(item) {
      //console.log(item)
      if(item && item.state && item.videoId){
        let data = {
          playVolume: 1,
          state: item.state,
          videoId: item.videoId,
          cardId:uni.getStorageSync('CARDID') || ''
        };
        this.updateBrowsingData(data, '');
      }else{
        //("palyvideo_error:",item)
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
    /**
     * 获取用户信息 低版本
     * @param e
     * @constructor
     */
    GetUserInfo(e) {
      debugger
      console.log(this.canUseGetUserProfile)
      const msg = e.target;
      if (!msg.rawData || !msg.signature || !msg.encryptedData || !msg.iv) {
        HandleLogin.showToast();
        return;
      }
      HandleLogin.login(data => {
        HandleLogin.setLoginMessageInStorage(data, false);
        // 进入首页，则需要连接websocket
        HandleWebsocket.connectWebsocket();

        this.$emit("loginSuccess");
      });
    },

    /**
     * 获取用户信息 新版本
     * @param e
     * @constructor
     */
    GetUserProfile(e) {
      let _v = this;
      console.log(this.canUseGetUserProfile)
      wx.getUserProfile({
          desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
          success: (res) => {
            HandleLogin.login(
              data => {
                HandleLogin.setLoginMessageInStorage(data, false);
                // 进入首页，则需要连接websocket
                HandleWebsocket.connectWebsocket();
                this.$emit("loginSuccess");
              },
              () => {
                this.loginFailed();
              },res
            );
          }
        })

    },
    //点击推荐商品
    chooseImg_tap(item){
      this.setGoodslist(item)
      //console.log(this.$store.state.videoGoods)
      this.$emit('primary')
    },
    save(){
      uni.showLoading({
        title:'加载中',
        mask:true
      })
      this.isShowPoster = true
      WXAJAX.POST(
        {
          companyId: this.vlist[this.videoIndex].companyId || '',
          address:this.vlist[this.videoIndex].address || '',
          title:this.vlist[this.videoIndex].title || '',
          url:this.vlist[this.videoIndex].url || '',
          userId:this.vlist[this.videoIndex].userId || '',
          videoId: this.vlist[this.videoIndex].videoId || ''
        },
        "",
        "/shortVideo/videoPoster"
      ).then(data => {
        if(data){
          uni.hideLoading()
          this.posterImg = WXAJAX.imgBackUrl + data
        }
      });
    },
    savePoster(){
      let than = this
      wx.getImageInfo({
        src: than.posterImg,
        success(data) {
          uni.hideLoading()

          uni.saveImageToPhotosAlbum({
            filePath: data.path,
            success: function() {
              uni.showToast({
                title:'保存成功'
              })
              than.isShowPoster = false
            },
            fail(err){

            }
          });
        },
        fail(err) {
          console.log(err);
        }
      })
    }
  },
  onReachBottom: function() {
    //console.log(111)
    if (timer != null) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {}, 1000);
  }
};
</script>

<style scoped>
.shortVideo {
  height: 100%;
  display: flex;
  box-sizing: border-box;
}
.short-video-list {
  box-sizing: border-box;
  position: relative;
}
.stop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 160upx;
  height: 160upx;
}
.information {
  display: flex;
  flex-direction: column;
}
.video-list {
  position: relative;
}
.video-list video {
  width: 100%;
  height: 100%;
}
.operation {
  position: absolute;
  right: 15upx;
  bottom: 70upx;
  display: flex;
  flex-direction: column;
  width: 98upx;
  height: 550upx;
  justify-content: space-between;
  z-index: 99;
}
.operation li {
  width: 98upx;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 123upx;
}
.haveChat {
  position: relative;
}
.forwarda {
  width: 100%;
  height: 100%;
  position: absolute;
  bottom: 0;
  z-index: 100;
  background: rgba(56, 56, 56, 0);
}
.follow-box {
  height: 98upx;
  width: 98upx;
  position: relative;
}
.follow {
  position: absolute;
  z-index: 99;
  display: block;
  height: 30upx;
  width: 80upx;
  background: #51cdcb;
  bottom: 0;
  margin-left: 7upx;
  text-align: center;
  border-radius: 15upx;
  left: 5upx;
  font-size: 20upx;
  color: #ffffff;
}
.headPortrait {
  width: 101upx;
  height: 101upx;
  border-radius: 50%;
  border: 8upx solid #ffffff;
}
.headPortrait image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.information {
  position: absolute;
  left: 30upx;
  z-index: 99;
  bottom: 100upx;
}
.title {
  margin-bottom: 30upx;
  color: #ffffff;
  font-size: 32upx;
  font-weight: 600;
}
.introduce {
  width: 458upx;
  height: 80upx;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 32upx;
  color: #ffffff;
  margin-bottom: 20upx;
}
.position {
  height: 40upx;
  background: rgba(118, 118, 118, 0.15);
  box-shadow: 0px 1px 4px 0px rgba(56, 56, 56, 0.3);
  border-radius: 20upx;
  display: flex;
  color: #ffffff;
  align-items: center;
  padding: 8upx 20upx;
  float: left;
}
.position-word {
  display: block;
  max-width: 450upx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.position image {
  margin-right: 9upx;
}
.active {
  z-index: 99;
}
.forward {
  background: rgba(255, 255, 255, 0);
  height: 103upx !important;
  position: relative;
  color: #ffffff;

}
.forwardNum {
  position: absolute;
  bottom: 0;
  left: 22upx;
}
.title-time{

  color: #FFFFFF;
  opacity: 0.7;
  text-shadow: 0upx 1upx 4upx rgba(56, 56, 56, 0.3);
}
.share-img {
  width: 100upx;
  height: 100upx;
}
.prod_choose_class {
  position: fixed;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  bottom: -100%;
  /* transition: all 0.2s linear; */
}
.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.show {
  bottom: 0;
  z-index: 1000;
}
.share-box {
  display: flex;
  padding-left: 50rpx;
  padding-right: 50rpx;
  justify-content: space-around;
  margin-top: 20upx;
  margin-bottom: 30upx;
}
</style>
