<template>
  <div class="assemble-box align-cen jsbet pl15">
    <div class="">
      <div class="cfff">
        <span class="fs12 fbold">￥</span>
        <span style="font-size: 60upx;" class="fbold">{{price | rmb}}</span>
      </div>
      <div class="fs10" style="color: #f5f5f6;text-decoration: line-through">
        <span>原价</span>
        <span>￥{{originalPrice | rmb}}</span>
      </div>
    </div>
    <div class="time-box pr15 fs16 disflex flex-column">
      <div class="disflex align-cen flex-end" style="color:#956015"> 
        <img :src="peopleIcon" class="w20 h20" alt="">
        {{proData.peopleNum}}人团</div>
      <div class="fs12 mt5 pb5 disflex flex-end" style="color: #d17923">距离结束还剩</div>
      <CountDown
        :diffTime="parseInt(endTime/1000)"
      />
    </div>
  </div>
</template>

<script>
  import CountDown from '@/components/CountDown';
  import WXAJAX from "@/utils/request";

  export default {
    name: "AssembleInfoBox",
    components: { CountDown },
    props:{
      proData: {
        required: true,
        type: Object
      },
      price: {
        required: true,
        type: Number
      },
      // 原价
      originalPrice: {
        type: [String, Number],
        default: '0.00'
      },
      dealNum: {
        required: true,
        type: Number
      },
      endTime: {
        required: true,
        type: Number
      },
      stockNum:{
        type:Number
      }
    },
    data(){
      return {
        peopleIcon:WXAJAX.imgBackUrl + '/yimai_photos/crmRevision/ic_people_num.png'
      }
    },
    filters: {
      rmb(value) {
        return (value / 100).toFixed(2)
      }
    },
  }
</script>

<style scoped>
  .team{
    height:40upx;
    padding: 0 15upx;
    border:2upx solid rgba(81,205,203,1);
    border-radius:10upx;
    color: #51CDCB;
    font-size: 20upx;
  }
</style>

<style>
  .assemble-box{
    box-sizing: border-box;
    height: 160upx;
    width: 100%;
    background: #FD4E56;
    display: flex;
  }

  .time-box{
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    height: 100%;
    width: 450upx;
    background: #FFCA12;
    align-content: center;
    justify-content: flex-end;
    justify-content: center;
    position: relative;
    line-height: 1;
  }

  .time-box::before{
    content: '';
    position: absolute;
    border-right: 31upx solid #ffca12;
    border-top: 80upx solid transparent;
    border-bottom: 80upx solid transparent;
    left: -30upx;
    top: 0;
  }
</style>
