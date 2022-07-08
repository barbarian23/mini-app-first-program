<template>
	<view class="content">
		<imt-calendar :selected="data"></imt-calendar>
    
	</view>
</template>

<script>
	import imtCalendar from '../../../components/imt-calendar'
	export default {
		data() {
			return {
				data:['2018-10-14','2020-11-11','2021-01-02','2020-02-15','2020-03-29']
			}
		},
		components: {
			imtCalendar
		}
	}
</script>

<style scoped>
	page{
		background: #f2f2f2;
	}
	.content{
    padding-top: 30upx;
    
  }
  #test{
    background:url('https://business.xiongmaoboshi.com/dpshop/res/img/Pop04(1)-1610015045587-753.png') no-repeat 0 0;
  }
</style>