<template>
  <div class="bgfff square_box" :style="{paddingTop:navHeight}">
    <div  class="borderbox bgfff fix_top" :style="{height:navHeight,paddingTop:navTop}">
      <div class="disflex align-cen h100p pl20">
        <div class="disflex align-cen h100p w30" @click="goback">
           <img :src="leftIcon" class="w16 h18">
        </div>
        <div class="fs20 c38 fbold mr20"
             :class="tabType == 1 ? 'active' : 'title'"
             @click="tab_type_tap(1)">{{leftTitle || lang.text_0}}</div>
        <div class="fs16 c38 fbold"
             :class="tabType == 2 ? 'active' : 'title'"
             @click="tab_type_tap(2)">{{rightTitle || lang.text_1}}</div>
      </div>
    </div>
    <div class="" v-if="tabType == 1">
      <Contacts :navHeight="navHeight"
                :menu="menu"
                :leftBanner="leftBanner"
                :demand_lists="demand_lists"
                @menu_tap="menu_tap"
                @zan="zan"
                @type_tap="type_tap"></Contacts>
    </div>
    <div :class="tabType == 2 ? '' : 'hidden'" >
      <product-center
        :goodsMenu="goodsMenu"
        :prod_lists="prod_lists"
        :rightBanner="rightBanner"
        @getProds="getProds"
        @scrolltoupper="scrolltoupper"
        @scrolltolower="scrolltolower"
      ></product-center>
    </div>
    <div class="release_products"></div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import Contacts from "./components/Contacts"
import productCenter from "./components/productCenter"
import { mapMutations } from "vuex";
import LangUtils from '../../../utils/LangUtils';

