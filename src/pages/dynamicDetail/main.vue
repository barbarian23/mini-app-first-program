<template>
  <div class="pb50 posre h100p">
    <p class="pt15 fbold fs18 c38 pl15 pr27 bgfff ">{{title}}</p>
    <div class="px15 dec">
      <div class="left-dec">
        <span>
          {{companyName}}
        </span>
        <span style="margin-left: 20upx;">
          {{time}}
        </span>
      </div>
      <span class="right-dec"
            @click="collect">{{isCollect ? lang.text_9 : '收藏'}}</span>
    </div>

    <div class="bgfff pt20 pb10" >
      <img :src="v"
           alt=""
           v-for="(v,k) in photos"
           mode="widthFix"
           :key="k"
           class="w100p">
      <div class="content">
        <rich-text :nodes='details'></rich-text>
      </div>
    </div>
    <div class="bottom pb50 borderbox bgfff flex1">
      <div class="disflex bbf5f6 c78">
        <div class="w50p h44 disflex posre jscen align-cen fs14"
             :class="currentTab == 1 ? 'active': ''"
             @click="tab_tap(1)">
          <span class="mr10 fs14">{{ lang.text_0 }}</span>
          {{dynamic.commentModelList.length || 0}}
          <span class="line"></span>
        </div>
        <div class="w50p h44 disflex posre jscen align-cen fs14"
             :class="currentTab == 2 ? 'active': ''"
             @click="tab_tap(2)">
          <span class="mr10 fs14">{{ lang.text_1 }}</span>
          {{dynamic.thumbsModelsList.length || 0}}
          <span class="line"></span>
        </div>
      </div>
      <div class="content">
        <div  v-if="currentTab == 1">
          <div class="disflex flex-column">
            <div class="h70 disflex bbf5f6 jscen align-cen">
              <span class="comment_btn" @click.stop="addComment('','','add')">
                立即评论
              </span>
            </div>
            <p class="textc ca8 fs12" v-if="!dynamic.commentModelList">{{ lang.text_2 }}</p>
              <div class="comment-list bbf5f6 pt20 pb20 bgfff disflex"
                   v-for="(v,k) in dynamic.commentModelList"
                   :key="k">
                   <img class="w50 h50 bradius5 mr10" mode="aspectFill" :src="v.logo || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'">
                   <div class="comment w100p pt5 borderbox" @click.stop="addComment(k,v)">
                      <div class="disflex jsbet mb10 align-cen">
                        <p class="cdeepblue fs14">{{v.userName}}</p>
                        <p class="ca8 fs12">{{v.createTime}}</p>
                      </div>
                      <div class="fs14 lh27 fs16">
                        <span v-if="v.replyName">{{ lang.text_3 }}</span>
                        <span class="cdeepblue" v-if="v.replyName">{{v.replyName}}:</span>
                        <span>{{v.text}}</span>
                      </div>
                   </div>
              </div>
          </div>
        </div>
        <div v-else>
          <div
              class="disflex pl15 pt10 bbf5f6  pb10 borderbox bgfff"
              v-for="(item,index) in dynamic.thumbsModelsList"
              :key="index">
            <img class="w50 h50 bradius5 mr10" mode="aspectFill" :src="item.logo || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'">
            <div class="disflex jscen align-cen">{{item.userName}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns disflex bgfff">
      <div class="disflex w155">
        <div class="disflex fs12 ca7 align-cen jscen flex-column w33p" @click="zan">
          <img :src="dynamic.isThumbs ? like_selectIcon  : likeIcon" class="w20 h20">
          {{dynamic.isThumbs ? '已点赞' : '点赞'}}
        </div>
        <div  class="disflex fs12 ca7 align-cen jscen flex-column w33p" @click="call_tap">
          <img :src="callIcon" class="w20 h20">
          通话
        </div>
        <div class='bgfff ca7 fs12 lh1 cdeepblue p0 w33p disflex flex-column jscen align-cen' @click="showShare">
          <img class="w20 h20 mb2" :src="shareIcon">
          <span class="ca7 lh1">{{ lang.text_4 }}</span>
        </div>
      </div>
      <div class="disflex jscen fs18 cfff align-cen flex1 consulting"  @click="talk">
        <img :src="ommentIcon" class="w24 h24 mr7">
        立即咨询
        <LoginIntercept @loginSuccess="loginInterceptSuccess" />
      </div>
      <!--评论输入框-->
    <div class="fix_bottomB  disflex borderbox align-cen pl15 h49 bgfff edit_input trans2"
         :class="input_show ? '' : 'hide'" @click.stop="">
      <!--:class="input_show ? '' : 'hide' "-->
      <div class="bgfff  disflex w100p jsbet pr11 borderbox align-cen">
        <input fixed="true"
               class=" borderbox h40 lh40 pr11 bgf5f6 bradius5 flex1 mr11 comment_input c38 fs18 pl15"
               :focus="comment_focus"
               :placeholder="
            replayComment.commentId
              ? '回复 ' + replayComment.userName + '：'
              : '评论'
          "
               cursor-spacing="4"
               @focus="inputgetFocus(this, $event)"
               @confirm="inputConfirm"
               :style="{ height: text_height + 'px' }"
               v-model="comments" />
        <!--        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/smile.png" alt="" class="w25 h25" @click="smile_tap">-->
        <span class="bgblue cfff w50 textc lh30 fs16 bradius5 disblock ml10"
              @click.stop="inputConfirm">{{ lang.text_5 }}</span>
        </div>
      </div>
    </div>



    <!-- <div v-if="isShowMore"
         style="position: relative;left: 0;right: 0;">
      <image mode="widthFix"
             class="w100p"
             style="max-height: 80vh;"
             src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/detail_img.png" />
      <div class="more-btn">
        <button @click="goPage">
          点击查看更多
        </button>
      </div>
    </div> -->
    <!-- 分享弹窗 -->
    <cover-view class="w100p h100p prod_choose_class borderbox disflex column-reverse"
                :class="{show : isShowShare} "
                @click.stop="isShowShare = false">
      <cover-view class="bgfff inner textc lh44">
        <cover-view class="share-box">
          <button style="margin-right: 136.5upx;margin-left: 0;background: #fff;"
                  open-type="share">
            <cover-image class="share-img"
                         src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/weixin_share.png"></cover-image>
            <cover-view class="share-title">{{ lang.text_6 }}</cover-view>
          </button>
          <cover-view style="margin-left: 136.5upx;"
                      @click="onShareEvent">
            <cover-image class="share-img mb8"
                         src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crm/weixin_share2.png"></cover-image>
            <cover-view class="share-title">{{ lang.text_7 }}</cover-view>
            <LoginIntercept @loginSuccess="loginInterceptSuccess" />
          </cover-view>
        </cover-view>
        <cover-view class="share-ornament"></cover-view>
        <cover-view class="fs16 c38 lh44"
                    @click.stop="isShowShare = false">
          取消
        </cover-view>
      </cover-view>
    </cover-view>
    <!--全屏预览-->
    <div class="mask disflex align-cen jscen"
         v-if="isPreviewImg">
      <div class="disinblock ">
        <div class="disflex flex-end ">
          <img @click="isPreviewImg = false"
               src="/static/close.png"
               style="height: 48rpx; width: 48rpx" />
        </div>
        <img class="img-size bradius5"
             :src="maskImg" />
        <span @click="saveImg"
              class="bg_line_blue cfff textc fs18 fbold bradius5 lh44 mb15"
              style="width: 465rpx;display: block;margin: 0 auto">{{ lang.text_8 }}</span>
      </div>
    </div>
    <!-- <BottomButtonSmall :text="'去分享'"
                       @btn_tap="showShare" /> -->
    <LoginIntercept @loginSuccess="loginInterceptSuccess" />
  </div>
</template>

<script>
import WXAJAX from '@/utils/request';
import BottomButtonSmall from '@/components/bottom_button_small';
import LoginIntercept from "@/components/LoginIntercept";

import util from '@/utils/index';
import { mapGetters, mapState } from 'vuex';
import { addShareRecord } from '@/utils/behavior';
import HandleLogin from '@/utils/handleLogin';
import {authSubscribeComment,authSubscribeMessage} from '../../utils/auth.js';
import LangUtils from '../../utils/LangUtils';

const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
const isUrl = path => reg.test(path);

export default {
  components: { BottomButtonSmall, LoginIntercept },
  computed: {
    ...mapGetters(["currentCompany"]),
    ...mapState({
      isLogin: state => {
        return state.isLoginStatus;
      }
    })
  },
  watch: {
    isLogin: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.isShowMore = false;
        }
      }
    }
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().dynamicDetail,
      webViewSrc: '',
      dynamicId: 98,

      addTypeShow: false,
      addTypes: [
        { name: "删除", id: "delete" },
        { name: "取消", id: "cancel" }
      ],

      title: '',
      companyName: '',
      time: '',
      details: '',
      photos: [],

      isShowShare: false,
      isCollect: false,
      isPreviewImg: false,
      maskImg: '',
      openStatus: false,
      isShowMore: true, //是否展示点击查看更多的页面
      cardId: '',
      dynamic:[],
      currentTab:1,
      messageImg: WXAJAX.imgBackUrl + "yimai_photos/crmRevision/icon_message.png",
      input_show: false,
      replayComment: {}, // 回复信息对象
      add_comments_index:0,
      comments:'',
      likeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_news_like.png',
      like_selectIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_news_like_select.png',
      shareIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_news_share.png',
      callIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_details_call.png',
      ommentIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/icon_message.png',
      isLike:false,
    }
  },
  // onShareAppMessage() {
  //   return {
  //     title: this.title,
  //     path:  `pages/dynamicDetail/main?dynamicId=${this.dynamicId}`,
  //     success: () => {
  //       uni.showToast({
  //         title: '分享成功',
  //         icon: 'none'
  //       })
  //     }
  //   }
  // },
  onShareAppMessage(e) {
    const { companyId, cardId } = this.currentCompany;
    this.addDynamicForwardRecord(cardId, this.dynamicId);
    // let shareId = await addShareRecord(companyId, 4, this.dynamicId);

    let uuid = cardId + '' + new Date().getTime();
    addShareRecord(companyId, 4, this.dynamicId, uuid).then(res => {
      console.log('添加一条记录', this.dynamicId, 'uuid', uuid, this.photos[0],
        this.title);
    }, err => { });
    let path = '/pages/dynamicDetail/main?dynamicId=' + this.dynamicId + '&companyId=' + companyId + '&cardId=' + cardId + '&goType=1&shareId=' + uuid;
    // let path = '/pages/dynamicDetail/main?companyId=' + companyId + '&cardId=' + cardId + '&goType=1&shareId=' + uuid;
    console.log(path)
    return {
      imageUrl: this.photos[0],
      title: this.title,
      path,
      success(e) {
        wx.showShareMenu({
          withShareTicket: true
        })
      },
      fail(e) {
        console.log('失败-- ', e);
      }
    }
  },
  async onLoad(options) {
    this.dynamicId = this.$root.$mp.query.dynamicId
    this.COMPANYID = this.$root.$mp.query.companyId || wx.getStorageSync('COMPANYID') || ''
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = `/${currentPage.route}`;
    wx.setStorageSync('pages',url)
    let cardId = options.cardId;
    this.cardId = options.cardId;
    await this.getInits(cardId)
    //判断是否已经收藏
    await this.checkCollect();
  },
  onPageScroll: function (e) {
    this.input_show = false;
  },
  methods: {
    //登录成功
    async loginInterceptSuccess() {
      if (this.webViewSrc) {
        this.isShowMore = true;
      } else {
        this.goPage();
      }
    },
    showShare() {
      this.isShowShare = true;
    },
    collect() {
      wx.showLoading();
      let _url = '',
        _request = {};
      if (this.isCollect) {//取消收藏
        _url = '/personal/delCollection';

      } else {//添加收藏
        _url = '/personal/addCollection';
      }
      _request = {
        itemType: 2,
        itemId: this.dynamicId,
      };

      WXAJAX.changeCollect(_request, _url).then((data) => {

        if (data) {
          this.isCollect = !this.isCollect;
        }
        wx.hideLoading();

      }).catch((err) => {
        wx.hideLoading();
      });

    },
    async getInits(cardId) {
      let v = this;
      wx.showLoading();
      try {
        let data = await WXAJAX.POST({
          companyId: v.COMPANYID,
          dynamicId: v.dynamicId,
          cardId: wx.getStorageSync('CARDID') || cardId,
        }, '', '/personal/getDynamicInfoDetail');
        wx.hideLoading();
        console.log(data)
        if (data) {
          data = data;
          if (isUrl(data.details)) {
            this.webViewSrc = data.details
          } else {
            this.details = this.formatRichText(data.details )
          }
          this.time = util.getdate(data.createTime, 'dateTime')
          v.dynamic = data
          // v.dynamic.photos = v.dynamic.photos ? v.dynamic.photos.split(",") : [];
          v.dynamic.createTime = util.getdate(v.dynamic.createTime, "dateTime");
          v.dynamic.createTime = v.getDateConversion(v.dynamic.createTime)
          v.dynamic.createTime = util.getFormatTime(v.dynamic.createTime,true)
          if(v.dynamic.commentModelList){
            let list = v.dynamic.commentModelList
            list.forEach((item,k) => {
              item.createTime = util.getdate(item.createTime, "dateTime")
              item.createTime = v.getDateConversion(item.createTime)
              v.dynamic.commentModelList[k].createTime = util.getFormatTime(item.createTime, true)
            });
          }else{
            v.dynamic.commentModelList = []
          }

          this.title = data.title || ''
          this.companyName = data.companyName


          this.photos = data.photos.split(',')
        }

      } catch (error) {
        console.log('err---------or', error);
      }
    },
    async toLogin(i) {
      if (i > 3) return;
      try {
        await HandleLogin.postLoginPromiseByTourists();
      } catch (error) {
        await this.toLogin(++i);
      }
    },
    // 保存图片
    saveImg() {
      let path = this.maskImg;
      wx.getImageInfo({
        src: path,
        success: sres => {
          //console.log(sres.path);
          wx.saveImageToPhotosAlbum({
            filePath: sres.path,
            success: res => {
              wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#ffffff",
                animation: {
                  duration: 1
                }
              });
              this.isPreviewImg = false;
              wx.showToast({
                title: "保存成功",
                duration: 1000,
                icon: "success",
                mask: true
              });
            },
            fail: res => {
              wx.setNavigationBarColor({
                frontColor: "#000000",
                backgroundColor: "#ffffff",
                animation: {
                  duration: 1
                }
              });
              this.isPreviewImg = false;
              wx.showToast({
                title: "保存失败",
                duration: 1000,
                icon: "none",
                mask: true
              });
            }
          });
        }
      })

    },
    tab_tap(type){
      if(type == 1){
        this.currentTab = 1
      }else{
        this.currentTab = 2
      }
    },
    talk() {
      let isLogin = HandleLogin.returnIsLogin();
      if(!isLogin){
        return
      }
      let selfCardId = uni.getStorageSync('SELFCARDID') || ''
      if(selfCardId == this.dynamic.cardId){
        return uni.showToast({
          title:'这篇文章是您发布的哦~',
          icon:'none'
        })
      }
      authSubscribeMessage(this.subscriptionNew);

      //跳转到当前选择名片的员工
      if(wx.getStorageSync('currentUserId') && wx.getStorageSync("CARDTEL") && wx.getStorageSync("CARDID") ){
        wx.navigateTo({
          url: "../IM/main?userId=" + wx.getStorageSync('currentUserId') +
            "&logo=" + wx.getStorageSync('userLogo') +
            "&type=2&cardId=" + wx.getStorageSync("CARDID") +
            "&name=" + this.dynamic.companyName +
            "&wxCode=" + (wx.getStorageSync("personalWx") || "") +
            "&phone=" + wx.getStorageSync("CARDTEL") ||  ''
        });
      }else{
        wx.navigateTo({
          url: "../IM/main?userId=" + this.dynamic.userId +
            "&logo=" + this.dynamic.companyLogo +
            "&type=2&cardId=" + this.dynamic.cardId +
            "&name=" + this.dynamic.companyName +
            "&wxCode=" +(this.dynamic.personalWx || "") +
            "&phone=" + this.dynamic.phone || this.dynamic.recruitPhone || this.dynamic.companyPhone ||  ''
        });
      }
    },
    call_tap(){
      if(this.dynamic.companyPhone || this.dynamic.recruitPhone || wx.getStorageSync("CARDTEL")){
        wx.makePhoneCall({
            phoneNumber: wx.getStorageSync("CARDTEL")  || this.dynamic.companyPhone || this.dynamic.recruitPhone
        });
      }else{
        wx.showToast({
          title:'暂无号码',
          icon:'none'
        })
      }
    },
    addComment(index1, replayComment,type) {
      authSubscribeMessage(this.subscriptionNew);
      //添加评论
      let isLogin = HandleLogin.returnIsLogin();
      if (!isLogin) {
        uni.showToast({
          title: "请先登录,才可以评论喔",
          icon: "none"
        });
        return;
      }
      if(type == 'add'){
        this.replayComment = ''
        this.input_show = true;
        let v = this;
      }else{
        if (
          (replayComment.userName && !replayComment.commentId) ||
          (replayComment.commentId &&
            replayComment.userId == wx.getStorageSync("userId"))
        ) {
          return;
        }else{
          this.replayComment = replayComment;
          this.add_comments_index = index1;
        }
      }


      this.input_show = true;
      let v = this;
      // setTimeout(function () {
      //   v.$set(v.dynamic[index1], "operate_show", false);
      //   v.comment_focus = true;
      // }, 200);
    },
    inputgetFocus(that, e) {
      let v = this;
    },
    inputConfirm() {
      //输入完成
      this.emoji_show = false;
      this.comment_focus = false;
      authSubscribeMessage(this.subscriptionNew);
      WXAJAX.POST(
        {
          dynamicId: this.dynamic.dynamicId,
          parentId: this.replayComment.commentId || 0,
          cardId: this.currentCompany.cardId || this.CARDID || 0,
          text: this.comments
        },
        "",
        "/personal/doComment"
      ).then(res => {
        var date = new Date()
        date = util.getdate(date, "dateTime")
        date = this.getDateConversion(date)
        date = util.getFormatTime(date, true)
        this.dynamic.commentModelList.push({
          text: this.comments,
          replyName: this.replayComment.userName || "",
          logo: wx.getStorageSync("avatarUrl"),
          createTime: date,
          userName: wx.getStorageSync("USERNAME")
        });
        this.input_show = false;
        this.comments = "";
      });
    },
    previewImage(urls) {
        wx.previewImage({urls: [urls + '.primary.png']})
      },
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
    zan() {
      //点赞
      let isLogin = HandleLogin.returnIsLogin();
      if (!isLogin) {
        uni.showToast({
          title: "请先登录,才可以点赞喔",
          icon: "none"
        });
        return;
      }

      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          dynamicId: v.dynamic.dynamicId,
          cardId: wx.getStorageSync("CARDID")
        },
        "",
        "/personal/doDynamicThumbs"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            v.dynamic.isThumbs  =  !v.dynamic.isThumbs
            v.isLike = true
            v.getInits(v.cardId)
          }else{
            v.dynamic.isThumbs = 0
            v.isLike = false
            v.getInits(v.cardId)
          }

        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
        });
    },
    //处理富文本样式问题
    formatRichText(html){
      let newContent= html.replace(/<img[^>]*>/gi,function(match,capture){
          match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
          match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
          match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
          return match;
      });
      newContent = newContent.replace(/style="[^"]+"/gi,function(match,capture){
          match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
          return match;
      });
      newContent = newContent.replace(/<br[^>]*\/>/gi, '');
      newContent = newContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto;display:inline-block;margin:10rpx auto;"');
      return newContent;
    },
    // 分享给朋友
    async onShareEvent() {
      wx.showLoading({ title: '生成海报中', mask: true });
      let cardId = wx.getStorageSync("CARDID")
      let uuid = cardId + '' + new Date().getTime();
      await WXAJAX.POST({ companyId: this.COMPANYID, shareType: 4, itemId: this.dynamicId, uuid:uuid }, '', '/shareRecord/addShareRecord').then(data => {
        WXAJAX.POST({ itemId: this.dynamicId, shardRecordId: data }, '', '/personal/getDynamicPoster').then(result => {
          this.maskImg = result
          this.isPreviewImg = true
          wx.hideLoading();
        }).catch(err => {
          uni.showToast({
            title: '生成分享图片失败',
            icon: 'none'
          })
          wx.hideLoading();
        })
      }).catch(err => {
        uni.showToast({
          title: '生成分享图片失败',
          icon: 'none'
        })
        wx.hideLoading();
      })
    },
    checkCollect() {//
      WXAJAX.checkCollect({
        itemType: 2,
        itemId: this.dynamicId,
      }).then((data) => {
        this.isCollect = data.status;
      }).catch((err) => {

      })
    },
    goPage() {
      uni.navigateTo({
        url: `./webView?url=${this.webViewSrc}`
      })
    },
    //  删除
    choose_tap(id) {
      if (id === 'cancel') {
        this.addTypeShow = false;
        return;
      }
      wx.showLoading();

      WXAJAX.POST({
        dynamicId: this.dynamicId,
      }, '', '/company/delDynamicInfo').then((data) => {

        wx.hideLoading();
        wx.showToast({
          title: '成功！',
          icon: 'success'
        });
        setTimeout(function () {
          wx.navigateBack();
        }, 600);
      }).catch((err) => {
        console.log(err);
        wx.hideLoading();
      });
    },
  }
}
</script>
<style>
page {
  background: #fff !important;
}
.dec {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30upx;
  padding-bottom: 40upx;
  border-bottom: 1upx solid #e8e8e8;
}
.left-dec {
  font-size: 24upx;
  color: #a8a8a8;
}

