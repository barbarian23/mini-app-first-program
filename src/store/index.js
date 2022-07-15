import Vue from 'vue'
import Vuex from 'vuex'
// import mutations from './mutations.js'
const SET_LOGIN = 'set_login_status';
const SET_USER_INFO = 'set_user_info';

Vue.use(Vuex)
import msgList from './msgList'
import msgCont from './msgCont'
import jsMsg from './jsMsg'
import loginStore from "./login";
import {
  stat
} from 'fs';
const state = {
  currentCompany: wx.getStorageSync('CURRENT_COMPANY') || {},
  phone: wx.getStorageSync('phone') || '',
  unreadNum: 0, // 详情页面中的未读消息数量
  isLoginStatus: wx.getStorageSync('isLogin') || false, //是否是登录状态
  /* name: 'HD384483939',// 用户名
   infocount: 1,// 消息数量
   token: '123456'//token*/
  userInfo: {
    userName: wx.getStorageSync('USERNAME') || '',
    phone: wx.getStorageSync('phone') || '',
    userId: wx.getStorageSync('userId') || '',
    avatarUrl: wx.getStorageSync('avatarUrl') || '',
  },
  subscriptionNew: [], //订阅消息
  videoId: [],
  editStatus: '',
  isBayWindow:'',
  industryList:[], //人脉集市行业
  demandClass:[], //需求广场分类
  clockSetting:[], //打卡配置
  posterText:'', //选择海报文案
  posterPhoto:'', //选择海报图片
  refresh:0 , // 是否推送访问信息
  videoGoods:"" ,// 短视频推荐商品
  codeVideoId:'', //太阳码视频id
  CardTemplateEnums:'DEFAULT', // 名片模板类型 
};
const mutations = {
  SET_CURRENT_COMPANY(state, data) {
    state.currentCompany = data;
    if (data) {
      wx.setStorageSync('CURRENT_COMPANY', JSON.stringify(data));
    } else {
      wx.removeStorageSync('CURRENT_COMPANY');
    }
  },
  SET_PHONE(state, data) {
    state.phone = data;
  },
  SET_UNREAD_NUM(state, data) {
    state.unreadNum = data;
  },
  [SET_LOGIN](state, data) {
    state.isLoginStatus = data;
  },
  [SET_USER_INFO](state, data) {
    state.userInfo = data;
  },
  setPhone(state, phone) {
    state.phone = phone;
  },
  //保存正在观看视频id
  setVideo(state, videoId) {
    state.videoId = videoId
  },
  setIsBayWindow(state,data){
    state.isBayWindow = data
  },
  //保存名片是否为编辑状态
  setEditStatus(state, data) {
    state.editStatus = data
  },
  //设置用户更改的头像
  setAvatarUrl(state, data) {
    state.userInfo.avatarUrl = data
  },
  SET_SUBSCRIPTION_NEW(state, subscriptionNew) {
    state.subscriptionNew = subscriptionNew;
  },
  setIndustryList(state,data){
    state.industryList = data
  },
  setDemandClass(state,data){
    state.demandClass = data
  },
  //自动打卡配置
  setClockSetting(state,data){
    state.clockSetting = data
  },
  //选择打卡文案
  setPosterText(state,data){
    state.posterText = data
  },
  //选择打卡海报
  setPosterPhoto(state,data){
    state.posterPhoto = data
  },
  //设置是否推送访问消息
  setRefresh(state,data){
    state.refresh = data
  },
  // 短视频推荐商品
  setGoodslist(state,data){
    state.videoGoods = data
  },
  setForwardVideoId(state,data){
    console.log(data)
    state.codeVideoId = data
  },
  setCardTemplateEnums(state,data){
    state.CardTemplateEnums = data
  }
};

const actions = {
  setCurrentCompany({
    commit
  }, data) {
    commit('SET_CURRENT_COMPANY', data)
  },
  setPhone({
    commit
  }, data) {
    commit('SET_PHONE', data);
  },
  setUnreadNum({
    commit
  }, data) {
    commit('SET_UNREAD_NUM', data);
  },
  setSubscriptionNew({
    commit
  }, data) {
    commit('SET_SUBSCRIPTION_NEW', data);
  },
  
};

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules: {
    msgList,
    msgCont,
    jsMsg,
    loginStore
  },
  getters: {
    currentCompany: state => state.currentCompany,
    selfPhone: state => state.phone,
    msglist: state => state.msgList.msglist,
    msgCont: state => state.msgCont.msgCont,
    changePosition: state => state.msgCont.status,
    unreadNum: state => state.unreadNum,
    countNum: state => state.msgCont.countNum,
    currentNum: state => state.msgCont.currentNum,
    subscriptionNew: state => state.subscriptionNew
  },
  /* plugins: [
       createPersistedState({
           storage: {
               getItem: key => {
                   wx.getStorageSync(key)
               },
               setItem : (key ,value)=>{
                   wx.setStorageSync(key,value)
               },
               removeItem:key=>{
                   wx.clearStorage()
               }
           }
       })
   ]*/
})
