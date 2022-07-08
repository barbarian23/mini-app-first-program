<template>
	<view class="content">
    <div class="roll-box pt10">
      <div class="flex-c-c flex-column pb15">
        <img :src="avatarUrl" class="w60 h60 bradius50p mb10">
        <p class="fs16 cfff mb15">Hi {{userName}}</p>
        <div class="h46 disflex align-cen mb10" v-if="clockDay">
          <p class="fs18 cfff mr8">已坚持</p>
          <div class="w34 h46 bradius5 overhidden posre mr5" v-for="item in clockDay" :key="item">
            
            <div class="bge6e2 h50p">
            </div>
            <div class="bgfff h50p">
            </div>
            <div class="fs28 cblue clockDay-position fbold flex-c-c">{{item}}</div>
          </div>
          <p class="fs18 cfff ml4">天打卡</p>
        </div>
        <div class="h46 disflex align-cen mb10" v-else>
          <p class="fs18 cfff ml4">还未打卡哟</p>
        </div>

        <div class="h27  border bradius15 bgblue flex-c-c pr15 pl15">
          <img :src="pk_icon" class="w15 h15">
          <div class="fs14 cfff">击败了<span class="fs14 cyellow fitalic">{{beatNum}}</span>人</div>
        </div>
      </div>
      <div v-if="calendar">
        <imt-calendar :selected="data" 
                      :startDate="startDate"
                      :calendar="calendar"
                      @queryPageUserClockDetail="queryPageUserClockDetail"></imt-calendar>
      </div>
      <div v-else class="h308 flex-c-c c68">
        暂无记录
      </div>
      
    </div>
    
    
	</view>
</template>

