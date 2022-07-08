<template>
  <div class="distribution-item" @click="downType=false;input_show = false">
    <SelfSwiper :imgUrls="leftBanner"
                :self_class="'h150 ml15 mr15 mt15 mb15 bradius10 borderbox'"
                :isShowMask="true"
                @swipclick="preview"
                :isShowDots="false" />
    <div class="nav_top" :style="{top:navHeight}">
      <div class="posre disflex align-cen jsbet pl15 pr15 bgfff">
        <scroll-view scroll-x
                      class="nav"
                      scroll-with-animation>
          <div class="">
            <div class="nav-item"
                  v-for="(navItem,idx) in menu"
                  :key="idx"
                  :class="menu_id == navItem.settingId ?'active':''"
                  @click="menu_tap(navItem.settingId)">{{navItem.name}}
            </div>
          </div>
        </scroll-view>
        <div class="disflex w74 h25 borderbox jsbet pl10 pr10 pt7 pb7 fs14 c80 be8 align-cen posre"  @click.stop="condition_tap">
        {{typeTitle || '最新'}}
          <img :src="leftIcon" class="w8 h10 leftIcon">
          <div class="DownOption" :class="downType ? 'down' : 'up'">
              <div class="list" v-for="(item,index) in typeTab" :key="index" @click="type_tap(item.title,item.type)">
                  {{item.title}}
              </div>
          </div>
        </div>
      </div>
    </div>
    <div v-for="(demand_item, k1) in demand_lists"
               :key="k1"
               @click="demand_detall(demand_item.squareId,demand_item.companyId)"
               style="position: relative;">
      <demandItem :dynamic_item="demand_item"
                  @operate_tap="operate_tap"
                  @addCommentA="addCommentA"
                  @zan="zan"
                  @getMoreComment="getMoreComment"
                  :index1="k1">
      </demandItem>
    </div>
    <div class="flex1 bgfff" v-if="demand_lists == ''">
      <nodata  :title="'暂无需求信息，快去发布你的需求吧'"></nodata>
    </div>
    
    <div class="release_btn disflex jscen align-cen" @click="release_tap">
      <img :src="sendIcon" class="w30 h30">
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import SelfSwiper from "../../../../components/contactsSwipers";
import demandItem from "../../../../components/demandItme";
import nodata from "../../../../components/noDataA";

  export default {
    components:{SelfSwiper,demandItem,nodata},
    props:['navHeight','menu','demand_lists','leftBanner'],
    data(){
      return {
        searchImg: WXAJAX.imgBackUrl + "one-stand/products/icon_search.png",
        banners:[
          'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-stand/photo/20191027/271623c2f079256b88afdb74eafd72ba.png.primary.png',
          'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-stand/photo/20191027/271623c2f079256b88afdb74eafd72ba.png.primary.png'
          ],
        typeTab:[{
          title:'最新',
          type:1
        },{
          title:'人气',
          type:2
        }],
        currentType:1,
        // menu:[{ 
        //   name: "全部", goodstypeId: -10 
        // },{ 
        //   name: "塞尔达", goodstypeId: 1 
        // }],
        likeIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like.png',
        likeSelectIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like_select.png',
        hotIocn: WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/icon_hot.png',
        leftIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/Icon_back.png',
        sendIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/ic_send%402x.png',
        menu_id:'-10',
        downType:false,
        typeTitle:'',
        input_show:false,
        squareId:'', // 需求id
        companyId:'', // 公司id
      }
    },
    onShareAppMessage(e) {
    let COMPANYID = wx.getStorageSync("COMPANYID") || 0;
    let CARDID = wx.getStorageSync("CARDID") || 0;

    this.addGoodsForwardRecord(CARDID);
    let uuid = CARDID + "" + new Date().getTime();
    addShareRecord(COMPANYID, 2, "", uuid).then(
      res => {},
      err => {}
    );
    return {
        path:
          "pages/demandSquare/detall/main?squareId=" +
          this.squareId +
          "&companyId=" +
          this.companyId,
        success(e) {
          wx.showShareMenu({
            withShareTicket: true
          });
        },
        fail(e) {
          console.log("失败分享名片--- ", e);
        }
      };
    },
    methods:{
      preview(){
        this.previewImages(this.banners, this.banners[idx]);
      },
      toSearchGoods(){

      },
      change_type(type){
        this.currentType = type
      },
      menu_tap(id) {
      this.menu_id = id || "";
      this.page = 1;
      this.$emit('menu_tap',id)
      // this.nodata = false;
      // this.isLoading = false;
      // this.prod_lists = [];
      // wx.showLoading();
      // this.getProds();
      },
      condition_tap(){
        this.downType = !this.downType
      },
      type_tap(title,type){
        this.typeTitle = title
        this.$emit('type_tap',type)
      },
      release_tap(){
        uni.navigateTo({
          url:'../release/main'
        })
      },
      zan(index1,likeNum){
        this.$emit('zan',index1,likeNum)
      },
    //   addCommentA(index1, replayComment) {
    //   //添加评论
    //   // let isLogin = HandleLogin.returnIsLogin();
    //   // if (!isLogin) {
    //   //   uni.showToast({
    //   //     title: "请先登录,才可以评论喔",
    //   //     icon: "none"
    //   //   });
    //   //   return;
    //   // }
    //  console.log(index1)

    //   this.input_show = true;
    //   this.replayComment = replayComment;
    //   // this.comment_focus = true ;
    //   this.add_comments_index = index1;
    //   let v = this;
      
    //   },
      demand_detall(squareId,companyId){

        wx.navigateTo({
          url:`../detall/main?companyId=${companyId}&squareId=${squareId}`
        })
      },
      
    },
    onPageScroll: function (e) {
      this.input_show = false;
      this.comment_focus = false;
    },
  }
