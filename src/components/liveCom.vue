<template>
  <view class="cardCss">
    <view class="flex-column w100p">
      <view class="flex-column w100p h40">
        <img class="imglogo"
             :src="liveInfo.companyLogo">
        <view class="companyCss pl16">{{liveInfo.companyName}}</view>
      </view>
      <view class="flex-column coverImgcss">
        <view class="bkgcss"
              @click="liveClick(liveInfo)"
              :style="{backgroundImage:`url(${liveInfo.coverImg})`}">
        </view>
        <view class="liveStatus">
          {{liveInfo.liveStatus == '101' ? "直播中" : liveInfo.liveStatus == '102' ? "未开始" :
           liveInfo.liveStatus == '103' ? "已结束" :  liveInfo.liveStatus == '104' ? "禁播" :
           liveInfo.liveStatus == '105' ? "暂停中" :  liveInfo.liveStatus == '107' ? "已过期" : "异常"  }}
        </view>
      </view>
      <view class="roomNameCss pl16">{{liveInfo.name}}
      </view>
      <view class="flex-column borderbox w100p pl16">
        <img class="imgTime"
             src="../static/images/icon_time.png" />
        <view class="playCssTime">
          开播时间 <span style="margin-left: 10rpx">{{liveInfo.startTime}} - {{liveInfo.endTime}}</span>
        </view>
      </view>
    </view>
    <view class="live-mask" v-if="liveMask">
      <img src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/one-product/video-icon/liveMask.jpg" mode=""></img>
    </view>
  </view>
</template>

<script>
const querystring = require("querystring");
import httpclient from "../utils/request";
// live_status 直播状态 101: 直播中, 102: 未开始, 103: 已结束, 104: 禁播, 105: 暂停中, 106:
export default {
  name: "liveCom",
  props: {
    liveInfo: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      liveMask:false
    };
  },
  created() {
    if (this.liveInfo == "") {
      this.liveMask = true
    }
  },
  mounted() {
    console.log("liveInfo", this.liveInfo);
  },
  onUnload() {
    this.cur = 0;
  },
  onHide() {
    this.cur = 0;
  },
  methods: {
    //直播测试
    liveClick(liveInfo) {
      console.log("直播测试", liveInfo);
      // 填写具体的房间号，可通过下面【获取直播房间列表】 API 获取
      let customParams = encodeURIComponent(
        JSON.stringify({ path: "pages/videPack/live/index", pid: 1 })
      ); // 开发者在直播间页面路径上携带自定义参数（如示例中的path和pid参数），后续可以在分享卡片链接和跳转至商详页时获取，详见【获取自定义参数】、【直播间到商详页面携带参数】章节（上限600个字符，超过部分会被截断）
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${liveInfo.roomid}&custom_params=${customParams}`
      });
    },
    nowReceive(couponInfo) {},
    useCoupon(couponInfo) {
      wx.switchTab({
        url: "/pages/Products/main?" + querystring.stringify(couponInfo)
      });
    },
    seletCoupon(status) {
      this.$emit("selectCoup", this.couponIndex, status);
    }
  }
};
</script>

<style>
.cardCss {
  width: 100%;
  height: 100vh;
  margin-top: 40rpx;
  background: rgba(0, 0, 0, 1);
  display: inline-flex;
  position: relative;
}

.imglogo {
  width: 60upx;
  height: 60upx;
  float: left;
  margin-left: 30rpx;
  border-radius: 50%;
  margin-right: 25rpx;
  margin-bottom: 20rpx;
}
.companyCss {
  box-sizing: border-box;
  padding-left: 34rpx;
  width: 100%;
  height: 26rpx;
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  line-height: 33px;
  opacity: 0.3;
  text-shadow: 0px 1px 4px rgba(56, 56, 56, 0.3);
}
.coverImgcss {
  text-align: center;
}
.coverImgcss .bkgcss {
  height: 388rpx;
  width: 94%;
  margin-left: 3%;
  border-radius: 10px;
}
.liveStatus {
  width: 124rpx;
  height: 50rpx;
  background: rgba(0, 0, 0, 1);
  opacity: 0.6;
  border-radius: 6px;
  align-content: center;
  text-align: center;
  padding-top: 10rpx;
  position: relative;
  margin-top: -80rpx;
  margin-left: 40rpx;
  margin-bottom: 50rpx;
}
.roomNameCss {
  box-sizing: border-box;
  width: 100%;
  height: 31px;
  font-family: PingFang SC;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 28px;
  opacity: 0.6;
  text-shadow: 0px 1px 4px rgba(56, 56, 56, 0.3);
}
.imgTime {
  width: 24px;
  height: 24px;
  opacity: 1;
  float: left;
  margin-right: 20rpx;
}
.playCssTime {
  font-family: PingFang SC;
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  opacity: 0.3;
  text-shadow: 0px 1px 4px rgba(56, 56, 56, 0.3);
}
.live-mask{
  width: 100%;
  height: 100%;
  position:absolute;
  top:0upx;
}
.live-mask img{
  width: 100%;
  height: 100%;
}
</style>
