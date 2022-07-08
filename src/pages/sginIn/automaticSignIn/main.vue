<template>
    <div class="pt10 pr15 pl15">
      <div class="bgfff mb10 btf5f6 flex-sb-c bradius5 h60 pl15 pr15">
        <div class="disflex align-cen fs16 fbold">
          <img :src="icon_time" alt="" class="w20 h20 mr10">
          自动打卡
        </div>
        <div class="disflex align-cen fs16">
          <p class="fs14 ca8 mr10">{{ isSwitch ? '开启' :'关闭'}}</p>
          <switch :checked="isSwitch" @change="switch1Change" color='#59D0CE'/>
        </div>
      </div>
      <div class="hint fs14 cblue lh22 pt15 pb15 pr15 pl15 borderbox">
        <span></span>
        开启自动打卡时，在设定时间内，首次打开小程序，系统将自动为您打卡，并弹出打卡页面
      </div>
      <div class="bgfff mb10 btf5f6 bradius5">
        <div class="disflex align-cen fs16 fbold h44 pl15 pr15 bbf5f6">
          <span class="w10 h10 bradius50p bg bggreen mr8"></span>
          <p class="fs16 c38 fbold">早安打卡时间段</p>
        </div>
        <div class="flex-sb-c pl15 pr15 h44 align-cen">
          <p class="fss4 c78">开始时间</p>
          <picker mode="time" @change="morningChange($event,'start')" start="05:00" end="12:00">
            <div class="disflex  align-cen">
              <div class="fs14 c38">{{mstartDate}}</div>
              <img :src="icon_right" class="w15 h15 ml8">
            </div>
          </picker>
        </div>
        <div class="flex-sb-c pl15 pr15 h44 align-cen" v-if="mstartDate !=='请选择开始时间'">
          <p class="fss4 c78">结束时间</p>
          <picker mode="time" @change="morningChange($event,'end')" :start="mstartDate" end="12:00">
            <div class="disflex  align-cen">
              <div class="fs14 c38">{{mendDate}}</div>
              <img :src="icon_right" class="w15 h15 ml8">
            </div>
          </picker>
        </div>
      </div>

      <div class="bgfff mb10 btf5f6 bradius5">
        <div class="disflex align-cen fs16 fbold h44 pl15 pr15 bbf5f6">
          <span class="w10 h10 bradius50p bg bg_line_yellow mr8"></span>
          <p class="fs16 c38 fbold">晚安打卡时间段</p>
        </div>
        <div class="flex-sb-c pl15 pr15 h44 align-cen">
          <p class="fss4 c78">开始时间</p>
          <picker mode="time" @change="eveningChange($event,'start')" start="13:00" end="23:59">
            <div class="disflex  align-cen">
              <div class="fs14 c38">{{estartDate}}</div>
              <img :src="icon_right" class="w15 h15 ml8">
            </div>
          </picker>
        </div>
        <div class="flex-sb-c pl15 pr15 h44 align-cen" v-if="estartDate !=='请选择开始时间'">
          <p class="fss4 c78">结束时间</p>
          <picker mode="time" @change="eveningChange($event,'end')" :start="estartDate" end="23:59">
            <div class="disflex  align-cen">
              <div class="fs14 c38">{{eendDate}}</div>
              <img :src="icon_right" class="w15 h15 ml8">
            </div>
          </picker>
        </div>
      </div>
      <div class="fix_bottom h49 bgblue textc lh49 fs18 cfff" @click="save_tap">
        保存  
      </div>
    </div>
</template>
<script>
import WXAJAX from '@/utils/request';
export default {
    data(){
        return{
          icon_time:WXAJAX.imgBackUrl +'yimai_photos/signIn/ic_time@2x.png',
          icon_right:WXAJAX.imgBackUrl +'yimai_photos/signIn/icon_right@2x.png',
          icon_copywriter:WXAJAX.imgBackUrl +'yimai_photos/signIn/icon_copywriter@2x.png',
          icon_record:WXAJAX.imgBackUrl +'yimai_photos/signIn/ic_record@2x.png',
          mstartDate:'请选择开始时间',
          mendDate:'请选择结束时间',
          estartDate:'请选择开始时间',
          eendDate:'请选择结束时间',
          isSwitch:false
        }
    },
    mounted() {
      let data = this.$store.state.clockSetting
      this.queryClockSetting()
    },
    methods:{
      
      switch1Change(e){
        this.isSwitch = e.target.value
      },
      morningChange(e,type) {
        if(type == 'start'){
          this.mstartDate = e.target.value
        }else{
          this.mendDate = e.target.value
          if(this.mstartDate == this.mendDate){
            uni.showToast({
              title:'结束时间不可与开始时间相同',
              icon:'none'
            })
            return this.mendDate = '请选择结束时间'
          }
        }
      },
      eveningChange(e,type) {
        if(type == 'start'){
          this.estartDate = e.target.value
        }else{
          this.eendDate = e.target.value
          if(this.estartDate == this.eendDate){
            uni.showToast({
              title:'结束时间不可与开始时间相同',
              icon:'none'
            })
            return this.eendDate = '请选择结束时间'
          }
        }
      },
      getDate(){
        let data = {
          companyId:uni.getStorageSync('SELFCOMPANYID') || '',
          userId:uni.getStorageSync('userId') || '',
        }
        WXAJAX.POST(data,'','/poster/queryClockSetting')
        .then((res)=>{
          this.mstartDate = res.amStart
          this.mendDate = res.amEnd
          this.estartDate = res.pmStart
          this.eendDate = res.pmEnd
          this.isSwitch = res.isAuto
        })
        .catch((err)=>{
          console.log(err)
        })
      },
      save_tap(){

        if(this.mstartDate == '请选择开始时间' || this.mendDate == '请选择结束时间' || this.estartDate == '请选择开始时间' || this.eendDate == '请选择结束时间'){
          wx.showToast({
            title:'请选择打卡时间段',
            icon:'none'
          })
          return
        }
        let data = {
          amStart:this.mstartDate,
          amEnd:this.mendDate,
          pmStart:this.estartDate,
          pmEnd:this.eendDate,
          isAuto:this.isSwitch
        }
        WXAJAX.POST(data,'','/poster/saveClockSetting')
        .then((res)=>{
          uni.navigateBack({
            delta:1
          })
        })
        .catch((err)=>{
          console.log(err)
        })
      },
      //请求自动打卡配置
      queryClockSetting(){
        let data = {
          companyId:uni.getStorageSync('SELFCOMPANYID') || '',
          userId:uni.getStorageSync('userId') || '',
        }
        WXAJAX.POST(data,'','/poster/queryClockSetting')
        .then((res)=>{
          this.mstartDate = res.amStart
          this.mendDate = res.amEnd
          this.estartDate = res.pmStart
          this.eendDate = res.pmEnd
          this.isSwitch = res.isAuto
        })
        .catch((err)=>{
          console.log(err)
        })
      },
      // timeToSec(time) {
      //   var hour = time.split('😂[0]
      //   var min = time.split('😂[1]
      //   var sec = time.split('😂[2]
      //   var s = Number(hour * 3600) + Number(min * 60) + Number(sec)
      //   return s * 1000
      // }
    }
}
</script>
<style scoped>
.hint{
  position: relative;
  margin-top: 30rpx;
  height: 146rpx;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  background: #E7F4F3;
}
.hint span{
  position:absolute;
  top:-20upx;
  left: 30upx;
  width: 0;
  height: 0;
  border-left: 25upx solid transparent;
  border-right: 25upx solid transparent;
  border-bottom: 20upx solid #E7F4F3;
}
</style>
