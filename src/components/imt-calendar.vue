<template>
<div>
	<view class="imt-calendar">
		<view class="calendar-month-wrapper">
			<p class="fs16 c38 fbold">{{currentMonth || startDate.currentMonth || ''}}月打卡记录</p>

				<div class="disflex w100 h25 borderbox jsbet pl10 pr10 pt7 pb7 fs14 c80 be8 align-cen posre">
					<picker class='time-picker disinblock pr10'
									mode="date"
									fields="month"
									:value="startDate.current"
									:start="startDate.start"
									:end="startDate.current"
									@change="datePickerChange"
					>
							{{pickerTime || startDate.current || ''}}
					</picker>
					<img :src="leftIcon" class="w8 h10 leftIcon">
				</div>
		</view>

		<view class="calendar-week-wrapper pr8">
			<view class="calendar-week" v-for="(item,index) in week" :key="index">{{item}}</view>
		</view>
			<div class="calendar-date-wrapper">
				<view class="calendar-date"
						  @click="calendar_tap(value,key)"
							v-for="(value,key) in calendar"
							:key="key"
							:style="{ background:value.type2 == 1 || currentKey  == key ? '#51CDCB' : '' ,
											 color:value.type2 == 2 ? '#E8E8E8' : value.type2 == 1 ||  currentKey  == key ? '#FFFFFF' : '#000000' }">
							{{value.day}}
							<span v-if="value.type2 !== 1"
										:class="value.type == 1 ? 'bgblue': value.type !== 2   ? 'bgfff' :  'bg_line_yellow'"></span>
				</view>
			</div>

	</view>
	<div class="imt-calendar-bottom">
			<div class="disflex align-cen">
				<span class="w10 h10 bgblue bradius50p mr8"></span>
				<p class="fs16 c38 fbold">{{currentMonth || startDate.currentMonth || ''}}{{lang.text_1}}}{{chooseDay || startDate.currentDay || ''}}{{ lang.text_2 }}</p>
			</div>
			<div class="disflex jsbet align-cen">
				<img :src="img_morning" style="width:463upx;height:50upx" v-if="checkDate.list && checkDate.list.amStart">
				<img :src="img_morninga" style="width:463upx;height:50upx" v-else>

				<p class="fs16 c38 fbold" v-if="checkDate.list.amStart">{{checkDate.list.amStart.hh}}:{{checkDate.list.amStart.mm}}</p>
				<p class="fs16 c38 fbold" v-else>{{ lang.text_0 }}</p>
			</div>
			<div class="disflex jsbet align-cen">
				<img :src="img_night" style="width:463upx;height:50upx" v-if="checkDate.list && checkDate.list.amEnd">
				<img :src="img_nighta" style="width:463upx;height:50upx" v-else>

				<p class="fs16 c38 fbold" v-if="checkDate.list.amEnd || checkDate[0].amEnd">{{checkDate.list.amEnd.hh}}:{{checkDate.list.amEnd.mm}}</p>
				<p class="fs16 c38 fbold" v-else>{{ lang.text_0 }}</p>
			</div>
	</div>
</div>

</template>

<script>
import WXAJAX from "@/utils/request";
import { DELETE } from '../utils/request';
import LangUtils from '../utils/LangUtils';
export default {
	data() {
		return {
		  lang: LangUtils.getLangSrc().components.imt_calendar,
			week: [ '一', '二', '三', '四', '五', '六', '日'],
			leftIcon:WXAJAX.imgBackUrl + 'yimai_photos/crmAdd/Icon_back.png',
			downType:false,
			chooseMonth:'',
			currentMonth:'',
			checkDate:'',
			chooseDay:'', //选择日期
			img_morning:WXAJAX.imgBackUrl+'yimai_photos/signIn/img_title_morningA@2x.png',
			img_morninga:WXAJAX.imgBackUrl+'yimai_photos/signIn/img_title_morningc@2x.png',
			img_night:WXAJAX.imgBackUrl+'yimai_photos/signIn/img_title_nightB@2x.png',
			img_nighta:WXAJAX.imgBackUrl+'yimai_photos/signIn/img_title_nightd@2x.png',
			currentKey:null,//选中时间
			pickerTime:''
		}
	},
	props: {
		startDate: {
			type: Object,
		},
		calendar:{
			type: Object,
		}
	},
	watch:{
		calendar:{
			handler(newVal,old){
				newVal.forEach(v=>{
					if(v.type2 == 1){
						this.checkDate = v
					}
				})
			},
			immediate: true
		}
	},
	methods() {
		let than = this
		console.log(this.selected)
		this.selected.forEach(v => {
			this.changeDate(v)
		});
	},
	methods: {

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
      return Date.parse(date)
		},
		calendar_tap(item,key){

			this.chooseDay = key + 1

			this.chooseDay = this.chooseDay < 9 ? '0' + this.chooseDay : this.chooseDay

			this.checkDate = item
			this.currentKey = key
			console.log(this.checkDate)
		},
		//选择月份
		datePickerChange(e) {
			this.currentKey = 0
			console.log(e.target.value)
			let _time = e.target.value.split('-');
			_time = _time[0] + '-' + _time[1];

			let date = this.changeDate(_time)
					date = new Date(parseInt(date));
			let year = date.getFullYear()
			this.currentMonth = (date.getMonth()+1) < 10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1)
			this.pickerTime = year + '-' + this.currentMonth
			//重置选择日期
			this.chooseDay = '01'
			this.checkDate = this.calendar[0]
			console.log(this.checkDate )
			this.$emit('queryPageUserClockDetail',this.currentMonth ,year,'click')
			// wx.showLoading();
		},

	},
	computed: {

	}
}
</script>

<style scoped>

	.imt-calendar {
		width: 690upx;
		margin: auto;
		background: #fff;
		border-radius: 20upx;
		text-align: center;
		color: #333;
		box-shadow: 0px 0px 20px 0px rgba(56, 56, 56, 0.08);
	}
	.imt-calendar-bottom{
		width: 690upx;
		height: 286upx;
		margin: auto;
		margin-bottom: 60upx;
		margin-top: 20upx;
		background: #fff;
		border-radius: 20upx;
		padding:35upx 30upx 40upx 30upx;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		box-shadow: 0px 0px 20px 0px rgba(56, 56, 56, 0.08);
	}

	.calendar-month-wrapper {
		display: flex;
		justify-content: space-between;
		border-bottom: 2upx solid #e5e5e5;
		align-items: center;
		height: 100upx;
		padding:0 30upx;
	}

	.calendar-month {
		font-size: 32upx;
		line-height: 100upx;
	}

	.calendar-icon-leftArrow {
		transform: rotate(180deg);
	}

	.calendar-week-wrapper {
		display: flex;
	}

	.calendar-week {
		flex: 1;
		font-size: 32upx;
		line-height: 100upx;
	}

	.calendar-date-wrapper {
		display: flex;
		flex-wrap: wrap;
	}

	.calendar-date {
		position: relative;
		width: 80upx;
		height: 80upx;
		font-size: 28upx;
		line-height: 80upx;
		border-radius: 50%;
		margin: 9upx;
	}
	.calendar-date span{
		position:absolute;
		top: 60upx;
		left: 36upx;
		width: 8upx;
		height: 8upx;
		border-radius: 4upx;
	}
.leftIcon{
  transform:rotate(-90deg);
}

</style>