.right-dec {
  font-size: 24upx;
  color: rgba(86, 108, 132, 1);
}
.prod_choose_class {
  position: fixed;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  bottom: -100%;
  /* transition: all 0.2s linear; */
}
.more-btn {
  position: absolute;
  top: 12vh;
  left: 0;
  right: 0;
  text-align: center;
}
.more-btn button {
  width: 250upx;
  border: 1upx solid rgba(81, 203, 205, 1);
  border-radius: 10upx;
  color: rgba(81, 203, 205, 1);
  font-size: 28upx;
}
.show {
  bottom: 0;
  z-index: 1000;
}

.prod_choose_class .inner {
  border-radius: 10upx 10upx 0 0;
}
.share-box {
  display: flex;
  justify-content: center;
  margin-top: 20upx;
  margin-bottom: 30upx;
}
.share-img {
  width: 100upx;
  height: 100upx;
}
.share-title {
  font-size: 24upx;
  color: #a8a8a8;
  /* line-height:14upx; */
}
.share-ornament {
  background: #f5f5f6;
  height: 10upx;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.img-size {
  width: 600upx;
  height: 600upx;
  margin-top: 30upx;
  margin-bottom: 60upx;
}
.content{
  box-sizing: border-box;
  padding:0 0 118upx 0;
}
.content rich-text{
  width: 750upx;
  overflow: hidden;
}
</style>
<style scoped>
.top{
  padding: 30upx;
  box-sizing: border-box;
}
.title{
  width: 688upx;
  font-size: 32upx;
  font-weight: 500;
  color: #383838;
  line-height: 48upx;
}
.line{
  transition: all 0.2s;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 32upx;
  height: 8upx;
  background: #ffffff;
}
.active{
  color: #383838;
  font-weight: bold;
}
.active .line{
  transition: all 0.2s;
  background: #51CDCB !important;
}
.content{
  padding: 0 30upx;
}
.comment_btn{
  display: block;
  padding:17upx 34upx;
  border: 1px solid #51CDCB;
  border-radius: 30px;
  color: #51CDCB;
  font-size: 28upx;
}
.btns{
  height: 98upx;
  position: fixed;
  bottom: 0;
  width: 100vw;
  z-index: 99;
}
.bottom{
  min-height: 500rpx;
}
.consulting{
  background: linear-gradient(-90deg, #51CBCD, #76DAD9);
}
.edit_input.hide {
  opacity: 0;
}
.comment_input{

}
</style>
