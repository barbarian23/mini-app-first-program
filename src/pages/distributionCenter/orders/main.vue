<template>
  <div>
    <div class="disflex h115 bgfff">
      <div class="w50p flex-c-c flex-column">
        <p class="fs18 corange fbold textc mb10">￥{{orderAmount.toFixed(2)}}</p>
        <p class="fs14 c78 textc">订单金额</p>
      </div>
      <div class="w50p flex-c-c flex-column">
        <p class="fs18 cblue fbold textc mb10">￥{{sumBalance}}</p>
        <p class="fs14 c78 textc" >所得佣金</p>
      </div>
    </div>
    <div v-if="orderList.length !== 0"> 
      <div class="h43 disflex  pl15 pr15 align-cen">
        <p class="fs14 c78">共{{orderList.length}}个商家</p>
      </div>
      <div class=" bgfff" 
           v-for="(items,index) in orderList" 
           :key="index"
           @click="unfold_tap(index,items)">
        <div class="h60 pl15 pr15 disflex jsbet align-cen bbf5f6">
          <p class="fs16 c38 fbold">{{items.companyName}}</p>
          <div class="disflex jsbet align-cen">
            <p class="fs16 c38 mr10">{{items.orderNum}}笔</p>
            <img :src="rightIcon" class="w10 h10 trans2" :class="items.isShow ? 'rotate90' : ''">
          </div>
        </div>
        <div class="bbf5f6 overhidden" v-if="items.isShow" @click.stop="">
          <div class="pt15 mb15 pr15 pl15">
            <div class="bgblue_2 disflex jsbet align-cen pl20 pr20 bblue h40 bradius20">
              <p class="fs14 cblue fbold">分销等级:初级分销员</p>
              <p class="fs14 cblue">总佣金金额<span class="corange fbold">{{companyOrderAmount}}</span></p>
            </div>
          </div>
          <div class="disflex w100p pl15 pr15 align-cen jsbet borderbox mb15" @click.stop="">
            <p class="fs14 c38 pl15">时间</p>
            <div class="w125 disflex jsbet">
              <div class="pl10 pr10 pt7 pb7 fs12 c78 " 
                  v-for="(item,index) in date" 
                  :key="index"
                  :class="type == item.type ? 'isSelect cblue trans2' : 'b1fff trans2'"
                  @click="date_tap(item.type)">
                近{{item.time}}天
              </div>
            </div>
          </div>

          <div class="pl30 pr30" @click.stop="">
            <div class=" pt20 pb20 bbf5f6 " 
                 v-for="(item,k) in goodsList" 
                 :key="k">
              <div class="disflex jsbet">
                <div class="disflex h60 align-cen">
                  <img :src="item.url" class="w50 h50 bradius5 mr10">
                  <div class="disflex h60 jsbet flex-column">
                    <p class="fs14 c38 fbold">{{item.goodsName}}</p>
                    <p class="fs12 c38">订单金额<span class="corange">￥{{' ' +  getMoney(item.orderPrice,true)}}</span></p>
                    <p class="fs12 c38">购买时间{{' ' + getTime(item.createTime)}}</p>
                  </div>
                </div>
                <div class="disflex jsbet flex-column align-end">
                  <p class="fs14 c38 mb2 fbold">佣金<span class="corange">￥{{' ' +  getMoney(item.commissionAmount)}}</span></p>
                  <p class="fs12 c38 buyer_name">购买者：{{' ' + item.nickeName}}</p>
                </div>
              </div>
              <div class="disflex flex-end mt5">
                <p class="pt3 pb3 pr9 pl9 cblue bblue bradius10 fs10 borderbox">{{item.level == 1 ? '一' : '二'}}级佣金订单</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="pt85 flex-c-c flex-column" v-else>
      <img :src="icon_nodata" class="w170 h170a mb10">
      <p class="textc fs12 ca2">
        暂无内容，快去分享推广吧
      </p>
    </div>

  </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'

export default {
  
  data(){
    return {
      date:[{
        time:7,
        type:2
      },{
        time:30,
        type:3
      }],
      type:2,
      orderList:[],
      rightIcon:WXAJAX.imgBackUrl + '/yimai_photos/user/right.png',
      icon_nodata:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/Icon_nodata.png',
      orderAmount:0,
      commissionAmount:0,
      companyOrderAmount:0,
      chooseCompany:'', //选择的公司 
      goodsList:[],
      sumBalance:0,
    }
  },
  created() {
    this.queryByPromoteOrder()
  },
  computed:{
    getTime(time){
      return function(time){
        return time = time.replace(/\s[\x00-\xff]*/g,'')
      }
    },
    getMoney(price,type){
      return function(price,type){
        if(type){
          return price = (price/100).toFixed(2)
        }else{
          return price = price.toFixed(2)
        }
      }
    }
  },
  mounted() {
    
  },
  methods:{
    date_tap(index){
      this.type = index
      this.queryByPromoteOrderDetail(this.chooseCompany)
    },
    unfold_tap(index,item){
      this.orderList.forEach((v,k)=>{
        if(index != k){
          v.isShow = false
        }
      })
      this.chooseCompany = item.companyId
      item.isShow = !item.isShow
      this.queryByPromoteOrderDetail(item.companyId)
    },
    queryByPromoteOrder(){
       wx.showLoading({
        title:'加载中',
        mask:true
      })
      let data = {
        companyId:wx.getStorageSync('COMPANYID'),
        ascriptionUserId:wx.getStorageSync('userId'),
        pageSize:100
      }
      WXAJAX.POST(data,'','/distributor/queryByPromoteOrder')
      .then(data=>{
        wx.hideLoading()
        this.orderList = data.pageInfo.list
        this.sumBalance = data.distributor.sumBalance
        this.orderList.forEach(v=>{
          this.orderAmount += v.orderAmount
          this.commissionAmount += v.commissionAmount
        })
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    },


    queryByPromoteOrderDetail(companyId){
      let data = {
        companyId:companyId,
        ascriptionUserId:wx.getStorageSync('userId'),
        pageSize:100,
        type:this.type
      }
      WXAJAX.POST(data,'','/distributor/queryByPromoteOrderDetail')
      .then(data=>{
        this.goodsList = data.pageInfo.list
        this.companyOrderAmount = data.distributor.sumBalance
      })
      .catch(err => {
        console.log("申请错误：", err);
      });
    }
    

  }
};
</script>
<style scoped>
.isSelect{
  border:1upx solid #51CDCB;
  border-radius: 30upx;
}
.hideFold{
  transition:all .2s;
  height: 0upx;

}
.showFold{
  transition:all .2s;
}
.buyer_name{
  width: 200upx;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  text-align: right;
}
</style>
