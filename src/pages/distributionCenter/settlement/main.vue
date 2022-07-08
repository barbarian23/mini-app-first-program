<template>
  <div class="posre">
    <div class="title-tabbar">
      <div class="column-title-box">
        <div class="column-title"
            :class="item.type == type ? 'title-active' : ''"
            v-for="item in titleList"
            :key="item"
            @click="selectColumn(item)">
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 佣金 -->
    <div v-if="type == 1">
      <div class="h115 flex-c-c flex-column">
        <p class="cblue fs24 fbold mb10">{{sumCommission}}</p>
        <p class="fs14 c78">合计佣金</p>
      </div>
      <div class="disflex align-cen pl15 fs14 c78 h43 bgf8" v-if="commissionList.length !== 0">
        共{{commissionList.length}}条数据
      </div>
      <div class="disflex align-cen pl15 fs14 c78 h43 bgf8" v-else>
        暂无订单
      </div>
      <div class="disflex borderbox h85 flex-column jsbet pl15 pt20 pr15 pb20 bbf8f8" 
           v-for="(item,index) in commissionList" 
           :key="index">
        <div class="disflex jsbet">
          <p class="fs14 c38 fbold">{{item.level == 1 ? '一' : '二'}}级订单：{{item.ordersNo}}</p>
          <p class="fs18 corange fbold">{{item.commissionAmount.toFixed(2)}}</p>
        </div>
        <div class="disflex jsbet">
          <p class="fs12 ca2">{{item.completeTime}}</p>
          <p class="fs12 ca2">{{item.status == 0 ? '结算中' : item.status == 1 ? '已结算' : '用户订单取消/退款，结算失败'}}</p>
        </div>
      </div>
    </div>  
    <!-- 结算  -->
    <div class="" v-if="type == 2">
      <div class="h115 disflex jsbet posre pt33 pl35 pr35 borderbox">
        <div class="disflex flex-column borderbox">
          <p class="cfff fs14 mb10">可提现金额(元)</p>
          <p class="fs20 fbold cfff">{{withdrawAmount}}</p>
        </div>
        <div class="w72 h30 bgfff bradius15 flex-c-c cblue fs16 fbold" @click="extract_commission_tap">
          提现
        </div>
        <img :src="cashImg" class="w100p h100p bg">
      </div>
      <div class="disflex align-cen pl15 fs14 c78 h43 bgf8" v-if="withdrawList.length !== 0">
        提现记录
      </div>
      <div class="disflex align-cen pl15 fs14 c78 h43 bgf8" v-else>
        暂无提现记录
      </div>
      <div class="disflex borderbox h85 jsbet pl15 pt20 pr15 pb20 bbf8f8" 
          v-for="(item,index) in withdrawList" 
          :key="index">
        <div class="disflex flex-column jsbet">
          <p class="fs14 c38 fbold">提现到当前微信钱包</p>
          <p class="fs12 ca8">{{item.createdTime}}</p>
        </div>
        <div class="disflex align-cen">
          <p class="c38 fbold">-{{item.amount.toFixed(2)}}元</p>
        </div>
      </div>
      
      

    </div>
    <promptBox :applyForShow="applyForShow"
                @prompt_box_tap="prompt_box_tap"
                @confirm_tap="confirm_tap"
                type='2'></promptBox>
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
      titleList: [
        {
          name: "佣金",
          type:1
        },
        {
          name: "预约提现",
          type:2
        }
      ],
      type:1,
      applyForShow:false,
      orderStatus:[{
        type:2,
        title:465321876132131,
        sum:132.132,
        status:1,
        time:1605669206000
      },{
        type:1,
        title:465321876132131,
        sum:412.132,
        status:2,
        time:1605669206000
      },{
        type:1,
        title:465321876132131,
        sum:12.132,
        status:2,
        time:1605669206000
      }],
      cashImg: WXAJAX.imgBackUrl +'/yimai_photos/distributionCenter/img_cash@2x.png',
      commissionList:'',
      withdrawList:'', //提现记录
      withdrawAmount:'', //提现金额
      pages:1,
      isLoading:true,
      sumCommission:0.00
    }
  },
  created() {
    this.queryMyCommissionRecrod()
  },
  onShow(){
    this.pages = 1
    this.commissionList = []
    this.withdrawList = []
    this.queryMyCommissionRecrod()
  },
  onReachBottom(){
    this.queryMyCommissionRecrod()
  },
  computed:{
    //佣金总计
    commissionaAmount(){
      let number = 0
      if(this.commissionList){
        this.commissionList.forEach(v=>{
          if(v.status == 1){
            number += Number(v.commissionAmount)
          }
        })
        return number.toFixed(2)
      }
    }
  },
  methods:{
    selectColumn(item){
      this.pages = 1
      this.isLoading = true
      this.commissionList = []
      this.type = item.type
      this.queryMyCommissionRecrod()
    },
    prompt_box_tap(){
      this.applyForShow = false
    },
    confirm_tap(){
      wx.navigateTo({
        url:'../product/main'
      })
      this.applyForShow = false
    },
    //提现
    extract_commission_tap(){
      if(this.withdrawAmount <= 0){
        this.applyForShow = true
      }else{
        uni.navigateTo({
          url:`../withdrawDeposit/main?amount=${this.withdrawAmount}`
        })
      }
    },
    //查询佣金、提现金额
    queryMyCommissionRecrod(){
      let url = ''
      let than = this
      
      
      if(!than.isLoading){
        return
      }
      than.isLoading = false
       wx.showLoading({
        title:'加载中',
        mask:true
      })
      //判断是佣金还是预约提现
      let data = {}
      if(than.type == 1){
        url = '/distributor/queryMyCommissionRecrod'
        data = {
          companyId:wx.getStorageSync('COMPANYID'),
          recipientUserId:wx.getStorageSync('userId'),
          pageNum:than.pages
        }
      }else{
        url = '/distributor/queryMyWithdrawRecrod'
        data = {
          companyId:wx.getStorageSync('COMPANYID'),
          userId:wx.getStorageSync('userId'),
          pageNum:than.pages
        }
      }
      WXAJAX.POST(data,'',url)
      .then(data=>{
        wx.hideLoading()
        if(data && data.pageInfo){
          if(than.type == 1){
            than.commissionList = [...than.commissionList, ...data.pageInfo.list]
            than.sumCommission = data.sumCommission
          }else{
            than.withdrawAmount = data.withdrawAmount.toFixed(2)
            than.withdrawList = [...than.commissionList, ...data.pageInfo.list] || ''
          }
          than.pages++ 
          setTimeout(function(){
            than.isLoading = true
          },1000)
        }
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },
  }
};
</script>
<style>
page{
  background: #ffffff;
}
</style>
<style scoped>
/* 头部切换 */
.title-tabbar {
  height: 88upx;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  box-sizing: border-box;
  align-items: center;
  padding: 0 30upx;
}
.column-title-box {
  box-sizing: border-box;
  width: 448upx;
  height: 78upx;
  display: flex;
  background-color: #f8f8f8;
  border: 1upx solid #e8e8e8;
  border-radius: 39upx;
}
.column-title {
  transition: all 0.4s;
  width: 224px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a2a0a0;
  border-radius: 39upx;
}
.title-active {
  transition: all 0.4s;
  color: #ffffff !important;
  background-color: #51cdcb;
}
.bg{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
}
</style>
