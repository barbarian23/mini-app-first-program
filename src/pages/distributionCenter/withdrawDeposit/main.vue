<template>
  <div class="posre">
    <!-- 佣金 -->
    <div class="pt10 bgfff">
      <div class="h44 disflex align-end pb8 pl15">
        <p class="fs16 c38 fbold">提现到当前微信钱包</p>
      </div>
      <div class="disflex align-cen pt8 ml15 mr15 fs14 c78 bbF2F3F4 jsbet withdraw_deposit_box">
        <div class="disflex h60 align-cen">
          <p class="fs21 c18 mr10">￥</p>
          <input type="digit" class="fs21 c38" name="" v-model="money" :placeholder="textCash">
        </div>
        <img :src="delImg" @click="del_tap" class="w20 h20">
      </div>
      <div class="pl15 pr15 disflex h53 jsbet align-cen">
        <p class="fs14 c38">可提现余额￥{{amount}}</p>
        <p class="fs14 cblue" @click="money = amount">全部提现</p>
      </div>
    </div>
    <div class="mt20 ml15 mr15 mb10 bg_line_blue flex-c-c bradius5 fs18 cfff h44" @click="submit_tap">
      提现
    </div>
    <div class="flex-c-c">
      <img :src="questionImg" class="w16 h16 mr8">
      <p class="fs12 ca8">一般两个工作日内到账，微信将会收取0.1%手续费</p>
    </div>
    <promptBox :applyForShow="applyForShow"
               @prompt_box_tap="prompt_box_tap" 
                type='2'></promptBox>
    <div class="center_mask" v-if="isSucceed" @click="withdraw_tap()">
      <div class="w290 h290 disflex flex-column align-cen bgfff bradius10 pt40 borderbox">
        <img :src="cashImg" class="w93 h93 mb20">
        <p class="fs18 c38 fbold mb20">提现成功</p>
        <div class="w210 disflex flex-column">
          <div class="disflex jsbet fs14 c78 mb10">
            <p>提现金额</p>
            <p class="corange">{{money}}</p>
          </div>
          <div class="disflex jsbet fs14 c78 mb10">
            <p>提现账户</p>
            <p>微信账户</p>
          </div>
          <div class="disflex jsbet fs14 c78">
            <p>当前余额</p>
            <p>{{ balance}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
import promptBox from '../components/prompt_box'
export default {
  components:{
    promptBox
  },
  data(){
    return {
      amount:0,
      money:'',
      delImg: WXAJAX.imgBackUrl +'/yimai_photos/distributionCenter/ic_del@2x.png',
      questionImg: WXAJAX.imgBackUrl +'/yimai_photos/distributionCenter/ic_question@2x.png',
      cashImg: WXAJAX.imgBackUrl +'/yimai_photos/distributionCenter/img_cash_s@2x.png',
      isSucceed:false ,//提款是否成功
      cashAmount:0
    }
  },
  onLoad(options){
    console.log(options)
    this.amount = options.amount
    this.querySetting()
  },
  created() {
    

  },
  computed:{
    balance(){
      if(this.amount && this.money){
        return (this.amount - this.money).toFixed(2)
      }
    },
    textCash(){
      return '不低于'+ this.cashAmount + '元'
    }
  },
  methods:{
    prompt_box_tap(){
      this.applyForShow = false
    },
    del_tap(){
      this.money = this.money.toString()
      if(this.money){
        this.money = this.money.slice(0,this.money.length-1)
      }
    },
    
    querySetting(){
      wx.showLoading({
        mask:true,
        title:'加载中'
      })
      let companyId = wx.getStorageSync('COMPANYID')
      WXAJAX.POST({
        companyId:companyId,
      },'','/distributor/querySetting') 
      .then(data=>{
        wx.hideLoading()
        console.log(data)
        this.cashAmount = data.cashAmount
      })
      .catch(err => {
        console.log("申请错误：", err);
      });

    },
    submit_tap(){
      if(this.money > this.sum){
        uni.showToast({
          title:'您的账户余额小于提现金额，请重新输入',
          icon:'none'
        })
        return
      }
      if(this.money < this.cashAmount){
        uni.showToast({
          title:'提现金额小于最低提现额度，请重新输入',
          icon:'none'
        })
        return
      }
      wx.showLoading({
        mask:true,
        title:'加载中'
      })
      let companyId = wx.getStorageSync('COMPANYID')
      let userId = wx.getStorageSync('userId')
      WXAJAX.POST({
        companyId:companyId,
        approvalUserId:userId,
        amount:this.money
      },'','/distributor/addWithdraw')
      .then(data=>{
        wx.hideLoading()
        this.isSucceed = true
      })
      .catch(err => {
        console.log("申请错误：", err);
      });

    },
    withdraw_tap(){
      this.isSucceed = false
      wx.navigateBack({
        delta:1
      })
    }
  }
};
</script>
<style>
page{
  background: #f5f5f6;
}
</style>
<style scoped>
.withdraw_deposit_box input:-ms-input-placeholder{
  color: #e8e8e8;
}
</style>
