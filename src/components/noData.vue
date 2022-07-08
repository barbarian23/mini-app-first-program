<template>
  <div class="textc outer">
    <img mode="widthFix" width="340rpx" src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/product-index/20190418164236.png" alt="">
    <p class="desc">
      <slot>{{ lang.text_0 }}</slot>
    </p>
  </div>
</template>

<script>
import LangUtils from '../utils/LangUtils';

  export default {
    name: "noData",
    data() {
      return {
        lang: LangUtils.getLangSrc().components.noData
      };
    }
  }
</script>

<style scoped>
  .outer{
    padding: 60upx 0;
  }
  img{
    width: 340upx;
    height: 340upx;
  }
  .desc{
    font-size: 28upx;
    color: #a8a8a8;
  }
</style>
