<script>
import HandleWebsocket from './utils/websocket'
import utils from './utils';
import WXAJAX from '@/utils/request'
import HandleLogin from '@/utils/handleLogin'
import { openShare } from '@/utils/behavior'
import { mapState,mapMutations } from "vuex";
export default {
  globalData: {
    menuButtonBounding: 0, // wx.getMenuButtonBoundingClientRect(), // 胶囊控件，iphone 6中，该值在第一次获取没有问题，但是后面获取就为0了，所以第一次获取后，将次存下来
    navHeight: 0, // 导航的高度(胶囊控件加上状态栏所有的高度)
  },
  computed: {
    ...mapState({
      isLogin: state => {
        return state.isLoginStatus;
      }
    })
  },
  data() {
    return {
      preShareId: ""
    }
  },
  onLoad(options){
  
  },
  async onShow(options) {
    let system = wx.getAccountInfoSync()
    console.log('system',system)
    //置空进入首页状态
    console.log('options:',options)
    wx.setStorageSync('pages','')
    // var currentPage = pages[pages.length-1] //获取当前页面的对象
    // var url = currentPage.route //当前页面url
    if(options.referrerInfo.extraData){
      let login =  wx.getStorageSync('isLogin')
      wx.setStorageSync('CARDID', options.referrerInfo.extraData.cardId)
      wx.setStorageSync('COMPANYID', options.referrerInfo.extraData.companyId)
    }
    this.checkVersion();
    if (options.query.scene) {
      console.log(options.query)
      let param = utils.formatParams(decodeURIComponent(options.query.scene));
      if(param.card){
        
        wx.setStorageSync('CARDID', param.card)
        wx.setStorageSync('COMPANYID',param.c)
      }
      console.log("太阳码打开小程序参数:", );
      console.log(param)
      if (param.id > 0) { // 文章跳转
        this.sceneJump(param);
      }else if(param.i){ // 判断是否是邀请跳转
        this.inviteJump(param);
      
      }else if(param.v){ //视频跳转
        this.$store.commit('setForwardVideoId',param.v)
      } else {
        this.oldSceneJump(param, options);
      }
    }

    if (options.query.goType == 1) {
      let url = '/' + options.path;
      console.log('----------', options.query);
      if (options.query.goodId || options.query.forwardId) {
        wx.setStorageSync('forwardId', options.query.forwardId);
        wx.setStorageSync('parentId', options.query.parentId);
        wx.setStorageSync('forwardGoodsId', options.query.goodId);
        url += ('?goodId=' + options.query.goodId);
      }
      if (options.query.dynamicId) url += ('?dynamicId=' + options.query.dynamicId + '&companyId=' + options.query.companyId + "&cardId=" + options.query.cardId);

      wx.setStorageSync('COMPANYID', options.query.companyId);
      wx.setStorageSync('CARDID', options.query.cardId);
      wx.setStorageSync('redirectPage', url);

      // 分享或者小程序跳转进入，如果当前用户已经登录，且还没有名片，则需要重新登录一次，查看是否还有名片
      if (HandleLogin.returnIsLogin() && !wx.getStorageSync("hasCard")) {
        
        // HandleLogin.login(data => {
        //     HandleLogin.setLoginMessageInStorage(data, false);
        //     // 进入首页，则需要连接websocket
        //     HandleWebsocket.connectWebsocket();
        // });
        let data = await HandleLogin.loginPromise();
        if (data) {
          HandleLogin.setLoginMessageInStorage(data, false);
          HandleWebsocket.connectWebsocket();
        }
        // } else if (!HandleLogin.returnIsLogin()) {
        //   console.log('app 游客登录');
        //   await HandleLogin.postLoginPromiseByTourists();
      }
      if(options.query.forwardId){
        //uni.navigateTo({url:url})
        return
      }
      if (options.query.shareId && options.query.shareId !== this.preShareId && this.isLogin) {
        this.preShareId = options.query.shareId;
        openShare(options.query.shareId);
        
      }
    }

    HandleWebsocket.connectWebsocket();
  },
  onHide(){
    wx.setStorageSync('pages','')
  },
  created() {
    
  },
  methods: {
    checkVersion() {
      if (wx.canIUse("getUpdateManager")) {

        const updateManager = wx.getUpdateManager();
        updateManager.onCheckForUpdate(function (res) {
          console.log('checkInfo', res);
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: "更新提示",
                content: "新版本已经准备好，是否重启应用？",
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: "已经有新版本了哟~",
                content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
              });
            });
          }
        });
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: "提示",
          content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
        });
      }
    },
    oldSceneJump(param, options) {
      console.log('options',options)
      let url = '/' + options.path;

      
      if(param.cp && param.cf && param.f){
        wx.setStorageSync('COMPANYID', param.cp);
        wx.setStorageSync('CARDID', param.cf);
        wx.setStorageSync('parentId', param.f);
      }
      
      wx.setStorageSync('forwardArr', param);
      
      //储存g:商品id   g:分享id
      if (param.g) url += `?goodId=${param.g}`;
      else if(param.f) url += `?forwardId=${param.f}`;
       //wx.reLaunch({ url: url });

      //检查是否登录
      if (HandleLogin.returnIsLogin()) {

        if(param.cf && param.cp && param.f){
          return
        }
        wx.navigateTo({ url: url });
      } else {
        wx.setStorageSync('redirectPage', url);
        wx.switchTab({
          url:'pages/index/main'
        })
      }
    },
    inviteJump(param){
      let url = '../distributionCenter/applyFor/main'
      //定义用户邀请其他用户的唯一key
      // card=名片id c=公司id i=邀请人id
      let inviteArr = {}
      inviteArr.companyId = param.c
      inviteArr.cardId = param.card 
      inviteArr.userId = param.i
      wx.setStorageSync('COMPANYID', param.c);
      wx.setStorageSync('CARDID', param.card);
      wx.setStorageSync('inviteArr',inviteArr)
      if (HandleLogin.returnIsLogin()) {
        //wx.navigateTo({ url: url + `?companyId=${param.c}&cardId=${param.card}&userId=${param.i}` });
        wx.navigateTo({ url: url });
      } else {
        wx.setStorageSync('redirectPage', url);
      }
    },
    sceneJump(param) {
      WXAJAX.POST({
        sunCodeId: param.id
      }, '', '/businessCard/getSunCode').then(res => {
        let url = '/' + res.page;
        let paramsObj = utils.formatParams(decodeURIComponent(res.scene));
        console.log("太阳码 scene :", paramsObj);
        wx.setStorageSync('COMPANYID', paramsObj.c);
        wx.setStorageSync('CARDID', paramsObj.card);

        if (url === "/pages/dynamicDetail/main") {
          // 转载文章的太阳码
          url += `?dynamicId=${paramsObj.dynamic}`;
          // userApi/shareRecord/addOpenShareCount 打开分享
          openShare(paramsObj.shareId);
        } else {
          if (paramsObj.g) url += `?goodId=${paramsObj.g}`;
        }

        // wx.reLaunch({ url: url });
        if (HandleLogin.returnIsLogin()) {
          wx.reLaunch({ url: url });
        } else {
          wx.setStorageSync('redirectPage', url);
        }
      });
    },
  },
  log() {
    console.log(`log at:${Date.now()}`)
  }
}
</script>

<style>
page {
  width: 100%;
  height: 100%;
  background: #f5f5f6;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
* {
  box-sizing: border-box;
}
</style>
