<template>
  <div class=" disflex flex-column overhidden align-cen " :style="{paddingTop:navHeight}">
    <div :style="{height:navHeight}" class="w100p bgblue fix_top">
      <div :style="{height:navTop}"></div>
      <div :style="{height:navBarUserHeight,width:'100%'}" class="borderbox disflex align-cen jsbet pl20 pr20">
        <div class="back" @click="goBack"> </div>
        <p class="fs18 cfff fbold">{{ lang.text_0 }}</p>
        <p class="w20"></p>
      </div>
    </div>
    <div class="title">
      <p class="fs32 cfff fbold mb10">{{datas.title || lang.text_1}}</p>
      <p class="fs14 cfff lh22">{{datas.content || lang.text_2}}</p>
    </div>
    <div class="formContent shadow_grayA">
      <div class="decorate"></div>
      <div v-for="(item,index) in datas.detailRequests" :key="index">
        <!-- 单选项 -->
        <single v-if="item.formType == 'SINGLE'"
                :datas="item.childrenDetails"
                :number="index"
                :title='item.title'
                :required="item.required"
                @singleChoice='singleChoice'
                ></single>
        <!-- 复选项 -->
        <multiple v-else-if="item.formType == 'MULTIPLE'"
                  :datas="item.childrenDetails"
                  :number="index"
                  :title='item.title'
                  :required="item.required"
                  @check_choice="check_choice"></multiple>
        <!-- 下拉选项 -->
        <dropDown v-else-if="item.formType == 'DROP_DOWN'"
                  :datas="item.childrenDetails"
                  :title='item.title'
                  :number="index"
                  :required="item.required"
                  @list_tap="list_tap"></dropDown>
        <!-- 文本框 -->
        <textareas v-else-if="item.formType == 'TEXTAREA'"
                   :title='item.title'
                   :number="index"
                   :required="item.required"
                   @text_tap="text_tap"
                   ></textareas>
        <!-- 评分 -->
        <stars  v-else-if="item.formType == 'SCOURE'"
                :datas="item.childrenDetails"
                :title='item.title'
                :number="index"
                :required="item.required"
                @star_tap="star_tap"></stars>
        <!-- 图片上传 -->
        <images v-else-if="item.formType == 'IMAGE'"
               :datas="item.childrenDetails"
               :title='item.title'
               :number="index"
               :required="item.required"
               @img_tap="img_tap"></images>
        <!-- 地址定位 -->
        <GPS v-else-if="item.formType == 'GPS'"
             :datas="item.childrenDetails"
             :title='item.title'
             :number="index"
             :required="item.required"
             :address="address"></GPS>
        <!-- 个人信息 -->
        <userinfo v-else-if="item.formType == 'USERINFO'"
                  :datas="item.childrenDetails"
                  :title='item.title'
                  :number="index"
                  :required="item.required"
                  @input_tap="input_tap"></userinfo>
        <!-- 提交日期 -->
        <datepicker v-else-if="item.formType == 'DATEPICKER'"
                    :datas="item.childrenDetails"
                    @bindDateChange="bindDateChange"
                    :title='item.title'
                    :required="item.required"
                    :number="index"></datepicker>
      </div>
      <div class="bgblue h44 bradius5 fs18 cfff fbold disflex jscen align-cen" @click="submitFrom" v-if="datas.length !== 0">
        确认提交
      </div>
      <div v-if="iscommit">
        <fromTipsBox :dialog_title="'提示'"
                     @btn_tap="btn_tap"
                     :dialog_ph="tipsTitle"
                     :tipsdec="tipsdec"
                     v-if="isShwo"
        ></fromTipsBox>
      </div>
    </div>
  </div>
</template>

