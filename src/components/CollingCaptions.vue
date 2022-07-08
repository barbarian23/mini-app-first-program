<template>
  <div class="tip disflex">
    <div class="notice">
      <img :src="noticeIcon" class="w15 h15 mr10">
    </div>
    <div class="inner disflex" :class="{'move': scroll}" :style="styleName">
      
      <text class="tip-inder">{{text}} {{scroll ? text : '' }}</text>
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
export default {
  props: {
    text: {
      type: String,
      defualt: ''
    },
  },
  data() { 
    return {
      styleName: "animation-duration: 6s",
      scroll: false,
      tipWidth: 0,
      noticeIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/icon_notice.png'
    };
  },
  watch:{
    text(newVal,old){
      if(newVal){
        newVal = newVal.replace(/,/g,' ')
        this.textScroll()
      }
    }
  },
  mounted(){
    this.textScroll()
  },
  methods: {
    textScroll() {
      // 等待节点挂载后再执行,热门线路tip滚动实现
      this.$nextTick(() => {
        let query = wx.createSelectorQuery().in(this)
        query.select('.tip').boundingClientRect(data => {
          this.tipWidth = data.width
          console.log('tip', this.tipWidth)
        }).exec();
        query.select('.tip-inder').boundingClientRect(data => {
          console.log('tip-inder', data.width)
          if(data.width > this.tipWidth) {
            let w = Number(data.width)
            let time = Math.round(w / 40)
            this.styleName = `animation-duration: ${time}s`
            this.scroll = true
          }
        }).exec();
      })
    }
  }
};
</script>

<style scoped>
.tip {
  width: 100%;
  background: #f6f9ff;
  color: #52CDCC;
  font-size: 28rpx;
  height: 80rpx;
  line-height: 80rpx;
  white-space: nowrap;
  position: relative;
  padding-left: 80upx;
  padding-right: 80upx;
  box-sizing: border-box;
}
.tip{
  overflow: hidden;
  display: inline-block;
  background: #EDFAFA;
  
}
.notice{
  width: 78upx;
  height: 80rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #EDFAFA;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}
 .inner {
  overflow: hidden;
  display: inline-block;
}

.tip .inner .tip-inder {
  white-space: nowrap;
  padding-left: 30rpx;

}

.tip .inner.move {
  /* animation: move 6s infinite linear; */
  animation-name: scroll;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes scroll {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-50%);
    }
}
</style>
