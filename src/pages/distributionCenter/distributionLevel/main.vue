<template>
    <div class="posre h100p">
      <topbg :statusBarHeight="statusBarHeight"
             :navBarUserHeight="navBarUserHeight"
             :title="'分销等级'"></topbg>
      <div class="pl15 pr15 disflex flex-column borderbox h100p scrollbar" :style="{paddingTop:navHeight + 6 + 'px'}">
        <div class="distribution_box">
          <!-- header -->
          <div class="bradius15 pl20 pr20 pt20 pb20 shadow_gray bgfff posre mb10"> 
            <div class="disflex pb15 mb20">
              <img :src="distributorData.avatarUrl" class="w50 h50 bradius5 mr10 ">
              <div class="disflex flex-column jsbet ">
                <p class="fs18 c38 fbold">{{distributorData.name}}</p>
                <div class="bradius10 fs12 cblue pt3 pb3 pl8 pr8 bgf8 bblue bg_distributionLevel_blue">
                  您在此商家的等级
                  <span class="fbold ml5">{{currentLevel.lavelName}}</span>
                </div>
              </div>
            </div>
            <div class="flex-c-c mb10">
              <div class="w8 h8 bge8 bradius50p posre">
                <div class="level_radius" v-if="currentLevel.level == 1">
                  <div class="w10 h10 bradius50p bgblue"></div>
                </div>
                <div class="level_small_radius"  v-else-if="currentLevel.level > 1">
                  <div class="w10 h10 bradius50p bgblue"></div>
                </div>
              </div>
              <span class="w120 h1 bge8" :class="currentLevel.level < 2 ? 'bge8' : 'bgblue'"></span>
              <div class="w8 h8 bge8 bradius50p posre">
                <div class="level_radius" v-if="currentLevel.level == 2">
                  <div class="w10 h10 bradius50p bgblue"></div>
                </div>
                <div class="level_small_radius"  v-else-if="currentLevel.level > 2">
                  <div class="w10 h10 bradius50p bgblue"></div>
                </div>
              </div>
              <span class="w120 h1 bge8" :class="currentLevel.level > 2 ? 'bgblue' : 'bge8'"></span>
              <div class="w8 h8 bge8 bradius50p posre">
                <div class="level_radius" v-if="currentLevel.level == 3">
                  <div class="w10 h10 bradius50p bgblue"></div>
                </div>
              </div>
            </div>
            <div class="disflex jsbet pb20 bbf5f6">
              <div class="fs13 " v-for="(item,index) in distributorData.royaltyResponseList" :key="index" :class="index == currentLevel.level - 1 ? 'cblue' : 'c333'">
                 {{item.lavelName}}
              </div>
            </div>
            <div class="pt20">
              <p class="fs12 c78 lh19">每个商家的佣金比例可能不同。<br>成功分享下单后，请您根据自己的佣金等级和分销商品的价格计算您所应得的佣金</p>
            </div>
            <div class="pt26 pb20 fs36 fbold c38 textc">
              当前权益
            </div>
            <div class="disflex jscen mb30">
              <div class="disflex mr20">
                <img :src="LevelIcon1" class="w50 h50 mr7">
                <div class="disflex flex-column pt5 pb5 jsaround">
                  <p class="fs15 c38 fbold">{{currentLevel.oneRoyalty || 0}}%</p>
                  <p class="fs14 c78">一级佣金比例</p>
                </div>
              </div>

              <div class="disflex">
                <img :src="LevelIcon2" class="w50 h50 mr7">
                <div class="disflex flex-column jsaround">
                  <p class="fs15 c38 fbold">{{currentLevel.twoRoyalty || 0}}%</p>
                  <p class="fs14 c78">二级佣金比例</p>
                </div>
              </div>
            </div>
            <div>
              <p class="fs16 c38 fbold mb10">满足以下规则即可升级为<span class="cblue">{{currentLevel.level  == 3 ? currentLevel.lavelName : distributorData.royaltyResponseList[currentLevel.level].lavelName}}</span></p>
              <div class="disflex align-cen"  v-if="currentLevel.level < 3">
                <div class="pl5 pr5 pt3 pb3 bblue bradius5 mr7 fs12 cblue">未达标</div>
                <p class="fs12 c78">
                  推广佣金达{{distributorData.royaltyResponseList[currentLevel.level].conditions || 0}}元（还差
                  <span class="corange">
                    {{(distributorData.royaltyResponseList[currentLevel.level].conditions - distributorData.orderAmount).toFixed(2) || 0}}
                  </span>元）
                </p>
              </div>
              <div class="disflex align-cen"  v-else>
                <div class="pl5 pr5 pt3 pb3 bblue bradius5 mr7 fs12 cblue">已达标</div>
                <p class="fs12 c78">
                  <span class="corange">
                    已到达最高分销员等级！
                  </span>
                </p>
              </div>
            </div>
          </div>
          <!-- rule -->
          <div class="pt30 pb10  shadow_gray bgfff posre bradius15 mb10">
            <p class="pb20 fs36 fbold c38 textc">等级规则</p>
            <div class="bf5f6 pl10 pr10 pt15 pb15 mb10  mr10 ml10 bradius10">
              <div class="disflex jsbet">
                <div class="disflex flex-column align-cen">
                  <img :src="share_icon" class="w40 h40 mb15">
                  <p class="fs12 c38">你分享</p>
                </div>
                <div class="disflex flex-column jsaround pb32">
                  <p class="fs10 c78 textc">A</p>
                  <span class="h1 w70 bgf5f6"></span>
                  <p class="fs10 c78 textc">打开分享</p>
                </div>
                <div class="disflex flex-column align-cen">
                  <img :src="order_icon" class="w40 h40 mb15">
                  <p class="fs12 c38">A下单</p>
                </div>
                <div class="disflex flex-column jsaround pb32">
                  <p class="fs10 c78 textc">你得到</p>
                  <span class="h1 w70 bgf5f6"></span>
                  <p class="fs10 c78 textc">订单完成</p>
                </div>
                <div class="disflex flex-column align-cen"> 
                  <img :src="money_icon" class="w40 h40 mb15">
                  <p class="fs12 c38">一级佣金</p>
                </div>
              </div>
            </div>
            <div class="bf5f6 pl10 pr10 pt15 pb15 mr10 ml10 bradius10">
              <div class="disflex jsbet">
                <div class="disflex flex-column align-cen">
                  <img :src="share_icon" class="w40 h40 mb15">
                  <p class="fs12 c38">你分享</p>
                </div>
                <div class="disflex flex-column jsaround pb32">
                  <p class="fs10 c78 textc">A</p>
                  <span class="h1 w28 bgf5f6"></span>
                  <p class="fs10 c78 textc">打开</p>
                </div>
                <div class="disflex flex-column align-cen">
                  <img :src="sharea_icon" class="w40 h40 mb15">
                  <p class="fs12 c38">A分享</p>
                </div>
                <div class="disflex flex-column jsaround pb32">
                  <p class="fs10 c78 textc">B</p>
                  <span class="h1 w28 bgf5f6"></span>
                  <p class="fs10 c78 textc">打开</p>
                </div>
                <div class="disflex flex-column align-cen">
                  <img :src="order_icon" class="w40 h40 mb15">
                  <p class="fs12 c38">B下单</p>
                </div>
                <div class="disflex flex-column jsaround pb32">
                  <p class="fs10 c78 textc">你得到</p>
                  <span class="h1 w28 bgf5f6"></span>
                  <p class="fs10 c78 textc">完成</p>
                </div>
                <div class="disflex flex-column align-cen"> 
                  <img :src="money_icon" class="w40 h40 mb15">
                  <p class="fs12 c38">二级佣金</p>
                </div>
              </div>
            </div>
            <swiper class="swiper h260" 
                    :indicator-dots="indicatorDots" 
                    :autoplay="autoplay" 
                    :interval="interval" 
                    :duration="duration"
                    indicator-active-color="#51CDCB">
              <swiper-item v-for="(item,index) in distributorData.royaltyResponseList" :key="index">
                <div class="disflex align-cen flex-column pt30">
                  <div class="w95 bgblue h25 bradius15 lh25 textc fs14 cfff mb30">
                    {{item.lavelName}}
                  </div>
                  <p class="fs16 c38 fbold mb10">规则介绍</p>
                  <p class="fs14 c78 mb30" v-if="item.level == 1">成为分销员后即是该等级</p>
                  <p class="fs14 c78 mb30" v-else>推销金达{{item.conditions.toFixed(2) || 0}}元</p>
                  <p class="fs16 c38 fbold mb10">权益介绍</p>
                  <p class="fs14 c78 mb30">一级佣金比例{{item.oneRoyalty || 0}}%，二级佣金比例为{{item.twoRoyalty || 0}}%</p>
                </div>
              </swiper-item>
            </swiper>
          </div>
        </div>
      </div>
      <div class="center_mask" v-if="applyForShow" @click="applyForShow = false">
        <div class="w290 h231 bgfff bradius5 disflex flex-column align-cen">
          <img :src="applyForImg" class="w170 h114 pt35 mb25">
          <p class="c78 fs14">您的申请正在审核中请耐心等待</p>
        </div>
      </div>  
    </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
