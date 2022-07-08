<template>
  <div class="bgfff pt20 pl15 pr16 bbf5f6 mb5">
    <div class="disflex mb15 jsbet align-cen">
      <div class="disflex">
        <img :src="dynamic_item.logo || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card1_logo.png'"
         alt=""
         mode="aspectFill"
         class="w50 h50 bradius5 mr8">
        <div class="disflex flex-column jsaround">
          <span class="fbold c38 w195 fs16 over_1 ">{{dynamic_item.name}}</span>
          <span class="ca8 fs12">{{createTime}}</span>
        </div>
      </div>
      <div class="bblue disborder align-cen w80 h25 disflex jscen fs14 cblue bradius15" @click.stop="phone_tap(dynamic_item.phone)">
        联系TA
      </div>
    </div>

    <div class="flex1">
      <div @click="addComment(dynamic_item.dynamicId)">
        <p class="fs16 c38">{{dynamic_item.description}}</p>
        <div class="disflex pt15 picture-list">
          <div class="w93 h93"
               v-for="(v,k) in photos"
               :key="k">
            <img :src="v"
                 mode="aspectFill"
                 :lazy-load="true"
                 @click.stop="previewImage(v)">
          </div>
        </div>
      </div>
      <div class="disflex h39 mt15 btf5f6" @click.stop="">
        <button class='bgfff fs12 cdeepblue p0 w33p disflex jscen align-cen'
                :data-dynamicId="dynamic_item.dynamicId"
                open-type="share"
                hover-class="other-button-hover">
          <img class="w20 h20 mr8" :src="shareIcon">
          <span>{{ lang.text_0 }}</span>
        </button>
        <div class="disflex jscen align-cen w33p"
             @click.stop="addCommentA(dynamic_item)">
          <img class="w20 h20 mr8" :src="commentIcon">
          <p class="fs12 c78">{{dynamic_item.commentNum}}</p>
        </div>
        <div class="disflex jscen align-cen w33p"
             @click.stop="zan(index1 , dynamic_item.likeNum, dynamic_item.squareId)">
          <img class="w20 h20 mr8" :src="dynamic_item.isBind ?  like_selectIcon :  likeIcon">
          <p
            :class="dynamic_item.isThumbs == 1 ?  'cblue' :  'c78'"
            class="fs12">{{dynamic_item.likeNum}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from '@/utils/request'
import utils from '@/utils/index'
import { mapGetters } from 'vuex';
import LangUtils from '../utils/LangUtils';
export default {
  name: "dynamicItem",
  props: ['dynamic_item', 'index1'],

  data(){
    return {
      lang: LangUtils.getLangSrc().components.demandItme,
      commentIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_news_comment.png',
      likeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_news_like.png',
      like_selectIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_news_like_select.png',
      shareIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/ic_news_share.png',
      createTime:utils.getFormatTime(this.dynamic_item.createdTimestamp),
      photos:JSON.parse(this.dynamic_item.images)
    }
  },
  computed: {
    ...mapGetters(['currentCompany']),
  },
  methods: {
    dynamic_detail(id) {
      return
      this.$emit('dynamic_detail', id);
    },
    operate_tap(index1) {
      this.$emit('operate_tap', index1)
    },
    addComment() {
      // const { companyId, cardId } = this.currentCompany;
      // let url = '../commentDetail/main?dynamicId=' + this.dynamic_item.dynamicId + '&companyId=' + companyId + '&cardId=' + cardId;
      // wx.navigateTo({ url: url })
      console.log(this.dynamic_item)
    },
    addCommentA(dynamic_item) {
      console.log(dynamic_item)
      wx.navigateTo({
        url:`../detall/main?companyId=${dynamic_item.companyId}&squareId=${dynamic_item.squareId}`
      })
    },
    zan(index1, likeNum,squareId) {//点赞
      //点赞
      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          //tyoe: 2为点赞 1为评论
          type: 2,
          squareId: squareId,
          commentUserId: wx.getStorageSync("userId")
        },
        "",
        "/demandSquare/likeSquareComment"
      )
        .then(data => {
          wx.hideLoading();
          this.$emit('zan',index1,likeNum)

        })
        .catch(err => {
          console.log(err);
          wx.hideLoading();
        });
    },
    getMore() {
      wx.showLoading();
      WXAJAX.POST({
        pageSize: 10,
        pageNum: parseInt(this.dynamic_item.commentModelList.length / 10) + 1,
        dynamicId: this.dynamic_item.dynamicId,
      }, '', '/personal/selectComment')
        .then(res => {
          wx.hideLoading();
          this.$emit('getMoreComment', res, this.index1);
        });
    },
    previewImage(src) {
      let source = this.checkImgNameIsNumber(src) ? src : (src + '.primary.png');
      let sourceArr = this.dynamic_item.photos.map(val => this.checkImgNameIsNumber(val) ? val : (val + '.primary.png'));
      wx.previewImage({
        current: source,
        urls: sourceArr
        // urls必须是数组 不然会报错
      })
    },
    phone_tap(phone){
      wx.makePhoneCall({
          phoneNumber: phone
      });
    },
    // toDetail() {//查看文章详情
    //   const { companyId, cardId } = this.currentCompany;
    //   let url = '../dynamicDetail/main?dynamicId=' + this.dynamic_item.dynamicId + '&companyId=' + companyId + '&cardId=' + cardId;
    //   wx.navigateTo({ url: url })
    // },
    detail_tap(type){
      // console.log(type)
      // if(type == 2){
      //   this.addComment()
      // }else if(type == 1 || 3 ){
      //   this.toDetail()
      // }
    }

  }
}
</script>

<style scoped>
.picture-list {
  flex-wrap: wrap;
}
.picture-list div {
  overflow: hidden;
  margin-right: 6upx;
  margin-top: 6upx;
}
.picture-list img {
  width: 100%;
  height: 100%;
}
.picture-list div:nth-child(3n) {
  margin-right: 0;
}

.picture-list div:nth-child(1),
.picture-list div:nth-child(2),
.picture-list div:nth-child(3) {
  margin-top: 0;
}
.dynamic_operate {
  width: 376upx;
  top: 0;
  bottom: 0;
  right: 104upx;
  margin: auto;
  transition: 0.2s;
  overflow: hidden;
  height: 80upx;
}

.dynamic_operate > div {
  border-radius: 10upx;
  line-height: 80upx;
  height: 80upx;
  box-sizing: border-box;
}

.dynamic_operate.w0 {
  width: 0;
  padding: 0;
  overflow: hidden;
}

.triangle_border_right {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-width: 20upx 0 20upx 20upx;
  border-style: solid;
  border-color: transparent transparent transparent #383838; /*透明 透明 透明 黄*/
  top: 50%;
  transform: translateY(-50%);
  right: 4upx;
  transition: 0.2s;
}
.w0 .triangle_border_right {
  border: 0;
}
.dynamic_likes {
  word-break: break-all;
}
.dynamic_likes .like_name::after {
  content: "，";
}
.dynamic_likes .like_name:last-child::after {
  content: "";
}
</style>