export default {
  data(){
    return{
      lang: LangUtils.getLangSrc().demandSquare.index,
      navHeight:'',
      navbarWidth:'',
      navTop:'',
      leftIcon:WXAJAX.imgBackUrl + '/yimai_photos/crmAdd/Icon_back.png',
      tabType:1,
      menu:'', //分类
      settingId:'',
      isLoading:true,
      pages:1,
      demand_lists:[], //需求
      queryType:1,
      smartMainId:WXAJAX.smartMainId, //主体小程序公司id
      company_msg:'', //公司信息
      goodsMenu:'',
      prod_lists:'',
      goosPages:1, // 产品中心page
      leftBanner:['http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png'],// 需求广场图片
      rightBanner:['http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png'], // 产品中心图片
      leftTitle:'',//需求标题
      rightTitle:'' // 产品中心标题
   }
  },
  components:{Contacts,productCenter},
  created(){

  },
  onLoad(option){
    this.tabType = option.type


    // if(this.tabType == 1 || !this.tabType){
    //   this.init()
    // }else{
    //   this.productInit()
    // }
    this.calculateNavBarHeight()
    this.getCustomizeSetting()
  },
  onShow(){
    this.pages = 1
    this.isLoading = true;
    this.prod_lists = []
    this.demand_lists = []
    if(this.tabType == 1 || !this.tabType){
      this.init()
    }else{
      this.productInit()
    }
  },
  methods:{
    ...mapMutations(['setDemandClass']),
    /**
     * 计算navbar的高度
     */
    calculateNavBarHeight() {
      if (getApp().globalData.menuButtonBounding === 0) {
        getApp().globalData.menuButtonBounding = wx.getMenuButtonBoundingClientRect();
      }
      let menuButtonBounding = getApp().globalData.menuButtonBounding;
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          let navHeight =
            statusBarHeight +
            (menuButtonBounding.top - statusBarHeight) * 2 +
            menuButtonBounding.height; //导航高度
          let navBarUserHeight = navHeight - statusBarHeight;

          this.navHeight = navHeight + "px";
          this.navTop = statusBarHeight + "px";
          wx.setStorageSync('navTop',this.navTop)
          this.navBarUserHeight = navBarUserHeight + "px";
        },
        fail(err) {
          console.log(err);
        }
      });
    },
    tab_type_tap(type){
      this.settingId = ''
      this.isLoading = true
      this.pages = 1
      this.queryType = type
      this.demand_lists = []
      this.goodsMenu = []
      this.prod_lists = []

      if(type == 1){
        this.init()
      }else{
        this.productInit()
      }
      this.tabType = type
    },
    init(){
      this.getAllClass()
      this.getPageUser()
    },
    productInit(){
      this.getMeuns()
      this.getProds()
    },
    getAllClass(){
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        // companyId: wx.getStorageSync('SELFCOMPANYID') || ''
        dataType:1
      }
      WXAJAX.POST(data,'','/demandSquare/queryAllClassification').then(data=>{
        if(data){
          wx.hideLoading()
          this.setDemandClass(data)
          this.menu = [
            { name: "全部", settingId: -10 },
            ...data]
            console.log(this.menu)
        }else{
          this.menu = []
          this.setDemandClass('')
        }

      })
      .catch(err => {
        wx.hideLoading()
        wx.showToast({
          title:err,
          icon:'none'
        })
      });
    },
    getPageUser(){
      let v = this
      if(!v.isLoading){
        return
      }
      v.isLoading = false
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        // companyId: wx.getStorageSync('SELFCOMPANYID') || ''
        companyId:this.smartMainId,
        settingId:v.settingId || '',
        pageNum:v.pages,
        queryType:this.queryType || ''
      }
      WXAJAX.POST(data,'','/demandSquare/queryPageUserDemand').then(data=>{
        if(data.pageInfo.list){
          wx.hideLoading()
          v.demand_lists = [...v.demand_lists,...data.pageInfo.list]
          v.pages++
          setTimeout(()=>{
            v.isLoading = true
          },500)
        }else{
          wx.hideLoading()
        }
      })
      .catch(err => {

        wx.hideLoading()
        wx.showToast({
          title:err,
          icon:'none'
        })
      });
    },
    getMeuns() {
      //获取产品中心所有的分类
      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          companyId:'',
        },
        "",
        "/goods/getGoodsTypeDemand"
      )
        .then((data, code) => {
          // wx.hideLoading();
          if (data) {
            v.goodsMenu = [
            { name: "全部", goodstypeId: -10 },
            ...data]
          }
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
          v.menu = [];
        });
    },
    getProds(type,id,goosPages) {

      //获取产品中心产品
      //type  判断用户是否点击分类
      //id    分类id
      //goosPages  分页
      if(type == 1){
        this.prod_lists = []
      }
      let v = this;
      if (!v.isLoading) {
        wx.hideLoading();
        return;
      }
      v.isLoading = true;
      WXAJAX.POST(
        {
          goodstypeId: id,
          pageNum: goosPages,
          //上架
          isPutOn:true
        },
        "",
        "/goods/getGoodsList/demand"
      )
        .then(data => {
          wx.hideLoading();
          if (data) {
            if(goosPages === 1){
              v.prod_lists = []
            }
            data.forEach(function(i, k) {
              if (i.goodPhoto) {
                i.prodLogo = i.goodPhoto.split(",")[0];
              } else {
                i.prodLogo = "";
              }
              if (i.price) {
                i.price /= 100;
                i.price = i.price.toFixed(2);
              } else {
                i.price = "";
              }

              if (i.isKill) {
                i.killPrice = i.killPrice / 100;
                i.killPrice = i.killPrice.toFixed(2);
                i.originPrice = i.price;
              }
            });
            v.prod_lists = [...v.prod_lists, ...data];
            v.goosPages++;
            setTimeout(function() {
              v.isLoading = true;
            }, 500);
          } else {

          }
        })
        .catch(err => {
          console.log(err);
          v.prod_lists = [];
          wx.hideLoading();
          if (err.code == 204) {
            v.nodata = true;
          }
          setTimeout(function() {
            v.isLoading = false;
          }, 500);
        });
    },


    menu_tap(id){
      console.log(id)
      if(id == -10){
        this.settingId = ''
      }else{
        this.settingId = id
      }

      this.demand_lists = []
      this.isLoading = true
      this.pages = 1
      this.getPageUser()
    },
    scrolltoupper(){
      this.prod_lists = []
      this.goosPages = 1
      this.getMeuns()
      this.getProds('','',this.goosPages)
    },
    scrolltolower(id){
      this.getProds('',id,this.goosPages)
    },
    type_tap(type){
      this.isLoading = true
      this.pages = 1
      this.queryType = type
      this.demand_lists = []
      this.getPageUser(type)
    },
    goback(){
      uni.navigateBack({
        delta:1
      })
    },
    getCustomizeSetting() {
      //获取产品中心所有的分类
      let v = this;
      wx.showLoading();
      WXAJAX.POST(
        {
          companyId:'',
        },
        "",
        "/demandSquare/queryCustomizeSetting"
      )
        .then((data, code) => {
          // wx.hideLoading();
          console.log(data)
          this.leftBanner = JSON.parse(data.leftImage)
          this.rightBanner = JSON.parse(data.rightImg)
          this.leftTitle = data.nameLeft
          this.rightTitle = data.nameRight
          wx.hideLoading();
        })
        .catch(err => {
          wx.hideLoading();
        });
    },
    zan(index1,likeNum){
      this.demand_lists[index1].isBind = true
      this.demand_lists[index1].likeNum += 1
    }
  },
  onReachBottom(){
    this.getPageUser()
  },
}
</script>

<style scoped>
.square_box{
  min-height: 100%;
  box-sizing: border-box;
}
.title{
  font-size: 36upx;
  color: #383838;
  opacity: 0.4;
  transition: all .2s;
}
.active{
  font-size: 40upx;
  color: #383838;
  transition: all .2s;
}
.hidden{
  display: none;
}

</style>