import topbg from '../components/top_bg'
export default {
  components:{
    topbg
  },
  data(){
    return {
      //设置头部需要的参数
      title:'访客详情',
      navHeight: 0,
      statusBarHeight: 0,
      navBarUserHeight:0,
      applyForImg:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/img_applyfor%402x.png',
      LevelIcon1:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/icon_Level1.png',
      LevelIcon2:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/icon_Level2.png',
      money_icon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/ic_rules_money@2x.png',
      order_icon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/ic_rules_order@2x.png',
      orderb_icon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/ic_rules_orderb@2x.png',
      share_icon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/ic_rules_share@2x.png',
      sharea_icon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/ic_rules_sharea@2x.png',
      img:'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-stand/photo/20190427/1556345724608.jpg',
      user:{
        status:1,
        type:1
      },
      money:0,
      applyForShow:false,
      indicatorDots: true,
      autoplay: false,
      interval: 2000,
      duration: 500,
      distributorData:'', //分销员数据
      currentLevel:'', //当前等级
    }
  },
  created() {
    this.calculateNavBarHeight()

  },
  mounted() {
    this.getdistributorApp()
  },
  computed:{
    // position(){
    //   let positon = '初级分销员'
    //   if(this.user.status == 1){
    //     positon = '初级分销员'
    //   }else if(this.user.status == 2){
    //     positon = '中级分销员'
    //   }else if(this.user.status == 3){
    //     positon = '钻石分销员'
    //   }
    //   return positon
    // },
  },
  methods:{
    //计算高度
    calculateNavBarHeight() {
      if (getApp().globalData.menuButtonBounding === 0) {
        getApp().globalData.menuButtonBounding = wx.getMenuButtonBoundingClientRect();
      }
      let menuButtonBounding = getApp().globalData.menuButtonBounding;
      console.log(menuButtonBounding)
      wx.getSystemInfo({
        success: res => {
          let statusBarHeight = res.statusBarHeight; //胶囊按钮与顶部的距离
          let navHeight =
            statusBarHeight +
            (menuButtonBounding.top - statusBarHeight) * 2 +
            menuButtonBounding.height; //导航高度
          let navBarUserHeight = navHeight - statusBarHeight;
          this.navHeight = navHeight ;
          this.statusBarHeight = statusBarHeight  + "px";
          wx.setStorageSync('navTop',this.navTop)
          this.navBarUserHeight = navBarUserHeight + "px";
        },
        fail(err) {
          console.log(err);
        }
      });
    },
    //查询分销规则
    getdistributorApp(){
       wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        companyId:wx.getStorageSync('COMPANYID'),
        distributorUserId:wx.getStorageSync('userId')
      }
      WXAJAX.POST(data,'','/distributor/distributorApp')
      .then(data=>{
        wx.hideLoading()
        console.log(data)
        this.distributorData = data
        data.royaltyResponseList.forEach((v,k) => {
          if(data.royaltyId ==  v.royaltyId){
            this.currentLevel =  v
          }
        });
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
    applyFor_tap(){
      if(this.user.type == 1){
        this.applyForShow = true
      }else{

      }
    },
    goBack(){
      wx.navigateBack({
        delete:1
      })
    }
  }
};
</script>
<style scoped>
.distribution_box {
  flex: 1;
  overflow: auto;
}
.scrollbar ::-webkit-scrollbar{
  display: none;
}
.distribution_status{
  right: 0;
  top: 30upx;
  font-size: 28upx;
  padding: 7upx 25upx 7upx 25upx;
  background: #51CBCD;
  border-radius:30upx 0 0 30upx;
}
.bg_distributionLevel_blue{
  background:#E5F8F7
}
.level_radius{
  position: relative;
  top:-14upx;
  left: -14upx;
  width: 40upx;
  height: 40upx;
  background: #DCF5F5;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.level_small_radius{
  position: relative;
  top:-1upx;
  left: -4upx;
  width: 20upx;
  height: 20upx;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
