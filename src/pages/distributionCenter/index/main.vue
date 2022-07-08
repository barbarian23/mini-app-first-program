<template>
    <div class="posre h100p">
      <topbg :statusBarHeight="statusBarHeight"
             :navBarUserHeight="navBarUserHeight"
             :title="'分销中心'"></topbg>
      <div class="pl15 pr15 disflex flex-column borderbox h100p scrollbar" :style="{paddingTop:navHeight + 6 + 'px'}">
        <div class="distribution_box">
          <!-- header -->
          <div class="bradius15 pl20 pr20 pt20 pb20 shadow_gray bgfff posre mb10"> 
            <div class="disflex pb15 bbf5f6">
              <img :src="avatarUrl" class="w50 h50 bradius5 mr10">
              <div class="disflex flex-column jsbet">
                <p class="fs18 c38 fbold">{{name}}</p>
                <div class="bradius10 fs12 ca2 pt3 pb3 pl8 pr8 bgf8">{{distributorData.appStatus == 1 ? '所有分销员自己购买商品不会获得佣金哦' : '您还未成为分销员，快去申请赚佣金吧'}}</div>
              </div>
            </div>
            <div class="posab distribution_status">
              <p class="cfff" v-if="distributorData.appStatus !== 1" @click="applyFor_tap">发起申请</p>
              <p class="cfff distributor_name" @click="toDistributionLevel" v-else>{{currentLevel.lavelName}}</p>
            </div>
            <p class="fs12 cblue pt15" @click="toDistributionLevel">升级分销等级可获得更多佣金，去看看商家升级规则吧！</p>
          </div>
          <!-- earnings -->
          <div class="pt20 pb20  shadow_gray bgfff posre bradius15 flex-sb-c flex-column mb10">
            <div class="earnings flex-sa-c">
              <div>
                <p class="fs24 fbold textc cblue mb10">{{distributorData.sumIncome || 0.00}}</p>
                <p class="fs14 ca8">当前累计收益(元)</p>
              </div>
            </div>
            <p class="fs12 c38 mt8 fbold mb15">包含待结算{{distributorData.settlement || 0.00}}元</p>
            <div class="w65p flex-sb-c">
              <div class="disflex flex-column align-cen">
                <p class="c78 fs12 mb15">昨日收益</p>
                <p class="corange fbold fs15">{{distributorData.yesIncome || 0.00}}</p>
              </div>
              <div class="disflex flex-column align-cen">
                <p class="c78 fs12 mb15">昨日下单(数)</p>
                <p class="corange fbold fs15">{{distributorData.yesOrderNum || 0}}</p>
              </div>
            </div>
          </div>

          <div class="pt20 pb20 pl20 pr20 shadow_gray bgfff posre bradius15 flex-sb-c align-cen mb10" @click="page_tap('settlement')">
            <p class="fs16 fbold c38">可提现佣金<span class="corange ml5"> {{ distributorData.withdraw || 0.00}}元</span></p>
            <p class="fs16 cblue">立即提现</p>
          </div>

          <div class="pt20 pb20 pl28 pr28 shadow_gray bgfff posre bradius15 flex-sb-c mb10">
            <div class="disflex flex-column" @click="page_tap('order')">
              <p class="textc cblue fs24 fbold mb10">{{distributorData.orderNum || 0}}</p>
              <p class="textc fs14 c78 mb25">推广订单</p>
              <div class="w116 h39 cfff flex-c-c bgblue bradius5 posre" @click.stop="page_tap('product')">
                推广商品
                <img :src="commissionIcon" class="w43 h24 distribution_icon">
              </div>
            </div>
            <div class="disflex flex-column" @click="page_tap('invite')">
              <p class="textc cblue fs24 fbold mb10">{{distributorData.invitesNum || 0}}</p>
              <p class="textc fs14 c78 mb25">累计邀请</p>
              <div class="w116 h39 cfff flex-c-c bgblue bradius5 posre" @click.stop="page_tap('code')">
                邀请好友
                <img :src="extendIcon" class="w43 h24 distribution_icon">
              </div>
            </div>
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
      commissionIcon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/img_news_y@2x.png',
      extendIcon:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/img_news_r@2x.png',
      applyForImg:WXAJAX.imgBackUrl + '/yimai_photos/distributionCenter/img_applyfor%402x.png',
      avatarUrl:wx.getStorageSync('avatarUrl'),
      name:wx.getStorageSync('USERNAME'),
      distributorData:'', //分销员数据
      currentLevel:'', //当前等级
      applyForShow:false
    }
  },
  created() {
    this.calculateNavBarHeight()

  },
  onShow(){
    this.getdistributorApp()
  },
  mounted() {
    
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
        data.sumIncome = data.sumIncome.toFixed(2)
        data.settlement = data.settlement.toFixed(2)
        data.yesIncome = data.yesIncome.toFixed(2)
        data.withdraw = data.withdraw.toFixed(2)
        this.distributorData = data
        data.royaltyResponseList.forEach(v => {
          if(data.royaltyId ==  v.royaltyId){
            //console.log()
            this.currentLevel =  v
          }
        });
        console.log(this.currentLevel)
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
    applyFor_tap(){
      if(this.distributorData.appStatus){
        if(this.distributorData && !this.distributorData.royaltyId &&  (this.distributorData.appStatus !== 2 ||  this.distributorData.appStatus !== 3) ){
          return this.applyForShow = true
        }
      }
      wx.navigateTo({
        url:'../applyFor/main'
      })
    },
    toDistributionLevel(){
      if(this.distributorData.appStatus !== 1){
        wx.navigateTo({
          url:'../applyFor/main'
        })
        return
      }
      wx.navigateTo({
        url:'../distributionLevel/main'
      })
    },
    goBack(){
      wx.navigateBack({
        delete:1
      })
    },
    page_tap(type){
      if(this.distributorData.appStatus !== 1){
       wx.navigateTo({
          url:'../applyFor/main'
        })
      return
      }

      if(type == 'product'){
        wx.navigateTo({
          url:'../product/main'
        })
      }else if(type == 'order'){
        wx.navigateTo({
          url:'../orders/main'
        })
      }else if(type == 'invite'){
        wx.navigateTo({
          url:'../invite/main'
        })
      }else if(type == 'settlement'){
        wx.navigateTo({
          url:'../settlement/main'
        })
      }else{
        wx.navigateTo({
          url:'../invitePhoto/main'
        })
      }
    }
  }
};
</script>
<style>

</style>
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
.earnings{
  height: 345upx;
  width: 380upx;
  background-image:url('https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/distributionCenter/img_money%402x.png');
  background-size:100%;/*按比例缩放*/
  /*background-size: 100px 100px;!*这个是按数值缩放*!*/
  background-repeat: no-repeat;/*还有repeat-x,y等*/
}
.distribution_icon{
  position: absolute;
  right: -21upx;
  top: -21upx;
}
.distributor_name{
  
}
</style>