<script>
import WXAJAX from "@/utils/request";
import imtCalendar from '../../../components/imt-calendar'
export default {
  data() {
    return {
      data:['2020-05-15','2021-04-02','2018-10-14','2020-11-11',],
      userImg:'',
			avatarUrl:uni.getStorageSync('avatarUrl') || 'https://you-one-stand.oss-cn-shanghai.aliyuncs.com/yimai_photos/user/card1_user.png',
      userName:uni.getStorageSync('USERNAME'),
      pk_icon:WXAJAX.imgBackUrl + 'yimai_photos/signIn/ic_pk@2x.png',
      startDate:'',
      records:'',
      clockDay:'', // 打卡天数
      beatNum:0, // 击败多少人
      currentMonth:'', //当前月
      currentYear:'', //当前年,
      currentDay:'' ,//今天,
      calendar:'', // 日历实例
      types:''
    }
    
  },
  created(){
    this.queryPageUserClockDetail('','','')
    
  },
  methods:{
    type_tap(type){
      
      this.queryType = type
    },
    queryPageUserClockDetail(month,year,type){
      let data = {}
      this.types = type
      if(this.types !== 'click'){
        
        data = {
          companyId:uni.getStorageSync('SELFCOMPANYID') || '',
          userId:uni.getStorageSync('userId') || '',
          
        }
      }else{
        this.records = []
        data = {
          companyId:uni.getStorageSync('SELFCOMPANYID') || '',
          userId:uni.getStorageSync('userId') || '',
          createdTime: (year + '-' + month) || ''
        }
      }
      
      WXAJAX.POST(data,'','/poster/queryPageUserClockDetail')
      .then((res)=>{
        
        if(res.clockRecords){
          res.clockRecords.forEach(v => {
            
            if(v.amStart){
              v.amStart = this.changeDate(v.amStart)
            }
            if(v.amEnd){
              v.amEnd = this.changeDate(v.amEnd)
            }
            v.createdTime = this.changeDate(v.createdTime)
          });
          this.records = res.clockRecords
          console.log('this.records',this.records)
          if(this.types == 'click'){
            
            this.getDate(this.types,year,month)
          }else{
            this.startDate = this.getDate('')
          }
          

          this.clockDay = res.clockDay.toString()
          let arr = []
          for(var i = 0;i< this.clockDay.length;i++){
            
            arr.push(this.clockDay[i])
            break;
          }
          this.clockDay = arr
          this.beatNum = res.beatNum
        }else{
          this.startDate = this.getDate(this.types,year,month)
        }
      })
      .catch((err)=>{
        console.log(err)
        this.startDate = this.getDate(this.types,year,month)
      })
    },
    //获取开始时间
    getDate(type,year,month) {
      if(type == 'click'){
        
        this.setDate(month,year)
      }else{
        const date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let startYear = year - 10;

        
        month = month > 9 ? month : '0' + month;
        this.currentYear = year
        this.currentDay = day
        this.currentMonth = month
        this.setDate(month,year)
        return {
          start:`${startYear}-${month}`,
          current:`${year}-${month}`,
          currentMonth:this.currentMonth,
          currentDay:day,
          currentYear:year
        };
      }
			
    },
    //设置日历数组
		setDate(month,year){
      let than = this
			let days = [4, 6, 9, 11].includes(month * 1) ? 30 : (month != 2 ? 31 : (year % 4 == 0 ? 29 : 28))
      console.log(days)
      let arr = []
      for(var i = 0; i<days; i++){
          const day = than.records.find(item => item.createdTime.day == i+1);
          //表示找到打卡记录
          if(day){
            //判断打卡记录是否存在异常
            if(day.amStart && day.amEnd){
              //两次打卡皆为正常
              if(than.currentMonth == month && than.currentYear == year && than.currentDay == i+1 ){
                //type2 == 1 日期等于当前日期
                arr.push({
                  day:i+1,
                  type:1,
                  list:day,
                  type2:1
                })
              }else{
                //日期不等于当前日期
                arr.push({
                  day:i+1,
                  type:1,
                  list:day
                })
              }
            }else{
              //打卡存在异常}
              if(than.currentMonth == month && than.currentYear == year && than.currentDay == i+1 ){
                //type2 == 1 日期等于当前日期
                arr.push({
                  day:i+1,
                  type:2,
                  list:day,
                  type2:1
                })
              }else{
                //日期不等于当前日期
                arr.push({
                  day:i+1,
                  type:2,
                  list:day
                })
              }
            }
          }else{
            //未打卡
          if(than.currentMonth == month && than.currentYear == year && than.currentDay == i+1 ){
              //type2 == 1 日期等于当前日期
              arr.push({
                day:i+1,
                type:0,
                type2:1
              })
            }
            else if(than.currentMonth == month && than.currentYear == year && than.currentDay < i+1 ){
              //type2 == 2 日期大于当前日期
              arr.push({
                day:i+1,
                type:0,
                type2:2
              })
            }else{
              // 日期大于当前日期
              arr.push({
                day:i+1,
                type:0
              })
            }
            
          }
       
      }
      this.calendar = arr
    },
    //转化时间为时间戳
		changeDate(date){
			// date = date.replace(/-/g, '/')
			let phoneSystem = "";
      wx.getSystemInfo({
        success: function(res) {
          phoneSystem = res.system;
        }
      });
      if (phoneSystem.indexOf("iOS") != -1) {
        date = date.replace(/-/g, "/");
      }
      let time = Date.parse(date),
          year = '',
          month='',
          day='',
          hh='',
          mm='',
          ss=''
          time = new Date(time)
          year = time.getFullYear()
          month = time.getMonth()+1
          day = time.getDate()
          hh = time.getHours()
          mm = time.getMinutes()
          if(hh < 10){
            hh = '0' + hh
          }
          if(mm < 10){
            mm = '0' + mm
          }
      return {
        year:year,
        month:month,

        day:day,
        hh:hh,
        mm:mm,
      }
    },
    
  },
  
  components: {
    
    imtCalendar
  }
}
</script>

<style scoped>
page{
  overflow: hidden;
  
}
.content{
  
  box-sizing: border-box;
  height: 100%;
  background: linear-gradient(0deg, rgba(81, 203, 207, 0) 0%, #51CBCF 100%);
  display: flex;
  flex-direction: column;
}
.roll-box{
  flex: 1;
  overflow: auto;
}
.clockDay-position {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto 0;
}
</style>
