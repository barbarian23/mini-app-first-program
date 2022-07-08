<template>
  <div class="bgfff square_box" :style="{paddingTop:navHeight}">
    <div  class="borderbox bgfff fix_top" :style="{height:navHeight,paddingTop:navTop}">
      <div class="disflex align-cen h100p pl20">
        <div class="disflex align-cen h100p w30" @click="goback">
           <img :src="leftIcon" class="w16 h18">
        </div>
        <div class="fs20 c38 fbold mr20"
             :class="tabType == 1 ? 'active' : 'title'"
             @click="tab_type_tap(1)">{{ lang.text_0 }}</div>
        <!-- <div class="fs16 c38 fbold"
             :class="tabType == 2 ? 'active' : 'title'"
             @click="tab_type_tap(2)">{{ lang.text_1 }}</div> -->
      </div>
    </div>
    <div class="" v-if="tabType == 1">
      <Contacts :newItems="newItems"
                :navHeight="navHeight"
                :popularity="popularity"
                :industry="industry"
                :banners="banners"
                @change_type="change_type"
                @bind_tap="bind_tap"
                ></Contacts>
    </div>

  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import Contacts from "./components/Contacts"
import { mapMutations } from "vuex";
import LangUtils from '../../../utils/LangUtils';

export default {
  data(){
    return{
      lang: LangUtils.getLangSrc().contactsMarket.index,
      navHeight:'',
      navbarWidth:'',
      navTop:'',
      leftIcon:WXAJAX.imgBackUrl + '/yimai_photos/crmAdd/Icon_back.png',
      tabType:1,
      newItems:'',//滚动字幕
      popularity:'',//人脉列表
      pages:1,
      isLoading:true, //防止用户短时间多次请求
      industry:[], //行业
      queryType:1, //请求type
      banners:['http://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418160834.png'],//顶部广告图
    }
  },
  components:{Contacts},
  created(){
    this.calculateNavBarHeight()
    this.init()
  },
  methods:{
    ...mapMutations(['setIndustryList']),
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
      this.tabType = type
    },

    init(){
      this.getBusinessCardSevenDay()
      this.getAdvancedForm()
      this.getIndustry()
      this.getBusinessCard()
    },
    getBusinessCardSevenDay(){
      wx.showLoading({
        title:'加载中',        mask:true
      })
      let data = {
        // companyId: uni.getStorageSync('SELFCOMPANYID') || ''
        companyId: 1
      }
      WXAJAX.POST(data,'','/market/queryBusinessCardSevenDay').then(data=>{
        if(data){
          uni.hideLoading()
          this.newItems += data.map(v => {
            let text = v.name + '已成功注册名片！'
            return text
          });

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
    getAdvancedForm(){
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        // companyId: uni.getStorageSync('SELFCOMPANYID') || ''
        companyId: ''
      }
      WXAJAX.POST(data,'','/market/queryMarketAdvancedForm').then(data=>{
        if(data){
          uni.hideLoading()
          console.log(data)
          this.banners = JSON.parse(data[0].url)
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
     getIndustry(){
      let than = this
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        // companyId: uni.getStorageSync('SELFCOMPANYID') || ''
        companyId: 1
      }
      WXAJAX.POST(data,'','/market/queryMarketIndustry').then(data=>{
        if(data){
          uni.hideLoading()
          this.setIndustryList(data)
          data.forEach((v,k) => {
            v.background = 'rgb(' + Math.floor(Math.random() * 130+110) + ',' + Math.floor(Math.random() * 130+110) + ',' + Math.floor(Math.random() * 130+110) + ',0.3)'
            if(k < 8 ){
              than.industry.push(v)
            }
          });

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
    getBusinessCard(type){
      let v = this
      if(!this.isLoading){
        return
      }
      this.isLoading = false
      wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        // companyId: uni.getStorageSync('SELFCOMPANYID') || ''market / queryMarketAdvancedForm
        companyId: 1,
        queryType: v.queryType,
        pageNum:v.pages
      }
      WXAJAX.POST(data,'','/market/searchBusinessCard').then(data=>{
        uni.hideLoading()
        if(data.pageInfo.list){
          v.popularity = [...v.popularity, ...data.pageInfo.list]
          v.pages++
          setTimeout(function(){
            v.isLoading = true
          },200)
        }else{
          v.isLoading = false
        }
      })
      .catch(err => {
        v.isLoading = false
        wx.hideLoading()
        wx.showToast({
          title:err,
          icon:'none'
        })
      });
    },
    change_type(type){
      this.isLoading = true
      this.pages = 1
      this.queryType = type
      this.popularity = []
      this.getBusinessCard(type)
    },
    goback(){
      uni.navigateBack({
        delta:1
      })
    },
    bind_tap(index){
      if(this.popularity[index].isBind == true){
        uni.showToast({
          title:'该名片已收藏！'
        })
      }else{
        this.popularity[index].isBind = true
        uni.showToast({
          title:'该名片已收藏！'
        })
      }

    }
  },
  onReachBottom(){
    this.getBusinessCard(this.queryType)
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
</style>
