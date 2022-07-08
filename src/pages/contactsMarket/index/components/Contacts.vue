<template>
  <div class="distribution-item">
    <CollingCaptions
      v-if="newItems"
      :text="newItems"
    ></CollingCaptions>
    <SelfSwiper :imgUrls="banners"
                :self_class="'h150 ml15 mr15 mt15 mb15 bradius10 borderbox'"
                :isShowMask="true"
                @swipclick="preview"
                :isShowDots="false" />
    <div class="bgfff">
      <div class="fs18 cfff disflex pl15 pr16 company-title">
        <div class="search-goods"
             @click="toSearchGoods(1,'')">
          <img :src="searchImg"
                alt=""
                class="w15 h15 mr8">
          搜索行业或用户姓名
        </div>
      </div>
    </div>
    <div class="">
      <div class="centet  pl15 pr15 mt15 borderbox disflex">
        <div class="disflex flex1">
          <div class="disflex h65 wrap w345 ">
            <div class="industry_top" 
                 v-for="(item,index) in industry" 
                 :class="index == 3  ? '' : 'mr5' &&  index == 7  ? '' : 'mr5'"
                 :style="{background:item.background}"
                 :key="index"
                 @click="toSearchGoods(2,item.industryName)">
                 {{item.industryName}}
            </div>
          </div>
          <div class="h65 w65 fs14 c78 lh22 borderbox pl18 pr15 pt5 float-left disflex jscen align-cen bf5f6 ml10 mr10"
               v-if="industry.length >= 8"
               @click="toSearchGoods(2,'','more')">
            查看更多
          </div>
        </div>
      </div>
    </div>

    <div class="type_list disflex pl15 align-cen" :style="{top:navHeight}">
        <p class="mr20 mb20" 
           v-for="item in typeTab" :key="item"
           :class="currentType == item.type ? 'fs18 cblue fbold ' : 'fs14 c38 '" 
           @click="change_type(item.type)">
          {{item.title}}
        </p>
    </div>
    <div class="pl15 pr15 pb15">
      <div class="disflex bf5f6 jsbet pt20 pl15 pr15 pb15 bradius10 mb10"
           v-for="(item,index) in popularity" 
           :key="index"
           @click="page_turn(item)">
        <div class="disflex">
          <img :src="item.logo" class="w50 h50 bradius5">
          <div class="ml10 h50 disflex flex-column jsbet"> 
            <div class="disflex">
              <img :src="hotIocn" class="w20 h20 mr10" v-if="index <= 2 && currentType == 2">
              <p class="fs18 c38">{{item.name}}<span class="fs14 c78 ml10">{{item.position}}</span></p>
            </div>
            <p class="fs14 c78">{{item.companyName}}</p>
          </div>
        </div>
         
         <div class="h50 disflex flex-column jsbet align-cen float-right" @click.stop="collection_tap(index,item.cardId,item.companyId)">
           <img :src=" (item.isBind || selfUserId == item.userId) ? likeSelectIocn : likeIocn" class="w20 h20">
           <p class="ca8 fs12">{{ (item.isBind || selfUserId == item.userId) ? '已加入' : '加入名片夹'}}</p>
         </div>  
      </div>
    </div>
    <nodata v-if="popularity == ''" :title="'暂无名片，快去公开你的名片到这里吧'"></nodata>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import CollingCaptions from "../../../../components/CollingCaptions"
import SelfSwiper from "../../../../components/contactsSwipers"
import nodata from "../../../../components/noDataA";


  export default {
    components:{CollingCaptions,SelfSwiper,nodata},
    props:['newItems','navHeight','popularity','industry','banners'],
    data(){
      return {
        searchImg: WXAJAX.imgBackUrl + "one-stand/products/icon_search.png",
        typeTab:[{
          title:'最新',
          type:1
        },{
          title:'人气',
          type:2
        }],
        currentType:1,
        selfUserId:wx.getStorageSync('userId') || '',
        likeIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like.png',
        likeSelectIocn:WXAJAX.imgBackUrl + 'yimai_photos/crmRevision/details_like_select.png',
        hotIocn: WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/icon_hot.png'
      }
    },
    methods:{
      preview(){
        this.previewImages(this.banners, this.banners[idx]);
      },
      toSearchGoods(type,name,type1){
        if(type1 == "more"){
          wx.navigateTo({
            url:`../chooseProfession/main?queryType=${this.currentType}`
          })
        }else{
           wx.navigateTo({
            url:`../search/main?type=${type}&industry=${name}&queryType=${this.currentType}`
          })
        }
        
      },
      page_turn(item){
        
        wx.setStorageSync('COMPANYID',item.companyId);/*id*/
        wx.setStorageSync('CARDID',item.cardId);/*id*/
        wx.switchTab({url:'../../index/main?cardId='+item.companyId+'&companyId+'+item.cardId});
      },
      change_type(type){
        if(this.currentType !== type){
          this.currentType = type
          this.$emit('change_type',type)
        }
      },
      collection_tap(index,cardId,companyId){
       
        let url = "/businessCard/cardDetails";
        //获取数据
        //
        wx.showLoading({
          mask:true
        });
        WXAJAX.POST(
          {
            cardId: cardId,
          },
          "",
          url
        )
          .then((data, code) => {
            wx.hideLoading();
            if (data) {
              this.$emit('bind_tap',index)
              console.log(data)
            }
          })
          .catch(err => {
            ////console.log(err);
            wx.hideLoading();
          });
        }
      
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
  font-size: 22upx;
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
.type_list{
  position: sticky;
  background: white;
  z-index: 100;
}
</style>