<script>
import WXAJAX from "../../utils/request";
import util from "../../utils/index";
import { mapState, mapGetters } from "vuex";
import single from "@/components/formModule/single";
import multiple from "@/components/formModule/multiple";
import dropDown from "@/components/formModule/drop_down";
import textareas from "@/components/formModule/textarea";
import stars from "@/components/formModule/stars";
import images from "@/components/formModule/image";
import GPS from "@/components/formModule/GPS";
import userinfo from "@/components/formModule/userinfo";
import datepicker from "@/components/formModule/datepicker";
import fromTipsBox from "../../components/fromTipsBox"
import LangUtils from '../../utils/LangUtils';

export default {
  data() {
    return {
      lang: LangUtils.getLangSrc().questionnaire,
      datas:'',
      navBarUserHeight:'',
      navHeight:'',
      navTop:'',
      address:'', // 选择地址
      list:[],
      starNum:[],   //评分答案
      imgContent:[], //图片字段
      downText:'', //下拉字段
      tipsTitle:'同一表单只可提交一次哦',
      tipsdec:'表单内容更新后，可再次提交。',
      iscommit:'', //是否已经提交表单 您可以点击聊天窗口或拨打电话联系负责人哦
      isShwo:false //是否显示 此企业尚未发布“反馈表单”哦
    };
  },
  onShow(){
    // this.$refs.formModule.addressSplicing()
    let add = wx.getStorageSync('company_address')
    //console.log(add)
    this.address = add.street + add.build
  },
  mounted() {
    this.calculateNavBarHeight();
    this.getFrom()
  },
  components: {single,multiple,dropDown,textareas,stars,images,GPS,userinfo,datepicker,fromTipsBox},
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
          this.navBarUserHeight = navBarUserHeight + "px";
        },
        fail(err) {
          //console.log(err);
        }
      });
    },
    getFrom(){
      wx.showLoading() ;
      let data = {
        commitUserId:wx.getStorageSync('userId') || '',
        companyId:wx.getStorageSync('COMPANYID') || ''
      }
      WXAJAX.POST(
        data,'','/advancedForm/queryUserForm'
      )
      .then(data => {
        wx.hideLoading();
        if(data){
          data.detailRequests.forEach(v => {
            for(var i in v.childrenDetails){
              v.childrenDetails[i].content = ''
              if(v.formType == 'MULTIPLE'){
                v.childrenDetails[i].checked = false

              }else if(v.formType == 'SCOURE'){
                v.childrenDetails[i].choice = -1
              }
            }
          });
          this.datas = data
          this.iscommit = data.commit
        }
      })
      .catch((err) => {
          this.datas=[]
          wx.hideLoading();
          //console.log(err)
          wx.showToast({
            title:err,
            icon:'none'
          })
        })
    },
    //组件事件回调  处理fromdata的数据
    async singleChoice(item,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails = item
    },

    list_tap(text,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails[0].content = text
    },
    bindDateChange(item,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails = item
    },
    text_tap(text,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails[0].content = text
    },
    img_tap(imgs,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails[0].content = imgs
    },
    input_tap(item,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails = item
    },
    check_choice(item,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails = item
    },
    star_tap(item,index){
      this.isShwo = true
      this.datas.detailRequests[index].childrenDetails = item
    },
    //提交表单
    submitFrom(){
      let data = []
      for(var i in this.datas.detailRequests){

        //data.push()
        let list = this.filterAnswers(this.datas.detailRequests[i])
        data.push(list.data)
        if(list.intercept){
          uni.showToast({
            title:'请先填写带*号的问题',
            icon:'none'
          })
          return
        }
        //console.log(this.filterAnswers(v))
      }

      //console.log(v)
      // return console.log(data)
      var parameter = {
        commitUserId:wx.getStorageSync('userId') || '',
        formId:this.datas.advancedFormId,
        companyId:wx.getStorageSync('COMPANYID') || '',
        detailRequests:data
      }
      WXAJAX.POST(
        parameter,'','/advancedForm/addFeedback'
      )
      .then(data=>{
        //console.log(data)
        wx.showToast({
          title:'提交成功！',
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },1000)
      })
      .catch((err) => {
        wx.hideLoading();
        //console.log(err)
        wx.showToast({
          title:err,
          icon:'none'
        })
      })
    },
    //过滤表单答案
    filterAnswers(item){
      //console.log(item)
      let intercept = false
      let arr = {}

      let data = {
      }
      arr = item.childrenDetails.map((v,k)=>{
        return{
          formDetailParentId:v.parentId,
          formDetailId:v.detailId,
          formDetailType:v.formType,
          formDetailtitle:v.title,
          required:item.required,
          answer:v.content
        }
      })
      //console.log(arr)
      if(arr[0].formDetailType == 'GPS'){
        //console.log('gps')
        data.formDetailId = arr[0].formDetailParentId,
        data.formDetailType = arr[0].formDetailType,
        // data.required = arr[0].required
        data.answer = this.address
        if(arr[0].required){
          if(!data.answer){
            intercept = true
          }

        }

      }else if(arr[0].formDetailType == 'DROP_DOWN'){
        //console.log('DROP_DOWN')
        data.formDetailId = arr[0].formDetailParentId,
        data.formDetailType = arr[0].formDetailType,
        // data.required = arr[0].required
        arr.forEach(v=>{
          if(v.answer){
            data.answer = v.answer
          }
        })
        if(arr[0].required){
          if(!data.answer){
            intercept = true
          }
        }
      }else if(arr[0].formDetailType == 'SINGLE' || arr[0].formDetailType == 'MULTIPLE'){
        data.formDetailId = arr[0].formDetailParentId,
        data.formDetailType = arr[0].formDetailType,
        //data.required = arr[0].required
        data.answer = []
        data.answer = arr.map(data=>{
          return{
            formDetailId:data.formDetailId,
            formDetailtitle:data.formDetailtitle,
            answer:data.answer
          }
        })
        if(arr[0].required){
        for(var i in data.answer){
           if(data.answer[i].answer || data.answer[i].answer !== 0){
            intercept =  false
            break
           }else{
            intercept =  true
           }
         }
        }
      }else{
        data.formDetailId = arr[0].formDetailParentId,
        data.formDetailType = arr[0].formDetailType,
        //data.required = arr[0].required
        data.answer = []
        data.answer = arr.map(data=>{
          return{
            formDetailId:data.formDetailId,
            answer:data.answer
          }
        })
        if(arr[0].required){
          data.answer.forEach(v=>{
            if(!v.answer){
              intercept = true
            }
          })
        }
      }

      return {data:data,intercept:intercept}
    },
    goBack(){
      wx.navigateBack({
        delta:1
      })
    },
    btn_tap(){
      this.isShwo = false
    }
  },
};
</script>

<style scoped>
.top{
  width: 100%;
  height: 500upx;
  background: #51CDCB;

}
.back{
  height: 30rpx;
  width: 30rpx;
  border-width: 0 0 5rpx 5rpx;
  border-color: #fff;
  border-style: solid;
  transform: matrix(0.71, 0.71, -.71, 0.71, 0, 0);
}
.title{
  height: 420upx;
  width: 100%;
  padding-left: 40upx;
  padding-right: 40upx;
  box-sizing:border-box;
  background:url('https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/crmAdd/img_bg_cyan@2x.png');
  background-size:100% 100%;
  background-repeat: no-repeat;
}
.formContent{
  background: #ffffff;
  border-radius: 10upx;
  margin-top: -174upx;
  width: 90%;
  min-height: 400upx;
  position: relative;
  padding: 80upx 40upx 20upx 40upx;
  margin-bottom: 20upx;
  box-sizing: border-box;

}
.decorate{
  position: absolute;
  top: -30upx;
  width: 630upx;
  height: 60upx;
  background: #FFFFFF;
  opacity: 0.6;
  border-radius: 20px 20px 0px 0px;
  left: 0;
  right: 0;
  margin:0 auto;
}
</style>
