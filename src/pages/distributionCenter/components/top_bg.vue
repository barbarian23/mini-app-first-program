<template>
    <div class="top-bg posab">
      <div :style="{height: statusBarHeight}"></div>
      <div class="share-details-title posre"
           :style="{height: navBarUserHeight}">
           <image class="icon-back" @click="goBack()" :src="imgUrl" mode=""></image>
           <p class="navgation-title fs18 cfff fbold">{{title}}</p>
           <!-- 占位置 -->
           <p></p>
      </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request.js'
import tools from '@/utils/index.js'
export default {
  props: {
    navBarUserHeight: {
      type: String
    },
    statusBarHeight:{
      type: String
    },
    title:{
      type: String
    }
  },
  data(){
    return {
      imgUrl:WXAJAX.imgBackUrl + '/marketing/icon_back.png',
    }
  },
  created() {
    

  },
  mounted() {
    
  },
  methods:{
    goBack(){
      let pageStack = getCurrentPages()
      console.log(pageStack)
      wx.navigateBack({
        delta:1
      })
    }
  }
};
</script>
<style scoped>
.top-bg{
  height: 502upx;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(to bottom, #51cdcc, #f5f5f6);
 }
.share-details-title{
    display: flex;
    align-items: center;
    padding:0 100upx 0 20upx;
    z-index: 999;
}
.navgation-title{
  width: 100%;
  display: flex;
  justify-content:space-around;
}
.icon-back{
  width: 45upx;
  height: 36upx;
  margin-top: 2upx;

}
.middle{
   height: 348upx;
   width: 100%;
   box-sizing: border-box;
   padding:20upx 30upx 20upx 30upx;
   background-size: 100%;
}
.information-title{
  width: 476upx;
  height: 80upx;
  overflow: hidden;
  word-break: break-all;
  display: -webkit-box; /**对象作为伸缩盒子模型展示**/
  overflow: hidden; /**隐藏超出的内容**/
}
/* .middle {
  display: flex;
  align-items: flex-start;
  height: 120upx;
  align-items: flex-start;
} */
/* .card{
  padding: 40upx 25upx 0 25upx;
  display: flex;
}
.dynamic-photos{
  width: 120upx;
  height: 120upx;
  border-radius: 10upx;
  margin-right: 30upx;
}
.time{
  position: absolute;
  bottom: 0;
  left: 0;
}
.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.comment{
  margin-top: 90upx;
  display: flex;
  justify-content: space-between;
  padding:0 45upx 0 30upx;
} */
/* .details {
  border-top: 1upx solid #f8f8f8;
  display: flex;
  justify-content: space-around;
  align-items: center;
} */
</style>
