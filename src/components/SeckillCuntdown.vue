<template>
    <div class="seckill-count-down flex-sb-c">
        <div class="seckill-count-title flex-c-c mr3">
            <img
          src="https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/seckill-flash2.png"
          alt
          style="width: 30rpx;height: 30rpx;margin-right:6rpx"
        />
            <span class="fs12 cfff">{{ lang.text_0 }}</span>
        </div>
        <p class="fs12 c38 mr3">{{ lang.text_1 }}</p>
         <CountDown
        :diffTime="diffTime"
        class="count-down"
        type=3
      />
    </div>
</template>
<script>
  import CountDown from '@/components/CountDown';
  import LangUtils from '../utils/LangUtils';

export default {
    data() {
      return {
        lang: LangUtils.getLangSrc().components.SeckillCuntdown
      };
    },
    props: {
         // 倒计时
      diffTime: {
        type: Number,
        default: 800
      }
    },
    components: { CountDown },
}
</script>
<style scoped>
.seckill-count-down {
    height: 40upx;
}
.seckill-count-title {
    width: 114upx;
    height: 40upx;
    background-color: #FD634E;
    border-radius:10upx;
}
.count-down{
    height: 60upx;

}
</style>
