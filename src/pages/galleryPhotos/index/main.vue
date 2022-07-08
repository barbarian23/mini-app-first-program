<template>
	<div class="content disflex flex-column h100p overhidden">
		<div class="disflex" style="height:200rpx;flex-shrink: 0;">
      <div class="flex-c-c flex-column" 
           :style="{width:topWidth + 'px',height:'200rpx'}"
           :class="currentTab == 0 ? ' trans2 bgf5f6' : 'bgfff trans2' "
           @click="Tab_tap('main',0)">
        <img :src="icon_mian" class="h50 w50 mb2">
        <div class="fs14 c38 flex-c-c w67 h26 bradius15 "
            :class="currentTab == 0 ? ' trans2 bgblue cfff' : 'bgfff trans2 c38' ">我的</div>

      </div>
      <div class="flex1 disflex overauto">
        <scroll-view scroll-x
                     style="height:200rpx"
                     scroll-with-animation
                     :show-scrollbar="true"
                     :style="{width:'75vw'}"
                     :scroll-left="scrollLeft">
          <div class="disflex">
            <div class="flex-c-c flex-column h110" 
                :style="{width:topWidth + 'px',height:'200rpx'}"
                :class="currentTab == index+1 ? ' trans2 bgf5f6' : 'bgfff trans2' "
                v-for="(item,index) in tabArr" 
                @click="Tab_tap('',index+1,item.classificationId)"
                :key="index">
              <img :src="item.logo" class="h50 w50 mb2">
              <div class="fs14 c38 flex-c-c w67 h26 bradius15 "
                  :class="currentTab == index+1 ? ' trans2 bgblue cfff' : 'bgfff trans2 c38' ">{{item.name}}</div>
            </div>
          </div>
          
        </scroll-view>
      </div>
      
    </div>
    <div  class="flex1 mt10">
      <div class="h100p bgfff" :current="currentTab" @change="currentTab_tap">
        <div class="disflex flex-column" v-if="currentTab == 0">
          <div class="disflex jsbet align-cen bbf5f6 pl20 pr15">
            <div class="h44">
              <div class="flex-c-c h100p" v-if="selectSwitch">
                <radio color="#51CDCB" :checked="allSclect" @click="checkAll_tap"></radio>
                <p>全选</p>
              </div>
            </div>
            <div @click="selectSwitch_tap">
              <div>{{selectSwitch ? '完成': '管理'}}</div>
            </div>
          </div>
          <div class="pb10 posre">
            <scroll-view id='scroll_view' 
                         :scroll-y="true" 
                         :style="{height:navHeight,width:'w100p'}"
                         @scrolltolower="drop_down_tap('main')"
                         class="pb10">
              <div class="disflex wrap borderbox  pt15 pr15 pl15 jsbet">
                <div class="flex-c-c  flex-column w165 h228 mb10 be8 bradius5" @click="uploadpic(1)">
                  <img :src="icon_add" class="w48 h48"> 
                  <p class="mb10 mt10 fs16 cblue fbold">添加图片</p>
                  <p class="textc fs12 c38 lh20">上传图片格式png，<br>jpeg，jpg。<br>大小尽量不超过2M，最<br>多上传20张。</p>

                </div>
                <div class="shadow_grayD w165 h228 mb10 bradius5 overhidden posre" 
                     v-for="(item,index) in mianArr" 
                     @click="selectedImg(item,index)"
                     :key="item">
                  <img :src="item.imagePath" class="w100p h100p">
                  <div class=" w40 h40 isSelect" v-if="selectSwitch">
                    <img :src="item.isSelect ?  ic_selected_wl : ic_selected_b " class="w20 h20">
                  </div>
                </div>
              </div>
            </scroll-view>
            <div class="h49 disflex flex-end align-cen w100p posab bgfff " 
                 v-if="selectSwitch"
                 :style="{width:'100vw',bottom:'17px'}">
              <div class="w75 h30 flex-c-c fs18  cfff bradius5 mr15" 
                   :class="mianArr.length == 0 ? 'bgbf' :'bg_line_orange'"
                   @click="del_tap">删除</div>
            </div>
          </div>
          
        </div>
        <div v-else>
          <scroll-view id='scroll_viewB' 
                       :scroll-y="true" 
                       :style="{height:navHeightB,width:'w100p'}"
                       @scrolltolower="drop_down_tap()"
                       class="pb10">
              <div class="disflex wrap borderbox pt15 pr15 pl15 jsbet">
                <div class="shadow_grayD w165 h228 mb10 bradius5 overhidden posre" 
                     v-for="item in imgArr"
                     @click="selectedImg(item,index)"
                     :key="item">
                  <img :src="item.imagePath" class="w100p h100p">
                  <div class="posab disflex jscen flex-column pl10" style="bottom:0;left:0;width:100%;height:101rpx;background:#000000;opacity: 0.7;">
                    <p class='fs16 cfff fbold'>{{item.title}}</p>
                    <p class='fs12 cfff'><span class="cblue">{{item.useNum}}</span>人正在使用</p>
                  </div>
                </div>
              </div>
            </scroll-view>

        </div>
        
      </div>
    </div>
    
	</div>
