<template>
  <div class="bgf5f6 disflex h100p flex-column" @click="tap_all">
    <div class="top bgfff mb15">
      <div class="disflex">
        <img :src="dynamic.logo || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card1_logo.png'"
          alt=""
          mode="aspectFill"
          class="w50 h50 bradius5 mr8">
        <div class="disflex jsbet flex1">
          <div class="disflex flex-column jsaround">
            <span class="fbold cblue_3 fs16 over_1 ">{{dynamic.name}}</span>
            <span class="ca8 fs12">{{dynamic.createdTimestamp}}</span>
          </div>
          <p class="cblue fs12 w105 over_1 textr">{{dynamic.address}}</p>
        </div>
      </div>
      <p class="title mb15">{{dynamic.description}}</p>
      <div class="mb20">
        <div class="disflex picture-list">
          <div
               v-for="(v,k) in dynamic.images"
               :key="k">
            <img :src="v"
                 class="w110 h110 mr3"
                 mode="aspectFill"
                 :lazy-load="true"
                 @click.stop="previewImage(v)">
          </div>
        </div>
      </div>
      <div class="fs14 c78 lh25 mb10 disflex jsbet">
        <div class="w250">
          备注：{{dynamic.note || ''}}
        </div>
        <div>
          已浏览<span class="cblue ml6">{{dynamic.browseNum}}</span>
        </div>
        </div>
        <div class="disflex jsbet align-cen mb10">
          <div class="h20 lh20 pl10 pr10 fs12 ca8 bgf5f6 bradius10 float-left">{{ lang.text_0 }}</div>
          <div class="fs12 cblue" @click="report_tap">{{ lang.text_1 }}</div>
        </div>
      <div>

      </div>
    </div>
    <div class="bottom pb50 borderbox bgfff flex1">
      <div class="disflex bbf5f6 c78">
        <div class="w50p h44 disflex posre jscen align-cen fs14"
             :class="currentTab == 1 ? 'active': ''"
             @click="tab_tap(1)">
          <span class="mr10 fs14">{{ lang.text_2 }}</span>
          {{commentModelList.length || 0}}
          <span class="line"></span>
        </div>
        <div class="w50p h44 disflex posre jscen align-cen fs14"
             :class="currentTab == 2 ? 'active': ''"
             @click="tab_tap(2)">
          <span class="mr10 fs14">{{ lang.text_3 }}</span>
          {{likeModelList.length || 0}}
          <span class="line"></span>
        </div>
      </div>
      <div class="content">
        <div  v-if="currentTab == 1">
          <div class="disflex flex-column">
            <div class="h70 bbf5f6 disflex jscen align-cen">
              <span class="comment_btn" @click.stop="addComment('','','add')">
                立即评论
              </span>
            </div>
            <p class="textc ca8 fs12" v-if="!commentModelList">{{ lang.text_4 }}</p>
              <div class="comment-list bbf5f6 pt20 pb20 bgfff disflex"
                   v-for="(v,k) in commentModelList"
                   :key="k"
                   @longpress.stop="longpress_tap(v.commentId)"
                   >
                  <img class="w50 h50 bradius5 mr10" mode="aspectFill" :src="v.logo || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'">
                   <!-- <div class="comment w100p pt5 borderbox" @click.stop="addComment(k,v)"> -->
                  <div class="comment flex1 pt5 borderbox">
                    <div class="disflex jsbet mb10 align-cen">
                      <p class="cdeepblue fs14">{{v.name}}</p>
                      <p class="ca8 fs12">{{v.createdTimestamp}}</p>
                    </div>
                    <div class="fs14 lh27 fs16">
                      <span>{{v.comment}}</span>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div v-else>
          <div
              class="disflex bbf5f6 pl15 pt10 pb10 borderbox bgfff"
              v-for="(item,index) in likeModelList"
              :key="index">
            <img class="w50 h50 bradius5 mr10" mode="aspectFill" :src="item.logo || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_default_avatar_square.png'">
            <div class="disflex jscen align-cen">{{item.name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns disflex bgfff">
      <div class="disflex w155">
        <div class="disflex fs12 ca7 align-cen jscen flex-column w33p" @click="zan">
          <img :src="dynamic.isBind ? like_selectIcon  : likeIcon" class="w20 h20">
          {{dynamic.isBind ? '已点赞' : '点赞'}}
        </div>
        <div  class="disflex fs12 ca7 align-cen jscen flex-column w33p" @click="call_tap">
          <img :src="callIcon" class="w20 h20">
          通话
        </div>
        <button class='bgfff ca7 fs12 lh1 cdeepblue p0 w33p disflex flex-column jscen align-cen'
                :data-squareId="dynamic.squareId"
                open-type="share"
                hover-class="other-button-hover">
          <img class="w20 h20 mb2" :src="shareIcon">
          <span class="ca7 lh1">{{ lang.text_5 }}</span>
        </button>
      </div>
      <div class="disflex jscen fs18 cfff align-cen flex1 consulting"  @click="talk">
        <img :src="ommentIcon" class="w24 h24 mr7">
        立即咨询
      </div>
      <!--评论输入框-->
    <div class="fix_bottomB disflex borderbox align-cen pl15 bgfff h49 edit_input trans2"
         :class="input_show ? '' : 'hide'" @click.stop="">
      <!--:class="input_show ? '' : 'hide' "-->
      <div class="bgfffpl10 disflex jsbet pr11 w100p borderbox align-cen">
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

               v-model="comments"/>
        <!--        <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/smile.png" alt="" class="w25 h25" @click="smile_tap">-->
        <span class="bgblue cfff w50 textc lh30 fs16 bradius5 disblock ml10"
              @click.stop="inputConfirm">{{ lang.text_6 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from '@/utils/request';
import BottomButtonSmall from '@/components/bottom_button_small';
import LoginIntercept from "@/components/LoginIntercept";

import util from '@/utils/index';
import { mapGetters, mapState } from 'vuex';
import { addShareRecord } from '@/utils/behavior';
import HandleLogin from '@/utils/handleLogin'
import {authSubscribeComment,authSubscribeMessage} from '@/utils/auth.js'
import LangUtils from '../../../utils/LangUtils';

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
    },
  },
  computed: {
    ...mapGetters(["subscriptionNew"]),
  },
  data() {
    return {
      lang: LangUtils.getLangSrc().demandSquare.detall,
      webViewSrc: '',
      squareId: 98,
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
      commentModelList:[], //点赞数据
      likeModelList:[],//点赞数据
   }
  },
  async onLoad(options) {
    this.squareId = this.$root.$mp.query.squareId
    this.COMPANYID = this.$root.$mp.query.companyId || wx.getStorageSync('COMPANYID') || ''
    let cardId = options.cardId;
    this.cardId = options.cardId;
    await this.getInits(cardId)

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
    tap_all(){
      this.input_show = false;
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
        itemId: this.squareId,
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
          squareId: v.squareId,
          cardId: wx.getStorageSync('CARDID') || cardId,
        }, '', '/demandSquare/queryDetailDemand');
        wx.hideLoading();
        console.log(data)
        v.dynamic = data
        v.dynamic.photos = this.dynamic.photos ? v.dynamic.photos.split(",") : [];
        v.dynamic.createdTimestamp = util.getFormatTime(v.dynamic.createdTimestamp,true)
        v.dynamic.images = JSON.parse(v.dynamic.images)
        if(v.dynamic.squareCommentResponses){
          let list = v.dynamic.squareCommentResponses
          list.forEach((item,k) => {
            item.createdTimestamp = util.getFormatTime(item.createdTimestamp)
            if(item.type == 1){
              v.commentModelList.push(item)
            }else if(item.type == 2){
              v.likeModelList.push(item)
            }
          });
        }else{
          v.commentModelList = []
        }
      } catch (error) {
        wx.hideLoading();
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
    // 分享给朋友
    // async onShareEvent() {
    //   wx.showLoading({ title: '生成海报中', mask: true });
    //   await WXAJAX.POST({ companyId: this.COMPANYID, shareType: 4, itemId: this.squareId }, '', '/shareRecord/addShareRecord').then(data => {
    //     WXAJAX.POST({ itemId: this.squareId, shardRecordId: data }, '', '/personal/getDynamicPoster').then(result => {
    //       this.maskImg = result
    //       this.isPreviewImg = true
    //       wx.hideLoading();
    //     }).catch(err => {
    //       uni.showToast({
    //         title: '生成分享图片失败',
    //         icon: 'none'
    //       })
    //       wx.hideLoading();
    //     })
    //   }).catch(err => {
    //     uni.showToast({
    //       title: '生成分享图片失败',
    //       icon: 'none'
    //     })
    //     wx.hideLoading();
    //   })
    // },
    tab_tap(type){
      if(type == 1){
        this.currentTab = 1
      }else{
        this.currentTab = 2
      }
    },
    talk() {
      console.log(1111)
      //获取产品中心所有的分类
      let v = this;

      let userId = wx.getStorageSync('userId')
      if(userId == this.dynamic.createdUserId){
        return  wx.showToast({
            title:'不可以跟自己聊天哦~',
            icon:'none'
          })
      }
      authSubscribeMessage(this.subscriptionNew);
      wx.navigateTo({
        url:
          "../../IM/main?userId=" +
          this.dynamic.createdUserId +
          "&logo=" +
          this.dynamic.companyLogo +
          "&type=2&cardId=" +
          this.dynamic.cardId +
          "&name=" +
          this.dynamic.companyName +
          "&wxCode=" +
          (this.dynamic.personalWx || "") +
          "&phone=" +
          this.dynamic.phone || this.dynamic.recruitPhone || ''
      });
    },
    call_tap(){
      if(this.dynamic.phone || this.dynamic.recruitPhone){
        wx.makePhoneCall({
            phoneNumber: this.dynamic.phone || this.dynamic.recruitPhone //仅为示例
        });
      }else{
        wx.showToast({
          title:'暂无号码',
          icon:'none'
        })
      }

    },
    addComment(index1, replayComment,type) {
      //authSubscribeMessage(this.subscriptionNew);
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
      let v = this;
      //输入完成
      v.emoji_show = false;
      v.comment_focus = false;
      authSubscribeMessage(v.subscriptionNew);
      console.log(v.currentCompany)
      WXAJAX.POST(
        {
          squareId: v.dynamic.squareId,
          cardId: v.CARDID || v.cardId || 0,
          comment: v.comments,
          commentUserId:uni.getStorageSync('userId') || '',
          //type 1为评论 2为点赞
          type:1
        },
        "",
        "/demandSquare/likeSquareComment"
      ).then(res => {
        v.comments = ''
        v.input_show = false;
        v.commentModelList = []
        v.likeModelList = []
        v.getInits(v.cardId)
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
      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          //tyoe: 2为点赞 1为评论
          type: 2,
          squareId: v.dynamic.squareId,
          commentUserId: wx.getStorageSync("userId")
        },
        "",
        "/demandSquare/likeSquareComment"
      )
        .then(data => {
          wx.hideLoading();
          v.commentModelList = []
          v.likeModelList = []
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
    report_tap(){
      uni.navigateTo({
        url:`../report/main?squareId=${this.dynamic.squareId}&createdUserId=${this.dynamic.createdUserId}`
      })
    },
    longpress_tap(id){
      let v = this
      this.deleteComments()
      .then((res)=>{

        WXAJAX.POST(
        {
          //tyoe: 1为点赞 2为评论
          type: 2,
          commentId:id,

          commentUserId: wx.getStorageSync("userId")
        },
        "",
        "/demandSquare/deleteSquareComment"
      )
        .then(data => {
          wx.hideLoading();
          v.commentModelList = []
          v.likeModelList = []
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
      })
    },
    deleteComments(){
      return new Promise((resolve, reject)=>{
        uni.showModal({
          title: '提示',
          content: '是否要删除该评论',
          success: function (res) {
            if (res.confirm) {
                resolve(true)
            }
          }
        })
      })
    }
  }
}
</script>
<style>
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
}
.consulting{
  background: linear-gradient(-90deg, #51CBCD, #76DAD9);
}
.edit_input.hide {
  opacity: 0;
}
</style>
