<template>
  <div class="borderbox bgfff" :style="{paddingTop:navHeight}">
    <div  class="borderbox bgfff fix_top" :style="{height:navHeight,paddingTop:navTop}" >
      <div class="disflex align-cen h100p pl20">
        <div class="disflex align-cen h100p w30" @click="goback">
           <img :src="leftIcon" class="w16 h18">
        </div>
        <div class="fs20 c38 fbold mr20" 
             :class="tabType == 1 ? 'active' : 'title'" 
             @click="tab_type_tap(1)">{{ lang.text_7 }}</div>
        <div class="fs16 c38 fbold posre" 
             :class="tabType == 2 ? 'active' : 'title'" 
             @click="tab_type_tap(2)">通知
             <span class="float_number top_number_position" v-if="allLength">
               {{allLength}}
             </span>
        </div>
      </div>
    </div>
    <!--top-->

    <!--msg lists-->
    <template v-if="msgList.imList.length > 0 && tabType == 1">
      <div v-for="(msgitem,k) in msgList.imList"
           :key="k"
           class="">
        <MsgBox :msg="msgitem"
                :isImMsg="true"
                :istime="msgitem.newestMessage && msgitem.newestMessage.time"
                @row_tap="row_tap(msgitem.userId || '',msgitem.cardId || '',msgitem.logo || '',msgitem.name || '',msgitem.wxCode || '', msgitem.phone || '')">
        </MsgBox>
      </div>
    </template>
    <div class="" v-else-if="tabType == 2">
      <div class="bbf5f6">
        <div class="disflex jsbet h44 align-cen pl15 pr15">
          <div class="fs14 c78">{{ lang.text_8 }}</div>
          <div class="disflex align-cen">
            <img :src="icon4" class="w15 h15 mr7" alt="">
            <p class="fs14 cblue" @click="show_dialog_box">{{ lang.text_9 }}</p>
          </div>
        </div>
      </div>
      <div class="pl15 pr15">
        <!-- 审核通知 -->
        <div class="pl15 pr15 pt20 pb20 bbf5f6" v-if="checkList.length > 0">
          <div class="mb20">
            <div class="disflex jsbet align-cen">
              <div class="disflex align-cen posre">
                <img :src="icon1" class="w30 h30 mr11" alt="">
                <div class="fs18 c38 fbold">{{ lang.text_10 }}</div>
                <span class="float_number list_number_positon" v-if="checkLength">{{checkLength}}</span>
              </div>
              <p class="fs12 ca8">{{checkTime}}</p>
            </div>
          </div>
          <div class="msg_box  pt20 pr23 pb16 pl15 posre">
            <div class="disflex" v-for="(item,index) in checkList" :key="index">
              <div class="w4 h4 bgblue bradius50p mr7 mt13">
              </div>
              <div class="flex1 lh27 fs14 c38" @click="notification_tap(item,true)">
                您所发布的
                <span class="cblue">{{item.message}}</span>
                  {{item.decrit}}
              </div>
            </div>
            <div class="triangle">

            </div>
          </div>
        </div>
        <!-- 订单通知 -->
        <div class="pl15 pr15 pt20 pb20 bbf5f6" v-if="orderList.length > 0">
          <div class="mb20">
            <div class="disflex jsbet align-cen">
              <div class="disflex align-cen posre">
                <img :src="icon2" class="w30 h30 mr11" alt="">
                <div class="fs18 c38 fbold">{{ lang.text_11 }}</div>
                <span class="float_number list_number_positon" v-if="orderLength">{{orderLength}}</span>
              </div>
              <p class="fs12 ca8">{{orderTime}}</p>
            </div>
          </div>
          <div class="msg_box  pt20 pr23 pb16 pl15 posre">
            <div class="disflex" v-for="(item,index) in orderList" :key="index">
              <div class="w4 h4 bgblue bradius50p mr7 mt13">
              </div>
              <div class="flex1 lh27 fs14 c38" @click="notification_tap(item)">
                您所购买的
                <span class="cblue">{{item.message}}</span>
                  {{item.decrit}}
              </div>
            </div>
            <div class="triangle">
            </div>
          </div>
        </div>
        <div class="pt90 disflex flex-column jscen align-cen" v-if="orderList.length == 0 && checkList.length == 0 ">
          <img :src="icon_nodata" class="w170 h170">
          <span class="ca8 fs12 mt10">{{ lang.text_12 }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <NoData>{{ lang.text_13 }}</NoData>
    </div>
    <!-- <div class="textc disflex w60 h60 bradius50p bgblue disinblock back-btn"
         @click="page_turn('usercenter')">
      <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/user_add.png"
           alt=""
           class="w30 h30 mt15">
    </div> -->
    <div v-if="showDialog"> 
      <promptDialogBox
        :dialog_doc="dialog_doc"
        @dialogbox_tap="dialogbox_tap"
        @btn_tap="btn_tap" 
      ></promptDialogBox>
    </div>
  </div>
</template>

<script>
import NoData from "@/components/noData";
import store from "../../store/index";
import MsgBox from "@/components/msgBox"; // 订单项
import websocket from "../../utils/websocket";
import HandleLogin from "@/utils/handleLogin";
import { authSubscribeMessage } from "../../utils/auth.js";
import { mapGetters , mapState } from "vuex";
import WXAJAX from "../../utils/request";
import utils from "../../utils/index"
import promptDialogBox from "@/components/promptDialogBox"


export default {
  name: "",
  components: { MsgBox, NoData, promptDialogBox },
  computed: {
    ...mapGetters(["subscriptionNew"])
  },
  data() {
    return {
      page: 1,
      msg_lists: [
        // {
        //     isread:true,
        //     logo:'',
        //     name:'付鑫',
        //     status:'2',
        //     time:'18:20',
        //     text:'您好，我想了解一下壹脉智能名片'
        // },
        // {
        //     logo:'',
        //     name:'付鑫',
        //     status:'1',
        //     time:'18:20',
        //     text:'您好，我想了解一下壹脉智能名片'
        // },
      ],
      notice:[{
        title:'需求',
        isCheck:false
      },{
        title:'需求',
        isCheck:false
      },{
        title:'产品',
        isCheck:false
      },{
        title:'名片',
        isCheck:false
      }],
      navHeight:'',
      navBarUserHeight:'',
      navTop:'',
      leftIcon:WXAJAX.imgBackUrl + '/yimai_photos/crmAdd/Icon_back.png',
      tabType:1,
      icon1:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/ic_message_ demand@2x.png',
      icon2:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/ic_message_order@2x.png',
      icon3:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/ic_message_sales@2x.png',
      icon4:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/ic_clear@2x.png',
      icon_nodata:WXAJAX.imgBackUrl +'/yimai_photos/user/msg/Icon_nodata.png',
      scrollChange:false,
      notificationList:'',
      orderList:'', //订单时间
      checkList:'', //审核时间
      orderLength:0, //订单数量
      checkLength:0, //审核数量
      orderTime:'', //订单时间
      checkTime:'', //审核时间
      allLength:'',
      showDialog:false,
      dialog_doc:''
    };
  },
  /** tab点击 */
  onTabItemTap(item) {
    //订阅授权 信息相关
    authSubscribeMessage(this.subscriptionNew);
  },
  onShow() {
    HandleLogin.isLoginAndShowModal(() => {
      //登录了后查询聊天记录
      websocket.sendSocketJSON("108", this.page);
    });
    if (!wx.getStorageSync("token")) {
      wx.setStorageSync("redirectPage", "/pages/msg/main");
      wx.reLaunch({ url: "/pages/cardCase/main" });
      return;
    }
    websocket.sendSocketJSON("1011");
    //websocket.sendSocketJSON("108",1);
  },
  mounted() {
    wx.setNavigationBarTitle({
      title: "消息"
    });
    this.calculateNavBarHeight()
    console.log(store.state)
  },
  watch:{
    'msgCont': {
      deep: true,
      immediate: true,
      handler(value) {
        console.log('22222', value)
        this.notificationList = value.notificationList
        if(!this.notificationList){
          return
        }
        this.checkFilter()
        this.orderFilter()
        
        // this.dynamicFilter()
      }
    },
  },
  computed: {
    msgList() {
      console.debug("store接收的消息+++", store.state.msgList.msglist);
      return store.state.msgList.msglist;
    },
    noticeList(){
      return this.notice.slice(0,3)
    },
    ...mapState(['msgCont']),
  },
  async onPullDownRefresh() {
    websocket.sendSocketJSON("108", this.page);
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  },
  onReachBottom() {
    if(this.tabType == 2){
      return
    }
    this.page++;
    websocket.sendSocketJSON("108", this.page);
  },
  methods: {
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
    checkFilter(){
      let unreadLength = ''
      let orderList = []
      let arr = this.notificationList
      for(var i in arr){
        if(arr[i].noticeType == 1 || arr[i].noticeType == 8 || arr[i].noticeType == 9){
          arr[i].toPages = '../webSiteControl/userList/main';
          orderList.push(arr[i])
          switch(arr[i].noticeType){
              case 1 :
                arr[i].toPages = '../contactsMarket/index/main';
                arr[i].message = '名片';
                arr[i].decrit = "已经通过审核了，快去看看吧";
  ;                break;
              case 8 :
                arr[i].toPages = '../demandSquare/index/main?type=2';
                arr[i].message = '产品';
                arr[i].decrit = "已经通过审核了，快去看看吧";
                break;
              case 9 :
                arr[i].toPages = '../demandSquare/index/main';
                arr[i].message = '需求';
                arr[i].decrit = "已经通过审核了，快去看看吧";
                break; 
              default:
                break;
            }
        }
      }
      orderList = orderList.reverse() 
      unreadLength = orderList.filter( v=>{
        return v.type == 0
      })
      console.log(orderList)
      if(orderList.length > 0){
        this.checkTime = utils.getdateA(orderList[0].time,'monthTime')
      }
      this.checkLength = unreadLength.length
      this.checkList = orderList.slice(0,3)
    },
    orderFilter(){
      let orderLists = []
      let unreadLength = ''
      let arr = this.notificationList
      //判断是否已读
      for(var i in arr){
        if(arr[i].noticeType == 2 || arr[i].noticeType == 10){
          orderLists.push(arr[i])
          if(arr[i].noticeType == 2){
            switch(arr[i].status){
              case 1 :
                arr[i].toPages = '../orderLists/main';
                arr[i].decrit = "商品已被下单，快去看看吧";
                break;
              case 2 :
                arr[i].toPages = '../orderLists/main';
                arr[i].decrit = "商品已发货，快去看看吧";
                break;
              case 3 :
                arr[i].toPages = '../orderLists/main';
                arr[i].decrit = "商品处于待收货状态，快去看看吧";
                break;  
              case 4 :
                arr[i].toPages = '../orderLists/main';
                arr[i].decrit = "商品订单已完成，快去看看吧";
                break;
              case 5 :
                arr[i].toPages = '../orderLists/main';
                arr[i].decrit = "商品交易已取消，快去看看吧";
                break;
              default:
                break;
            }
          }else if(arr[i].noticeType == 10){
            arr[i].toPages = '../orderLists/main';
            arr[i].decrit = "商品已退款成功，快去看看吧";
          }
        }
      }
      orderLists = orderLists.reverse() 
      unreadLength = orderLists.filter( v=>{
        return v.type == 0
      })
      if(orderLists.length > 0){
        this.orderTime = utils.getdateA(orderLists[0].time,'monthTime')
      }
      //消息总数
      this.allLength = this.orderLength+ this.checkLength
      if(this.allLength >= 100){
        this.allLength = 99
      }
      if(this.allLength){
        this.dialog_doc = '此操作会将未读的通知提示全部标记为已读'
      }else{
        this.dialog_doc = ''
        }
      this.orderLength = unreadLength.length
      this.orderList = orderLists.slice(0,3)
    },
    
    tab_type_tap(type){
      this.tabType = type
    },
    page_turn(url) {
      wx.reLaunch({ url: "../" + url + "/main" });
    },
    row_tap(id, cardid, logo, name, wxCode, phone) {
      console.log(111111)
      console.log(id)
      console.log(cardid)
      if(id && cardid){
        wx.navigateTo({
          url:
            "../IM/main?userId=" +
            id +
            "&logo=" +
            logo +
            "&type=2&cardId=" +
            cardid +
            "&name=" +
            name +
            "&wxCode=" +
            wxCode +
            "&phone=" +
            phone
        });
      }
    },
    notification_tap(item,type){
      if(type == true){
        this.checkList.forEach(v => {
            websocket.updateStatus({
              code:1012,
              targetId:v.companyId,
              noticeType:v.noticeType
            })
        })
        wx.navigateTo({
          url:item.toPages
        })
      }else{
        let param = {
          code:1012,
          targetId:item.companyId,
          noticeType:item.noticeType
        }
        websocket.updateStatus(param)
        wx.navigateTo({
          url:item.toPages
        })
      }
      
    },
    show_dialog_box(){
      this.showDialog = true
    },
    //设置消息读取弹框显隐
    dialogbox_tap(){
      this.showDialog = false
    },
    //设置消息全部已读
    btn_tap(){
      websocket.sendSocketJSON('1012')
      wx.showLoading({
        title:'清理中...',
        mask:true
      })
      setTimeout(function(){
        websocket.sendSocketJSON('1011')
        wx.hideLoading()
      },1000)
      
      this.showDialog = false
    }, 
    goback(){
      uni.navigateBack({
        delta:1
      })
    }
  }
};
</script>
<style>
page{
  background: #ffffff;
}
</style>
<style scoped>
.back-btn {
  position: fixed;
  bottom: 40upx;
  right: 40upx;
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
.msg_box{
  background: #F5F5F6;
  border-radius: 10upx;
}
.triangle{
  position: absolute;
  left: 15upx;
  top: -19upx;
  width: 0;
  height: 0;
  border-width: 0 20upx 20upx;
  border-style:solid;
  border-color: transparent transparent #F5F5F6;
}
.float_number{
  position: absolute;
  display: block;
  width: 30upx;
  height: 30upx;
  background: #FD634E;
  border-radius: 50%;
  font-size: 18upx;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  
}
.list_number_positon{
  top: -15upx;
  left: 40upx;
}
.top_number_position{
  top: -5upx;
  left: 65upx;
}
</style>
