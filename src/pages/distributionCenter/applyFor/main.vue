<template>
    <div class="posre h100p">
      <topbg :statusBarHeight="statusBarHeight"
             :navBarUserHeight="navBarUserHeight"
             :title="'申请成为分销员'"></topbg>
      <div class="pl15 pr15 disflex hidden_scroll flex-column borderbox h100p" :style="{paddingTop:navHeight + 6 + 'px'}">
        <div class="distribution_box">
          <!-- header -->
          <div class="bradius15 h88 borderbox pl20 pr20 shadow_gray bgfff posre mb10"> 
              <p class="ca8 fs14 lh44">申请的商家<span class="ml10 cblue">{{vendorName || ''}}</span></p>
              <p class="ca8 fs14 lh44" v-if="userId">您的邀请人<span class="ml10 c38">{{inviterName || ''}}</span></p>
          </div>

          <div class="bradius15 pl20 pr20 pt20 pb20 shadow_gray bgfff posre mb10"> 
            <div class="disflex">
              <img :src="avatarUrl" class="w50 h50 bradius5 mr10">
              <div class="disflex flex-column jsbet">
                <p class="fs18 c38 fbold">{{name}}</p>
                <div class="bradius10 fs12 ca2 pt3 pb3 pl8 pr8 bgf8">联系方式：{{phone || '暂无'}}</div>
              </div>
            </div>
          </div>

          <div>
            <p class="ca8 fs12 lh18">提示：</p>
            <p class="ca8 fs12 lh18">1、分销员申请通过后，产生分销佣金后商家将会直接把分销佣金打入微信零钱包，请确保个人微信支付已开通。</p>
            <p class="ca8 fs12 lh18">2、审核时间一般在0-3个工作日，请耐心等待。</p>
            <p class="ca8 fs12 lh18">3、审核结果请在“分销中心”查看。</p>
          </div>

        </div>
      </div>
      <div class="apply_bottom disflex w100p h49">
        <div class="w50p lh49 textc ca8 fs18 bgfff" @click="goBack">取消</div>
        <div class="bgblue w50p lh49 textc cfff fs18" @click="applyFor">申请</div>
      </div>
      <!-- 弹窗 -->
      <!-- <div class="center_mask" v-if="applyForShow" @click="applyForShow = false">
        <div class="w290 bgfff bradius5 disflex flex-column align-cen">
          <div class="felx1 textc pt25 pb28">
            <p class="fs18 fbold c38 mb20">提示</p>
            <p class="fs14 c78 lh22">您已通过申请，<br>快去分享商品给小伙伴吧！</p>
          </div>
          <div class="w100p h44 bgblue lh44 textc fs18 cfff">确认</div> 
        </div>
      </div>   -->
      <promptBox :applyForShow="applyForShow"
                 @prompt_box_tap="prompt_box_tap"
                 @confirm_tap="confirm_tap"
                 type='1'></promptBox>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
import topbg from '../components/top_bg'
import promptBox from '../components/prompt_box'

export default {
  components:{
    topbg,
    promptBox
  },
  data(){
    return {
      navHeight: 0,
      statusBarHeight: 0,
      navBarUserHeight:0,
      img:'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-stand/photo/20190427/1556345724608.jpg',
      avatarUrl:wx.getStorageSync('avatarUrl'),
      phone:wx.getStorageSync('phone'),
      name:wx.getStorageSync('USERNAME'),
      money:0,
      applyForShow:false,
      vendorName:'', //商家名称
      inviterName:'', //邀请人姓名
      companyId:wx.getStorageSync('inviteArr').companyId || '', //公司id
      inviteeUserId:wx.getStorageSync('userId') || '', //被邀请人id
      userId:wx.getStorageSync('inviteArr').userId || '' //邀请人Id
    }
  },
  created() {
    this.calculateNavBarHeight()
    this.getVendorName()
    this.getInviterName()
    this.addInvitationRecord()
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
    //获取申请商家名称
    getVendorName(){
      let cardId = wx.getStorageSync('CARDID')
      let inviteCardId = wx.getStorageSync('inviteArr').cardId || ''

      if(inviteCardId && cardId == inviteCardId){
        cardId = inviteCardId
      }
      WXAJAX.POST({
        cardId:cardId
      },'','/businessCard/cardDetails')
      .then(data=>{
        this.vendorName = data.companyName
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
    //获取邀请人姓名
    getInviterName(){
      let cardId = wx.getStorageSync('CARDID')
      let inviteCardId = wx.getStorageSync('inviteArr').cardId || ''
      if(inviteCardId && cardId == inviteCardId){
      }else{
        return
      }
      WXAJAX.POST({
        userId:wx.getStorageSync('inviteArr').userId
      },'','/businessCard/getUserInfoDetail')
      .then(data=>{
        this.inviterName = data.name
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
    //添加邀请记录
    addInvitationRecord(){
      let data = {
        companyId:this.companyId,
        inviteeUserId:this.inviteeUserId,
        userId:this.userId
      }
      if(!this.userId || !this.inviteeUserId || !this.companyId){
        return
      }
      if(data.inviteeUserId == data.userId){
        return
      }
      WXAJAX.POST(data,'','/distributor/addInvitationRecord')
      .then(data=>{
        console.log(1111)
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
    applyFor(){
       wx.showLoading({
        title:'加载中',
        mask:true
      })
      // let SELFCOMPANYID = wx.getStorageSync('SELFCOMPANYID');
      // if(!SELFCOMPANYID){
      //   return wx.showToast({
      //     title:'请先创建名片哦',
      //     icon:'none'
      //   })
      // }
      let currentCompanyId = wx.getStorageSync('COMPANYID') || ''
      let inviteCompanyId = this.companyId
      let inviteUserId =  this.userId
      // if(currentCompanyId !== inviteCompanyId){
      //   inviteUserId = ''
      // }
      
      
      let data = {
        companyId:currentCompanyId,//公司id
        distributorUserId:wx.getStorageSync('userId'), //受邀请人
        inviteUserId:inviteUserId //邀请人
      } 
      
      

      // let data = {
      //   companyId:wx.getStorageSync('COMPANYID'), 
      //   distributorUserId:wx.getStorageSync('userId'),
      //   inviteUserId:wx.getStorageSync('inviteArr').userId || '' 
      // }
      WXAJAX.POST(data,'','/distributor/addDistributorApp')
      .then(data=>{
        console.log(data)
        if(data.isTurnOn){
          wx.showToast({
            title:'申请发送成功！'
          })
          this.applyForShow = true
        }else{
          wx.navigateTo({
            url:'../product/main'
          })
        }
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
      
    },
    prompt_box_tap(){
      this.applyForShow = false
    },
    confirm_tap(type){
      console.log(type)
      if(this.type == 'back'){
        uni.navigateBack({
          delta:1 
        })
        this.applyForShow = false
        return
      }
      this.applyForShow = false
      setTimeout(function(){
        wx.navigateTo({
          url:'../product/main'
        })
      },500)
    },
    goBack(){
      wx.navigateBack({
        delta:1
      })
    },
  },
  onUnload(){
    let isLogin = wx.getStorageSync('isLogin')
    if(isLogin){
      wx.removeStorageSync('inviteArr')
    }
  }
};
</script>

<style scoped>
.distribution_box {
  flex: 1;
  overflow: auto;
}
.apply_bottom{
  position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1;
}
</style>
