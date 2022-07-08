<template>
  <div class="information mb20">
    <div class="disflex mb20">
      <span class="w6 h18 bgblue mr13"></span>
      <p class="fs18 fbold lh1">{{title}}<span v-if="required" class="cdeeporange ml6">*</span></p>
    </div>
    <div>
      <picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
        <div class="disflex jsbet align-cen bbe8 pt10 pl18 pb10">
          <p class="fs16 ca7">{{ specificDate || lang.text_0}}</p>
          <img :src="rightIcon" class="w10 h10">
        </div>
      </picker>
    </div>
  </div>
</template>

<script>
import WXAJAX from "@/utils/request";
import util from "@/utils/index";
import LangUtils from '../../utils/LangUtils';

export default {
  props:['datas','title','number','required'],
  data(){
  const currentDate = this.getDate({
      format: true
  })
    return{
      lang: LangUtils.getLangSrc().components.formModule.datepicker,
      date: currentDate,
      time: '12:00',
      specificDate:'',
      hourData:''
    }
  },
  methods:{
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === 'start') {
          year = year - 60;
      } else if (type === 'end') {
          year = year + 60;
      }
      month = month > 9 ? month : '0' + month;;
      day = day > 9 ? day : '0' + day;
      return `${year}-${month}-${day}`;
    },
    bindDateChange(e){
      this.specificDate = e.target.value
      this.datas[0].content = this.specificDate
      this.$emit('bindDateChange',this.datas,this.number)
    },
  },
  computed: {
    startDate() {
        return this.getDate('start');
    },
    endDate() {
        return this.getDate('end');
    }
  },
}
</script>

<style scoped>

</style>