</template>



<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      tabArr:[],
      currentTab:0,
      mianArr:[],
      imgArr:[],
      icon_add: WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_add_l@2x.png',
      ic_selected_b: WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_selected_b@2x.png',
      ic_selected_wl: WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_selected_wl@2x.png',
      icon_mian:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_poster1@2x.png',
      navHeight:'',
      navHeightB:'',
      windowHeight:'',
      selectSwitch:false,
      topWidth:'',
      pageNum:1, //分页页数
      isLoading:false, //防止短时间多次请求
      classificationId:'', //图片分类id
      allSclect:false, //是否全选
      chooseType:'' //是否为打卡选择海报
    }
  },
  onLoad(options){
    if(options){
      this.chooseType = options.type
    }
  },
  onReady() {
    let that=this;
    uni.getSystemInfo({ //调用uni-app接口获取屏幕高度
      success(res) { //成功回调函数
        that.topWidth = (res.windowWidth/4) 
        console.log(that.topWidth)
        that.windowHeight=res.windowHeight //windoHeight为窗口高度，主要使用的是这个
        let titleH=uni.createSelectorQuery().select("#scroll_view"); //想要获取高度的元素名（class/id）
        titleH.boundingClientRect(data=>{
          let pH=that.windowHeight; 
          that.navHeight=pH-data.top  + 'px' //计算高度：元素高度=窗口高度-元素距离顶部的距离（data.top）
          console.log(that.navHeight)
          that.navHeightB = pH-data.top + 48.5 + 'px'
        }).exec()
      }
    })
    this.queryPagePoster()
    this.queryPagePosterImage('main')
  },
  computed:{
    // checkAll(){
      
    //   return this.mianArr.every(i=>{
    //     return i.isSelect == true
    //   })
    // }
  },
  methods:{
    ...mapMutations(['setPosterPhoto']),
    //切换tab
    Tab_tap(tyep,index,id){
      this.currentTab = index
      this.isLoading = false
      this.pageNum = 1
      this.imgArr = []
      this.mianArr = []
      this.selectSwitch = false
      this.classificationId = id
      if(tyep == 'main'){
        this.queryPagePosterImage('main')
      }else{
        this.queryPagePosterImage()
      }
    },

    currentTab_tap(e){
      this.currentTab = e.detail.current
    },
    //下拉加载
    drop_down_tap(type){
      if(type == 'main'){
        this.queryPagePosterImage('main')
      }else{
        this.queryPagePosterImage()
      }
    },
    selectedImg(item,index){
      if(this.selectSwitch){
        let k = !item.isSelect
        this.$set(this.mianArr[index],'isSelect', k)
        this.checkAllS()
        this.$forceUpdate(); 
        console.log(this.mianArr[index].isSelect)
      }else{
        if(this.chooseType && this.chooseType == 'index'){
          this.setPosterPhoto(item.imagePath)
          uni.navigateBack({
            delta:1
          })
        }else{  
          let posterImageId = item.posterImageId
          uni.navigateTo({url:`../detall/main?posterImageId=${posterImageId}`})
        }
      }
    },
    checkAll_tap(){
      if(this.allSclect == true){
        this.mianArr.forEach((v,k)=>{
          v.isSelect = false
          this.allSclect = false
        })
        this.$forceUpdate(); 
      }else{
        this.mianArr.forEach((v,k)=>{
          v.isSelect = true
          this.allSclect = true
        })
        this.$forceUpdate(); 
      }
    },
    //检查是否全选
    checkAllS(){
      this.allSclect = this.mianArr.every(i=>{
        return i.isSelect == true
      })
    },
    //管理开关
    selectSwitch_tap(){
      this.selectSwitch = !this.selectSwitch 
      this.mianArr.forEach((v,k)=>{
        v.isSelect = false
        this.allSclect = false
      })
      this.$forceUpdate(); 
    },
    del_tap(){
      let than = this
      if(than.mianArr.length == 0){
        return
      }
      wx.showModal({
        title: '提示',
        content: '删除后无法恢复',
        cancelColor:'#51CDCB',
        confirmColor:'#FD634E',
        success: function (res) {
          if (res.confirm) {
            let delImg = []
            for(var i in than.mianArr){
              if(than.mianArr[i].isSelect == true){
                delImg.push({posterImageId:than.mianArr[i].posterImageId})
              }
            }
            // than.mianArr = than.mianArr.filter(v=>{
            //   return v.isSelect !== true
            // })
            // console.log('delImg',delImg)
            than.selectSwitch = false
            than.deletePosterImage(delImg)
          } else if (res.cancel) {
              
          }
         }
      });
    },
    //删除海报
    deletePosterImage(delImg){
      let than = this
      uni.showLoading({
        title:'加载中'
      })
      let data = {
        imageRequests:delImg
      }
      WXAJAX.POST(data,'','/poster/deletePosterImage')
      .then((res)=>{
        uni.hideLoading()
        console.log(res)
        uni.showToast({
          title:'删除成功！'
        })
        setTimeout(() => {
          than.pageNum = 1
          than.mianArr = []
          than.isLoading = false
          than.queryPagePosterImage('main')
        }, 1000);        
        
      })
      .catch((err)=>{
        console.log(err)
      })
     
    },
    //查询海报分类
    queryPagePoster(){
      uni.showLoading({
        title:'加载中'
      })
      let data = {
        companyId:uni.getStorageSync('SELFCOMPANYID') || '',
        pageSize:99
      }
      WXAJAX.POST(data,'','/poster/queryPagePoster')
      .then((res)=>{
        uni.hideLoading()
        this.tabArr = res.pageInfo.list
      })
      .catch((err)=>{
        console.log(err)
      })
    },
    // 查询分类图片
    queryPagePosterImage(tyep){
      let than = this
      uni.showLoading({
        title:'加载中'
      })
      if(than.isLoading){
        return uni.hideLoading()
      }
      than.isLoading = true
      let data = ''
      if(tyep == 'main'){
        data = {
          createdUserId:uni.getStorageSync('userId') || '',
          pageNum:than.pageNum
        }
      }else{
        data = {
          classificationId:than.classificationId,
          pageNum:than.pageNum
        }
      }
      WXAJAX.POST(data,'','/poster/queryPagePosterImage')
      .then((res)=>{
        uni.hideLoading()
        if(res.pageInfo.list){
          if(tyep == 'main'){
            than.mianArr = [...than.mianArr, ...res.pageInfo.list]
            than.mianArr.forEach((v)=>{
              v.isSelect = false
            })
          }else{
            than.imgArr = [...than.imgArr, ...res.pageInfo.list]
          }
          setTimeout(function(){
            than.pageNum ++  
            than.isLoading = false
          },500)
        }
      })
      .catch((err)=>{
        uni.hideLoading()
        than.isLoading = true
        console.log(err)
      })
    },
     async uploadpic(count) {
     
      let path = await util.chooseImage("file", count);
      if (!(path instanceof Array)) return;
      this.uploadImgFun(path, 0);
    },
    // 上传
    async uploadImgFun(path, index = 0) {
     WXAJAX.UploadImage(path[0])
     .then(res=>{
       res = JSON.parse(res);
       let path = `${WXAJAX.imgBackUrl}${res.data}`
       
       
       this.uploadImg(path)
     })
    },
    uploadImg(path) {
      let v = this;
      wx.showLoading({ mask: true });
      let data = {
        imagePath:path
      } 
      return WXAJAX.POST(data,'','/poster/addPosterImage')
        .then(data => {
          console.log(data)
          wx.hideLoading();
          this.pageNum = 1
          this.isLoading = false
          this.mianArr = []
          this.queryPagePosterImage('main')
        })
        .catch(err => {
          wx.hideLoading();
          console.log("err -- ", err);
        });
    },
    
  }
}
</script>

<style scoped>
.isSelect{
  position:absolute;
  top: 0;
  right: 0;
  border-radius:0 0 0 10upx;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}
::-webkit-scrollbar {
    width: 0;
    height: 0;
    color: transparent;
 }
</style>