</script>

<style scoped>
.search-goods {
  margin-left: 20upx;
  margin-right: 21upx;
  box-sizing: border-box;
  width: 100%;
  box-sizing: border-box;
  padding:0 30upx 0 30upx;
  height: 68upx;
  border-radius: 34upx;
  background-color: #f5f5f6;
  color: rgba(168, 168, 168, 1);
  display: flex;
  font-size: 28upx;
  align-items: center;
  padding: 0 41upx 0 41upx;
}
.industry_top{
  width: 165upx;
  height: 60upx;
  border-radius: 6upx;
  font-size: 20upx;
  color:#787878;
  display: flex;
  justify-content: center;
  align-items: center;
}
.centet{
  overflow: auto;
  width: 100%;
}
.centet::-webkit-scrollbar { 
  width: 0 !important 
}
.nav {
  height: 90upx;
  width: 75%;
  line-height: 88upx;
  font-size: 28upx;
  white-space: nowrap;
  /* background: linear-gradient(270deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%); */
}
.nav_top {
  position: sticky;
  background: white;
  z-index: 100;
}
.nav-item {
  display: inline-block;
  text-align: center;
  margin-right: 48upx;
}

.nav-item.active {
  font-size: 36upx;
  font-weight: bold;
  color: #51cdcb;
  font-weight: bold;
}
.leftIcon{
  transform:rotate(-90deg);
}
.DownOption{
  position: absolute;
  left: -1upx;
  top: 47upx;
  width: 148upx;
  background: #ffffff;
  z-index: 99;
  box-sizing: border-box;
  overflow: auto;
}
.DownOption .list{
  line-height: 60upx;
  padding-left: 20upx;
  border-bottom:1upx solid  #E8E8E8;
  font-size: 28upx;
  color:#787878;
}
.down{
  height: 120upx;
  border-top:1upx solid #ffffff;
  border-radius: 0px 0px 5upx 5upx;
  border: 1upx solid #E8E8E8;
  transition: all .4s;
}
.up{
  height: 0upx;
  transition: all .4s; 
}
.release_btn{
  border-radius: 50%;
  width: 120upx;
  height: 120upx;
  position: fixed;
  bottom: 10%;
  right: 30upx;
  background: #51CDCB;
}
.input-hide {
  height: 0;
}
</style>
